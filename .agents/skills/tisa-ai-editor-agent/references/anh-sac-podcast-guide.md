# Cẩm Nang Chi Tiết Về Style Anh Sắc Podcast (`anh-sac-podcast`)

## 1. Nguồn Gốc & Phân Tích Thực Chiến
Phong cách này được đảo ngược thiết kế (reverse-engineered) trực tiếp từ video thực tế của kênh Anh Sắc Nhỏ. Video đạt tỷ lệ giữ chân (retention rate) rất cao nhờ:
- Không để mắt người xem dừng lại ở 1 cảnh quá 3–4 giây.
- Sử dụng **2 bối cảnh quay xen kẽ (Dual-Set)**:
  1. *Set 1*: Studio đêm, mic podcast, ánh sáng vàng ấm tương phản.
  2. *Set 2*: Phòng làm việc ban ngày, giá sách, áo blazer chỉn chu.
- Chữ không dàn trải đều đều mà giật đập **Kinetic Pop** cực mạnh vào mắt người xem.

## 2. Thông Số Kỹ Thuật (Remotion Components)

### `GridFlatCard`
- Component: `src/components/GridFlatCard.tsx`
- Background: `#F6F7FA` với lưới đồ thị 52px.
- Hiệu ứng: `DebrisShards` bay từ 4 góc vào khung hình.
- Icon flat: `timeline`, `audio-wave`, `crane`, `camera`, `warning`, `book`, `lightbulb`.
- Subtitle: Dòng chữ đọc lồng tiếng in hoa viền đen bảo vệ độ tương phản.

### `NumberBadge`
- Component: `src/components/GridFlatCard.tsx` -> `NumberBadge`
- Vị trí: `top: 140px, right: 60px`
- Kích thước: `190px x 190px`, bo tròn 100%
- Gradient: `radial-gradient(circle at 35% 35%, #FFA726 0%, #FF6B00 70%, #E65100 100%)`
- Font: Montserrat 900, 110px

### `KineticPopHeadline` & `StaggeredLinesHeadline`
- Component: `src/components/Captions.tsx`
- Vị trí: Giữa ngực người nói (Y: 45% - 55%)
- Kích thước từ khóa chính: 146px, text-shadow 3D nổi bật

### `DebrisShatter`
- Component: `src/components/Transitions.tsx`
- Type: `debris-shatter`
- Tác dụng: 4 mảnh vỡ bay xoáy qua màn hình tạo nhịp cắt sắc lẹm
