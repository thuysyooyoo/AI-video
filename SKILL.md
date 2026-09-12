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
- So sánh các preset dựng (thuy-style-oneshot / thuy-style-nhieu-canh / anh-sac-podcast / classic): đọc [references/style-presets.md](references/style-presets.md).
- Quy chuẩn Chuyển cảnh & 9 Hiệu ứng CapCut độc quyền fix cứng SFX: đọc [references/transitions-guide.md](references/transitions-guide.md).
- Quy chuẩn Sound Design & 6 nhóm SFX chuẩn hóa (kho 45+ mẫu chuẩn, cơ chế xoay vòng chống lặp): đọc [references/sfx-sound-design.md](references/sfx-sound-design.md).
- Hướng dẫn chọn nhạc nền tự động (BGM): đọc [references/bgm-soundtrack-guide.md](references/bgm-soundtrack-guide.md).
- Vận hành, review, sửa và xử lý nhiều video: đọc [references/quy-trinh-van-hanh.md](references/quy-trinh-van-hanh.md).
- Khi người dùng cần prompt sao chép: đọc [references/bo-prompt-mau.md](references/bo-prompt-mau.md).

## Quy trình bắt buộc

1. Xác nhận đường dẫn video tồn tại. Nếu người dùng chưa biết đường dẫn, hướng dẫn họ kéo file vào cuộc trò chuyện hoặc sao chép đường dẫn; có thể tìm file trong phạm vi họ cho phép.
2. Xác định loại dựng: `talking-head` hoặc `b-roll + hook`. Chỉ hỏi nếu yêu cầu chưa rõ.
3. Xác định preset phong cách dựng: nếu người dùng kích hoạt qua `/thuy-style-oneshot`, `/thuy-style-nhieu-canh`, `/anh-sac-podcast` hoặc `/classic`, dùng preset tương ứng. Nếu không chỉ định, mặc định `thuy-style-oneshot`. Truyền `--preset <tên>` xuyên suốt pipeline (transcribe → generate-edl → render).
4. Xác định mục tiêu, nền tảng/tỷ lệ, phong cách màu sắc (theme) và đầu ra. Suy luận hợp lý từ nội dung; hỏi tối đa hai câu thật sự cần thiết.
5. Chạy `python scripts/doctor.py`. Nếu thiếu công cụ, giải thích ngắn gọn rồi cài/sửa trong đúng phạm vi người dùng cho phép. Không tuyên bố sẵn sàng trước khi doctor trả mã 0.
6. Sao chép video vào `public/raw/` với tên an toàn, không ghi đè file khác. Không sửa file gốc.
7. Thông báo thời gian ước tính trước lệnh dài: talking-head khoảng 7–12 phút; render lại 5–7 phút; b-roll 1–3 phút, tùy máy và độ dài.
8. Dựng theo workflow tương ứng. Với talking-head, ưu tiên `prefed`: lấy transcript bằng chế độ offline, tự lập `out/host-plan.json`, sinh EDL, kiểm tra rủi ro rồi render.
   - **Tự động chọn nhạc nền (BGM)**: Nếu người dùng không gợi ý bài nhạc cụ thể, AI agent tự động phân tích chủ đề/cảm xúc video từ transcript để chọn 1 track tương ứng từ kho thư viện `public/bgm/` (4 nhóm: Kể chuyện cảm xúc, Giáo dục/Chia sẻ kiến thức, Vlog/Day in life, Động lực/Cảm xúc). Cấu hình vào trường `music` của `edl.json`: `src` tương đối, `volume: 0.06-0.10 (mặc định: 0.08)`, `clipVolume: 1.0` (giữ nguyên 100% âm lượng giọng nói), `loop: true`, `fadeOutSec: 1.5`.
9. Kiểm tra đầu ra: video tồn tại, dung lượng > 0, ffprobe đọc được, EDL hợp lệ và không có lỗi đỏ. Mở video hoặc hiển thị đường dẫn cho người dùng.
10. Khi sửa nhỏ, chỉnh trực tiếp `out/edl.json` rồi `npm run render:edl`; không chạy lại toàn bộ pipeline. Chỉ dùng `--force-regen` khi người dùng muốn thay hướng lớn và đã hiểu bản chỉnh tay có thể bị thay.
11. Khi chuyển sang clip mới, giữ bản trước trong `out/archive/` hoặc sao chép `out/final.mp4` sang tên riêng trước khi tiếp tục.

