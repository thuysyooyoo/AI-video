"""
Multi-pass EDL reasoning — the AI "thinks like an editor" instead of one-shotting.
4 passes:
  1. analyze  — read transcript, segment (hook/point/proof/cta), mark emotion + visualizable keywords
  2. strategy — propose an edit plan: which segment gets which graphic + WHY + pacing
  3. compose  — turn the strategy into concrete graphic objects (typed, timed)
  4. critique — self-review: relevance, density, errors -> fix list

Each pass is a focused local LLM/CLI JSON call. Keeps generate-edl.py thin.
"""
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def _load_theme_names():
    try:
        data = json.loads((ROOT / "src" / "style-themes.json").read_text(encoding="utf-8"))
        return [k for k, v in data.items() if not k.startswith("_") and isinstance(v, dict)]
    except (OSError, json.JSONDecodeError):
        return ["sunset", "bloom", "ocean", "noir", "punch", "synthwave", "gold", "cyber", "fresh"]


THEME_NAMES = _load_theme_names()
THEME_CHOICES = "|".join(THEME_NAMES)
THEME_GUIDE = (
    "Theme guide: sunset=coaching/sales warm; bloom=beauty/lifestyle; ocean=education/tech; "
    "noir=luxury authority; punch=urgent/news; synthwave=neon creator; gold=premium luxury; "
    "cyber=AI/automation; fresh=wellness/friendly; premium-gold=dark gold semantic visuals; "
    "amber-olive-noir=cinematic thriller/luxury; porcelain-editorial=soft editorial/beauty; "
    "obsidian-red=warning/controversial sales; forest-luxury=deep trust/luxury; "
    "cobalt-authority=business/expert; rose-noir=feminine premium noir; "
    "graphite-minimal=minimal expert; mint-tech=SaaS/AI clean; violet-lab=analysis/research; "
    "documentary-cream=warm education/documentary."
)


GRAPHIC_TYPES_CLASSIC = (
    "kinetic-statement (chữ lớn gradient, câu chốt) | mask-reveal (chữ hiện sau cạnh sáng) | "
    "glass-strip (dải kính keyword) | path-mark[circle|underline|arrow] (nét vẽ tay nhấn keyword) | "
    "shape-3d[cube|sphere|torus|diamond] (khối 3D xoay, dùng cho khái niệm trừu tượng, KÈM text chú thích) | "
    "illus-mark[curved-arrow|starburst|check] (nét vẽ nhấn — DÙNG TIẾT CHẾ, tối đa 2-3 cả video, chỉ điểm CỰC nhấn; KHÔNG khoanh tròn vu vơ) | "
    "step-flow{items:[3-4 bước]} (sơ đồ quy trình 1-2-3 cards — DÙNG khi liệt kê bước/quy trình) | "
    "comparison{left,right} (so sánh 2 cột Trước/Sau — DÙNG khi đối lập) | "
    "list-reveal{items:[2-4 ý]} (list bullet hiện dần — DÙNG khi liệt kê lợi ích/điểm) | "
    "lower-third-pro{text,subtitle} (thanh tên/nhãn thiết kế — DÙNG giới thiệu tên/sản phẩm) | "
    "premium-roadmap{items:[3 bước]} (full-scene dark/gold S-curve roadmap — DÙNG cho lộ trình/quy trình chính) | "
    "neon-icon-card{icon,emphasis} (card đen neon line-icon — DÙNG cho lợi ích/khóa học/lời khuyên) | "
    "negative-slash-card (card gạch chéo đỏ — DÙNG cho không/đừng/tránh/loại bỏ) | "
    "dual-icon-cards{left,right} (2 card icon so sánh/lựa chọn) | diamond-label (nhãn kim cương premium ngắn) | "
    "info-table{text:tiêu đề, rows:[{k:nhãn,v:giá trị}]} (BẢNG thông tin chi tiết nhiều lớp effect — DÙNG khi liệt kê thông số/đặc điểm chi tiết, 3-5 dòng) | "
    "stat-compare{text:tiêu đề, leftLabel, leftVal:số, rightLabel, rightVal:số, unit} (SO SÁNH số liệu 2 cột thanh bar — DÙNG khi có con số đối chiếu vd trước/sau) | "
    "badge (nhãn ngắn) | callout (card nhấn ý) | highlight-reveal (bút quang) | "
    "number-counter[value,suffix] | donut-stat[value] | bar-stat[value] (số liệu)"
)

