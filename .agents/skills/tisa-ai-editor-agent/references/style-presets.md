# Style Presets — So sánh các phong cách dựng

Hệ thống hỗ trợ các preset phong cách dựng, kích hoạt bằng slash command `/` hoặc cờ `--preset` trong pipeline.

## Cách kích hoạt

| Slash Command | CLI Flag | Mô tả |
| :--- | :--- | :--- |
| `/thuy-style-oneshot` | `--preset thuy-style-oneshot` | Phong cách Oneshot hiện đại: studio tĩnh, blur đen đáy 30%, không card hộp |
| `/thuy-style-nhieu-canh` | `--preset thuy-style-nhieu-canh` | Phong cách Nhiều Cảnh: giữ trọn 9+ style headline, **bỏ blur đen 30% đáy** cho footage trong trẻo |
| `/anh-sac-podcast` | `--preset anh-sac-podcast` | Phong cách podcast sáng tạo: kinetic pop giữa ngực, grid flat card, number badge cam |
| `/classic` | `--preset classic` | Phong cách gốc với card hộp + icon SVG |

Mặc định: `thuy-style-oneshot` (nếu không chỉ định).

## Bảng so sánh chi tiết

| Tính năng | `/thuy-style-oneshot` | `/thuy-style-nhieu-canh` | `/classic` |
| :--- | :--- | :--- | :--- |
| **Phụ đề thoại** | Nhảy chữ karaoke 4–6 từ, bôi vàng `#FFE600` | Nhảy chữ karaoke 4–6 từ, bôi vàng `#FFE600` | Giống (chia sẻ chung engine) |
| **Card viền hộp** | ❌ CẤM 100% | ❌ CẤM 100% | ✅ Cho phép |
| **SVG Icon minh họa** | ❌ CẤM | ❌ CẤM | ✅ 10 icon line-art |
| **Emoji** | ❌ CẤM 100% | ❌ CẤM 100% | ✅ Cho phép |
| **Headline ý chính** | ✅ Đầy đủ 9+ style (`asymmetric-trio`, `stacked-contrast`, `multiblock-flow`, `glow-ambient`, `3-tier`, `stat-punch`, `split-contrast`, `step-flow`, `comparison`) | ✅ Đầy đủ 9+ style (`asymmetric-trio`, `stacked-contrast`, `multiblock-flow`, `glow-ambient`, `3-tier`, `stat-punch`, `split-contrast`, `step-flow`, `comparison`) | ❌ Không có |
| **B-Roll chữ full khung** | ✅ Tự động 1–2 cái (bullet list `•`) | ✅ Tự động 1–2 cái (bullet list `•`) | ❌ Không tự động |
| **Vị trí graphic** | Safe zones: 30% trên & 30% dưới | Safe zones: 30% trên & 30% dưới | Giữa-dưới (56%) |
| **Mutual Exclusivity** | ✅ Có graphic → ẩn phụ đề | ✅ Có graphic → ẩn phụ đề | ❌ Hiện cùng lúc |
| **Lớp phủ đáy (Scrim)** | Blur 14px + vignette đen 38% | ❌ **KHÔNG CÓ (Trong suốt 100%)** — `top-only` | Gradient nhẹ |
| **Mục đích tối ưu** | Talking-head 1 cảnh quay tĩnh | **Ghép nhiều cảnh quay, ngoại cảnh, vlog, b-roll** | Video giáo dục/kỹ thuật truyền thống |

## Cấu hình kỹ thuật

File cấu hình:
- **TypeScript**: `src/presets.ts` — đọc bởi Remotion render
- **Python**: `scripts/presets.json` — đọc bởi pipeline sinh EDL

Trường EDL: `edl.style.recipe.preset` = `"thuy-style-oneshot"`, `"thuy-style-nhieu-canh"`, `"anh-sac-podcast"`, hoặc `"classic"`.
