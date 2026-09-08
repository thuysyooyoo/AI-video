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
6. **AI Suy Luận Ngữ Cảnh Từng Lần Theo Mô Tả SFX (Semantic Contextual Selection)**:
   - Tuyệt đối KHÔNG chọn luân phiên máy móc, và NGHIÊM CẤM thói quen lười biếng chỉ chọn đi chọn lại 1-2 SFX mặc định (`whoosh`, `pop`, `impact`).
   - Tại **từng thời điểm xuất hiện visual, từ khóa hay bước chuyển**, AI BẮT BUỘC phải đọc kỹ câu nói của người thuyết trình, phân tích cảm xúc và mục tiêu truyền tải, đối chiếu với cột **Đặc tính âm thanh** và **Ứng dụng chuẩn xác trong dựng video** trong bảng 45+ mẫu dưới đây để lựa chọn âm thanh ăn khớp và đắt giá nhất.

---

## 2. HỆ THỐNG 6 DANH MỤC SFX CHUẨN HÓA (45+ MẪU: ANH SẮC + KOBE MEDIA + TYPING-1)

Hệ thống âm thanh được trích xuất và chuẩn hóa 100% theo các video tham chiếu chất lượng cao (Anh Sắc & Kobe Media) ở định dạng CBR 320kbps:

### 1. NGÀNH CÔNG NGHỆ (Tech / Cyber / UI Interactions)
Tạo không khí hiện đại, công nghệ cao, thao tác lập trình, trí tuệ nhân tạo (AI).

| Tên SFX trên video | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong dựng video |
| :--- | :--- | :--- | :--- |
| **Notification** | `tech-notification.mp3` | Chuông thông báo công nghệ 2 nhịp trong vắt | Xuất hiện thông báo, badge tính năng mới, popup. |
| **Mouse Click** | `tech-mouse-click.mp3` | Click chuột vi công tắc đanh gọn sắc bén | Minh họa thao tác chọn, click chuột, toggle setting. |
| **Keyboard Typing** | `tech-keyboard-typing.mp3` | Đoạn gõ phím cơ dồn dập (0.58s) | Xuất hiện dòng code, câu lệnh prompt AI, gõ text. |
| **Typing 1 (Dài)** | `typing-1.mp3` | Chuỗi gõ phím liên tục chân thực (16s) | Âm nền cho phân cảnh mô tả quy trình viết kịch bản, gõ prompt dài. |
| **Toggle** | `tech-toggle.mp3` | Bật/tắt công tắc vi mạch cực gọn (0.11s) | Bật/tắt tùy chọn, tick checkbox, kích hoạt switch. |
| **Glitch** | `tech-glitch.mp3` | Nhiễu sóng kỹ thuật số ngắt quãng | Bẻ cua luận điểm, hiệu ứng giật hình, đổi chủ đề. |
| **Digital Loading** | `tech-digital-loading.mp3` | Quét radar nạp dữ liệu hệ thống (1.61s) | AI đang xử lý dữ liệu, render progress, quét phân tích. |
| **Ding (Chime)** | `chime-ding.mp3` | Tiếng chuông ding thanh thoát, trong vắt (0.53s) | Bật mí ý tưởng hay, mẹo vặt, gợi mở thủ thuật thông minh. |

---

### 2. HIỆU ỨNG CHUYỂN CẢNH (Transitions / Shifts)
Làm mượt mà các bước cắt cảnh, lướt chữ headline hoặc chuyển đổi không gian.

> [!IMPORTANT]
> **Quy chuẩn chuyển cảnh video**: Khi thực hiện chuyển cảnh giữa các cảnh quay hoặc B-roll (trong `tracks.transitions`), **BẮT BUỘC** sử dụng 1 trong 9 hiệu ứng CapCut kèm SFX khóa cứng 1:1 quy định tại [transitions-guide.md](transitions-guide.md). Các SFX dưới đây chủ yếu dùng cho chuyển động đồ họa, thẻ headline trượt vào hoặc âm thanh môi trường.