## Nguyên tắc chất lượng

- **Quy tắc Cắt Gọt Triệt Để (Aggressive Trimming & Take Cleaning)**:
  - Phân tích transcript & audio waveform để **cắt sạch 100% các câu nói vấp, nói lặp lại 2 lần (false starts)**. Chỉ giữ lại cú nói hoàn chỉnh và dứt khoát nhất.
  - Cắt bỏ 100% lời nói ngoài lề, thoại hậu trường ("tắt máy đi ha", "làm lại câu này") và động tác với tay tắt máy.
  - Cắt các khoảng lặng ngắt nghỉ > 0.35s, tăng tốc lời thoại 1.05–1.12× (chuẩn: 1.07×).
- **Quy tắc Bắt Buộc keywordStartMs cho Headline**: Mọi khối Headline trong `tracks.graphics` BẮT BUỘC phải tính toán và truyền trường `keywordStartMs` từ transcript để đảm bảo kích hoạt cơ chế Hai Tầng Xuất Hiện (Two-Phase In).
- **Quy tắc Nhịp Điệu Câu Thoại (Sentence-Completion Visual Beats - BẮT BUỘC)**:
  - Cứ mỗi khi người nói hoàn thành **1 câu nói / 1 ý trọn vẹn**, trên màn hình **BẮT BUỘC PHẢI CÓ MỘT HIỆU ỨNG THỊ GIÁC (VISUAL EVENT)** xuất hiện. Tuyệt đối không để xảy ra "khoảng chết thị giác" chỉ có phụ đề karaoke trôi qua.
  - **AI phân tích ngữ cảnh ngữ nghĩa câu nói**:
    * Hành động, hiện vật, bối cảnh đời sống, chứng cứ thực tế $\rightarrow$ B-roll Full Khung Chiều Sâu.
    * Con số, tỷ lệ, điều kiện, văn bản luật $\rightarrow$ Kinetic Headline Số Liệu (`stat-punch`, `3-tier` số vàng).
    * Mâu thuẫn, nghịch lý, đối lập $\rightarrow$ Hiệu ứng đối lập (`split-contrast`, `comparison`).
    * Triết lý, lời khuyên, đúc kết luận điểm $\rightarrow$ Headline Đòn Bẩy (`asymmetric-trio`, `multiblock-flow`).
    * Chuyển hướng chủ đề, sang phân đoạn mới $\rightarrow$ Chuyển Cảnh CapCut 2-Layer (`phone-reveal`, `paper-ball`, `comic-cut`...).
  - Luân phiên các nhóm hiệu ứng giữa các câu liền kề, không lặp máy móc.

