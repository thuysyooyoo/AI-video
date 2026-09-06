---
name: classic
description: >-
  Dựng video ngắn talking-head theo phong cách Classic gốc: phụ đề nhảy chữ
  karaoke, card đồ họa viền hộp bo góc với SVG icon minh họa, mật độ graphic
  cao, scrim gradient nhẹ. Dùng khi người dùng gõ /classic hoặc yêu cầu dựng
  phong cách ban đầu.
---

# Phong Cách Classic

Skill này kích hoạt preset `classic` trong hệ thống dựng **TISA AI EDITOR AGENT**.

## Quy trình thực hiện

1. **Đọc và thực thi toàn bộ quy trình** trong skill `tisa-ai-editor-agent`
   tại `C:\Users\ADMIN\.antigravity\skills\tisa-ai-editor-agent\SKILL.md`.
   Skill này chỉ là lớp kích hoạt preset — toàn bộ engine nằm trong `tisa-ai-editor-agent`.

2. Ở **mọi bước pipeline** (transcribe → generate-edl → render), luôn truyền
   cờ `--preset classic`.

3. Áp dụng quy tắc riêng của preset classic:
   - **Cho phép** card viền hộp (`NeonIconCard`, `PremiumCard`, `NegativeSlashCard`, `DualIconCards`, `DiamondLabel`, `PremiumRoadmap`) với 10 SVG icon line-art minh họa.
   - **Cho phép** emoji và icon.
   - **Không tự động chèn** fullscreen-keyword B-roll (chỉ khi người dùng yêu cầu).
   - **Không áp dụng** cơ chế Mutual Exclusivity — card và phụ đề hiển thị đồng thời.
   - **Lớp phủ đáy**: Gradient nhẹ tinh tế (không blur nặng).
   - **Mật độ graphic**: Đậm đặc (25–45 graphic / 60–100s video), tạo nhịp liên tục.

4. **Phụ đề thoại** dùng chung engine nhảy chữ karaoke 4–6 từ/dòng, từ đang nói bôi vàng `#FFE600`, chữ thường sentence-case ~46px.