GRAPHIC_TYPES_THUY = (
    "kinetic-statement (chữ lớn gradient, câu chốt) | mask-reveal (chữ hiện sau cạnh sáng) | "
    "glass-strip (dải kính keyword) | path-mark[circle|underline|arrow] (nét vẽ tay nhấn keyword) | "
    "shape-3d[cube|sphere|torus|diamond] (khối 3D xoay, dùng cho khái niệm trừu tượng, KÈM text chú thích) | "
    "illus-mark[curved-arrow|starburst|check] (nét vẽ nhấn — DÙNG TIẾT CHẾ, tối đa 2-3 cả video, chỉ điểm CỰC nhấn; KHÔNG khoanh tròn vu vơ) | "
    "step-flow{items:[3-4 bước]} (sơ đồ quy trình 1-2-3 cards — DÙNG khi liệt kê bước/quy trình) | "
    "comparison{left,right} (so sánh 2 cột Trước/Sau — DÙNG khi đối lập) | "
    "list-reveal{items:[2-4 ý]} (list bullet hiện dần — DÙNG khi liệt kê lợi ích/điểm) | "
    "lower-third-pro{text,subtitle} (thanh tên/nhãn thiết kế — DÙNG giới thiệu tên/sản phẩm) | "
    "fullscreen-keyword{text,subtitle} (B-roll kinetic 100% full khung nền tối chữ keyword cực lớn, 1-2 lần/video, KHÔNG emoji) | "
    "info-table{text:tiêu đề, rows:[{k:nhãn,v:giá trị}]} (BẢNG thông tin chi tiết nhiều lớp effect — DÙNG khi liệt kê thông số/đặc điểm chi tiết, 3-5 dòng) | "
    "stat-compare{text:tiêu đề, leftLabel, leftVal:số, rightLabel, rightVal:số, unit} (SO SÁNH số liệu 2 cột thanh bar — DÙNG khi có con số đối chiếu vd trước/sau) | "
    "badge (nhãn ngắn) | callout (card nhấn ý) | highlight-reveal (bút quang) | "
    "number-counter[value,suffix] | donut-stat[value] | bar-stat[value] (số liệu)"
)


def pass_analyze(call, transcript_text, dur, model, video_parts=None):
    """Understand the content before editing. If video_parts given (inline video),
    the model SEES the footage too — judging gesture/expression/energy + WHERE the
    speaker's face sits — not just the words."""
    prompt = (
        "Bạn là editor reels. " +
        ("XEM video talking-head + " if video_parts else "") +
        "ĐỌC KỸ transcript dưới đây và PHÂN TÍCH (chưa dựng).\n\n"
        f"TRANSCRIPT ({dur}s):\n{transcript_text}\n\n"
        "Trả JSON (chỉ JSON):\n"
        "{\n"
        '  "topic": "<chủ đề chính 1 câu>",\n'
        '  "audience": "<đối tượng>",\n'
        '  "mood": "<sang|năng lượng|thân thiện|gấp gáp|truyền cảm hứng>",\n'
        '  "facePosition": "<left|center|right>",\n'
        '  "segments": [ {"label":"hook|problem|point|proof|cta","startSec":<n>,"endSec":<n>,"gist":"<ý chính>","energy":"<low|mid|high>","visualBeat":"<khoảnh khắc hình ảnh đáng nhấn nếu xem video>"} ],\n'
        '  "keyMoments": [ {"sec":<n>,"keyword":"<cụm đáng nhấn>","why":"<vì sao>","visualIdea":"<số/khái niệm/đối lập/nhấn mạnh>"} ]\n'
        "}\n"
        "segments 4-7 đoạn theo cấu trúc kể chuyện. keyMoments 8-14 mốc. "
        + ("Dựa vào HÌNH ẢNH: energy theo cử chỉ/biểu cảm, visualBeat theo động tác." if video_parts else "")
    )
    parts = (video_parts or []) + [{"text": prompt}]
    return call(parts, model)


