"""
Face-zone detection — finds WHERE the speaker is so graphics avoid the face.
Samples the clip (~2fps), runs OpenCV face detection, then derives a stable
"free zone" (top|bottom|left|right) per time-segment = the largest screen region
NOT covered by the face. EDL graphics get placed into the free zone.

Output: out/face-zones.json
  { "segments": [ {"startSec","endSec","faceCenterXPct","faceCenterYPct","freeZone"} ],
    "dominantFreeZone": "top|bottom|left|right" }

Usage: python scripts/detect-face-zones.py <clip_under_public>
"""
import sys, json, argparse
from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "out"
CASCADE = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"


def detect(clip_path, sample_fps=2):
    cap = cv2.VideoCapture(str(clip_path))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 1
    step = max(int(fps / sample_fps), 1)
    det = cv2.CascadeClassifier(CASCADE)
    samples = []  # (sec, cx_pct, cy_pct, h_pct) — None face -> skip
    idx = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if idx % step == 0:
            h, w = frame.shape[:2]
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = det.detectMultiScale(gray, 1.1, 5, minSize=(int(w * 0.08), int(w * 0.08)))
            sec = idx / fps
            if len(faces):
                # biggest face
                x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])
                samples.append((sec, (x + fw / 2) / w * 100, (y + fh / 2) / h * 100, fh / h * 100))
        idx += 1
    cap.release()
    return samples


def free_zone(cx, cy):
    """Largest empty band given face center (% coords). Talking-head: usually face
    is upper-center, so free zone is bottom; if face high -> top is occupied."""
    # vertical room
    top_room = cy - 0  # space above center
    bottom_room = 100 - cy
    left_room = cx
    right_room = 100 - cx
    # prefer vertical bands (cleaner for captions/graphics)
    if bottom_room >= top_room and bottom_room > 35:
        return "bottom"
    if top_room > 30:
        return "top"
    return "left" if left_room > right_room else "right"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip")
    ap.add_argument("--out-dir", default=str(OUT))
    ap.add_argument("--public-dir", default=str(PUBLIC))
    a = ap.parse_args()
    out_dir = Path(a.out_dir)
    public_dir = Path(a.public_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    clip = public_dir / a.clip
    samples = detect(clip)
    if not samples:
        # no face found -> safe default: keep top band for graphics
        out = {"segments": [], "dominantFreeZone": "top", "note": "no face detected"}
        (out_dir / "face-zones.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        print("No face detected -> default freeZone=top")
        return

    # aggregate into coarse segments (every ~5s) for stability
    seg_len = 5.0
    segments = []
    cur = []
    cur_start = samples[0][0]
    for s in samples:
        if s[0] - cur_start >= seg_len and cur:
            arr = np.array(cur)
            cx, cy = float(arr[:, 1].mean()), float(arr[:, 2].mean())
            segments.append({"startSec": round(cur_start, 2), "endSec": round(s[0], 2),
                             "faceCenterXPct": round(cx, 1), "faceCenterYPct": round(cy, 1),
                             "freeZone": free_zone(cx, cy)})
            cur = []
            cur_start = s[0]
        cur.append(s)
    if cur:
        arr = np.array(cur)
        cx, cy = float(arr[:, 1].mean()), float(arr[:, 2].mean())
        segments.append({"startSec": round(cur_start, 2), "endSec": round(samples[-1][0] + seg_len, 2),
                         "faceCenterXPct": round(cx, 1), "faceCenterYPct": round(cy, 1),
                         "freeZone": free_zone(cx, cy)})

    # dominant zone across whole clip
    from collections import Counter
    dom = Counter(s["freeZone"] for s in segments).most_common(1)[0][0]
    allcx = np.mean([s["faceCenterXPct"] for s in segments])
    allcy = np.mean([s["faceCenterYPct"] for s in segments])
    out = {"segments": segments, "dominantFreeZone": dom,
           "avgFaceCenterXPct": round(float(allcx), 1), "avgFaceCenterYPct": round(float(allcy), 1)}
    (out_dir / "face-zones.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> face at ({allcx:.0f}%,{allcy:.0f}%), dominant freeZone={dom}, {len(segments)} segments")


if __name__ == "__main__":
    main()
