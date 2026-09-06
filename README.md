# TISA AI EDITOR AGENT (AI Video Automation)

Hệ thống AI Editor tự động dựng video ngắn chất lượng cao (TikTok, Facebook Reels, YouTube Shorts) chạy hoàn toàn cục bộ (local) kết hợp sức mạnh của **Remotion**, **faster-whisper**, **OpenCV**, và **FFmpeg**.

---

## 🌟 Tính Năng Nổi Bật

- **Tự động nhận diện lời nói & bóc phụ đề**: Sử dụng mô hình `faster-whisper` cho tiếng Việt với độ chính xác cao và định thời gian chuẩn đến từng từ (word-level timestamps).
- **Cắt khoảng lặng thông minh (Smart Silence Cut)**: Tự động phát hiện và loại bỏ các khoảng lặng, khoảng ngập ngừng hoặc từ đệm.
- **Hỗ trợ 2 phong cách dựng độc lập (Dual Style Presets)**:
  1. **`thuy-style-oneshot`**: Phong cách hiện đại, tinh gọn chuẩn xu hướng triệu view.
  2. **`classic`**: Phong cách ban đầu của dự án với card đồ họa viền hộp bo góc và icon SVG minh họa.
- **Tích hợp Slash Command (`/`) trong Google Antigravity**: Kích hoạt nhanh chóng bằng cách gõ `/thuy-style-oneshot` hoặc `/classic`.

---

## 🎨 So Sánh 2 Phong Cách Dựng (Style Presets)

| Đặc điểm / Tính năng | `/thuy-style-oneshot` *(Hiện đại)* | `/classic` *(Gốc)* |
| :--- | :--- | :--- |
| **Phụ đề thoại** | Nhảy chữ karaoke 4–6 từ/dòng, bôi vàng `#FFE600` | Nhảy chữ karaoke 4–6 từ/dòng, bôi vàng `#FFE600` |
| **Card viền hộp** | ❌ **CẤM 100%** (không dùng card hộp che mặt) | ✅ Cho phép (`NeonIconCard`, `PremiumCard`...) |
| **Icon / Emoji** | ❌ **CẤM 100%** (chuẩn typography sang trọng) | ✅ Cho phép 10 SVG icon line-art nguyên bản |
| **Headline ý chính** | ✅ **4 style phân tầng** (`3-tier`, `stat-punch`, `split-contrast`, `tag-headline`) với keyword vàng + chạy chữ so le | ❌ Không có (thông tin nằm trong card hộp) |
| **B-Roll toàn màn hình** | ✅ Full khung 1080×1920, giữ trọn độ dài câu nói | ❌ B-roll thời lượng ngắn mặc định (~2s) |
| **Độc quyền hiển thị** | ✅ Có headline/b-roll → tự ẩn phụ đề thoại | ❌ Card và phụ đề hiển thị đồng thời |
| **Lớp phủ mờ đáy** | Blur 14px + vignette tối 38% ở 30% đáy video | Gradient đen mờ nhẹ tinh tế |

---

## 🚀 Hướng Dẫn Cài Đặt

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18+ hoặc 20+
- **Python**: Phiên bản 3.10+ hoặc 3.11+
- **FFmpeg**: Đã cài đặt và thêm vào biến môi trường `PATH`

### 2. Cài đặt thư viện

```bash
# Cài đặt Node dependencies
npm install

# Cài đặt Python dependencies
pip install -r requirements.txt
```

### 3. Kiểm tra môi trường
```bash
python scripts/doctor.py
```

---

## 🎬 Hướng Dẫn Sử Dụng

### 1. Sử dụng với Google Antigravity (Khuyên dùng)
Trong ô chat Antigravity, bạn chỉ cần gõ:
- `/thuy-style-oneshot` kèm đường dẫn video (hoặc kéo thả video vào).
- `/classic` nếu muốn dựng theo phong cách card hộp gốc.

### 2. Sử dụng qua dòng lệnh (CLI Pipeline)

```bash
# Bước 1: Bóc băng và cắt khoảng lặng
python scripts/silence-cut.py --input "public/raw/input.mp4" --output "public/raw/tight.mp4"

# Bước 2: Sinh EDL (Edit Decision List)
# Dựng phong cách Thuy One Shot:
python scripts/generate-edl.py --clip "tight.mp4" --preset thuy-style-oneshot

# Dựng phong cách Classic:
python scripts/generate-edl.py --clip "tight.mp4" --preset classic

# Bước 3: Render video thành phẩm với Remotion
npm run build
```

---

## 📁 Cấu Trúc Thư Mục

```
├── agents/             # Cấu hình agent
├── goldens/            # Ảnh mẫu nghiệm thu các theme màu sắc
├── public/             # Thư mục chứa video thô và âm thanh SFX
│   ├── raw/            # Video đầu vào
│   └── sfx/            # File âm thanh hiệu ứng (whoosh, pop, impact...)
├── references/         # Tài liệu quy chuẩn dựng và phân tích
├── scripts/            # Script Python (doctor, silence-cut, generate-edl...)
│   └── presets.json    # Cấu hình preset cho Python
├── skills/             # Các skill slash command (/thuy-style-oneshot, /classic)
├── src/                # Mã nguồn Remotion (React + TypeScript)
│   ├── components/     # Các component hiển thị (Captions, Graphics, Headlines...)
│   ├── presets.ts      # Nguồn chân lý cấu hình 2 phong cách dựng
│   ├── Reel.tsx        # Composition chính kết hợp các layer video
│   └── edl-types.ts    # Định nghĩa Schema dữ liệu EDL
└── SKILL.md            # Quy trình điều phối của Agent
```

---

## 📄 Bản Quyền & Giấy Phép

Phát triển bởi đội ngũ **TISA AI** dành riêng cho tự động hóa sản xuất nội dung video ngắn.