def pass_strategy(call, analysis, dur, mood, model, preset=None, preset_name="thuy-style-oneshot"):
    """Propose an edit plan grounded in the analysis. If a learned editor PRESET is
    given, the plan mimics that editor's measured rhythm + signature moves."""
    # default pacing; overridden by preset
    # density figures are a CEILING (max), not a quota to hit — v8 lesson:
    # stuffing graphics to "fill gaps" reads as noise, not craft
    pace_hint = ("đoạn energy=high → graphic tối đa mỗi ~1.8s; mid → ~2.5s; low → ~3.5s. "
                 "Đây là TRẦN mật độ, không phải chỉ tiêu phải đạt.")
    preset_block = ""
    forced_theme = None
    if preset and preset.get("version") == 2:
        # EXECUTABLE preset v2 — HYBRID apply (user gu = dày v7):
        # ❌ KHÔNG dùng preset.density (vision đo thưa 5-6 gfx/reel, bỏ sót graphic nhỏ
        #    → reel ra thưa 8x so với gu dày 40-55 của user). Giữ pace_hint dày v7.
        # ✅ DÙNG: themeLock (màu) + graphicMix (tỷ lệ loại) + signatureTypes + captionStyle.
        # ✅ signature ưu tiên KHI nội dung hợp, else fallback (không ép graphic vô nghĩa).
        forced_theme = preset.get("themeLock")
        mix = preset.get("graphicMix", {})
        # graphicMix định HƯỚNG PHÂN BỔ loại (relative), KHÔNG định số lượng tuyệt đối
        mix_str = ", ".join(f"{k} ~{int(v*100)}%" for k, v in mix.items())
        cap = preset.get("captionStyle", {})
        hook = preset.get("hookStyle", {})
        sig = preset.get("signatureTypes", [])
        preset_block = (
            f"\n=== PHONG CÁCH EDITOR '{preset.get('editor')}' ({preset.get('sampleCount','?')} reel đo thật) ===\n"
            f"THEME BẮT BUỘC: {forced_theme} (đã khóa, KHÔNG đổi).\n"
            f"TỶ LỆ LOẠI GRAPHIC (định hướng phân bổ — áp vào MẬT ĐỘ DÀY bên dưới, "
            f"KHÔNG giảm số lượng): {mix_str}\n"
            f"LOẠI CHỮ KÝ (ưu tiên dùng KHI nội dung/transcript có dữ liệu hợp; "
            f"nếu không hợp thì chọn loại khác — KHÔNG ép graphic vô nghĩa): "
            f"{json.dumps(sig, ensure_ascii=False)}\n"
            f"CAPTION: {cap.get('wordsPerLine',6)} từ/dòng, highlight keyword: {cap.get('highlightKeyword', True)}.\n"
            f"HOOK: kiểu '{hook.get('method','')}', ví dụ '{hook.get('example','')}'.\n"
            f"→ GIỮ MẬT ĐỘ DÀY (nhiều graphic), nhưng PHỐI TỶ LỆ LOẠI + THEME theo editor này.\n"
        )
    elif preset:
        # legacy v1 preset — suggest from prose
        fp = preset.get("measuredFingerprint", {})
        preset_block = (
            f"\nHỌC PHONG CÁCH '{preset.get('editor')}': "
            f"signatureMoves {json.dumps(preset.get('signatureMoves', [])[:3], ensure_ascii=False)}\n"
        )
        
    graphics_list = GRAPHIC_TYPES_CLASSIC if preset_name == "classic" else GRAPHIC_TYPES_THUY
    
    if preset_name == "classic":
        card_rules = (
            "lộ trình/quy trình CHÍNH của video→premium-roadmap; lợi ích/khóa học/lời khuyên→neon-icon-card; "
            "không/đừng/tránh/loại bỏ→negative-slash-card; lựa chọn/2 phần→dual-icon-cards; keyword ngắn sang→diamond-label; "
        )
    else:
        card_rules = (
            "cần chuyển cảnh cực mạnh/b-roll mảng tối→fullscreen-keyword; "
        )

    prompt = (
        "Bạn là editor reels cao cấp. Dựa trên PHÂN TÍCH nội dung, đề xuất KẾ HOẠCH DỰNG.\n"
        f"Phong cách tổng thể: {mood} (chọn theme màu hợp).\n"
        + preset_block +
        f"\nPHÂN TÍCH:\n{json.dumps(analysis, ensure_ascii=False)}\n\n"
        f"Nguyên tắc tần suất CAO (user muốn nhiều visual): {pace_hint} "
        "Mỗi keyMoment + mỗi câu nhấn nên có graphic phù hợp NGHĨA.\n"
        f"Loại graphic khả dụng: {graphics_list}\n\n"
        "Quy tắc chọn loại: liệt kê BƯỚC/quy trình→step-flow (items); SO SÁNH/đối lập→comparison (left,right); "
        "liệt kê LỢI ÍCH/điểm→list-reveal (items); giới thiệu TÊN/sản phẩm→lower-third-pro; "
        f"{card_rules}"
        "số liệu→counter/donut/bar; khái niệm trừu tượng→shape-3d KÈM chú thích; "
        "câu chốt mạnh→kinetic-statement; nhấn keyword→path-mark/highlight-reveal; nhãn ngắn→badge.\n"
        "Map loại: số liệu→counter/donut/bar; trừu tượng→shape-3d; câu chốt→kinetic-statement; "
        "nhấn keyword→path-mark/highlight-reveal; nhãn→badge; thông số chi tiết→info-table; số đối chiếu→stat-compare.\n"
        "=== QUY TẮC NHỊP ĐIỆU CÂU THOẠI (SENTENCE-COMPLETION VISUAL BEATS - BẮT BUỘC) ===\n"
        "Cứ mỗi khi người nói hoàn thành 1 CÂU NÓI / 1 Ý TRỌN VẸN, BẮT BUỘC phải có 1 hiệu ứng thị giác xuất hiện:\n"
        "- Hành động, hiện vật, chứng cứ, bối cảnh thực tế → B-roll (fullscreen-keyword hoặc broll footage) kèm slow zoom.\n"
        "- Con số, tỷ lệ, văn bản luật, điều kiện định lượng → Kinetic Headline số liệu (stat-punch, 3-tier số vàng).\n"
        "- Đối lập, nghịch lý, mâu thuẫn (lời vs lỗ, trước vs nay) → Hiệu ứng đối lập (split-contrast, comparison, stacked-contrast).\n"
        "- Triết lý, đúc kết luận điểm, lời khuyên cốt lõi → Kinetic Headline đòn bẩy (asymmetric-trio, multiblock-flow, kinetic-statement).\n"
        "- Chuyển hướng chủ đề, sang ý tiếp theo, đổi phân cảnh → Chuyển Cảnh CapCut 2-layer (phone-reveal, paper-ball, comic-cut...).\n"
        "AI BẮT BUỘC PHÂN TÍCH NỘI DUNG NGỮ NGHĨA để chọn loại tương thích nhất; CẤM chọn bừa hoặc máy móc. "
        "Luân phiên các loại, KHÔNG dùng cùng 1 loại cho 2 câu nói liền kề.\n\n"
        "Hình tượng minh họa (illus-mark) khả dụng cho khái niệm KHÔNG có số: process/tốc độ/chất lượng/tiền/ý tưởng. "
        "Bạn KHÔNG cần chọn metaphor cụ thể — hệ thống tự suy ra từ transcript (có thể đổi/bỏ nếu nội dung không hợp).\n\n"
        "=== PHONG CÁCH ===\n"
        "Gợi ý 'vocabulary' = 6-8 loại graphic CHỦ ĐẠO hợp topic+theme (ưu tiên dùng nhiều, nhưng KHÔNG bắt buộc chỉ dùng bấy nhiêu).\n"
        f"{THEME_GUIDE}\n"
        "=== NHỊP DÀY CÓ CHỦ ĐÍCH (user thích nhiều visual, nhưng quota là TRẦN) ===\n"
        "HOOK 0-3s dày đặc. Toàn video tần suất cao theo energy đoạn (TRẦN: high~1.8s, mid~2.5s, low~3.5s) "
        "— mỗi graphic phải gắn với điều ĐANG NÓI; khoảng thở ngắn là bình thường. "
        "Pre-CTA 5-7s cuối tăng dần. KHÔNG graphic mới trong 2s cuối.\n\n"
        "Trả JSON (chỉ JSON):\n"
        "{\n"
        f'  "theme": "<{THEME_CHOICES}>",\n'
        '  "ambient": "<sparkles|ring|both|none>",\n'
        '  "hookText": "<HOOK 3-6 từ giật tít viết hoa>",\n'
        '  "ctaText": "<CTA 2-4 từ kêu gọi>",\n'
        '  "plan": [ {"sec":<n>,"type":"<loại>","text":"<nội dung>","reason":"<vì sao>",'
        '"shape":"","kind":"","value":null,"suffix":""} ]\n'
        "}\n"
        "plan rải đều toàn bộ, DÀY visual (mỗi keyMoment + câu nhấn có graphic hợp NGHĨA)."
    )
    result = call(prompt, model)
    # executable preset locks the theme regardless of what the LLM chose
    if forced_theme:
        result["theme"] = forced_theme
    return result


