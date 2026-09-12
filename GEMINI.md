# QUY TẮC BẤT DI BẤT DỊCH CHO DỰ ÁN VIDEO (ALWAYS-ON WORKSPACE RULES)

Tài liệu này là bộ quy tắc cốt lõi được Antigravity tự động tải ở MỌI phiên làm việc trong dự án này.
Mọi luồng dựng video (kể cả chạy lệnh, viết script hay gọi skill) BẮT BUỘC tuân thủ 100% các nguyên tắc sau:

---

## 1. ÂM THANH: KHÓA CỨNG TỈ LỆ TƯƠNG QUAN ÂM LƯỢNG (RELATIVE VOLUME RATIOS)
Tuyệt đối KHÔNG khóa cứng một giá trị cố định thô, mà BẮT BUỘC **khóa cứng tỉ lệ tương quan âm lượng** giữa các thành phần âm thanh với Trục Neo Chính là Giọng Nói Diễn Giả:
- **Trục Neo Chính (Voice Master Anchor - $V_{voice}$)**:
  - Giọng nói người nói là tâm điểm, luôn được ưu tiên cao nhất, thường boost trong khoảng `1.30× – 1.40×` (chuẩn: `1.35×`) để âm thanh đanh thép, trong trẻo.
- **Tỉ lệ Nhạc Nền / Giọng Nói (BGM-to-Voice Ratio - $R_{bgm}$)**:
  - Khóa cứng tỉ lệ $V_{bgm} / V_{voice}$ trong dải chuẩn: **`0.05 – 0.08`** (Tối đa tuyệt đối không vượt quá **`0.09`** $pprox -22	ext{dB}$ so với giọng).
  - Công thức tự động: $V_{bgm} = V_{voice} 	imes 0.06$ (Ví dụ: Voice 1.35 $ightarrow$ BGM = 0.081; Voice 1.0 $ightarrow$ BGM = 0.06; Voice 1.5 $ightarrow$ BGM = 0.09).
  - Luôn cấu hình `fadeOutSec: 2.0` ở cuối video để chuyển êm, không cắt cụt nhạc.
- **Tỉ lệ Hiệu Ứng / Giọng Nói (SFX-to-Voice Ratio - $R_{sfx}$)**:
  - SFX lướt nhẹ, UI, chuyển cảnh mềm (`whoosh-soft`, `pop-soft`, `toggle`, `pip`): $0.35 – 0.50 	imes V_{voice}$ (khoảng 0.45 – 0.65).
  - SFX nhấn mạnh, va đập, nổ chữ, khen thưởng (`correct`, `magic-reveal`, `glare-burn`, `impact-soft`): $0.55 – 0.75 	imes V_{voice}$ (khoảng 0.70 – 0.95).
  - Tuyệt đối không để bất kỳ SFX nào vượt quá $0.85 	imes V_{voice}$ để tránh gây giật mình hoặc lấn át giọng nói.

---

## 2. NGUYÊN TẮC XUẤT HIỆN LỆCH PHA ĐỘNG LỰC HỌC CHO HEADLINE (TWO-PHASE IN)
- Áp dụng cho TOÀN BỘ các loại tiêu đề/ý tưởng Headline (`asymmetric-trio`, `stacked-contrast`, `multiblock-flow`, `3-tier`, `split-contrast`, `stat-punch`, `tag-headline`):
  - **Pha 1 (Frame 0 của Graphic)**: Tầng dẫn dắt (Header màu trắng) trượt xuống hiển thị ngay. **Từ khóa vàng `#FFE600` BẮT BUỘC ẨN HOÀN TOÀN (`opacity: 0`)**.
  - **Pha 2 (Đúng Voice Onset)**: Đúng thời điểm giọng nói phát âm tới từ khóa (khớp timestamp `keywordStartMs` trong transcript), từ khóa vàng mới bung nở (`scale: 1.0 -> 1.18 -> 1.0`), lóe sáng vàng neon kèm SFX nhẹ (`highlight` / `magic-reveal`).
  - **Quy tắc EDL**: MỌI khối Headline trong `tracks.graphics` BẮT BUỘC phải có trường `keywordStartMs` khớp với transcript âm thanh. Tuyệt đối không để trống để tránh fallback hiện đồng thời.
  - **Lưu ý**: Phụ đề transcript nói thường (4–6 từ nhảy chữ karaoke) KHÔNG bị ảnh hưởng bởi quy tắc này, hiển thị bình thường.

---

