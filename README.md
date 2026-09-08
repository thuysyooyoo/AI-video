# 🎬 TISA AI EDITOR AGENT (AI Video Automation)

> **Hệ thống AI Video Editor tự động hóa dựng video ngắn triệu view (TikTok, Facebook Reels, YouTube Shorts) chạy Local-first 100% với Remotion, faster-whisper, OpenCV và FFmpeg.**

---

## 🌟 Tính Năng Đột Phá

- ⚡ **Local-First & Bảo mật 100%**: Toàn bộ chuỗi xử lý (Bóc tách giọng nói, Cắt khoảng lặng, Lập kịch bản dựng EDL, Render video) diễn ra hoàn toàn trên máy cục bộ của bạn, không phụ thuộc cloud, không giới hạn chi phí API.
- 🎙️ **Tự động nhận diện giọng nói & bóc phụ đề (Word-level timestamps)**: Tích hợp `faster-whisper` tối ưu cho tiếng Việt với độ trễ cực thấp và thời gian chuẩn xác đến từng từ.
- ✂️ **Cắt khoảng lặng thông minh (Smart Silence Cut)**: Phát hiện và loại bỏ chính xác các đoạn ngừng nghỉ vô nghĩa, thở dài, từ đệm (`ờ`, `à`), giữ nhịp điệu cuốn hút từ giây đầu tiên.
- 🎭 **4 Phong cách dựng độc lập (Multi-Style Presets)**:
  1. `/thuy-style-oneshot`: Hiện đại, typography phân tầng, nền đen tuyền, blur 30% đáy video.
  2. `/thuy-style-nhieu-canh`: Tối ưu video ghép cảnh, du lịch, vlog, bỏ 100% lớp blur đáy cho hình ảnh trong trẻo sắc nét.
  3. `/anh-sac-podcast`: Phong cách Podcast / Chia sẻ đối thoại với giao diện card phẳng tinh tế.
  4. `/classic`: Phong cách gốc với card viền hộp bo góc và icon SVG minh họa.
- 🎞️ **Bộ 9 Hiệu ứng Chuyển cảnh CapCut Độc Quyền (CapCut 9 Suite)**: Chuẩn hóa 9 hiệu ứng chuyển cảnh viral kèm âm thanh SFX ghép cặp 1:1 cố định và quy tắc ngắt âm dứt điểm (**Anti-Bleed Hard Cutoff**).
- 🔊 **Sound Design 45+ Samples & Nhạc Nền Tự Động (BGM)**: Kho SFX 45+ mẫu phân nhóm khoa học với cơ chế xoay vòng chống lặp (Round-robin) và 4 nhóm nhạc nền tự động nhận diện cảm xúc video.
- 🚀 **Sẵn sàng 100% cho GitHub & Google Antigravity**: Tích hợp sẵn bộ kỹ năng Workspace tại `.agents/skills/`, mở dự án là nhận diện ngay toàn bộ Slash Commands mà không cần cấu hình phức tạp.

---

## 🎨 So Sánh 4 Phong Cách Dựng (Style Presets)

