"""
Local speech-to-text -> word-level timestamps.

No API key. No network.

Engine: faster-whisper
Output: out/transcript.json
  { language, durationSec, words:[{text,startMs,endMs}] }
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def transcribe_local(path: Path, language="vi", model_size="small", device="auto", compute_type="auto"):
    try:
        from faster_whisper import WhisperModel
    except ImportError as ex:
        raise RuntimeError("Missing local STT dependency. Install with: pip install faster-whisper") from ex

    model = WhisperModel(model_size, device=device, compute_type=compute_type)
    segments, info = model.transcribe(
        str(path),
        language=language or None,
        vad_filter=True,
        word_timestamps=True,
    )
    words = []
    for seg in segments:
        for w in seg.words or []:
            text = (w.word or "").strip()
            if not text:
                continue
            words.append({
                "text": text,
                "startMs": int(w.start * 1000),
                "endMs": int(w.end * 1000),
            })
    return {"language": getattr(info, "language", language) or language, "words": words}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--engine", default="local", choices=["local", "faster-whisper"])
    ap.add_argument("--local-model", default="small", help="tiny/base/small/medium/large-v3")
    ap.add_argument("--language", default="vi")
    # cpu is the safe default: device=auto picks CUDA when a GPU exists, and a
    # missing cuDNN DLL then hard-crashes the process (0xC0000409, not catchable)
    ap.add_argument("--device", default="cpu", help="cpu (safe default) | cuda | auto")
    ap.add_argument("--compute-type", default="auto")
    ap.add_argument("--out", default=str(ROOT / "out" / "transcript.json"))
    a = ap.parse_args()

    data = transcribe_local(Path(a.path), language=a.language, model_size=a.local_model,
                            device=a.device, compute_type=a.compute_type)
    words = data.get("words", [])
    dur = round(words[-1]["endMs"] / 1000, 2) if words else 0
    result = {"language": data.get("language", a.language), "durationSec": dur, "words": words}

    outp = Path(a.out)
    outp.parent.mkdir(parents=True, exist_ok=True)
    outp.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {len(words)} words, {dur}s, lang={result['language']} -> {outp}")
    if words:
        preview = " ".join(w["text"] for w in words[:15])
        safe_preview = preview.encode(sys.stdout.encoding or "utf-8", errors="replace").decode(sys.stdout.encoding or "utf-8")
        print(f"Preview: {safe_preview}...")


if __name__ == "__main__":
    main()
