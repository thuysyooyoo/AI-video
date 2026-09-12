import os, sys, json, subprocess, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_VIDEO = ROOT / "public" / "raw" / "clip_goc.mov"
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)

# Keep segments from clip_goc.mov:
# Segment 0: 0.00s -> 11.35s ("4 điều bạn cần kiểm tra... sắp tới có những con đường lớn.")
# (Cut out False Start 1: 11.35s -> 15.80s)
# Segment 1: 15.80s -> 22.65s ("Trước khi quyết định thì Sang thường trực tiếp kiểm tra 4 yếu tố sau đây... đường vào trong lô đất,")
# (Cut out False Start 2: 22.65s -> 24.60s)
# Segment 2: 24.60s -> 35.60s ("Ô tô có đi tận nơi được hay không... môi trường xung quanh.")
# (Cut out False Start 3: 35.60s -> 38.00s)
# Segment 3: 38.00s -> 45.60s ("Khu vực này đã có người sinh sống hay chưa... cách đó là bao xa.")
# (Cut out Long Pause: 45.60s -> 49.30s)
# Segment 4: 49.30s -> 83.90s ("Và thứ 3, đó là pháp lý... khi chúng ta cần.")
# (Cut out Long Pause: 83.90s -> 87.50s)
# Segment 5: 87.50s -> 98.40s ("Và hãy follow Quyền Sang... trước khi chúng ta xuống tiền nha.")
# (Cut out Dead Air: > 98.40s)

SEGMENTS = [
    (0.00, 11.35),
    (15.80, 22.65),
    (24.60, 35.60),
    (38.00, 45.60),
    (49.30, 83.90),
    (87.50, 98.40),
]

def cut_and_concat():
    temp_files = []
    concat_list = OUT / "concat_list.txt"
    
    print(f"Cutting {len(SEGMENTS)} segments from {RAW_VIDEO.name}...")
    for idx, (start, end) in enumerate(SEGMENTS):
        dur = end - start
        seg_file = OUT / f"seg_{idx:02d}.mp4"
        fade_out_start = max(0, dur - 0.02)
        cmd = [
            "ffmpeg", "-y",
            "-ss", f"{start:.3f}",
            "-t", f"{dur:.3f}",
            "-i", str(RAW_VIDEO),
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k",
            "-af", f"afade=t=in:ss=0:d=0.015,afade=t=out:st={fade_out_start:.3f}:d=0.015",
            str(seg_file)
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error cutting segment {idx}:", res.stderr)
            sys.exit(1)
        temp_files.append(seg_file)
        
    with open(concat_list, "w", encoding="utf-8") as f:
        for tf in temp_files:
            f.write(f"file '{tf.resolve().as_posix()}'\n")
            
    tight_output = OUT / "tight.mp4"
    print(f"Concatenating into {tight_output}...")
    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(tight_output)
    ]
    res = subprocess.run(concat_cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Error concatenating segments:", res.stderr)
        sys.exit(1)
        
    public_tight = ROOT / "public" / "raw" / "clip_goc-tight.mp4"
    shutil.copy2(tight_output, public_tight)
    print(f"Copied clean tight clip to {public_tight}")
    
    for tf in temp_files:
        try: tf.unlink()
        except: pass
    try: concat_list.unlink()
    except: pass
    print("Done cutting clean tight.mp4!")

if __name__ == "__main__":
    cut_and_concat()
