---
name: tisa-ai-editor-agent
description: Tự động dựng video ngắn bằng TISA AI EDITOR AGENT chạy local với Remotion, faster-whisper, ffmpeg và OpenCV. Dùng khi người dùng muốn cài bộ dựng; kiểm tra công cụ; dựng talking-head, TikTok, Reels, Shorts; cắt khoảng lặng và từ đệm; tạo caption tiếng Việt bám lời; thêm motion graphics, zoom, SFX, hook, CTA hoặc nhạc; review video; sửa caption, màu, bố cục, nhịp dựng; dựng lại hoặc xử lý nhiều video.
---

# TISA AI EDITOR AGENT

Điều phối bộ máy dựng local theo chuỗi: video thô → nhận dạng lời nói → cắt khoảng lặng → lập EDL → kiểm tra → Remotion render. Xử lý video trên máy; chỉ dùng dịch vụ ngoài khi người dùng yêu cầu rõ.

## Xác định thư mục chạy

Đặt `SKILL_ROOT` là thư mục chứa chính file `SKILL.md` này. Chạy mọi lệnh với thư mục làm việc là `SKILL_ROOT`; không giả định task hiện tại đang mở đúng thư mục skill.

## Chọn tài liệu cần đọc

- Cài đặt hoặc khắc phục môi trường: đọc [references/cai-dat-cong-cu.md](references/cai-dat-cong-cu.md).
- Hướng dẫn người mới và câu lệnh mẫu: đọc [references/huong-dan-su-dung.md](references/huong-dan-su-dung.md).
- Dựng talking-head: đọc [references/workflow-talking-head.md](references/workflow-talking-head.md), [references/edl-reasoning-talking-head.md](references/edl-reasoning-talking-head.md), [references/host-plan-schema.md](references/host-plan-schema.md), [references/graphic-catalog.md](references/graphic-catalog.md).
- Dựng b-roll + hook: đọc [references/workflow-broll-hook.md](references/workflow-broll-hook.md).
- Chọn phong cách: đọc [references/style-menu.md](references/style-menu.md).
- So sánh 2 preset dựng (thuy-style-oneshot / classic): đọc [references/style-presets.md](references/style-presets.md).
- Vận hành, review, sửa và xử lý nhiều video: đọc [references/quy-trinh-van-hanh.md](references/quy-trinh-van-hanh.md).
- Khi người dùng cần prompt sao chép: đọc [references/bo-prompt-mau.md](references/bo-prompt-mau.md).

## Quy trình bắt buộc

1. Xác nhận đường dẫn video tồn tại. Nếu người dùng chưa biết đường dẫn, hướng dẫn họ kéo file vào cuộc trò chuyện hoặc sao chép đường dẫn; có thể tìm file trong phạm vi họ cho phép.
2. Xác định loại dựng: `talking-head` hoặc `b-roll + hook`. Chỉ hỏi nếu yêu cầu chưa rõ.
3. Xác định preset phong cách dựng: nếu người dùng kích hoạt qua `/thuy-style-oneshot` hoặc `/classic`, dùng preset tương ứng. Nếu không chỉ định, mặc định `thuy-style-oneshot`. Truyền `--preset <tên>` xuyên suốt pipeline (transcribe → generate-edl → render).
4. Xác định mục tiêu, nền tảng/tỷ lệ, phong cách màu sắc (theme) và đầu ra. Suy luận hợp lý từ nội dung; hỏi tối đa hai câu thật sự cần thiết.
5. Chạy `python scripts/doctor.py`. Nếu thiếu công cụ, giải thích ngắn gọn rồi cài/sửa trong đúng phạm vi người dùng cho phép. Không tuyên bố sẵn sàng trước khi doctor trả mã 0.
6. Sao chép video vào `public/raw/` với tên an toàn, không ghi đè file khác. Không sửa file gốc.
7. Thông báo thời gian ước tính trước lệnh dài: talking-head khoảng 7–12 phút; render lại 5–7 phút; b-roll 1–3 phút, tùy máy và độ dài.
8. Dựng theo workflow tương ứng. Với talking-head, ưu tiên `prefed`: lấy transcript bằng chế độ offline, tự lập `out/host-plan.json`, sinh EDL, kiểm tra rủi ro rồi render.
9. Kiểm tra đầu ra: video tồn tại, dung lượng > 0, ffprobe đọc được, EDL hợp lệ và không có lỗi đỏ. Mở video hoặc hiển thị đường dẫn cho người dùng.
10. Khi sửa nhỏ, chỉnh trực tiếp `out/edl.json` rồi `npm run render:edl`; không chạy lại toàn bộ pipeline. Chỉ dùng `--force-regen` khi người dùng muốn thay hướng lớn và đã hiểu bản chỉnh tay có thể bị thay.
11. Khi chuyển sang clip mới, giữ bản trước trong `out/archive/` hoặc sao chép `out/final.mp4` sang tên riêng trước khi tiếp tục.

## Nguyên tắc chất lượng

- Xem hạn mức graphics là trần, không phải chỉ tiêu. Mỗi graphic phải làm rõ ý, tạo nhịp hoặc dẫn mắt.
- **Hierarchical Summary Captions & Scrim làm mờ 30%**: Mặc định dùng caption tóm tắt 3 tầng phân cấp (`header` bold trắng / `keyword` cực lớn in hoa nghiêng có ngoặc kép / `sub` nghiêng trắng). Phủ lớp backdrop-blur (14px) và vignette tối dần về đáy ở 30-36% chân khung hình giúp chữ sắc nét, tương phản cao.
- **B-roll Kinetic Keyword 100% Full Khung**: Chèn 1–2 B-roll toàn màn hình (1080×1920) chạy chữ keyword cực lớn trên nền tối cinematic tại các điểm chốt/bước chuyển quan trọng của người nói kèm SFX whoosh.
- **Tuyệt đối KHÔNG emoji**: Loại bỏ 100% emoji khỏi toàn bộ caption, graphic, callout, title, CTA để đảm bảo thẩm mỹ chuyên nghiệp, sang trọng chuẩn truyền thông cao cấp.
- Giữ caption đúng chính tả tiếng Việt, đồng bộ token, nằm trong vùng an toàn và dễ đọc trên điện thoại.
- Hook 0–3 giây phải rõ; CTA ngắn đặt trên vùng an toàn đầu không che mặt người nói; không thêm dữ liệu hoặc tuyên bố không có trong lời nói.
- Không dùng nhạc, footage hoặc font có bản quyền không rõ nguồn. Bộ skill không kèm nhạc nền.
- Không gửi video ra mạng, đăng bài hoặc ghi đè nguồn nếu người dùng chưa yêu cầu.

## Mẫu kết thúc mỗi vòng render

Nêu đủ: đường dẫn video, thời gian đã chạy, các kiểm tra đã đạt và ba lựa chọn tiếp theo: sửa bằng lời, giữ bản này, hoặc dựng video mới.