## 3. QUY CHUẨN CẮT GỌT TRIỆT ĐỂ (AGGRESSIVE TRIMMING)
- Trước khi dựng, phân tích kỹ transcript và waveform:
  1. **Cắt 100% câu nói vấp, nói lặp (False Starts & Repeated Phrases)**: Nếu người nói nói dở câu rồi nói lại nguyên câu chuẩn (ví dụ: *"anh chị cùng xem... anh chị cùng xem qua nha"*), BẮT BUỘC cắt sạch đoạn nói vấp đầu tiên, chỉ giữ lại câu hoàn chỉnh duy nhất.
  2. **Cắt 100% câu thoại hậu trường / giao tiếp kỹ thuật**: Các câu như *"Sau khi Sang nói xong rồi, Sang tắt đi ha"*, *"Quay lại đoạn này nha"*, động tác với tay tắt máy cuối clip phải bị cắt bỏ hoàn toàn.
  3. **Cắt khoảng lặng & lấy hơi**: Cắt bỏ các khoảng im lặng > 0.35s và tiếng thở dốc trước câu nói.
  4. **Tốc độ nhịp dựng**: Tăng tốc lời thoại `1.05× – 1.12×` (chuẩn: `1.07×`), giữ nguyên cao độ giọng tự nhiên.

---

## 4. QUY CHUẨN PRESET `thuy-style-nhieu-canh`
- **Chân video sắc nét 100% (Không blur đáy)**: Bắt buộc cấu hình `scrimMode: "top-only"`. Tuyệt đối KHÔNG áp dụng blur đen 14px ở 30% đáy khung hình.
- **Vùng an toàn 30%–70%**:
  - Toàn bộ Hook, Headline, B-roll Keyword, CTA button LUÔN neo ở **30% trên (tâm Y=15%)**.
  - Vùng 30%–70% giữa tuyệt đối không để bất kỳ graphic, card hay icon nào che khuất khuôn mặt, ánh mắt người nói.
- **Phụ đề Karaoke**:
  - Khóa cứng 1 dòng duy nhất (`whiteSpace: "nowrap"`), chunk ngắn 4–6 từ/lần.
  - **TUYỆT ĐỐI CẤM VIỀN ĐEN (Zero Black Stroke)**. Bắt buộc dùng **Deep Multi-Layer Dark Drop Shadow**.
  - Từ đang nói bôi vàng rực `#FFE600`, từ còn lại màu trắng `#FFFFFF`.

---

## 5. KHO NỀN B-ROLL CHIỀU SÂU ĐIỆN ẢNH ĐA DẠNG & CHUYỂN CẢNH CAPCUT
- **Kho Nền B-Roll Chiều Sâu Đa Dạng (Cinematic Depth Library)**:
  - **TUYỆT ĐỐI KHÔNG dùng cố định một mẫu duy nhất**. AI phải linh hoạt phân tích ngữ cảnh, chủ đề nội dung để chọn mẫu nền phù hợp từ kho `public/broll-bg/`:
    1. `dark-gradient-depth.png`: Gradient chiều sâu studio sang trọng (giới thiệu tổng quan, chia sẻ khóa học, phong cách chuyên nghiệp).
    2. `dark-brick-wall.png`: Tường gạch đen mờ cao cấp (talkshow, podcast, phỏng vấn, thực chiến).
    3. `grid-caro.png`: Lưới kỹ thuật số blueprint (công nghệ, AI, dữ liệu số, phân tích quy trình).
    4. `paper-crumpled-black.png`: Giấy nhàu đen mỹ thuật (sáng tạo nội dung, viral video, storytelling, cảm xúc).
    5. `concrete-dark-grunge.png`: Đá phiến bê tông tối màu điện ảnh (bất động sản, tài chính, kinh doanh, bán hàng).
    6. `radial-navy-glow.png`: Gradient xanh đen Navy rọi tâm (doanh nghiệp, chuyên gia cấp cao, uy tín).
    7. `carbon-mesh-studio.png`: Vân sợi carbon studio (thiết bị, công cụ quay phim, setup máy tính/studio).
    8. `lens-bokeh-abstract.png`: Đốm sáng bokeh hổ phách trên nền tối (cảm xúc lắng đọng, thương hiệu cá nhân).
    9. `blurred-speaker`: Khung hình người nói làm mờ 35px phủ tối (tính liền mạch điện ảnh phong cách tài liệu).
  - Kết hợp chuyển động Ken Burns slow zoom (1.02× $ightarrow$ 1.09×) hoặc micro-drift để khung hình B-roll luôn chuyển động êm ái, sống động.
  - Tuyệt đối không dùng nền đen tuyền phẳng đứng yên đơn điệu trừ khi người dùng yêu cầu rõ.