- Xem hạn mức graphics là trần, không phải chỉ tiêu. Mỗi graphic phải làm rõ ý, tạo nhịp hoặc dẫn mắt.
- **Hierarchical Summary Captions & Scrim làm mờ 30%**: Mặc định dùng caption tóm tắt 3 tầng phân cấp (`header` bold trắng / `keyword` cực lớn in hoa nghiêng có ngoặc kép / `sub` nghiêng trắng). Phủ lớp backdrop-blur (14px) và vignette tối dần về đáy ở 30-36% chân khung hình giúp chữ sắc nét, tương phản cao.
- **Nguyên tắc Xuất Hiện Lệch Pha Động Lực Học Cho Headline (CHỈ ÁP DỤNG CHO TIÊU ĐỀ HEADLINE - TUYỆT ĐỐI KHÔNG ÁP DỤNG CHO PHỤ ĐỀ TRANSCRIPT)**:
  - **Phạm vi áp dụng**: CHỈ áp dụng riêng cho các khối tiêu đề/ý tưởng Headline (`asymmetric-trio`, `stacked-contrast`, `multiblock-flow`, `3-tier`, `split-contrast`, `stat-punch`, `tag-headline`). **Phụ đề transcript (phụ đề nói thường 4–6 từ nhảy chữ karaoke) HOÀN TOÀN KHÔNG BỊ ẢNH HƯỞNG**, vẫn hiển thị trọn vẹn cả cụm và nhảy chữ bám âm thanh bình thường.
  - **TUYỆT ĐỐI KHÔNG để toàn bộ chữ trong Headline hiện ra đồng thời**: Hiện chữ cùng lúc gây nhàm chán, người xem đọc lướt trước từ khóa và làm mất đi nhịp điệu kích thích của video ngắn.
  - **Quy tắc 2 tầng xuất hiện (Two-Phase In)**:
    1. **Tầng 1 (Bối cảnh / Dẫn dắt - Header / Tag / Context)**: Phần chữ dẫn dắt, bối cảnh tóm tắt (không trùng với lời nói trực tiếp của người nói) **XUẤT HIỆN TRƯỚC NGAY TẠI FRAME 0 (0.0s)** với hiệu ứng nảy nhẹ hoặc trượt êm để định hình ngữ cảnh và neo giữ mắt người xem.
    2. **Tầng 2 (Từ khóa bôi vàng - Punchline Keyword / Stat)**: **CHỈ ĐƯỢC PHÉP XUẤT HIỆN KHỚP CHÍNH XÁC VỚI THỜI ĐIỂM GIỌNG NÓI PHÁT ÂM ĐẾN TỪ ĐÓ** (bám theo timestamp `keywordStartMs` trong transcript âm thanh). Trước thời điểm đó, từ khóa vàng hoàn toàn ẩn (`opacity: 0`). Đúng thời khắc người nói phát âm $\rightarrow$ Từ khóa vàng rực `#FFE600` lập tức bùng nổ (`Explosive Spring Pop` scale hoặc snap down) kèm hiệu ứng phát sáng và SFX nhẹ (`pop-soft` / `highlight`).
  - **Quy tắc Thoát Cảnh (Hold & Synchronized Out)**: Sau khi từ khóa vàng bung nở, toàn bộ Headline (cả phần dẫn dắt lẫn từ khóa) **tiếp tục giữ nguyên trên màn hình** cho đến khi người nói hoàn thành trọn vẹn luận điểm/câu nói đó (`endMs`), sau đó toàn khối cùng fade-out hoặc scale-down mượt mà ở 8–12 frame cuối.
- **B-roll Kinetic Keyword 100% Full Khung (Kho Nền Chiều Sâu Đa Dạng)**: Chèn 1–2 B-roll toàn màn hình (1080×1920) chạy chữ keyword cực lớn tại các điểm chốt/bước chuyển quan trọng kèm SFX whoosh. TUYỆT ĐỐI KHÔNG dùng cố định 1 mẫu duy nhất hay nền đen tuyền đơn điệu đứng yên; BẮT BUỘC luân phiên sử dụng kho 9+ mẫu nền chiều sâu điện ảnh (`dark-gradient-depth.png`, `dark-brick-wall.png`, `grid-caro.png`, `paper-crumpled-black.png`, `concrete-dark-grunge.png`, `radial-navy-glow.png`, `carbon-mesh-studio.png`, `lens-bokeh-abstract.png`, hoặc `blurred-speaker`) kết hợp chuyển động nhẹ Ken Burns slow zoom (1.02x -> 1.09x) và micro parallax drift để khung hình luôn sống động, điện ảnh.
- **Tuyệt đối KHÔNG emoji**: Loại bỏ 100% emoji khỏi toàn bộ caption, graphic, callout, title, CTA để đảm bảo thẩm mỹ chuyên nghiệp, sang trọng chuẩn truyền thông cao cấp.
- Giữ caption đúng chính tả tiếng Việt, đồng bộ token, nằm trong vùng an toàn và dễ đọc trên điện thoại.
- Hook 0–3 giây phải rõ; CTA ngắn đặt trên vùng an toàn đầu không che mặt người nói; không thêm dữ liệu hoặc tuyên bố không có trong lời nói.
- **Kho Chuyển Cảnh 9 Hiệu Ứng CapCut 2-Layer Khóa Cứng SFX (BẮT BUỘC TUYỆT ĐỐI)**:
  - Khi có nhu cầu sử dụng hiệu ứng chuyển cảnh (trong `tracks.transitions` của EDL hoặc khi cắt ghép cảnh quay), **CHỈ ĐƯỢC PHÉP SỬ DỤNG 1 TRONG 9 HIỆU ỨNG CAPCUT** đã chuẩn hóa: `glare-ii`, `phone-reveal`, `paper-ball`, `glitch`, `fade-down`, `blink`, `wave-right`, `swipe-left`, `comic-cut`. **TUYỆT ĐỐI KHÔNG DÙNG HIỆU ỨNG TỰ SINH RA NÀO KHÁC VÀ KHÔNG DÙNG MOCK OVERLAY 1 LỚP**.
  - **Quy tắc 2-Layer**: Chạy trực tiếp qua `CapCutTwoLayerTransitions` với đầy đủ `clipA`, `clipB`, `startFromA`, `startFromB`.
  - **Quy tắc Cut-Point**: Chuyển cảnh bắt buộc neo tâm tại điểm cắt cảnh (`startMs = broll.startMs - durMs // 2` khi vào B-roll và `broll.endMs - durMs // 2` khi thoát B-roll). Tuyệt đối không đặt lơ lửng giữa câu nói liền mạch.
  - Mỗi chuyển cảnh đi kèm SFX khóa cứng 1:1 trong `tracks.sfx`, thời lượng chuẩn theo frame (tại 30fps), direction hợp lệ (`"right"`, `"down"`, `"left"`), và quy tắc ngắt âm dứt điểm (Anti-Bleed).
  - → **Bắt buộc tra cứu bảng chi tiết (mã hiệu ứng, frame, file SFX, EDL Schema)** tại [references/transitions-guide.md](references/transitions-guide.md) hoặc file code [src/components/capcut-transitions-registry.ts](src/components/capcut-transitions-registry.ts).
