---
name: thuy-style-oneshot
description: >-
  Dựng video ngắn talking-head theo phong cách Thuy-style-oneshot: phụ đề nhảy
  chữ 4–6 từ bôi vàng 1 dòng duy nhất (no wrap), KHÔNG viền đen, bóng tối sâu đa tầng, KHÔNG card viền hộp, KHÔNG icon/emoji, headline phân tầng
  & kinetic typography chữ vàng chạy chữ so le, B-roll full khung nền đen tuyền bám lời, cơ chế
  độc quyền hiển thị liên tục. Dùng khi người dùng gõ /thuy-style-oneshot hoặc yêu cầu dựng
  phong cách oneshot hiện đại.
---

# Phong Cách Thuy Style One Shot

Skill này kích hoạt preset `thuy-style-oneshot` trong hệ thống dựng **TISA AI EDITOR AGENT**.

## Quy trình thực hiện

1. **Đọc và thực thi toàn bộ quy trình** trong skill `tisa-ai-editor-agent`
   tại `../tisa-ai-editor-agent/SKILL.md` (hoặc skill `tisa-ai-editor-agent`).
   Skill này chỉ là lớp kích hoạt preset — toàn bộ engine nằm trong `tisa-ai-editor-agent`.

2. Ở **mọi bước pipeline** (transcribe → generate-edl → render), luôn truyền
   cờ `--preset thuy-style-oneshot`.