- **Bộ Chuyển Cảnh CapCut 2-Layer Độc Quyền (Two-Layer Transitions Contract)**:
  - **TUYỆT ĐỐI KHÔNG dùng Mock Overlay 1 lớp (Single-Layer CSS Draw)**: Mọi chuyển cảnh trong video phải chạy qua Engine `CapCutTwoLayerTransitions` với đầy đủ 2 tầng video thật (`clipA` = cảnh trước, `clipB` = cảnh sau, `startFromA`, `startFromB` nối tiếp liền mạch).
  - **Quy Tắc Vị Trí Cắt Cảnh (Cut-Point Placement Contract)**:
    - Chuyển cảnh CapCut là cầu nối giữa 2 cảnh quay khác nhau. **TUYỆT ĐỐI KHÔNG đặt chuyển cảnh lơ lửng giữa câu nói của A-roll khi không có đổi cảnh**.
    - Vị trí đặt chuyển cảnh BẮT BUỘC neo tại đúng **Điểm Cắt Cảnh (Cut Point)**:
      + Vào B-roll: `startMs = broll.startMs - (durationMs / 2)` (Tâm chuyển cảnh trùng khớp frame B-roll bắt đầu).
      + Thoát B-roll: `startMs = broll.endMs - (durationMs / 2)` (Tâm chuyển cảnh trùng khớp frame B-roll kết thúc, trở về người nói).
      + Cắt đổi phân cảnh lớn (Jump-cut sang góc máy khác hoặc ý khác): neo tâm tại timestamp cắt phân cảnh.
  - **Bảng 9 Hiệu Ứng Khóa Cứng Thời Lượng, Hướng và SFX (Bắt buộc tuân thủ 100%)**:
    1. `glare-ii`: 16 frames (533ms), direction: `"right"`, SFX: `glare-burn` (vol: 0.90).
    2. `phone-reveal`: 22 frames (733ms), direction: `"right"`, SFX: `phone-shutter-1` (vol: 0.95).
    3. `paper-ball`: 20 frames (667ms), direction: `"right"`, SFX: `paper-ball-yt` (vol: 0.95).
    4. `glitch`: 14 frames (467ms), direction: `"right"`, SFX: `glitch-cut` (vol: 0.85).
    5. `fade-down`: 14 frames (467ms), direction: `"down"`, SFX: `fade-woosh` (vol: 0.90).
    6. `blink`: 8 frames (267ms), direction: `"right"`, SFX: `click` (vol: 0.95).
    7. `wave-right`: 16 frames (533ms), direction: `"right"`, SFX: `wave-sparkle` (vol: 0.90).
    8. `swipe-left`: 10 frames (333ms), direction: `"left"`, SFX: `whoosh-fast` (vol: 0.95).
    9. `comic-cut`: 20 frames (667ms), direction: `"right"`, SFX: `comic-paper-tear` (vol: 0.95).
  - **Quy tắc EDL & SFX Coupling**:
    + Mọi item trong `tracks.transitions` BẮT BUỘC phải có 1 item tương ứng trong `tracks.sfx` với sound chuẩn ở trên và `startMs` đồng bộ.
    + `direction` chỉ được chọn 1 trong: `["up", "down", "left", "right"]` (TUYỆT ĐỐI CẤM dùng `"center"` gây lỗi Schema).
    + Quy tắc Anti-Bleed: Âm lượng SFX chuyển cảnh phải ngắt triệt để khi chuyển cảnh kết thúc, không lấn sang cảnh kế tiếp.

---

## 6. QUY TẮC NHỊP ĐIỆU CÂU THOẠI: MỖI CÂU NÓI ĐỀU PHẢI CÓ HIỆU ỨNG THỊ GIÁC ĐI KÈM (SENTENCE-COMPLETION VISUAL BEATS)
- **Nguyên tắc bất di bất dịch**:
  - Cứ mỗi khi người nói **hoàn thiện một câu nói / một ý trọn vẹn** (sentence / complete thought boundary), trên màn hình **BẮT BUỘC PHẢI XUẤT HIỆN MỘT HIỆU ỨNG THỊ GIÁC ĐIỆN ẢNH**.
  - **TUYỆT ĐỐI KHÔNG ĐƯỢC ĐỂ XẢY RA "KHOẢNG CHẾT THỊ GIÁC" (Dead Visual Zone)**: Cấm để câu nói trôi qua chỉ với mỗi dòng phụ đề karaoke đơn độc mà không có biến chuyển hình ảnh.
