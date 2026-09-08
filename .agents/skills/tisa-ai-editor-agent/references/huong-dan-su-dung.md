# Hướng dẫn sử dụng TISA AI EDITOR AGENT

## Mục lục

1. Bắt đầu nhanh
2. Dựng video người nói
3. Dựng b-roll + hook
4. Chỉnh sửa bằng lời
5. Xem và lưu kết quả
6. Cách dùng hiệu quả

## 1. Bắt đầu nhanh

Sau khi cài đặt, nói với Codex bằng ngôn ngữ tự nhiên và gọi skill rõ ở lần đầu:

```text
Dùng $tisa-ai-editor-agent dựng video này thành Reel 9:16. Đây là video người nói, mục tiêu là thu hút khách hàng quan tâm bất động sản. Cắt khoảng lặng, làm caption tiếng Việt, phong cách sang trọng vàng đen, thêm graphic vừa phải. File: /đường/dẫn/video.mp4
```

Nếu chưa có phong cách, cho phép agent tự đề xuất ba lựa chọn phù hợp chủ đề. Nếu chưa biết đường dẫn, kéo file vào Codex hoặc dùng “Copy as path”.

## 2. Dựng video người nói

Đầu vào tốt nhất gồm:

- Đường dẫn file nguồn.
- Nền tảng: TikTok, Reels, Shorts hoặc video ngang.
- Mục tiêu: giáo dục, bán hàng, xây uy tín, kể chuyện.
- Phong cách: màu, nhịp, mức graphics.
- Điều bắt buộc: từ khóa, logo, CTA, từ không được cắt.

Ví dụ:

```text
Dùng $tisa-ai-editor-agent dựng video người nói này cho Facebook Reels. Giữ nội dung chính, bỏ khoảng lặng và từ đệm nhưng không làm câu bị cụt. Caption bám từng lời, sửa chính tả tiếng Việt, phong cách Luxury Authority vàng đen, graphics có chủ đích và CTA “Nhắn tin nhận tư vấn”. File: D:\Video\du-an-a.mp4
```

## 3. Dựng b-roll + hook

Đưa clip, chủ đề hoặc nguyên văn hook, phong cách và nhạc nếu có:

```text
Dùng $tisa-ai-editor-agent dựng b-roll này thành video 15 giây. Chủ đề: 3 dấu hiệu bất động sản có tiềm năng tăng giá. Hãy đề xuất 3 bộ hook + sub-hook + CTA, phong cách sang trọng. Chưa có nhạc, render bản không nhạc trước. File: /Users/me/Videos/broll.mp4
```

Nếu cung cấp hook hoàn chỉnh, agent phải giữ nguyên chữ và chỉ chia tối đa hai dòng bằng dấu `|`.

## 4. Chỉnh sửa bằng lời

Sau bản đầu, chỉ nói phần cần đổi:

- `Sửa caption ở 00:18 từ “...” thành “...”.`
- `Bớt khoảng 30% graphics, ưu tiên giữ số liệu và so sánh.`
- `Đổi sang xanh navy và vàng, giữ nguyên cắt và caption.`
- `Hạ caption lên trên vùng nút TikTok.`
- `Nhạc nhỏ xuống 40%, bắt đầu từ giây 12 của bài.`
- `Đổi CTA thành “Nhắn TISA để nhận bảng giá”.`

Agent phải chỉnh EDL và render lại; không nhận dạng lời nói/cắt lại nếu chỉ là thay đổi nhỏ.

## 5. Xem và lưu kết quả

- Bản mới nhất: `out/final.mp4`.
- Kế hoạch dựng: `out/edl.json`.
- Bản sinh mới chưa thay bản chỉnh tay: `out/edl.generated.json`.
- Dự án trước: `out/archive/`.

Khi ưng ý, nói: `Giữ bản này, lưu tên du-an-a-final.mp4 và ghi nhớ phong cách.`

## 6. Cách dùng hiệu quả

- Gửi clip ngắn, rõ tiếng và ánh sáng ổn định để nhận dạng chính xác hơn.
- Nêu một mục tiêu chính cho mỗi video; hook và graphic sẽ nhất quán hơn.
- Dùng mức graphics “ít / vừa / dày” thay vì yêu cầu càng nhiều càng tốt.
- Với nội dung quan trọng, yêu cầu agent liệt kê các câu bị cắt trước khi render cuối.
- Luôn xem toàn bộ bản cuối, nhất là số liệu, tên riêng, giá, pháp lý và CTA.
- Dùng cùng một theme và lưu phản hồi vào `memory/user-style-profile.md` để các video sau đồng bộ thương hiệu.