| Tiêu chí / Đặc điểm | `/thuy-style-oneshot` | `/thuy-style-nhieu-canh` | `/anh-sac-podcast` | `/classic` |
| :--- | :--- | :--- | :--- | :--- |
| **Mục đích tối ưu** | Talking-head quay 1 góc tĩnh, video chia sẻ, tri thức triệu view | Video nhiều góc máy, ghép cảnh, vlog ngoại cảnh, du lịch | Podcast đàm thoại, phỏng vấn, tâm sự sâu lắng | Video giải thích kĩ thuật dạng infographic gốc |
| **Phụ đề thoại** | Nhảy chữ karaoke 4–6 từ/dòng, từ đang nói bôi vàng `#FFE600` | Nhảy chữ karaoke 4–6 từ/dòng, từ đang nói bôi vàng `#FFE600` | Nhảy chữ 4–6 từ, màu nhấn thanh lịch | Nhảy chữ karaoke 4–6 từ/dòng, từ đang nói bôi vàng `#FFE600` |
| **Lớp phủ đáy (Bottom Scrim)** | **Blur 14px + tối 38%** ở 30% đáy video tạo chiều sâu | **KHÔNG CÓ (Bỏ 100% blur đáy)** để video trong trẻo | Gradient đen mờ tối giản | Gradient đen mờ nhẹ |
| **Card viền hộp** | ❌ **CẤM TUYỆT ĐỐI** | ❌ **CẤM TUYỆT ĐỐI** | Card phẳng (Flat card) tối giản | ✅ Cho phép (`NeonIconCard`, `PremiumCard`...) |
| **Icon / Emoji** | ❌ **CẤM TUYỆT ĐỐI** | ❌ **CẤM TUYỆT ĐỐI** | ❌ Không sử dụng | ✅ 10 SVG icon line-art |
| **Headline ý chính** | 4 style phân tầng (`3-tier`, `stat-punch`, `split-contrast`, `tag-headline`) | 4 style phân tầng với keyword vàng và kinetic typography | Typography phẳng, font clean | Nằm bên trong các card viền hộp |
| **Độc quyền hiển thị (Mutual Exclusivity)** | ✅ Có Headline/B-roll ➔ Tự ẩn phụ đề | ✅ Có Headline/B-roll ➔ Tự ẩn phụ đề | ✅ Tự động ẩn theo nhịp nói | ❌ Card và phụ đề hiển thị cùng lúc |

---

## ⚡ Bộ Chuyển Cảnh CapCut Độc Quyền (CapCut 9 Transition Suite)

Hệ thống tuân thủ **nghiêm ngặt quy tắc chuyển cảnh 1:1**: Mọi bước chuyển cảnh chỉ được phép chọn 1 trong 9 hiệu ứng cố định dưới đây, đi kèm file SFX đặc thù và áp dụng triệt để quy tắc **Anti-Bleed (hiệu ứng kết thúc ở frame nào thì âm thanh SFX dừng hẳn ngay tại frame đó)**:

| # | Mã hiệu ứng | Tên CapCut | Thời lượng chuẩn | File SFX bắt buộc | Mô tả thị giác & Quy tắc cơ học |
| :-: | :--- | :--- | :-: | :--- | :--- |
| 1 | `glare-ii` | Glare II | 16 frames (0.53s) | `sfx/glare-burn.mp3` | Chớp lóa quang học vàng kem ấm tỏa từ tâm; SFX tiếng xèo cuộn phim nhựa bị phơi sáng. |
| 2 | `phone-reveal` | Phone Reveal | 22 frames (0.73s) | `sfx/phone-shutter-1.mp3` | Khung iPhone 15 Pro xuyên tâm mở tràn màn hình; SFX đúng **1 tiếng tách màn trập** đanh gọn. |
| 3 | `paper-ball` | Paper Ball | 20 frames (0.67s) | `sfx/paper-ball-yt.mp3` | Cầu giấy vo tròn bung toạc 360°; SFX vò nghiến giấy giòn rụm từ YouTube. |
| 4 | `glitch` | Glitch | 14 frames (0.47s) | `sfx/glitch-cut.mp3` | Cắt lát hình ngang giật lệch vị trí kèm quang sai RGB; SFX xung điện từ giật số. |
| 5 | `fade-down` | Fade Down | 14 frames (0.47s) | `sfx/fade-woosh.mp3` | Clip B trượt từ đỉnh xuống đè mượt lên Clip A; SFX tiếng gió trầm sâu tần số thấp (Deep Down-Woosh). |
| 6 | `blink` | Blink | 8 frames (0.27s) | `sfx/click.mp3` | Mí mắt đen khép lại trong 3 frame rồi bung cảnh mới; SFX tiếng `click` dứt khoát kết thúc trước khi cảnh mở. |
| 7 | `wave-right` | Wave Right | 16 frames (0.53s) | `sfx/wave-sparkle.mp3` | Gợn sóng lỏng mực trắng quét ngang từ trái sang phải; SFX tia sáng lấp lánh (sparkle/bọt nước). |
| 8 | `swipe-left` | Swipe Left | 10 frames (0.33s) | `sfx/whoosh-fast.mp3` | Cú vuốt ngang siêu tốc 10 frame vệt mờ Kinetic Blade; SFX chém gió xé gió cực nhanh (Fast Whip Whoosh). |
| 9 | `comic-cut` | Comic Cut | 20 frames (0.67s) | `sfx/comic-paper-tear.mp3` | Xé đôi Clip A theo đường răng cưa dọc lộ Manga Halftone; SFX rách toạc giấy bìa (Paper Tear). |

