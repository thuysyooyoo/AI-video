# HƯỚNG DẪN QUẢN LÝ & TỰ ĐỘNG CHỌN NHẠC NỀN (BGM SOUNDTRACK GUIDE)
## Dành cho TISA AI EDITOR AGENT

Tài liệu này quy định quy tắc lựa chọn và cấu hình nhạc nền (BGM) tự động cho video ngắn dựng bằng TISA AI EDITOR AGENT.

---

## 1. NGUYÊN TẮC VÀNG VỀ NHẠC NỀN (BGM) TRONG TALKING-HEAD

1. **Ưu tiên giọng nói nhân vật (Voice First)**:
   - Tiếng người nói là nội dung chính. Nhạc nền chỉ đóng vai trò giữ nhịp (pacing), tạo cảm xúc (mood) và giữ chân người xem (retention).
   - Âm lượng người nói (`clipVolume`) luôn phải đặt là **`1.0`** (100%).
   - Âm lượng nhạc nền (`volume`) đối với video talking-head chỉ được dao động từ **`0.18` đến `0.25`**. Nếu nhạc beat có bass dày (trap, hip-hop), đặt `0.18 - 0.20`; nếu là piano, acoustic nhẹ nhàng, đặt `0.22 - 0.25`.
2. **Ưu tiên bản Beat / Instrumental không lời**:
   - 100% bài trong thư viện `public/bgm/` là bản Beat / Instrumental đã trích xuất sạch sẽ để tránh việc lời hát đè lên lời nói của nhân vật.
3. **Mềm mại khi kết thúc (Fade-out)**:
   - Luôn đặt `fadeOutSec: 1.5` để bài nhạc hạ âm lượng êm ái ở cuối video thay vì ngắt đột ngột.

---

## 2. BẢN ĐỒ PHÂN LOẠI & TỪ KHÓA NHẬN DIỆN (4 NHÓM)

Hệ thống thư viện BGM chuẩn local được đặt tại `public/bgm/` gồm 4 nhóm:

### Nhóm 1: `01_ke_chuyen_cam_xuc` (Storytelling / Emotional)
- **Mood:** Sâu lắng, hoài niệm, nhẹ nhàng, mở lòng, tự sự cá nhân.
- **Từ khóa nhận diện trong transcript:** *tâm sự, kỷ niệm, ngày xưa, bài học đắt giá, cảm xúc, nỗi buồn, trải nghiệm, thất bại, chia tay, gia đình, bạn bè, hối tiếc, nhận ra, cuộc đời...*
- **Các track lựa chọn:**
  - `bgm/01_ke_chuyen_cam_xuc/Gibran Alcocer - Idea 15.mp3` *(Ưu tiên số 1 cho video cao trào cảm xúc, triết lý)*
  - `bgm/01_ke_chuyen_cam_xuc/Drake - Hotline Bling (Instrumental).mp3` *(Tâm sự chill, nhẹ nhàng, đều nhịp)*
  - `bgm/01_ke_chuyen_cam_xuc/Steve Lacy - Dark Red (Instrumental).mp3` *(Lo-fi ấm áp, self-reflection)*
  - `bgm/01_ke_chuyen_cam_xuc/Hal Walker - Low Key Gliding.mp3` *(Mộc mạc, thư thái, gần gũi)*
  - `bgm/01_ke_chuyen_cam_xuc/Kanye West - Runaway (Piano Instrumental).mp3` *(Piano đơn độc, suy tư sâu sắc)*
  - `bgm/01_ke_chuyen_cam_xuc/Empire of the Sun - Walking on a Dream (Instrumental).mp3` *(Bay bổng, ước mơ, hoài bão)*

---

### Nhóm 2: `02_giao_duc_kien_thuc` (Education / Knowledge / Tech / Business)
- **Mood:** Nhịp điệu nhanh, dứt khoát, bass đanh thép, năng lượng cao, giữ retention tối đa.
- **Từ khóa nhận diện trong transcript:** *hướng dẫn, cách làm, bí quyết, mẹo, tips, công cụ, AI, ChatGPT, lập trình, kiếm tiền, kinh doanh, marketing, sai lầm, phân tích, chiến lược, tư duy, hiệu suất, quy trình, tự động hóa...*
- **Các track lựa chọn:**
  - `bgm/02_giao_duc_kien_thuc/Kendrick Lamar - Not Like Us (Instrumental).mp3` *(Ưu tiên số 1 cho video nhịp nhanh, cuốn hút ngay giây đầu)*
  - `bgm/02_giao_duc_kien_thuc/Lil Uzi Vert - 20 Min (Instrumental).mp3` *(Synth arpeggio cực kỳ giữ nhịp nói đều đặn)*
  - `bgm/02_giao_duc_kien_thuc/Yeat - Money So Big (Instrumental).mp3` *(Rage beat, bass 808 đập mạnh, tạo uy lực cho tech/tips)*
  - `bgm/02_giao_duc_kien_thuc/Future & Metro Boomin - Like That (Instrumental).mp3` *(Dứt khoát, quyền lực, thuyết phục)*
  - `bgm/02_giao_duc_kien_thuc/Yeat - Vampire Heart (Instrumental).mp3` *(Beat điện tử hiện đại, bí ẩn, phong cách AI/cyber)*
  - `bgm/02_giao_duc_kien_thuc/Bakar - Hell N Back (Instrumental).mp3` *(Tươi vui, giúp kiến thức chuyên môn trở nên gần gũi)*

