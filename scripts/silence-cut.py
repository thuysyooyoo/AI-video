"""
LAYER #1 — Pacing: silence removal + filler-word cut + jump-cut assembly.
The most important talking-head technique: make the video "dense" by cutting
dead air, breaths, and filler words ("ờ","à","um","uh","ừm","kiểu","thì là").

Pipeline:
  1. read transcript word timestamps
  2. mark words to DROP (filler) + gaps > threshold (silence/breath)
  3. build KEEP segments (contiguous spans of kept audio)
  4. FFmpeg: cut+concat those segments -> tight clip (jump-cut feel)
  5. REMAP every word's timestamp onto the new (shorter) timeline
  6. write tightened clip + remapped transcript (for caption/EDL downstream)

Output: out/tight.mp4, out/transcript-tight.json, out/cut-report.json

Usage: python scripts/silence-cut.py [--clip raw/talkinghead.mp4]
       [--max-gap-ms 350] [--pad-ms 60]
"""
import os, sys, json, subprocess, argparse, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "out"

# Vietnamese + English filler words to drop (lowercased, stripped of punctuation)
FILLERS = {
    # ONLY unambiguous hesitation sounds — NOT grammatical words.
    # "là/kiểu/thì" REMOVED: they're real Vietnamese connectives (gây phá câu).
    "ờ", "à", "ừm", "ừ", "um", "uh", "umm", "uhh", "er", "ah", "eh", "ậy", "ờm",
}
# multi-word filler phrases (matched via 2-gram window)
FILLER_NGRAMS = {"ờ thì", "à thì", "kiểu như", "you know", "ý là"}
# a filler is only dropped when ISOLATED: a pause on at least one side proves it's
# a real hesitation, not a connective glued into the sentence.
FILLER_ISOLATION_MS = 150


def norm(w):
    return w.lower().strip(" .,!?;:\"'…").strip()


def is_isolated_filler(words, i, drop_fillers):
    """Word i is a droppable filler iff it's a hesitation sound AND has a pause
    (>=FILLER_ISOLATION_MS) before or after it (isolated, not glued to a phrase)."""
    if not drop_fillers:
        return False
    w = words[i]
    single = norm(w["text"]) in FILLERS
    # 2-gram check
    bigram = False
    if i + 1 < len(words):
        bigram = f"{norm(w['text'])} {norm(words[i+1]['text'])}" in FILLER_NGRAMS
    if not (single or bigram):
        return False
    gap_before = (w["startMs"] - words[i - 1]["endMs"]) if i > 0 else 1e9
    gap_after = (words[i + 1]["startMs"] - w["endMs"]) if i + 1 < len(words) else 1e9
    return gap_before >= FILLER_ISOLATION_MS or gap_after >= FILLER_ISOLATION_MS


def build_keep_spans(words, max_gap_ms, pad_ms, drop_fillers):
    """Build KEEP spans. A dropped filler FORCES a span break (so its audio is
    actually cut, not just removed from captions) — fixes audio/caption desync."""
    kept_idx = [i for i in range(len(words)) if not is_isolated_filler(words, i, drop_fillers)]
    dropped = set(range(len(words))) - set(kept_idx)
    if not kept_idx:
        return [], []
    spans, word_map = [], []
    cur_start = words[kept_idx[0]]["startMs"]
    cur_end = words[kept_idx[0]]["endMs"]
    word_map.append((words[kept_idx[0]], 0))
    for idx in kept_idx[1:]:
        w = words[idx]
        gap = w["startMs"] - cur_end
        # break span on big gap OR if a filler was dropped between prev kept and this
        dropped_between = any(d for d in dropped if cur_end <= words[d]["startMs"] < w["startMs"])
        if gap > max_gap_ms or dropped_between:
            spans.append([max(0, cur_start - pad_ms), cur_end + pad_ms])
            cur_start = w["startMs"]
        cur_end = w["endMs"]
        word_map.append((w, len(spans)))
    spans.append([max(0, cur_start - pad_ms), cur_end + pad_ms])
    return spans, word_map


def remap_words(word_map, spans):
    """Map original word timestamps onto the concatenated (tight) timeline."""
    # cumulative offset where each span starts in the new timeline
    span_dur = [(e - s) for s, e in spans]
    span_offset = [0]
    for d in span_dur[:-1]:
        span_offset.append(span_offset[-1] + d)
    new_words = []
    for w, si in word_map:
        s_start = spans[si][0]
        off = span_offset[si]
        new_words.append({
            "text": w["text"],
            "startMs": off + (w["startMs"] - s_start),
            "endMs": off + (w["endMs"] - s_start),
        })
    total = span_offset[-1] + span_dur[-1] if span_dur else 0
    return new_words, total


def ffmpeg_cut_concat(clip, spans, dest):
    """Cut each span and concat with re-encode (clip parts have different keyframes)."""
    parts = []
    tmpdir = Path(tempfile.mkdtemp())
    for i, (s, e) in enumerate(spans):
        p = tmpdir / f"p{i:04d}.mp4"
        subprocess.run([
            "ffmpeg", "-y", "-ss", f"{s/1000:.3f}", "-to", f"{e/1000:.3f}",
            "-i", str(clip), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
            "-c:a", "aac", "-ar", "44100", str(p),
        ], check=True, capture_output=True)
        parts.append(p)
    listfile = tmpdir / "list.txt"
    listfile.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile),
        "-c", "copy", str(dest),
    ], check=True, capture_output=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--clip", default="raw/talkinghead.mp4")
    ap.add_argument("--max-gap-ms", type=int, default=350)
    ap.add_argument("--pad-ms", type=int, default=60)
    ap.add_argument("--no-fillers", action="store_true", help="don't drop filler words")
    ap.add_argument("--out-dir", default=str(OUT))
    ap.add_argument("--public-dir", default=str(PUBLIC))
    a = ap.parse_args()

    out_dir = Path(a.out_dir)
    public_dir = Path(a.public_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    transcript = json.loads((out_dir / "transcript.json").read_text(encoding="utf-8"))
    words = transcript["words"]
    clip = public_dir / a.clip

    spans, word_map = build_keep_spans(words, a.max_gap_ms, a.pad_ms, not a.no_fillers)
    if not spans:
        print("ERROR: no keep spans"); sys.exit(1)

    new_words, total_ms = remap_words(word_map, spans)
    orig_ms = words[-1]["endMs"]

    dest = out_dir / "tight.mp4"
    ffmpeg_cut_concat(clip, spans, dest)

    tight = {"language": transcript.get("language", "vi"),
             "durationSec": round(total_ms / 1000, 2), "words": new_words}
    (out_dir / "transcript-tight.json").write_text(
        json.dumps(tight, ensure_ascii=False, indent=2), encoding="utf-8")

    report = {
        "originalSec": round(orig_ms / 1000, 2),
        "tightSec": round(total_ms / 1000, 2),
        "removedSec": round((orig_ms - total_ms) / 1000, 2),
        "removedPct": round((1 - total_ms / orig_ms) * 100, 1),
        "segments": len(spans),
        "wordsKept": len(new_words),
        "wordsOriginal": len(words),
    }
    (out_dir / "cut-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> {dest}")
    print(f"  {report['originalSec']}s -> {report['tightSec']}s "
          f"(cut {report['removedSec']}s = {report['removedPct']}%, {len(spans)} jump-cuts)")
    print(f"  words: {len(words)} -> {len(new_words)} kept")


if __name__ == "__main__":
    main()
