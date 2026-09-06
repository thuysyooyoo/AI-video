---
name: thuy-style-oneshot
description: >-
  Dựng video ngắn talking-head theo phong cách Thuy-style-oneshot: phụ đề nhảy
  chữ 4–6 từ bôi vàng, KHÔNG card viền hộp, KHÔNG icon/emoji, headline phân tầng
  4 style chữ vàng chạy chữ so le, B-roll full khung bám lời, cơ chế độc quyền
  hiển thị. Dùng khi người dùng gõ /thuy-style-oneshot hoặc yêu cầu dựng phong
  cách oneshot hiện đại.
---

# Phong Cách Thuy Style One Shot

Skill này kích hoạt preset `thuy-style-oneshot` trong hệ thống dựng **TISA AI EDITOR AGENT**.

## Quy trình thực hiện

1. **Đọc và thực thi toàn bộ quy trình** trong skill `tisa-ai-editor-agent`
   tại `C:\Users\ADMIN\.antigravity\skills\tisa-ai-editor-agent\SKILL.md`.
   Skill này chỉ là lớp kích hoạt preset — toàn bộ engine nằm trong `tisa-ai-editor-agent`.

2. Ở **mọi bước pipeline** (transcribe → generate-edl → render), luôn truyền
   cờ `--preset thuy-style-oneshot`.

3. Áp dụng nghiêm ngặt các quy tắc riêng của preset này:
   - **Tuyệt đối KHÔNG card viền hộp** (`NeonIconCard`, `PremiumCard`, `NegativeSlashCard`, `DualIconCards`, `DiamondLabel`, `PremiumRoadmap`).
   - **Tuyệt đối KHÔNG icon SVG**, KHÔNG emoji.
   - **Hierarchical Idea Headlines** 4 style (`3-tier`, `stat-punch`, `split-contrast`, `tag-headline`) với keyword vàng rực rỡ `#FFE600` và hiệu ứng chạy chữ so le.
   - **B-roll fullscreen** 100% khung hình (1080×1920), giữ trọn vẹn theo độ dài câu thoại (dynamic duration).
   - **Cơ chế độc quyền hiển thị** (Mutual Exclusivity): Khi có headline hoặc B-roll → tự ẩn phụ đề transcript, không bao giờ bị đè chữ.
   - **Lớp phủ đáy**: Blur 14px + vignette tối 38% ở 30–36% chân video.
   - **SFX phân tầng tăng năng lượng**: Đồng bộ chính xác theo 5 nhóm âm thanh chuẩn creator.

4. **Phụ đề thoại** dùng chung engine nhảy chữ karaoke 4–6 từ/dòng, từ đang nói bôi vàng `#FFE600`, chữ thường sentence-case ~46px.

5. **Quy chuẩn Sound Design & SFX (Bắt buộc đọc [references/sfx-sound-design.md](references/sfx-sound-design.md))**:
   - Sử dụng đầy đủ 5 nhóm SFX theo ngữ cảnh:
     - **1. Xuất hiện**: `swish` (headline lướt), `pop` (tag vàng), `magic-reveal` (bật mí ý tưởng), `cartoon-effect` (tình huống vui nhộn).
     - **2. Chuột & Bàn phím**: `keyboard-click` (phím đơn đanh gọn), `typing-1` / `typing-2` (gõ phím code/prompt dồn dập), `mouse-click` (click chuột xác nhận).
     - **3. Công nghệ**: `pip` (UI scanner AI), `hologram` (laser sci-fi), `error` (buzzer cảnh báo lỗi quay/sai lầm), `glitch` (nhiễu sóng chuyển đoạn).
     - **4. Nhấn mạnh**: `highlight` (quẹt bút từ khóa vàng), `ding` (ý tưởng đắt giá), `hit` (cú đấm bass vào số liệu lớn 100%), `correct` (khẳng định chuẩn xác).
     - **5. Chuyển cảnh & Foley**: `transition-punch`, `camera-shutter` (ảnh minh chứng), `paper-slide` (lật kịch bản).
   - Quy tắc Pre-roll 65ms và cân bằng dải tần số để giữ trọn vẹn năng lượng nhưng tuyệt đối không át tiếng người nói.