- **Kho Hiệu Ứng Âm Thanh SFX (45+ Mẫu Chuẩn, 6 Nhóm Chức Năng)**:
  - BẮT BUỘC sử dụng kho 45+ mẫu SFX chuẩn tại `public/sfx/`. NGHIÊM CẤM chọn bừa, lặp lại máy móc hoặc chỉ dùng vài SFX quen thuộc (`whoosh`, `pop`, `impact`).
  - AI phải **suy luận ngữ cảnh từng câu nói** để chọn SFX phù hợp nhất từ 6 nhóm chức năng: *Thao tác công nghệ/UI*, *Chuyển cảnh/Lướt chữ*, *Cinematic/Kịch tính*, *Foley đời sống*, *Hài hước/Comic Meme*, *Game 8-Bit/CTA*.
  - → **Bắt buộc tra cứu bảng đặc tính âm thanh & ứng dụng chuẩn xác** tại [references/sfx-sound-design.md](references/sfx-sound-design.md).
  - **Quy tắc phối âm**: Hai SFX phát liên tiếp KHÔNG ĐƯỢC trùng nhau. Giữ khoảng cách tối thiểu giữa 2 SFX từ `1.2s – 1.8s` để tránh mệt tai người xem. Pre-roll 65ms (âm thanh đi trước đỉnh hình ảnh 40–65ms) và cân bằng âm lượng (0.45 – 0.75) để âm thanh sắc bén mà tuyệt đối không át tiếng người nói.
- **Nhạc nền (BGM) & Tỉ lệ âm lượng**: Tự động chọn track phù hợp từ kho `public/bgm/`. BẮT BUỘC KHÓA CỨNG TỈ LỆ TƯƠNG QUAN: BGM/Voice luôn nằm trong dải `0.05 – 0.08` (chuẩn: $V_{bgm} = V_{voice} 	imes 0.06$, tối đa không quá 0.09) và fade-out 2.0s cuối video. SFX dao động `0.35 – 0.75 × V_{voice}`.
- Không gửi video ra mạng, đăng bài hoặc ghi đè nguồn nếu người dùng chưa yêu cầu.

## Mẫu kết thúc mỗi vòng render

Nêu đủ: đường dẫn video, thời gian đã chạy, các kiểm tra đã đạt và ba lựa chọn tiếp theo: sửa bằng lời, giữ bản này, hoặc dựng video mới.