def pass_critique(call, plan_items, dur, model, analysis=None):
    """Self-review the plan: relevance, density gaps, errors. Receives the ANALYSIS
    (transcript segments + keyMoments) so relevance check is grounded in real content,
    not the plan's own self-reported reasons."""
    # ground truth: what's actually said at each moment
    context = ""
    if analysis:
        segs = analysis.get("segments", [])
        kms = analysis.get("keyMoments", [])
        context = (
            "NỘI DUNG THẬT (đối chiếu để chấm relevance):\n"
            f"- topic: {analysis.get('topic','')}\n"
            f"- segments: {json.dumps([{'s':s.get('startSec'),'e':s.get('endSec'),'gist':s.get('gist')} for s in segs], ensure_ascii=False)}\n"
            f"- keyMoments: {json.dumps([{'sec':k.get('sec'),'kw':k.get('keyword')} for k in kms], ensure_ascii=False)}\n\n"
        )
    prompt = (
        "Bạn là giám đốc sáng tạo review KẾ HOẠCH DỰNG reel. Tìm lỗi và đề xuất sửa.\n\n"
        + context +
        f"Thời lượng: {dur}s. KẾ HOẠCH (graphics theo giây):\n{json.dumps(plan_items, ensure_ascii=False)}\n\n"
        "Kiểm tra (đối chiếu graphic với NỘI DUNG THẬT tại giây đó): "
        "(1) graphic text/loại nào KHÔNG khớp điều đang nói? (BỎ) "
        "(2) graphic nào KHÔNG trả lời được 'làm rõ thông tin | tạo nhịp | dẫn mắt'? = trang trí thừa (BỎ) "
        "(3) shape-3d/illus nào vô nghĩa? (BỎ) (4) text nào quá dài/sai?\n"
        "NHỊP: chỉ 'add' khi graphic làm rõ thông tin / tạo nhịp / dẫn mắt cho ĐÚNG câu đang nói "
        "— quota là TRẦN, thà thưa còn hơn nhồi; KHÔNG add chỉ để lấp khoảng trống.\n"
        "Trả JSON (chỉ JSON):\n"
        "{\n"
        '  "drop": [<index các graphic nên BỎ vì không hợp>],\n'
        '  "add": [ {"sec":<n>,"type":"<loại>","text":"<...>","reason":"<lấp khoảng trống/tăng nhịp>","shape":"","kind":"","value":null,"suffix":""} ],\n'
        '  "notes": "<nhận xét ngắn>"\n'
        "}\n"
        "Mục tiêu: mọi graphic hợp nội dung, nhịp có chủ đích, không quá tải; khoảng thở là chấp nhận được."
    )
    return call(prompt, model)
