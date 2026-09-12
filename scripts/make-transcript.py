import json
from pathlib import Path
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"

CORRECTIONS = {
    "miêu tố": "yếu tố",
    "ưu tố": "yếu tố",
    "sáng": "Sang",
    "xanh": "Sang",
    "lâu đất": "lô đất",
    "đàn ghẹ": "đang rẻ",
    "đang ghẽ": "đang rẻ",
    "tôn đường": "con đường",
    "tòa đường": "con đường",
    "Auto": "Ô tô",
    "Ôu tô": "Ô tô",
    "mặc đường": "mặt đường",
    "lạy lỗi": "lầy lội",
    "biện ngập": "bị ngập",
    "khu vật": "khu vực",
    "xin sống": "sinh sống",
    "tiện ít": "tiện ích",
    "giới tờ": "giấy tờ",
    "bởi lại": "với lại",
    "răn dưới": "ranh giới",
    "một đứt": "mục đích",
    "một đất": "mục đích",
    "cố lâu": "của lô",
    "thân khoảng": "thanh khoản",
    "thành quản": "thanh khoản",
    "canh rao": "đang rao",
    "sáo tháng": "6 tháng",
    "quan đó": "quanh đó",
    "mức giá trốt": "mức giá chốt",
    "phạm bao nhiêu": "khoảng bao nhiêu",
    "bước đồng sản": "bất động sản",
    "bức tầng sản": "bất động sản",
    "bước tầng sản": "bất động sản",
    "giới sử dụng": "dễ sử dụng",
    "nhiều cầu": "nhu cầu",
    "quen sang": "Quyền Sang",
    "chỉ hành chế": "anh chị hạn chế",
    "cách rũ rõ": "các rủi ro",
    "cách rửa rõ": "các rủi ro",
    "trước mẫu ức định": "trước khi quyết định",
    "trước mẫu đình": "trước khi quyết định",
    "tiền nhạc": "tiền nha",
}

def clean_text(text: str) -> str:
    res = text
    for k, v in CORRECTIONS.items():
        if k in res.lower():
            import re
            pattern = re.compile(re.escape(k), re.IGNORECASE)
            res = pattern.sub(v, res)
    return res

def transcribe_tight():
    print("Loading faster-whisper small model...")
    model = WhisperModel("small", device="cpu", compute_type="int8")
    tight_mp4 = OUT / "tight.mp4"
    print(f"Transcribing {tight_mp4}...")
    segments, info = model.transcribe(
        str(tight_mp4),
        language="vi",
        word_timestamps=True,
        vad_filter=False
    )
    
    words = []
    full_text = []
    
    for s in segments:
        full_text.append(s.text.strip())
        for w in s.words:
            w_text = clean_text(w.word.strip())
            words.append({
                "text": w_text,
                "startMs": int(round(w.start * 1000)),
                "endMs": int(round(w.end * 1000))
            })
            
    # Fix any word startMs/endMs monotonicity
    for i in range(len(words)):
        if words[i]["endMs"] <= words[i]["startMs"]:
            words[i]["endMs"] = words[i]["startMs"] + 200
        if i > 0 and words[i]["startMs"] < words[i-1]["startMs"]:
            words[i]["startMs"] = words[i-1]["startMs"]
            
    transcript_data = {
        "language": "vi",
        "durationSec": round(words[-1]["endMs"] / 1000.0, 2) if words else 82.35,
        "fullText": " ".join(full_text),
        "words": words
    }
    
    out_transcript = OUT / "transcript.json"
    out_transcript.write_text(json.dumps(transcript_data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved transcript ({len(words)} words, duration={transcript_data['durationSec']}s) -> {out_transcript}")

if __name__ == "__main__":
    transcribe_tight()
