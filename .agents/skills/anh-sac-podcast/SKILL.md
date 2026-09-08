---
name: anh-sac-podcast
description: Dựng video ngắn talking-head theo phong cách Anh Sắc Podcast (creative podcast): kinetic pop caption (từ khóa đập lớn giữa ngực), graphic card flat 2D minh họa trên nền giấy kẻ ô (grid paper) với mảnh vỡ đen bay xoáy (debris shatter), floating number badge cam rực, b-roll xen kẽ dual-set cinematic và b-roll graphic, âm thanh impact dứt khoát. Dùng khi người dùng gõ /anh-sac-podcast hoặc yêu cầu dựng phong cách Anh Sắc.
---

# Phong Cách Dựng Video Anh Sắc Podcast (`anh-sac-podcast`)

Phong cách dựng video ngắn talking-head sáng tạo, trẻ trung, kết hợp giữa **Studio Podcast Tối Giản** và **Motion Graphics Minh Họa Flat 2D**.
Được đúc kết từ video phân tích chuẩn viral của kênh **Anh Sắc Nhỏ**.

---

## 1. Triết Lý Thiết Kế Cốt Lõi

1. **Dual-Set Visual Dynamics**: Xen kẽ giữa 2 góc quay / bối cảnh (Studio tối đèn vàng ấm mic Shure + Phòng làm việc sáng tủ sách blazer) hoặc A-roll xen kẽ B-roll thật/graphic liên tục mỗi 2–4 giây.
2. **Kinetic Pop Typography**: Caption không chỉ là phụ đề karaoke đều đặn, mà từ khóa đắt giá nhất nhảy bật cỡ khổng lồ (140–160px) ngay giữa ngực người nói.
3. **Graph Paper Motion Cards**: Thay vì headline card đóng khung hộp viền xám, sử dụng **Card đồ họa toàn màn hình trên nền giấy kẻ ô vuông (Grid Paper `#F6F7FA`)**, kết hợp icon flat 2D + chữ in hoa cam `#FF6B00` + chữ viết tay uốn lượn đen `#1A1A1A` + 4 mảnh vỡ đen bay xoáy từ 4 góc.
4. **Rule of 2–3 Chuyển Cảnh**: Giữ dứt khoát 2–3 loại chuyển cảnh chính xuyên suốt (`debris-shatter`, `quick-cut`, `color-flash`).
5. **Độc Quyền Hiển Thị (Mutual Exclusion)**: Khi Card đồ họa / B-roll xuất hiện, phụ đề thoại biến mất hoặc chuyển thành dải chữ in hoa viền đen sắc nét dưới đáy màn hình.

---

## 2. Hệ Thống Màu & Token Thiết Kế

| Token | Mã màu | Ý nghĩa sử dụng |
|:---|:---|:---|
| `accent` | `#FF6B00` | Cam rực: Headline chính, từ khóa nhấn mạnh, nút sóng âm, number badge |
| `accent2` | `#1A1A1A` | Đen tuyền: Icon flat, mảnh vỡ debris, chữ viết tay script |
| `highlightColor` | `#FFE600` | Vàng rực: Từ khóa đang nói (active word), điểm sáng phụ |
| `captionColor` | `#FFFFFF` | Trắng tinh: Phụ đề, viền chữ sắc nét |
| Nền card | `#F6F7FA` | Nền trắng ngà kẻ lưới ô vuông `rgba(0,0,0,0.055)` 52px |

---

## 3. Hệ Thống Caption & Typography

### A. Kinetic Pop (`kinetic-pop`)
- **Vị trí**: Chính giữa ngực / thân trên của người nói (khoảng Y: 45%–55%).
- **Cấu trúc**: 1 từ khóa quan trọng cỡ **KHỔNG LỒ (140–160px)**, in hoa, font `Montserrat 900`, viền đổ bóng nổi 3D (`textShadow: -3.5px -3.5px 0 #000, 3.5px -3.5px 0 #000...`).
- **Dòng phụ**: Chữ thường hoặc in hoa nhỏ hơn (48–54px) nằm ngay dưới.
- **Ví dụ**: **RẤT** *nhiều bạn mắc*.