---

### Nhóm 3: `03_vlog_day_in_life` (Vlog / Lifestyle / Daily)
- **Mood:** Thư giãn, thời thượng, aesthetic, tự nhiên, nhịp nhàng đời thường.
- **Từ khóa nhận diện trong transcript:** *một ngày của mình, hôm nay, đi chơi, du lịch, cafe, ăn uống, unboxing, trang phục, dạo phố, làm việc tại nhà, thói quen hàng ngày, cuối tuần...*
- **Các track lựa chọn:**
  - `bgm/03_vlog_day_in_life/Arctic Monkeys - I Wanna Be Yours (Instrumental).mp3` *(Ưu tiên số 1 cho vlog cinematic, chill aesthetic)*
  - `bgm/03_vlog_day_in_life/Frank Ocean - Lost (Instrumental).mp3` *(Vibe năng động, du lịch, đường phố tràn đầy sức sống)*
  - `bgm/03_vlog_day_in_life/M.I.A. - Paper Planes (Instrumental).mp3` *(Nhịp điệu kinh điển cho các cảnh quay di chuyển, hành trình)*
  - `bgm/03_vlog_day_in_life/JID - Surround Sound (Instrumental).mp3` *(Hip-hop hiện đại, trẻ trung, cá tính)*
  - `bgm/03_vlog_day_in_life/Cochise & $NOT - Tell Em (Instrumental).mp3` *(Cloud trap bắt tai thế hệ Gen Z)*
  - `bgm/03_vlog_day_in_life/Metro Boomin - Space Cadet (Instrumental).mp3` *(Bass lướt êm ái, hợp cảnh quay b-roll)*
  - `bgm/03_vlog_day_in_life/Aurora - Runaway (Instrumental).mp3` *(Hoàng hôn, thiên nhiên, không gian rộng mở)*

---

### Nhóm 4: `04_dong_luc_cam_xuc` (Motivation / Inspiration / Workout / Success)
- **Mood:** Bứt phá giới hạn, kỷ luật, năng lượng chiến thắng, thúc đẩy hành động ngay.
- **Từ khóa nhận diện trong transcript:** *thành công, kỷ luật, cố gắng, nỗ lực, dậy sớm, không từ bỏ, thay đổi bản thân, động lực, tập luyện, thể thao, gym, kiên trì, mục tiêu, bứt phá, chiến thắng...*
- **Các track lựa chọn:**
  - `bgm/04_dong_luc_cam_xuc/VOJ & Narvent - Memory Reboot.mp3` *(Ưu tiên số 1 cho video động lực, gym, sigma, bứt phá giới hạn)*
  - `bgm/04_dong_luc_cam_xuc/Tommy Richman - Million Dollar Baby (Instrumental).mp3` *(Funk R&B bùng nổ, cảm giác chiến thắng đẳng cấp)*
  - `bgm/04_dong_luc_cam_xuc/Phoenix - 1901 (Instrumental).mp3` *(Nhịp trống dồn dập, thúc giục hành động lập tức)*
  - `bgm/04_dong_luc_cam_xuc/Peter Bjorn and John - Young Folks (Instrumental).mp3` *(Huýt sáo lạc quan, năng lượng ngày mới)*
  - `bgm/04_dong_luc_cam_xuc/Dido - Thank You (Instrumental).mp3` *(Tri ân, kiên định, sâu sắc)*
  - `bgm/04_dong_luc_cam_xuc/Ghostwriter - Heart On My Sleeve.mp3` *(Độc đáo, bắt tai, lôi cuốn)*

---

## 3. QUY TRÌNH TỰ ĐỘNG LỰA CHỌN CỦA AGENT

Khi thực hiện lệnh dựng video (`talking-head` hoặc `b-roll`):

1. **Kiểm tra yêu cầu người dùng:**
   - Nếu người dùng cung cấp file nhạc hoặc chỉ định rõ tên bài/link → Sử dụng bài của người dùng.
   - Nếu người dùng **KHÔNG gợi ý nhạc nền bên ngoài** → **Bắt buộc tự động chọn 1 bài từ kho `public/bgm/`**.
2. **Phân tích nội dung (Auto Match):**
   - Đọc transcript của video để xác định thể loại chính thuộc 1 trong 4 nhóm trên.
   - Chọn track ưu tiên hoặc track có nhịp điệu tương xứng với tốc độ nói của nhân vật (nói nhanh → chọn beat nhóm Giáo dục như `Not Like Us` hoặc `20 Min`; tâm sự chậm rãi → chọn `Idea 15` hoặc `Hotline Bling`).
3. **Khai báo trong `edl.json`:**
   ```json
   {
     "music": {
       "src": "bgm/02_giao_duc_kien_thuc/Kendrick Lamar - Not Like Us (Instrumental).mp3",
       "volume": 0.22,
       "clipVolume": 1.0,
       "loop": true,
       "startSec": 0,
       "fadeOutSec": 1.5
     }
   }
   ```
4. **Thông báo cho người dùng khi hoàn tất:**
   - Nêu rõ bài nhạc nền đã tự động chọn (tên bài, nghệ sĩ, lý do chọn hợp nội dung) và hướng dẫn cách đổi bài khác nếu muốn.