3. Áp dụng nghiêm ngặt các quy tắc biên tập độc quyền của preset này:

   ### A. Vùng An Toàn Độc Quyền: Nằm Chính Giữa 30% Trên & 30% Dưới (BẮT BUỘC)
   - **Quy tắc vị trí tuyệt đối**:
     - **Idea Headline và các Card trực quan: LUÔN NẰM CHÍNH GIỮA 30% KHUNG HÌNH TRÊN (Y: 0% – 30%, căn giữa tại tâm Y=15% ~ 288px) HOẶC CHÍNH GIỮA 30% KHUNG HÌNH DƯỚI (Y: 70% – 100%, căn giữa tại tâm Y=85% ~ 1632px)**.
     - **TUYỆT ĐỐI KHÔNG QUÁ CAO SÁT MÉP TRÊN, KHÔNG QUÁ THẤP SÁT MÉP DƯỚI, VÀ KHÔNG TIẾN RA GIỮA**: Vùng trung tâm 30% – 70% là không gian độc quyền dành riêng cho khuôn mặt, ánh mắt, khẩu hình và cử chỉ tay của người nói.
     - Cấu hình vị trí chuẩn từng style:
       - Container trên: `height: "30%"`, `top: 0`, `display: "flex"`, `justifyContent: "center"` (căn giữa hoàn hảo cho `stat-punch`, `split-contrast` dòng trên, `comparison`, `step-flow`, `hook`).
       - Container dưới: `height: "30%"`, `bottom: 0`, `display: "flex"`, `justifyContent: "center"` (căn giữa hoàn hảo cho `3-tier`, `split-contrast` dòng dưới, `tag-headline`).

   ### B. Quy Tắc Giới Hạn Độ Dài Từ (Word Count Limit)
   - **GIỚI HẠN KHÔNG QUÁ 6 TỪ TRÊN 1 DÒNG** cho tất cả các style Headline (đặc biệt là style 3 dòng `3-tier`), tránh tuyệt đối tình trạng headline bị quá nhiều chữ, gây rối mắt.
   - Cả 3 dòng của style `3-tier`:
     - Line 1 (Header bối cảnh): ≤ 6 từ.
     - Line 2 (Keyword vàng ngoặc kép): ≤ 6 từ.
     - Line 3 (Sub câu chốt): ≤ 6 từ.

   ### C. Quy Tắc Cố Định Headline (Topic Block Duration)
   - **Tuyệt đối KHÔNG gán style headline vào các cụm transcript ngắn** (1–2 giây) vì sẽ làm headline bị chớp nháy/giật giật biến mất liên tục theo nhịp nhả chữ.
   - **BẮT BUỘC đặt Headline vào track `graphics`** với thời lượng cố định liên tục **8–15 giây** (hoặc bao trọn từ đầu đến cuối khoảng thời gian người nói diễn giải ý đó).
   - **Cơ chế độc quyền hiển thị (Mutual Exclusivity)**: Khi có Headline, Card đồ họa hoặc B-roll xuất hiện trên track `graphics`, phụ đề transcript sẽ tự động ẩn đi để tránh đè chữ. Khi khối visual đó kết thúc, phụ đề transcript sẽ tự động xuất hiện trở lại.

   ### D. Quy Chuẩn Nội Dung Headline & Đa Dạng Style Kinetic Typography + Card Đồ Họa
   - **Headline phải mang tính tóm tắt/đúc kết ý tưởng**: Tuyệt đối không bê nguyên văn chữ nói thô từ transcript vào headline. Headline phải là câu tóm lược súc tích, đắt giá, thể hiện trọng tâm mà người nói đang truyền tải.
   - **Đa dạng luân phiên các Style Kinetic Typography & Card đồ họa**:
     1. `asymmetric-trio`: Cụm 3 khối bất đối xứng đòn bẩy: Khối trái từ mở đầu (Trắng IN HOA ~88px) + Khối giữa cụm nối chữ thường (~42px trắng) + Khối phải từ khóa chốt hạ IN HOA khổng lồ (VÀNG RỰC `#FFE600` ~92px).
     2. `stacked-contrast`: 2 tầng tương phản trên dưới: Dòng trên chữ thường bổ nghĩa (~48px trắng) + Dòng dưới từ khóa quyền lực IN HOA khổng lồ (VÀNG RỰC `#FFE600` ~108px).
     3. `multiblock-flow`: Dòng chảy 3 khối so le: Khối mở đầu IN HOA (Trắng ~78px) + Cụm nối chữ thường (~46px trắng) + Từ khóa hạ màn IN HOA khổng lồ 2 dòng (VÀNG RỰC `#FFE600` ~96px).
     4. `glow-ambient`: Tiêu đề chủ đề/năm/con số khổng lồ (VÀNG RỰC `#FFE600` ~140–180px) nổi bật ở đỉnh đầu vùng 30% trên.
     5. `stat-punch`: Tiêu đề số đòn bẩy khổng lồ (vàng rực `#FFE600`) + dòng phụ đề trắng in nghiêng phía dưới.
     6. `comparison`: Card đồ họa đối chiếu 2 cột so sánh trực quan (Cũ vs Mới, Trước vs Sau, Nên vs Không nên).
     7. `split-contrast`: Chạy chữ so le 2 dòng (dòng trên slide-down từ frame 0 ở 30% trên, dòng dưới slide-up từ frame 14 ở 30% dưới).
     8. `step-flow`: Card đồ họa quy trình từng bước (Bước 1 → Bước 2 → Bước 3) với badge số vàng.
     9. `3-tier`: Headline 3 tầng chữ vàng ngoặc kép in hoa viền sắc nét (`header` + `keyword` + `sub`).
   - **Quy tắc về Màu Sắc & Hiệu Ứng Chữ (BẮT BUỘC)**:
     - Chỉ sử dụng bảng màu thương hiệu chuẩn: **Trắng `#FFFFFF`** cho cụm từ ngữ dẫn dắt/bối cảnh và **Vàng rực `#FFE600`** độc quyền cho các từ khóa/số liệu trọng tâm cần nhấn mạnh.
      - **TUYỆT ĐỐI CẤM**:
        + **Viền đen / Border stroke quanh chữ** (`-3px -3px 0 #000...` hay `-webkit-text-stroke`) vì gây thô cứng, hoạt hình, mất thẩm mỹ.
        + **Hiệu ứng hào quang mờ neon** (blurry camera bloom / diffuse glow halo) gây mờ đục chữ.
      - **BẮT BUỘC DÙNG LỚP BÓNG TỐI SÂU ĐA TẦNG (Deep multi-layer dark drop shadow)**: `textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)'` cho từ khóa chính và `0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)` cho chữ thường/từ dẫn dắt. Lớp bóng tối sâu tạo độ nổi khối điện ảnh (cinematic pop) giúp chữ bứt khỏi nền video sắc nét mà hoàn toàn KHÔNG có đường viền đen bao quanh.
   - **Quy tắc về Card**: Cho phép các card trực quan nội dung như `comparison`, `step-flow` trong vùng an toàn (top safe zone); Tuyệt đối KHÔNG dùng các card viền hộp tĩnh kiểu cũ kèm icon SVG (`NeonIconCard`, `DiamondLabel`, `DualIconCards`...).

   ### E. Bắt Buộc Làm Nổi Bật Con Số & Nghị Định/Văn Bản Bằng Headline
   - Khi người nói đề cập tới:
     - Tên văn bản luật, nghị định, thông tư (ví dụ: *Nghị định 37*).
     - Số lần kiểm tra, điều kiện định lượng (ví dụ: *3 lần liên tiếp*).
     - Số lượng danh mục, thông tin bắt buộc (ví dụ: *4 thông tin bắt buộc*).
     - Cơ chế độc quyền (ví dụ: *1 doanh nghiệp - 1 mã vạch*).
   - **BẮT BUỘC** phải tạo Headline (`stat-punch`, `3-tier`) hoặc Card đồ họa để làm nổi bật con số đó bằng màu vàng rực `#FFE600`, không để con số chỉ trôi qua ở phụ đề thường.

   ### F. Tăng Cường B-Roll Full Khung Bám Sát Lời Nói
   - **Quy chuẩn thẩm mỹ B-Roll**:
     - **Bắt buộc dùng nền đen tuyền (`#000000`)**: Tạo chiều sâu điện ảnh, tương phản cao, tối giản và sang trọng. Tuyệt đối không dùng nền màu mè hay họa tiết hình học rối mắt.
     - Sử dụng component `fullscreen-keyword` (1080x1920) với tiêu đề IN HOA khổng lồ, từ khóa đòn bẩy bôi vàng rực `#FFE600` đổ bóng tối sâu.
   - **Các dạng ứng dụng thực tế**:
     - *Dạng liệt kê tiêu chí/hồ sơ/bước*: Nội dung các mục phân tách bằng ký tự `•` (ví dụ: `1. Mục A • 2. Mục B...`), hệ thống tự động hiển thị badge số vàng nảy tuần tự theo nhịp nói.
     - *Dạng chốt kết quả/quyền lợi*: Xuất hiện ngắn gọn tạo cú đấm thị giác (punch) ở giai đoạn chốt ý quan trọng.
   - *Lưu ý linh hoạt*: Thiết kế B-roll linh hoạt bám sát ngữ cảnh của từng video cụ thể, tuyệt đối không gán cứng nội dung văn bản vào skill để tránh bị cứng nhắc cho các video khác.

   ### G. Sound Design SFX: AI Suy Luận Ngữ Cảnh & Khai Thác Kho 45+ Mẫu Chuẩn
    - **BẮT BUỘC TRỎ TỚI KHO SFX CHUẨN HÓA**: Mọi SFX phải được lấy từ kho 45+ mẫu chuẩn (Anh Sắc + Kobe Media + `typing-1`) tại `public/sfx/`.
    - **NGHIÊM CẤM** chọn bừa, lặp máy móc, hoặc lười biếng chỉ dùng `whoosh`, `pop`, `impact`. AI phải **suy luận ngữ cảnh câu nói** để chọn SFX đắt giá nhất từ 6 nhóm chức năng: *Thao tác công nghệ/UI*, *Chuyển cảnh/Lướt chữ*, *Cinematic/Kịch tính*, *Foley đời sống*, *Hài hước/Comic Meme*, *Game 8-Bit/CTA*.
    - → **Bắt buộc tra cứu bảng đặc tính âm thanh & ứng dụng chuẩn xác** tại [sfx-sound-design.md](../tisa-ai-editor-agent/references/sfx-sound-design.md) (hoặc `tisa-ai-editor-agent/references/sfx-sound-design.md`).
    - **Quy tắc phân bổ âm thanh**:
      - Khoảng 10–14 SFX cho video 2–3 phút, không spam dồn dập.
      - **Hai SFX phát liên tiếp KHÔNG ĐƯỢC PHÉP trùng nhau**.
      - Giữ khoảng cách tối thiểu giữa 2 SFX từ `1.2s – 1.8s` để tránh mệt tai.
      - Quy tắc Pre-roll 65ms (âm thanh đi trước đỉnh hình ảnh 40–65ms) và cân bằng âm lượng (0.45 – 0.75) để âm thanh sắc bén mà tuyệt đối không át tiếng người nói.

   ### H. Bộ 9 Hiệu Ứng Chuyển Cảnh CapCut 2-Layer Khóa Cứng SFX (BẮT BUỘC TUYỆT ĐỐI)
    - **QUY TẮC CỐ ĐỊNH BẮT BUỘC**:
      - Khi có nhu cầu sử dụng chuyển cảnh (trong `tracks.transitions` hoặc khi đổi phân đoạn/cắt cảnh, B-roll), **CHỈ ĐƯỢC PHÉP SỬ DỤNG 1 TRONG 9 HIỆU ỨNG CHUYỂN CẢNH CAPCUT** đã chuẩn hóa: `glare-ii`, `phone-reveal`, `paper-ball`, `glitch`, `fade-down`, `blink`, `wave-right`, `swipe-left`, `comic-cut`.
      - **TUYỆT ĐỐI KHÔNG DÙNG MOCK OVERLAY 1 LỚP (Single-layer CSS)**: Chuyển cảnh bắt buộc chạy qua Engine 2 lớp thật `CapCutTwoLayerTransitions` (Clip A bị xé/cuộn/trượt để lộ Clip B bên dưới với timeline chạy liên tục qua `startFromA` và `startFromB`).
       - **QUY TẮC CHUYỂN CẢNH THEO PHÂN ĐOẠN NỘI DUNG (SECTION-BOUNDARY TRANSITION CONTRACT)**:
         + **B-roll KHÔNG BẮT BUỘC CÓ CHUYỂN CẢNH**: Lớp B-roll AI là hình ảnh minh họa ngữ cảnh (cutaway), hiển thị êm ái với chuyển động Ken Burns slow zoom (1.02× -> 1.09×), TUYỆT ĐỐI KHÔNG ép chèn hiệu ứng chuyển cảnh nặng mỗi khi B-roll xuất hiện nếu đang ở giữa câu nói/ý của diễn giả.
         + **Chuyển Cảnh Phục Vụ Chuyển Đổi Phân Đoạn Nội Dung Lớn (Macro Section Boundary)**:
           Chuyển cảnh CapCut BẮT BUỘC được kích hoạt khi **kết thúc một phần nói để bước sang phần nói tiếp theo**:
           * Chuyển từ phần Giới thiệu chung sang các Luận điểm/Yếu tố chính (Intro -> Luận điểm 1).
           * Chuyển cảnh bắt đầu giữa từng Luận điểm/Yếu tố (Yếu tố 1 -> Yếu tố 2, Yếu tố 2 -> Yếu tố 3, Yếu tố 3 -> Yếu tố 4,...).
           * Chuyển từ Luận điểm cuối cùng sang Phần Kết luận / Kêu gọi hành động (Yếu tố cuối -> CTA / Kết bài).
         + **Vị Trí Căn Chỉnh (Timing)**: Neo trọn vẹn tại khoảng lặng (silence pause) giữa câu kết thúc phân đoạn trước và từ mở đầu của phân đoạn tiếp theo, kết thúc dứt khoát trước hoặc đúng onset của từ đầu câu mới để bảo đảm giọng nói đanh thép không bị đè lấn.
      - **BẢNG 9 HIỆU ỨNG CHUẨN XÁC (FRAME, DURATION, DIRECTION & SFX)**:
        1. `glare-ii`: 16 frames (533ms), `direction: "right"`, SFX: `glare-burn` (vol: 0.90).
        2. `phone-reveal`: 22 frames (733ms), `direction: "right"`, SFX: `phone-shutter-1` (vol: 0.95).
        3. `paper-ball`: 20 frames (667ms), `direction: "right"`, SFX: `paper-ball-yt` (vol: 0.95).
        4. `glitch`: 14 frames (467ms), `direction: "right"`, SFX: `glitch-cut` (vol: 0.85).
        5. `fade-down`: 14 frames (467ms), `direction: "down"`, SFX: `fade-woosh` (vol: 0.90).
        6. `blink`: 8 frames (267ms), `direction: "right"`, SFX: `click` (vol: 0.95).
        7. `wave-right`: 16 frames (533ms), `direction: "right"`, SFX: `wave-sparkle` (vol: 0.90).
        8. `swipe-left`: 10 frames (333ms), `direction: "left"`, SFX: `whoosh-fast` (vol: 0.95).
        9. `comic-cut`: 20 frames (667ms), `direction: "right"`, SFX: `comic-paper-tear` (vol: 0.95).
      - **Quy tắc Zod Schema & SFX Coupling**:
        + Trường `direction` trong EDL chỉ nhận `["up", "down", "left", "right"]`. Cấm dùng `"center"`.
        + Mỗi transition bắt buộc có SFX tương ứng trong `tracks.sfx` với `startMs` đồng bộ.
      - **Quy tắc ngắt âm dứt điểm (Anti-Bleed Rule)**: SFX khóa cứng tương ứng bắt buộc phải dừng hẳn khi hết chuyển cảnh (âm lượng về 0.0 RMS ở 2 frame cuối, unmount Sequence, không lấn sang cảnh sau).
      - → **Bắt buộc tra cứu bảng chi tiết** tại [transitions-guide.md](../tisa-ai-editor-agent/references/transitions-guide.md) và file code `src/components/capcut-transitions-registry.ts`.

   ### I. Quy Tắc Nhịp Điệu Câu Thoại: Mỗi Câu Nói Bắt Buộc Có Hiệu Ứng Đi Kèm (SENTENCE-COMPLETION VISUAL BEATS)
   - **BẮT BUỘC 100%**: Cứ mỗi khi người nói hoàn thành **1 câu nói / 1 ý trọn vẹn**, trên màn hình **BẮT BUỘC PHẢI CÓ MỘT BIẾN CHUYỂN THỊ GIÁC (VISUAL EVENT)** xuất hiện. Tuyệt đối không để xảy ra "khoảng chết thị giác" (dead visual zone) nơi câu nói trôi qua chỉ với mỗi dòng phụ đề karaoke đơn điệu.
   - **AI PHÂN TÍCH NGỮ NGHĨA ĐỂ CHỌN ĐÚNG LOẠI HIỆU ỨNG (CẤM CHỌN BỪA HOẶC MÁY MÓC)**:
     1. **Câu mô tả hành động, bối cảnh, tài sản, chứng cứ, hiện vật thực tế** (đất đai, sổ đỏ, gia đình, công nghệ, công xưởng, thị trường...) $\rightarrow$ **Chọn B-Roll Full Khung Chiều Sâu** (kèm Ken Burns slow zoom, nền chiều sâu phù hợp, từ khóa punchline và chuyển cảnh CapCut 2-layer vào/ra).
     2. **Câu chứa con số, tỷ lệ, điều kiện định lượng, văn bản luật** (Nghị định 37, 3 lần, 80%, 4 bước...) $\rightarrow$ **Chọn Kinetic Headline Số Liệu (`stat-punch`, `3-tier`)** bôi vàng rực `#FFE600` với cơ chế Hai Pha Xuất Hiện (Two-Phase In).
     3. **Câu chứa mâu thuẫn, nghịch lý, so sánh đối lập** (tưởng lời hóa lỗ, trước vs nay, nên vs không nên...) $\rightarrow$ **Chọn Hiệu Ứng Đối Lập (`split-contrast`, `comparison`, `stacked-contrast`)**.
     4. **Câu đúc kết triết lý, lời khuyên vàng, cú chốt luận điểm** $\rightarrow$ **Chọn Kinetic Headline Đòn Bẩy (`asymmetric-trio`, `multiblock-flow`, `kinetic-statement`)**.
     5. **Câu chuyển hướng chủ đề, lật ngược vấn đề, bước sang phân đoạn mới** $\rightarrow$ **Chọn Chuyển Cảnh CapCut 2-Layer** (`glare-ii`, `phone-reveal`, `paper-ball`, `comic-cut`, `wave-right`, `glitch`, `fade-down`, `blink`, `swipe-left`) neo đúng điểm cắt và gắn SFX khóa cứng 1:1.
   - **Quy tắc Luân Phiên & Chống Trùng Lặp**: Không dùng liên tiếp 2 hiệu ứng cùng loại cho 2 câu nói liền kề để giữ nhịp độ thị giác luôn kích thích, sống động theo chuẩn viral retention.