---

## 🔊 Thiết Kế Âm Thanh & BGM (Sound Design Architecture)

1. **Kho 45+ SFX chuẩn hóa**: Phân bổ vào 6 nhóm chức năng (Công nghệ số, Chuyển cảnh cinematic, Foley hành động, Hoạt hình retro, Game điện tử, Cues dẫn hướng).
2. **Cơ chế xoay vòng chống lặp (Round-Robin Rotation)**: Khi một loại hiệu ứng xuất hiện nhiều lần (ví dụ: kinetic text), hệ thống tự động luân phiên đổi mẫu âm thanh để video không bao giờ bị "máy móc".
3. **Quy tắc dứt điểm Anti-Bleed**: Toàn bộ SFX chuyển cảnh được giới hạn độ dài theo chính xác số frame của hiệu ứng chuyển cảnh, không để âm thanh kéo rê sang cảnh tiếp theo.
4. **4 Nhóm nhạc nền tự động (BGM Auto-matching)**: AI tự động phân tích cảm xúc từ transcript để ghép nhạc phù hợp với âm lượng chuẩn `volume: 0.20-0.25`, ducking êm ái và fade out mượt mà.

---

## 🚀 Cài Đặt & Đóng Gói GitHub Sẵn Sàng (1-Click Setup)

Dự án được thiết kế theo cấu trúc tự khép kín (Self-contained). Khi tải hoặc clone từ GitHub về bất kỳ máy tính nào:

### Cách 1: Cài đặt tự động 1-Click (Khuyên dùng cho Windows)
Chỉ cần nhấp đúp hoặc chạy lệnh:
```bat
scripts\setup.bat
```
Script sẽ tự động:
1. Kiểm tra môi trường Node.js (18+) và Python (3.10+).
2. Tự động chạy `npm install` cài đặt Remotion và các thư viện đồ họa React.
3. Tự động khởi tạo môi trường ảo `.venv` và cài đặt `requirements.txt` (`faster-whisper`, `opencv-python`, `numpy`...).
4. Tự động kích hoạt `scripts/doctor.py` để nghiệm thu môi trường sẵn sàng 100%.

### Cách 2: Cài đặt thủ công (Cross-platform)
```bash
# 1. Cài đặt Node dependencies
npm install

# 2. Tạo môi trường ảo Python và cài thư viện
python -m venv .venv
# Trên Windows:
.venv\Scripts\pip install -r requirements.txt
# Trên macOS/Linux:
source .venv/bin/activate && pip install -r requirements.txt

# 3. Kiểm tra toàn diện hệ thống
python scripts/doctor.py
```

### 3. Khả năng tương thích Google Antigravity
- Thư mục `.agents/skills/` chứa toàn bộ 9 kỹ năng chuẩn của dự án. Mở thư mục này bằng Antigravity là các lệnh slash hoạt động ngay tức thì.
- **Nếu muốn dùng Slash Commands ở cấp độ Global** (ở bất kỳ thư mục nào trên máy tính):
  - Windows: Chạy `scripts\sync-skills.bat`
  - macOS / Linux: Chạy `bash scripts/sync-skills.sh`

