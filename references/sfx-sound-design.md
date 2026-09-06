# BỘ QUY CHUẨN THIẾT KẾ ÂM THANH (SOUND DESIGN KNOWLEDGE BASE)
## Phong Cách Thuy-Style-Oneshot & Short-Form Retention

Tài liệu này là **nguồn tri thức chuẩn mực (Knowledge Base)** về âm thanh hiệu ứng (SFX) dành cho TISA AI EDITOR AGENT. Hệ thống được thiết kế để giữ chân người xem (Retention), đẩy cao nhịp cảm xúc và năng lượng nhưng tuyệt đối giữ được sự **sang trọng, tinh tế và thẩm mỹ cao cấp** của thương hiệu.

---

## 1. NGUYÊN TẮC VÀNG TRONG SOUND DESIGN VIDEO NGẮN

1. **Hiệu ứng xúc giác thị giác (Haptic Illusion)**:
   Khi xem video trên màn hình điện thoại, mắt nhìn thấy chuyển động nhưng tai nghe thấy âm thanh va chạm dứt khoát sẽ tạo ra cảm giác vật lý sống động (giống như chạm vào vật thể thật).
2. **Visual Anchoring (Định vị tiêu điểm mắt)**:
   Não người phản xạ với âm thanh trước hình ảnh ~50ms. SFX phát ra đúng mili-giây xuất hiện của Headline hay B-roll sẽ lập tức "kéo mắt" người xem vào đúng từ khóa trọng tâm.
3. **Pre-roll Timing (Quy tắc đi trước 65ms)**:
   Âm thanh SFX luôn được kích hoạt trước khi visual bung ra hết cỡ khoảng **40ms – 65ms**. Điều này giúp đỉnh sóng âm (transient peak) trùng khít với thời điểm graphic dừng lại ở trạng thái cân bằng.
4. **Phân tầng tần số (Frequency Balancing)**:
   - Giọng nói người thuyết trình tập trung ở dải trung âm: **300 Hz – 3,500 Hz**.
   - SFX chuyên nghiệp phải tránh đục dải này:
     - Dải siêu trầm (Sub-bass `< 120 Hz`): Dành cho `hit`, `boom`, `sub-drop` tạo độ uy lực.
     - Dải cao (`> 4,000 Hz`): Dành cho `pip`, `ding`, `sparkle`, `mouse-click`, `keyboard-click` tạo độ giòn, thanh thoát.
5. **Giới hạn mật độ (Ear Fatigue Prevention)**:
   - Khoảng cách tối thiểu giữa 2 SFX cùng dải tần là **1.2 – 1.8 giây**.
   - Không lạm dụng âm thanh liên tục; chỉ kích hoạt tại các điểm chuyển ý (Pivot), điểm rơi từ khóa vàng (Punchline) hoặc chuyển cảnh.

---

## 2. HỆ THỐNG 5 DANH MỤC SFX CHUẨN HÓA

Dựa trên bộ thẻ âm thanh chuẩn editor triệu view, hệ thống phân chia thành 5 nhóm âm thanh với chức năng chuyên biệt:

### 1. XUẤT HIỆN (Appearing / Reveal / Motion Entry)
Tạo nhịp chuyển động khi một đối tượng đồ họa hoặc khối chữ mới bắt đầu trượt vào khung hình.

| Tên SFX | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong `/thuy-style-oneshot` |
| :--- | :--- | :--- | :--- |
| **Pop** | `pop.mp3`, `pop-soft.mp3` | Tiếng bóng nảy nhẹ, dứt khoát, thanh thoát | Xuất hiện thẻ tag vàng (`TagHeadline`), badge thông tin nhỏ. |
| **Swish** | `swish.mp3`, `whoosh-fast.mp3` | Gió lướt nhanh, tần số trung cao 1.2k–3.2kHz | Dòng chữ Headline Style 3 trượt vào so le; thanh bar neon lướt qua. |
| **Magic reveal** | `magic-reveal.mp3`, `sparkle.mp3` | Chuỗi chuông kim loại lấp lánh nối tiếp | Khi người nói tiết lộ một "bí mật", "công thức", "kết quả bất ngờ". |
| **Cartoon effect**| `cartoon-effect.mp3` | Tiếng lò xo tưng tưng (spring boing) vui vẻ | Điểm chạm hài hước, tình huống trớ trêu, lỗi sai vui người nói tự nhận. |

---

### 2. CHUỘT & BÀN PHÍM (Foley / Tech Interaction / UI)
Tạo cảm giác chân thực của người làm việc thực chiến, lập trình, thao tác máy tính.

| Tên SFX | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong `/thuy-style-oneshot` |
| :--- | :--- | :--- | :--- |
| **Click keyboard**| `keyboard-click.mp3` | 1 tiếng gõ switch cơ đanh gọn (blue/brown) | Khi xuất hiện 1 con số thống kê, 1 phím tắt, 1 câu lệnh prompt. |
| **Typing 1** | `typing-1.mp3` | Chuỗi gõ phím nhanh dồn dập thực tế | Khi người nói nhắc đến việc "viết kịch bản", "nhập prompt", "gõ lệnh AI". |
| **Typing 2** | `typing-2.mp3` | Gõ phím đều nhịp mượt mà (10–12 nhịp) | Dùng nền khi mô tả quy trình tự động hóa, làm việc liên tục. |
| **Mouse click** | `mouse-click.mp3` | Tiếng vi công tắc chuột sắc cạnh, tinh tế | Khi visual mô tả thao tác "chọn", "click", "bật tính năng". |

---

### 3. CÔNG NGHỆ (Tech / AI / Cyber / Warnings)
Mang âm hưởng hiện đại, trí tuệ nhân tạo, phần mềm công nghệ cao.