- **Phân Loại & Quyết Định Dựa Trên Phân Tích Ngữ Cảnh Thoại (Semantic Context Decision - CẤM CHỌN BỪA HOẶC MÁY MÓC)**:
  AI phải phân tích ngữ nghĩa, cấu trúc và mục đích của từng câu nói để chọn đúng 1 trong 3 nhóm hiệu ứng:
  1. **Nhóm B-Roll Chiều Sâu (Contextual Cinematic B-Roll)**:
     - *Khi câu nói mô tả*: Hành động thực tế, bối cảnh đời sống, hiện vật/tài sản (đất đai, sổ đỏ, quy hoạch, công nghệ, gia đình, công xưởng), hoặc đưa ra ví dụ/chứng cứ trực quan.
     - *Hiển thị*: B-roll full màn hình 9:16 có chuyển động Ken Burns slow zoom (1.02× $\rightarrow$ 1.09×) hoặc micro drift, chọn nền chiều sâu tương ứng từ kho `public/broll-bg/`, kèm từ khóa vàng punchline. Cắt vào/ra bằng chuyển cảnh CapCut 2-layer neo đúng cut point.
  2. **Nhóm Hiệu Ứng Chữ & Tiêu Đề Động (Kinetic Typography & Dynamic Headlines)**:
     - *Khi câu nói chứa con số, điều kiện, văn bản pháp luật*: *Nghị định 37, 3 lần, 80%, 4 điều kiện...* $\rightarrow$ Kích hoạt `stat-punch` hoặc `3-tier` với số vàng khổng lồ `#FFE600`.
     - *Khi câu nói chứa mâu thuẫn, đối lập, cảnh báo sai lầm*: *"Tưởng lời nhưng lỗ", "Trước đây vs Bây giờ"* $\rightarrow$ Kích hoạt `split-contrast`, `comparison` hoặc `stacked-contrast`.
     - *Khi câu nói đúc kết triết lý, lời khuyên cốt lõi, cú chốt luận điểm (Golden Rule)* $\rightarrow$ Kích hoạt `asymmetric-trio`, `multiblock-flow` hoặc `kinetic-statement`.
     - *Lưu ý*: Tuân thủ nghiêm ngặt quy tắc Hai Tầng Xuất Hiện (Two-Phase In) với `keywordStartMs`.
  3. **Nhóm Hiệu Ứng Chuyển Cảnh CapCut (CapCut Two-Layer Transitions)**:
     - *Khi câu nói đánh dấu bước ngoặt*: Chuyển hướng chủ đề lớn, lật ngược vấn đề sang ý tiếp theo, hoặc câu mở đầu sang một phân đoạn mới (ví dụ: *"Nhưng chưa hết...", "Và đây mới là điều then chốt...", "Bước tiếp theo bạn phải làm là..."*).
     - *Hiển thị*: Neo đúng điểm cắt cảnh bằng 1 trong 9 hiệu ứng CapCut 2-layer chuẩn (`glare-ii`, `phone-reveal`, `paper-ball`, `comic-cut`, `wave-right`, `glitch`, `fade-down`, `blink`, `swipe-left`) kèm SFX khóa cứng 1:1 dứt khoát.
- **Quy tắc Luân Phiên & Chống Trùng Lặp (Anti-Repetition & Dynamic Pacing)**:
  - Không dùng cùng một nhóm hiệu ứng cho 2 câu nói liên tiếp (ví dụ: câu trước B-roll thì câu sau nên là Kinetic Headline hoặc Chuyển cảnh CapCut).
  - Giữ nhịp độ thị giác luôn tươi mới, kích thích sự chú ý liên tục của người xem theo chuẩn TikTok/Reels triệu view.

---

## 7. GÁC CỔNG TỰ ĐỘNG TRƯỚC KHI RENDER
- Luôn chạy kiểm tra `python scripts/validate-edl-risk.py out/edl.json`.
- Mọi cảnh báo rủi ro về tỉ lệ âm lượng BGM/Voice, SFX/Voice, thiếu `keywordStartMs`, thiếu hiệu ứng nhịp thoại, hoặc lỗi chính tả phải được khắc phục về 0 trước khi tiến hành render.