| Tên SFX trên video | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong dựng video |
| :--- | :--- | :--- | :--- |
| **Woosh #1** | `transition-woosh-1.mp3` | Gió lướt mở màn chuyển cảnh êm mượt | Headline trượt vào, thẻ đồ họa lướt ngang. |
| **Woosh #2** | `transition-woosh-2.mp3` | Gió xoáy lướt nhanh dứt khoát | Cắt cảnh nhanh (quick cut), whip-pan, swipe. |
| **Kobe Woosh** | `kobe-woosh.mp3` | Gió lướt dứt khoát đanh nét phong cách Kobe Media (0.85s) | Cắt cảnh swipe/slide nhanh, chuyển ý dứt khoát. |
| **Deep Woosh** | `transition-deep-woosh.mp3` | Gió trầm cinematic có sức nặng | Chuyển cảnh B-roll toàn màn hình, chuyển ý lớn. |
| **Camera Shutter** | `camera-shutter.mp3` | Màn trập máy ảnh cơ 2 nhịp tách tách | Chụp màn hình minh chứng, hiện ảnh screenshot. |
| **Film Burn** | `film-burn.mp3` | Tiếng phim nhựa cháy xèo cổ điển | Chuyển cảnh retro, vintage, đổi góc quay nghệ thuật. |
| **Reverse Playback** | `reverse-playback.mp3` | Tua ngược băng từ / rewind | Tua lại tình huống, flashback, nhớ lại quá khứ. |

---

### 3. HIỆU ỨNG FILM / ĐIỆN ẢNH (Cinematic / Drama / Tension)
Tạo độ kịch tính, đẩy cao nhịp cảm xúc và độ sâu không gian.

| Tên SFX trên video | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong dựng video |
| :--- | :--- | :--- | :--- |
| **Metallic Rise** | `cinematic-metallic-rise.mp3` | Kim loại kéo căng tạo kịch tính dồn dập | Dẫn dắt đến cao trào câu nói, đếm ngược trước khi hé lộ. |
| **Boom** | `cinematic-boom.mp3` | Cú nổ siêu trầm lan tỏa không gian | Hook mở đầu video, khẳng định chân lý cốt lõi. |
| **Hit** | `cinematic-hit.mp3` | Cú đấm impact uy lực dứt khoát | Stat-Punch: Khi hiện con số khổng lồ (VD: 100%, 0 ĐỒNG). |
| **Suspense** | `cinematic-suspense.mp3` | Kéo căng hồi hộp, dồn dập suspense (3.59s) | Khoảng thời gian nín thở chuẩn bị hé lộ bí mật/sự thật sốc. |
| **Among Us Reveal** | `among-us-reveal.mp3` | Hợp âm kèn Among Us role reveal kịch tính (2.42s) | Vạch trần kẻ mạo danh, cú twist lật tẩy sự thật bất ngờ. |
| **Remembering Woosh** | `remembering-woosh.mp3` | Gió hồi tưởng hư ảo vang vọng | Kể câu chuyện quá khứ, chiêm nghiệm, bài học rút ra. |

---

### 4. HIỆU ỨNG HÀNH ĐỘNG (Foley / Action / Real Life)
Tái hiện âm thanh thực tế đời sống, tactile và gần gũi.