### B. Staggered Lines (`staggered-lines`)
- **Vị trí**: Trung tâm màn hình.
- **Cấu trúc**: 2–3 dòng so le:
  - Dòng 1 (54px trắng): "Ở ĐÂY"
  - Dòng 2 (88px cam rực in hoa): "CHUYỂN CẢNH"
  - Dòng 3 (48px trắng): "LIÊN TỤC"

### C. Bottom Subtitle (Dải phụ đề dưới đáy trên Card / B-roll)
- **Vị trí**: `bottom: 180px` (nằm an toàn trên thanh điều hướng điện thoại).
- **Style**: Chữ in hoa trắng, font `Be Vietnam Pro 800`, viền đen đậm sắc nét 2.5px bao quanh chống chìm nền.
- **Ví dụ**: `TÌNH HUỐNG ẤY HÃY ĐẶT THÊM NHIỀU GÓC QUAY`.

---

## 4. Graphic Cards & Iconography

### A. Card Minh Họa Lưới Vuông (`grid-flat-card`)
- **Đặc trưng**:
  - Nền giấy kẻ ô vuông graph paper.
  - 4 mảnh vỡ hình học đen tuyền (`Debris`) phóng từ 4 góc bay vào trung tâm khi xuất hiện.
  - Tiêu đề chính in hoa đậm màu cam (`#FF6B00`).
  - Tiêu đề phụ chữ viết tay phóng khoáng (`Patrick Hand` script cursive) màu đen nghiêng `-3deg`.
  - Icon flat 2D vector tối giản:
    - `timeline`: Thanh timeline tiến trình đen bo góc + nút Play tam giác cam + 2 con trỏ mũi tên trắng + thước đo "3 giây".
    - `audio-wave`: Biểu tượng loa + viên thuốc cam chứa các vạch sóng âm thanh EQ.
    - `crane`: Cần cẩu xây dựng + móc dây cáp + avatar người dùng (minh họa "xây kênh").
    - `camera`: Máy ảnh flat 2D + ống kính cam.
    - `warning`: Tam giác cảnh báo cam + dấu chấm than trắng.
    - `book` / `lightbulb`: Sách / bóng đèn sáng tạo ý tưởng.

### B. Huy Hiệu Số Nổi Bật (`number-badge`)
- **Vị trí**: Góc trên bên phải (`top: 140px, right: 60px`).
- **Hình dạng**: Hình tròn đường kính 190px, gradient đa tầng từ cam sáng `#FFA726` đến cam đậm `#E65100`.
- **Nội dung**: Con số thứ tự đếm mục (1, 2, 3, 4, 5...) màu trắng tinh, cỡ 110px font Montserrat 900.
- **Tác dụng**: Giữ chân người xem theo dõi hết danh sách các mẹo / bước.

---

## 5. Chuyển Cảnh & Sound Design (SFX)

### Bộ 3 chuyển cảnh chủ đạo:
1. `debris-shatter`: 4 mảnh vỡ văng qua màn hình cắt dứt khoát giữa cảnh này và cảnh khác.
2. `quick-cut`: Cắt hình tức thì, chuẩn nhịp nói, không delay.
3. `color-flash`: Chớp sáng nhẹ màu cam/trắng nhấn mạnh thay đổi cảm xúc.

### SFX phối hợp:
- Card xuất hiện: `impact-soft` + `whoosh-fast`
- Mảnh vỡ văng / Chuyển cảnh: `whoosh-fast` + `impact-hard`
- Number badge xuất hiện: `ding` hoặc `bell-bright`
- Từ khóa kinetic pop: `pop-soft`

---

## 6. Lệnh Thực Thi
Để tạo video theo phong cách này:
```bash
python scripts/generate-edl.py --preset anh-sac-podcast --clip raw/talkinghead.mp4
npx remotion render src/index.ts Reel out/final.mp4
```