4. **Quy Chuẩn Phụ Đề Thoại (Captions) – Bắt Buộc 1 Dòng Duy Nhất & Hiển Thị Liên Tục**:
   - **BẮT BUỘC CHỈ HIỂN THỊ ĐÚNG 1 DÒNG DUY NHẤT (Single-line Only)**:
     - Khóa cứng `whiteSpace: "nowrap"` và `flexWrap: "nowrap"`. Tuyệt đối KHÔNG được để phụ đề rớt xuống dòng thứ 2 hoặc thứ 3.
   - **Độ dài chunk: Đúng 4 đến 6 từ/lần xuất hiện (Tối đa 6 từ)**:
     - Khâu xử lý dữ liệu EDL: Bắt buộc chạy thuật toán gom `tokens` từ Whisper thành các cụm từ ngắn tự nhiên từ **4 đến 6 từ** (thời lượng ~1.0 – 1.8 giây/chunk). Tuyệt đối không bê nguyên câu thoại dài 12–15 từ của Whisper vào EDL.
   - **Hiệu ứng Karaoke nhảy chữ & Màu sắc**:
     - Chữ thường tự nhiên (sentence-case) hoặc in hoa thanh lịch, font size ~48–52px.
     - Từ đang nói (`isActive`) bôi **Vàng rực `#FFE600`**, nảy chữ nhịp nhàng (scale `1.15x`, translateY `-3px`).
     - Các từ còn lại giữ màu **Trắng `#FFFFFF`**.
     - **TUYỆT ĐỐI CẤM VIỀN ĐEN (Zero Black Stroke)**: Cả phụ đề lẫn Headline đều cấm dùng viền đen stroke thô cứng. Bắt buộc dùng **Lớp bóng tối sâu đa tầng** `textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 10px 36px rgba(0,0,0,0.95)'` (từ khóa vàng) và `0 3px 14px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.85)'` (từ trắng) để chữ bứt khỏi nền video tự nhiên và sắc nét.
   - **Vị trí hiển thị**:
     - Nằm ở phần dưới khung hình (cách mép dưới ~18%–20%), trên nền scrim gradient tối, đảm bảo không bị các nút bấm/thanh điều hướng của TikTok/Reels che khuất.
   - **Cơ chế hiển thị liên tục (Fine-grained Mutual Exclusivity)**:
     - Phụ đề thoại **BẮT BUỘC HIỂN THỊ LIÊN TỤC** ở tất cả các khoảng trống giữa các Headline và B-roll.
     - Phụ đề chỉ tạm ẩn đúng lúc có visual graphic/B-roll che màn hình (ngưỡng overlap > 150ms). Khi visual đó kết thúc, phụ đề tiếp theo phải **lập tức xuất hiện trở lại ngay**, tuyệt đối không để xảy ra tình trạng mất phụ đề diện rộng.