| Tên SFX trên video | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong dựng video |
| :--- | :--- | :--- | :--- |
| **Brushing** | `foley-brushing.mp3` | Quẹt chổi chải ma sát giòn dã | Thao tác highlight bôi vàng từ khóa, quét cọ. |
| **Deck Brushing** | `foley-deck-brushing.mp3` | Cọ sàn chà bề mặt gỗ chắc nịch | Chà rửa, lau dọn, chuẩn bị không gian làm việc. |
| **Sponge** | `foley-sponge.mp3` | Tiếng bóp mút xốp ướt | Làm sạch, tẩy xóa vết bẩn, thao tác thủ công. |
| **Boiling Juicy Dishes**| `foley-boiling-dishes.mp3` | Thức ăn sôi sục xèo xèo thơm lừng | Video ẩm thực, nấu nướng, công thức bùng nổ. |
| **Stir Ice in Glass** | `foley-stir-ice-glass.mp3` | Khuấy đá lách cách ly thủy tinh thanh mát | Thư giãn, cafe làm việc, lifestyle, chill vlog. |

---

### 5. HIỆU ỨNG HOẠT HÌNH / RETRO & VOCAL MEME (Cartoon / Fun / Comic)
Tạo điểm nhấn vui tươi, châm biếm nhẹ nhàng, phá vỡ sự khô khan.

| Tên SFX trên video | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong dựng video |
| :--- | :--- | :--- | :--- |
| **Pop** | `cartoon-pop.mp3` | Tiếng bóng nảy bong bóng vui nhộn | Thẻ tag nhỏ hiện ra, icon biểu tượng bung nở. |
| **Running** | `cartoon-running.mp3` | Tiếng bước chân hoạt hình líu díu | Hối hả, vội vã, chạy deadline, chuyển cảnh nhanh. |
| **Punch** | `cartoon-punch.mp3` | Cú đấm truyện tranh comic ngộ nghĩnh | Điểm nhấn bất ngờ, va đập hài hước. |
| **Thump with Boing** | `cartoon-thump-boing.mp3`| Cú đập nặng kèm lò xo tưng tưng (0.60s)| Va chạm hài hước, va vào tường, trúng đòn bất ngờ. |
| **Duck Quack** | `cartoon-duck-quack.mp3` | Tiếng vịt kêu cạp cạp ngộ nghĩnh (0.26s) | Tình huống ngô nghê, hài hước, châm biếm câu hỏi ngây ngô. |
| **Ascending Whistle** | `slide-whistle-up.mp3` | Còi trượt vút lên cao nhanh gọn (0.47s) | Tăng tốc đột ngột, phóng vọt lên, thăng tiến nhanh chóng. |
| **Slide Whistle** | `cartoon-slide-whistle.mp3` | Còi trượt tuýt lên cao dài tinh nghịch | Tăng vọt, tăng giá trị, bay bổng. |
| **Boing** | `cartoon-boing.mp3` | Tiếng lò xo tưng tưng bung nảy | Nảy sinh ý tưởng vui, bật tung năng lượng. |
| **Womp Womp** | `cartoon-womp-womp.mp3` | Kèn đồng tụt hứng kinh điển (fail) | Sai lầm, thất bại hài hước, vấp ngã người nói tự nhận. |
| **Blinking** | `cartoon-blinking.mp3` | Tiếng chớp mắt chuông gõ lanh lảnh | Bất ngờ, ngơ ngác, thắc mắc, tò mò. |
| **Uh (Vocal)** | `comic-vocal-uh.mp3` | Tiếng thốt "Uh?!" / "Hả?!" ngơ ngác (0.38s)| Nghe câu hỏi vô lý, gặp tình huống bất thường, nghi hoặc. |
| **Yeet (Vocal)** | `comic-vocal-yeet.mp3` | Tiếng hô "YEET!" ném đồ đi (0.57s) | Vứt bỏ tư duy cũ, ném rào cản đi, loại bỏ thứ vô dụng. |

---

### 6. HIỆU ỨNG GAME (8-Bit / Arcade / Gamification)
Kích hoạt dopamine bằng âm thanh phần thưởng, thành tích, đúng/sai.