---

## 🎬 Hướng Dẫn Sử Dụng

### 1. Dựng video bằng Google Antigravity (Khuyên dùng)
Kéo thả video thô vào ô chat và gõ kèm câu lệnh:
- `/thuy-style-oneshot`: Dựng video triệu view phong cách Thùy One Shot (nền đen tuyền, headline phân tầng, blur 30% đáy).
- `/thuy-style-nhieu-canh`: Dựng video vlog, ngoại cảnh, ghép nhiều cảnh (bỏ hoàn toàn blur đáy, hình ảnh trong trẻo).
- `/anh-sac-podcast`: Dựng video podcast đàm thoại phong cách phẳng tinh gọn.
- `/classic`: Dựng video với card viền hộp và icon phong cách infographic nguyên bản.
- `/tisa-ai-editor-agent`: Dựng tự động với bộ điều phối toàn năng của TISA.

### 2. Dựng video bằng dòng lệnh (CLI Pipeline)
```bash
# Bước 1: Cắt khoảng lặng và từ đệm tự động
python scripts/silence-cut.py --input "public/raw/input.mp4" --output "public/raw/tight.mp4"

# Bước 2: Bóc tách giọng nói & sinh kịch bản dựng (EDL)
python scripts/generate-edl.py --clip "tight.mp4" --preset thuy-style-oneshot

# Bước 3: Xem trước trên Remotion Studio (Tùy chọn)
npm run studio:edl

# Bước 4: Render video thành phẩm siêu tốc
npm run render:edl
```

---

## 📁 Cấu Trúc Thư Mục Chuẩn Hóa

```
├── .agents/skills/     # Workspace Skills cho Google Antigravity (Di động 100% khi đẩy GitHub)
│   ├── tisa-ai-editor-agent/
│   ├── thuy-style-oneshot/
│   ├── thuy-style-nhieu-canh/
│   ├── anh-sac-podcast/
│   └── classic/
├── docs/               # Quy chuẩn CapCut Transitions & SFX Rules
├── goldens/            # Ảnh mẫu nghiệm thu các theme màu sắc
├── public/             # Thư mục tài nguyên
│   ├── bgm/            # Kho nhạc nền tự động phân loại cảm xúc
│   ├── raw/            # Video đầu vào của bạn
│   └── sfx/            # Kho 45+ hiệu ứng âm thanh chuẩn hóa (MP3)
├── references/         # 15 tài liệu quy chuẩn dựng, thiết kế âm thanh và hướng dẫn vận hành
├── scripts/            # Bộ công cụ Python & Batch tự động hóa
│   ├── setup.bat       # Script cài đặt 1-Click cho máy mới
│   ├── sync-skills.bat # Script đồng bộ kỹ năng sang Global Config
│   ├── doctor.py       # Kiểm tra toàn diện hệ thống
│   ├── silence-cut.py  # Cắt khoảng lặng thông minh
│   └── generate-edl.py # Bộ máy lập kịch bản dựng
├── src/                # Mã nguồn Remotion (React + TypeScript)
│   ├── components/     # Captions, CapCut Transitions, Headlines, SFX Layer...
│   ├── presets.ts      # Single Source of Truth cấu hình các phong cách dựng
│   ├── Reel.tsx        # Composition chính kết hợp các layer video
│   └── edl-types.ts    # Schema dữ liệu EDL kiểm định bằng Zod
└── requirements.txt    # Danh sách thư viện Python cần thiết
```

---

## 📄 Bản Quyền & Giấy Phép

Phát triển bởi đội ngũ **TISA AI** dành riêng cho tự động hóa sản xuất nội dung video ngắn chuyên nghiệp. Mọi bản quyền thuộc về tác giả.
