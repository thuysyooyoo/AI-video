# Style Presets — So sánh 2 phong cách dựng

Hệ thống hỗ trợ 2 preset phong cách dựng, kích hoạt bằng slash command `/` hoặc cờ `--preset` trong pipeline.

## Cách kích hoạt

| Slash Command | CLI Flag | Mô tả |
| :--- | :--- | :--- |
| `/thuy-style-oneshot` | `--preset thuy-style-oneshot` | Phong cách hiện đại, sạch sẽ, không card hộp |
| `/classic` | `--preset classic` | Phong cách gốc với card hộp + icon SVG |

Mặc định: `thuy-style-oneshot` (nếu không chỉ định).

## Bảng so sánh chi tiết

| Tính năng | `/thuy-style-oneshot` | `/classic` |
| :--- | :--- | :--- |
| **Phụ đề thoại** | Nhảy chữ karaoke 4–6 từ, bôi vàng `#FFE600` | **Giống** (chia sẻ chung engine) |
| **Card viền hộp** | ❌ CẤM 100% | ✅ Cho phép |
| **SVG Icon minh họa** | ❌ CẤM | ✅ 10 icon line-art |
| **Emoji** | ❌ CẤM 100% | ✅ Cho phép |
| **Headline ý chính** | ✅ 4 style phân tầng | ❌ Không có |
| **B-Roll chữ full khung** | ✅ Tự động 1–2 cái | ❌ Không tự động |
| **Vị trí graphic** | Top safe zone (17%) | Giữa-dưới (56%) |
| **Mutual Exclusivity** | ✅ Có graphic → ẩn phụ đề | ❌ Hiện cùng lúc |
| **Lớp phủ đáy (Scrim)** | Blur 14px + vignette 38% | Gradient nhẹ |
| **Mật độ graphic** | Thấp (chỉ khi cần) | Cao (25–45 / 60–100s) |

## Cấu hình kỹ thuật

File cấu hình:
- **TypeScript**: `src/presets.ts` — đọc bởi Remotion render
- **Python**: `scripts/presets.json` — đọc bởi pipeline sinh EDL

Trường EDL: `edl.style.recipe.preset` = `"thuy-style-oneshot"` hoặc `"classic"`.
