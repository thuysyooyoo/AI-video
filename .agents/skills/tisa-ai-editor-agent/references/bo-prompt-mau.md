# Bộ prompt cài đặt và tự động dựng

## Mục lục

1. Cài skill
2. Cài toàn bộ công cụ
3. Cài skill hỗ trợ
4. Dựng talking-head tự động
5. Dựng b-roll tự động
6. Review và sửa
7. Dựng hàng loạt

Thay phần trong ngoặc vuông bằng thông tin thật. Có thể sao chép nguyên prompt vào Codex.

## 1. Prompt cài skill

```text
Hãy cài skill TISA AI EDITOR AGENT từ file ZIP [ĐƯỜNG DẪN ZIP]. Trước tiên kiểm tra cấu trúc và an toàn của gói. Giải nén vào thư mục skill của Codex với tên thư mục chính xác tisa-ai-editor-agent, bảo đảm SKILL.md nằm ngay tại ~/.codex/skills/tisa-ai-editor-agent/SKILL.md (Windows dùng %USERPROFILE%\.codex\skills\...). Không ghi đè bản đang có nếu chưa sao lưu. Sau khi cài, xác thực YAML, báo vị trí cài và hướng dẫn tôi khởi động lại Codex. Chưa cài thư viện nặng ở bước này.
```

## 2. Prompt cài toàn bộ công cụ

```text
Dùng $tisa-ai-editor-agent để thiết lập đầy đủ môi trường dựng video trên máy này. Hãy tự nhận diện Windows/macOS/Linux; kiểm tra trước rồi chỉ cài phần còn thiếu: Python 3.10+ (ưu tiên 3.11), Node.js 18+ LTS, npm, ffmpeg và ffprobe. Sau đó tại thư mục skill hãy tạo/dùng .venv, cài requirements.txt, chạy npm ci, chạy scripts/doctor.py và npm run typecheck. Ưu tiên trình quản lý gói chính thức có sẵn trên máy. Không đổi cấu hình hệ thống ngoài phạm vi cần thiết, không xóa bản cũ, không tải video của tôi lên mạng. Nếu một bước cần quyền quản trị hoặc có lựa chọn làm thay đổi hệ thống đáng kể, hãy giải thích ngắn gọn trước. Chỉ kết luận hoàn tất khi doctor trả mã 0 và typecheck đạt; nếu lỗi, tự chẩn đoán và sửa trong phạm vi an toàn rồi báo rõ phần còn thiếu.
```

## 3. Prompt cài skill hỗ trợ

```text
Hãy kiểm tra danh mục skill Codex hiện có và bổ sung các skill hỗ trợ phù hợp cho $tisa-ai-editor-agent: remotion-best-practices, remotion-captions, remotion-multimedia, remotion-render và computer-use. Chỉ cài những skill còn thiếu, dùng nguồn chính thức/đáng tin cậy, không thay thế phiên bản đang hoạt động nếu chưa xác minh. Sau đó liệt kê skill nào đã có, skill nào vừa cài và skill nào không khả dụng. Đây là phần tăng cường; không được coi thiếu skill tùy chọn là lỗi của bộ dựng cơ bản.
```

## 4. Prompt dựng talking-head tự động

```text
Dùng $tisa-ai-editor-agent dựng tự động video người nói tại [ĐƯỜNG DẪN VIDEO] cho [TIKTOK/REELS/SHORTS]. Mục tiêu: [MỤC TIÊU]. Khán giả: [KHÁN GIẢ]. Hãy cắt khoảng lặng và từ đệm nhưng không làm cụt ý; tạo caption tiếng Việt bám lời và sửa lỗi chính tả; lập hook 3-6 từ và CTA [CTA]; chọn phong cách [PHONG CÁCH hoặc “tự chọn theo nội dung”]; thêm zoom, SFX và graphics ở mức [ÍT/VỪA/DÀY] nhưng mỗi hiệu ứng phải có lý do. Giữ nguyên các câu/từ sau: [DANH SÁCH]. Tự chạy doctor, dùng quy trình prefed, validate EDL, render, kiểm tra bằng ffprobe và mở video cho tôi. Không sửa file gốc, không đăng lên mạng. Khi xong hãy báo đường dẫn, thời gian, các kiểm tra đã đạt và đề xuất tối đa 3 chỉnh sửa có giá trị.
```

## 5. Prompt dựng b-roll tự động

```text
Dùng $tisa-ai-editor-agent dựng clip b-roll [ĐƯỜNG DẪN VIDEO] thành video [ĐỘ DÀI/NỀN TẢNG]. Chủ đề: [CHỦ ĐỀ]. Nếu tôi chưa đưa câu chữ đầy đủ, hãy xem 2-3 frame và đề xuất 3 bộ hook 1-2 dòng + sub-hook + CTA để tôi chọn. Phong cách: [PHONG CÁCH]. Nhạc: [ĐƯỜNG DẪN MP3 hoặc “không nhạc”]. Giữ nguồn âm thanh ở mức [MỨC] hoặc tắt nếu không phù hợp. Sau khi tôi chọn chữ, hãy render, kiểm tra đầu ra và mở video. Không dùng tài sản bản quyền không rõ nguồn.
```

## 6. Prompt review và sửa

```text
Dùng $tisa-ai-editor-agent review bản out/final.mp4 cùng out/edl.json như một editor video ngắn. Kiểm tra 5 nhóm: hook/giữ chân, nhịp cắt, caption, graphics/bố cục, âm thanh/CTA. Đối chiếu transcript để phát hiện sai tên riêng và số liệu. Hãy phân loại lỗi bắt buộc sửa và gợi ý tùy chọn. Tự sửa các lỗi kỹ thuật/chính tả rõ ràng; với thay đổi sáng tạo lớn hãy hỏi tôi trước. Giữ nguyên những phần đang tốt, chỉnh EDL thay vì chạy lại toàn bộ pipeline, validate rồi render lại và báo thay đổi theo timestamp.
```

## 7. Prompt dựng hàng loạt

```text
Dùng $tisa-ai-editor-agent xử lý tuần tự tất cả video trong [THƯ MỤC]. Áp dụng preset: [NỀN TẢNG, THEME, CTA, MẬT ĐỘ GRAPHICS, STT MODEL]. Không ghi đè nguồn và không trộn dữ liệu giữa các clip. Với mỗi clip: kiểm tra, dựng, validate, render, ffprobe, lưu thành out/<ten-clip>-final.mp4 và ghi trạng thái vào một báo cáo Markdown. Nếu một clip lỗi, giữ log, chuyển sang clip tiếp theo khi an toàn và tổng hợp lỗi cuối cùng. Không đăng video lên mạng.
```