| Tên SFX | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong `/thuy-style-oneshot` |
| :--- | :--- | :--- | :--- |
| **Pip** | `pip.mp3` | Sóng sin 1480Hz ngắt cực nhanh (35ms) | Tiếng quét UI scanner, xác nhận hệ thống AI đã phân tích xong. |
| **Hologram** | `hologram.mp3` | Dao động pha sci-fi 12Hz kèm tia laser | Khi giới thiệu tính năng AI thế hệ mới, đồ họa công nghệ quét qua. |
| **Error** | `error.mp3` | Hai hồi còi cảnh báo bất hòa âm (170Hz + 225Hz)| Khi người nói chỉ ra "lỗi sai", "điều cấm kỵ", "sai lầm khi quay". |
| **Glitch** | `glitch.mp3` | Tiếng nhiễu sóng gián đoạn (bitcrushed) | Hiệu ứng giật hình nhẹ, chuyển mạch suy nghĩ, bẻ cua luận điểm. |

---

### 4. NHẤN MẠNH (Punch / Impact / Accents / Reward)
Tạo điểm neo cảm xúc mạnh mẽ nhất cho người xem tại các cao trào.

| Tên SFX | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong `/thuy-style-oneshot` |
| :--- | :--- | :--- | :--- |
| **Highlight** | `highlight.mp3` | Tiếng ma sát bút dạ quang quẹt trên giấy | Đúng lúc từ khóa đổi sang màu vàng `#FFE600` trong câu nói. |
| **Ding** | `ding.mp3`, `bell-bright.mp3` | Chuông vàng ngân trong vắt, ngân dài | Ý tưởng sáng giá lóe lên, kết quả xuất sắc, điểm mấu chốt tích cực. |
| **Hit** | `hit.mp3` (`impact-hard`), `boom.mp3` | Cú đấm bass siêu trầm uy lực (<80Hz) | Stat-Punch: Khi hiện chữ số khổng lồ (VD: **`100% TỰ ĐỘNG`**). |
| **Correct** | `correct.mp3` | Hợp âm tam giác trưởng đi lên (C-E-G-C) | Đưa ra giải pháp đúng, công thức chuẩn, khẳng định thành công. |

---

### 5. CHUYỂN CẢNH & KHÔNG GIAN (Transitions & Scene Shifts)
Làm mượt mà các bước cắt cảnh hoặc thay đổi không gian bàn luận.

| Tên SFX | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong `/thuy-style-oneshot` |
| :--- | :--- | :--- | :--- |
| **Transition punch**| `transition-punch.mp3` | Whoosh gió mạnh kết hợp bass thud nhẹ | Chuyển sang B-Roll toàn màn hình (1080×1920) phá vỡ nhịp nói. |
| **Camera shutter** | `camera-shutter.mp3` | Tiếng trập màn trập máy ảnh cơ 2 nhịp | Đưa ra bằng chứng chụp màn hình, ảnh thực tế, minh chứng rõ ràng. |
| **Paper slide** | `paper-slide.mp3` | Tiếng lướt giấy mượt mà êm ái | Khi lật sang ý tiếp theo trong kịch bản phân tầng. |

---

## 3. BẢNG ÁNH XẠ TỰ ĐỘNG CHO PHONG CÁCH `/thuy-style-oneshot`

Agent khi lập kế hoạch dựng (`generate-edl.py` hoặc `host-plan.json`) sẽ tự động ánh xạ theo ma trận ngữ nghĩa sau:

```
TÌNH HUỐNG NỘI DUNG                              SFX TỰ ĐỘNG GẮN KÈM
─────────────────────────────────────────────────────────────────────────────
• Hook mở đầu (0 - 3s)                     ──>  impact-hard + whoosh-fast
• Headline Style 3 (Split Contrast dòng 1) ──>  swish
• Headline Style 3 (Split Contrast dòng 2) ──>  highlight (bôi vàng từ khóa)
• Headline Style 1 (3-Tier từ khóa chính)  ──>  ding (chuông vàng ngân)
• Headline Style 2 (Stat Punch số khổng lồ)──>  hit (impact bass sâu)
• B-Roll Fullscreen xuất hiện              ──>  transition-punch
• B-Roll Bullet row 1, 2, 3 lần lượt hiện  ──>  pip (hoặc keyboard-click)
• Người nói nhắc đến "Lỗi / Sai / Vấp"    ──>  error (tiếng buzzer đỏ)
• Người nói nhắc đến "Công cụ / AI / Code" ──>  typing-1 (hoặc hologram)
• Người nói nhắc đến "Đúng / Chuẩn / Tốt"  ──>  correct
• CTA kêu gọi cuối video                   ──>  bell-bright + pop
```

---

## 4. QUY CHUẨN ÂM LƯỢNG (MIXING SPECIFICATION)

Để đảm bảo âm thanh chuyên nghiệp chuẩn phát sóng mạng xã hội:
- **Giọng nói (Dialogue/Voice)**: Chuẩn `-14 LUFS` (Peak tối đa `-1.0 dB`).
- **SFX Impact/Hit**: Đặt âm lượng tương đối ở mức `0.65 – 0.75` (Peak `-6.0 dB`).
- **SFX UI (Click/Pip/Tick)**: Đặt âm lượng `0.45 – 0.55` (Peak `-12.0 dB`).
- **SFX Foley/Highlight/Paper**: Đặt âm lượng `0.50 – 0.58`.
- **Sidechain / Auto-ducking**: Khi SFX Impact nổ ra cùng lúc với lời nói, hệ thống tự động cân bằng dải tần để giọng người nói luôn giữ được độ sáng và rõ chữ 100%.