| Tên SFX trên video | File Audio | Đặc tính âm thanh | Ứng dụng chuẩn xác trong dựng video |
| :--- | :--- | :--- | :--- |
| **Correct** | `game-correct.mp3` | Ting ting trả lời đúng gameshow (0.81s) | Khẳng định phương án đúng, xác thực thông tin chính xác. |
| **Wrong Buzzer** | `game-wrong-buzzer.mp3` | Tiếng còi buzzer rè báo sai (0.85s) | Báo lỗi, làm sai quy trình, cảnh báo điều cấm kỵ. |
| **Coin Collect** | `game-coin-collect.mp3` | Tiếng nhặt đồng xu vàng 8-bit | Nhận thưởng, kiếm tiền, tiết kiệm chi phí, bonus. |
| **Power Up** | `game-power-up.mp3` | Tăng sức mạnh âm giai đi lên | Nâng cấp bản thân, sử dụng công cụ AI tăng tốc x10. |
| **Level Up** | `game-level-up.mp3` | Hợp âm thăng cấp rạng rỡ thành công | Đạt cột mốc mới, giải pháp chuẩn, chiến thắng. |
| **Health Low Beeps** | `game-health-low.mp3` | Cảnh báo máu đỏ sắp cạn bíp bíp | Cảnh báo khẩn cấp, nguy cơ mất tiền/thất bại. |
| **Pixel Explosions** | `game-pixel-explosion.mp3` | Nổ hạt pixel 8-bit vỡ vụn | Phá bỏ rào cản cũ, đập tan lối mòn. |
| **Level Complete** | `game-level-complete.mp3` | Chuông hoàn thành màn chơi chiến thắng | Kêu gọi hành động CTA cuối video, chốt hạ thành công. |

---

## 3. BẢNG ÁNH XẠ TỰ ĐỘNG CHO PIPELINE DỰNG VIDEO

```
TÌNH HUỐNG NỘI DUNG                              SFX TỰ ĐỘNG GẮN KÈM
─────────────────────────────────────────────────────────────────────────────
• Hook mở đầu (0 - 3s)                     ──>  cinematic-hit + transition-woosh-2
• Headline Style 3 (Dòng 1 trượt vào)      ──>  transition-woosh-1
• Headline Style 3 (Dòng 2 bôi vàng)       ──>  foley-brushing
• Headline Style 1 (Từ khóa chính)         ──>  tech-notification
• Headline Style 2 (Stat Punch số khổng lồ)──>  cinematic-hit (hoặc cinematic-boom)
• B-Roll Fullscreen xuất hiện              ──>  transition-deep-woosh
• B-Roll Bullet row 1, 2, 3 lần lượt hiện  ──>  tech-toggle (hoặc tech-mouse-click)
• Nhắc đến "Lỗi / Thất bại / Sai lầm"      ──>  cartoon-womp-womp (hoặc game-health-low)
• Nhắc đến "Công cụ / AI / Viết prompt"    ──>  tech-keyboard-typing (hoặc typing-1)
• Nhắc đến "Đúng / Giải pháp / Thành công" ──>  game-level-up (hoặc game-power-up)
• Nhắc đến "Kiếm tiền / Chi phí / Doanh thu"──> game-coin-collect
• CTA kêu gọi hành động cuối video         ──>  game-level-complete + cartoon-pop
```

---

## 4. QUY CHUẨN ÂM LƯỢNG (MIXING SPECIFICATION)

- **Giọng nói (Dialogue/Voice)**: Chuẩn `-14 LUFS` (Peak tối đa `-1.0 dBFS`).
- **SFX Impact / Hit / Boom**: Đặt âm lượng tương đối ở mức `0.65 – 0.75` (Peak `-6.0 dBFS`).
- **SFX UI (Click / Toggle / Notification)**: Đặt âm lượng `0.45 – 0.55` (Peak `-12.0 dBFS`).
- **SFX Foley / Brushing / Ice**: Đặt âm lượng `0.50 – 0.60`.
- **SFX Game / Cartoon**: Đặt âm lượng `0.55 – 0.65`.
