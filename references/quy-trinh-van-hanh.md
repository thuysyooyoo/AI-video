# Quy trình vận hành

## Mục lục

1. Luồng chuẩn
2. Cổng kiểm soát chất lượng
3. Sửa phiên bản
4. Dựng hàng loạt
5. Quản lý file
6. Sự cố và phục hồi

## 1. Luồng chuẩn

### Pha 1 — Tiếp nhận

Ghi nhận file nguồn, loại dựng, nền tảng, mục tiêu, khán giả, phong cách, CTA, tài sản thương hiệu và hạn chế. Không bắt người không kỹ thuật trả lời các mục đã suy luận được.

### Pha 2 — Kiểm tra

Chạy doctor, xác minh video bằng ffprobe, xem 2–3 frame đại diện, phát hiện tỷ lệ khung hình, độ dài, audio và khuôn mặt. Không chỉnh file nguồn.

### Pha 3 — Phân tích

Với talking-head: tạo transcript, cắt khoảng lặng, đọc toàn bộ transcript, chia cấu trúc hook → vấn đề → luận điểm/chứng minh → CTA và lập host plan. Với b-roll: xem hình, viết hoặc giữ nguyên hook rồi chọn theme.

### Pha 4 — Dựng

Sinh EDL, kiểm tra rủi ro, sửa lỗi chính tả/timestamp, render. Graphic phải bám đúng câu đang nói; dữ liệu phải có trong nội dung gốc.

### Pha 5 — QA

Kiểm tra kỹ thuật và biên tập:

- ffprobe đọc được video và audio.
- Không có khung đen/đứng hình bất thường ở đầu cuối.
- Caption không che mặt hoặc vùng UI nền tảng.
- Tên riêng, số, giá, địa chỉ và CTA đúng.
- Không có graphic thừa, lặp loại liên tiếp hoặc hiệu ứng làm mất tập trung.
- Nhạc không lấn giọng; fade đầu/cuối tự nhiên.

### Pha 6 — Bàn giao và học

Mở bản render, báo vị trí, thời gian và kiểm tra. Khi người dùng nói “giữ bản này”, sao chép thành tên riêng và ghi sở thích bền vững vào `memory/user-style-profile.md`: theme ưa thích, mật độ graphic, caption, nhịp cắt và các điều cần tránh.

## 2. Cổng kiểm soát chất lượng

Không bàn giao “hoàn tất” nếu một trong các điều sau chưa đạt:

- `scripts/validate-edl-risk.py` còn lỗi nghiêm trọng.
- `out/final.mp4` không tồn tại hoặc dung lượng bằng 0.
- ffprobe không đọc được duration/streams.
- Caption chứa lỗi nhận dạng rõ ràng tại hook, CTA, tên riêng hoặc số liệu.
- EDL tham chiếu clip khác với clip đang dựng.

## 3. Sửa phiên bản

- Sửa nhỏ: sao lưu EDL hiện tại, chỉnh `out/edl.json`, validate, render lại.
- Đổi style: giữ cut/caption, chỉ đổi block `style` và graphic liên quan.
- Đổi cấu trúc: tạo `edl.generated.json`, so sánh rồi hợp nhất; chỉ ghi đè khi đã xác nhận.
- Làm lại từ đầu: giải thích rằng chỉnh tay có thể bị thay, sau đó dùng `--force-regen`.

## 4. Dựng hàng loạt

Xử lý tuần tự để tránh `out/` bị ghi đè. Với mỗi clip:

1. Tạo tên dự án an toàn.
2. Chạy pipeline và QA.
3. Sao chép `out/final.mp4` thành `out/<ten-clip>-final.mp4`.
4. Lưu báo cáo ngắn: theme, duration, trạng thái và ghi chú.
5. Chỉ chuyển clip tiếp theo sau khi file đích đã được xác minh.

Không tự động đăng video lên mạng nếu người dùng chỉ yêu cầu dựng.

## 5. Quản lý file

- `public/raw/`: bản làm việc của clip nguồn.
- `public/music/`: nhạc do người dùng cung cấp.
- `out/`: dự án hiện tại và bản render.
- `out/archive/`: dự án cũ.
- `memory/`: sở thích dựng, không lưu bí mật hoặc dữ liệu nhạy cảm.

Không đưa `node_modules`, `.venv`, video nguồn, nhạc của người dùng hoặc thư mục `out` vào ZIP phân phối.

## 6. Sự cố và phục hồi

- Render bị dừng: giữ EDL, chạy lại `npm run render:edl`.
- Pipeline sinh EDL xấu: giữ bản đang dùng, xem `edl.generated.json`, sửa có chọn lọc.
- Sai clip: dừng ngay, kiểm tra `source.clip`, không force render.
- Thiếu dung lượng: dừng trước render, báo dung lượng cần giải phóng; không tự xóa video người dùng.
- Máy yếu: giảm độ dài hoặc chia clip; giữ nguyên timeline rõ ràng khi ghép.
