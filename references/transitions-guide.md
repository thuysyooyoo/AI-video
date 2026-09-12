# Thư Viện Hiệu Ứng Chuyển Cảnh CapCut Khóa Cứng SFX (CapCut Transitions Guide)

Tài liệu này thuộc cơ sở tri thức (Knowledge Base) cốt lõi của dự án **TISA AI EDITOR AGENT**, preset **Thuy Style One Shot** và **Thuy Style Nhiều Cảnh**.

> [!CAUTION]
> **QUY TẮC BẮT BUỘC TUYỆT ĐỐI (NON-NEGOTIABLE RULE)**:
> 1. **MỤC ĐÍCH CHUYỂN CẢNH**: Chuyển cảnh CapCut phục vụ việc **chuyển đổi giữa các phân đoạn nội dung lớn (Section Boundaries)**: từ Giới thiệu sang các Luận điểm/Yếu tố, giữa từng Luận điểm, và từ Luận điểm cuối sang CTA/Kết bài. Neo trọn vẹn tại khoảng lặng (silence pause) giữa các câu.
> 2. **B-ROLL KHÔNG ÉP CHUYỂN CẢNH**: B-roll AI là hình ảnh minh họa ngữ cảnh (cutaway), hiển thị êm ái với Ken Burns slow zoom (1.02× -> 1.09×), **TUYỆT ĐỐI KHÔNG ép chèn hiệu ứng chuyển cảnh nặng ở mỗi lần B-roll xuất hiện**.
> 3. Khi chuyển cảnh, **CHỈ ĐƯỢC PHÉP SỬ DỤNG DUY NHẤT 1 TRONG 9 HIỆU ỨNG CAPCUT CHUẨN DƯỚI ĐÂY KÈM SFX CỐ ĐỊNH TƯƠNG ỨNG**.
> 4. **TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ HIỆU ỨNG TỰ SINH RA NÀO KHÁC**.
> 5. Mã nguồn và đăng ký trung tâm được lưu trữ chuẩn hóa tại:
>    - **Registry**: `src/components/capcut-transitions-registry.ts`
>    - **Core Transitions Component**: `src/components/CapCutTwoLayerTransitions.tsx`
>    - **Tài liệu chi tiết**: `docs/CAPCUT_TRANSITIONS_SFX_RULES.md`

---

## I. Danh Mục 9 Hiệu Ứng Chuyển Cảnh Chuẩn CapCut & Khóa Cứng SFX 1:1

| STT | Mã hiệu ứng (`type`) | Tên hiệu ứng CapCut | Cơ chế chuyển động 2 lớp (Visual Mechanics) | File SFX Khóa Cứng (`sfxPath`) | Frame (@30fps) | Thời lượng | Âm lượng |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| 1 | `glare-ii` | **Glare II** | Chớp lóa quang học vàng kem ấm tỏa từ tâm, đẩy sáng cực đại và hòa tan cảnh mới | `sfx/glare-burn.mp3` | 16 | 0.53s | 0.90 |
| 2 | `phone-reveal` | **Phone Reveal** | Khung iPhone 15 Pro viền titan bay từ xa vào màn hình, camera zoom xuyên qua kính để mở cảnh mới | `sfx/phone-shutter-1.mp3` | 22 | 0.73s | 0.95 |
| 3 | `paper-ball` | **Paper Ball** | Toàn bộ cảnh trước bị vo tròn co rúm thành quả cầu giấy 3D nát vụn, rồi rách toạc 360° bung cảnh mới | `sfx/paper-ball-yt.mp3` | 20 | 0.67s | 0.95 |
| 4 | `glitch` | **Glitch** | Cắt lát ngang 3 tầng tách rời, giật lệch vị trí sang hai bên & lệch quang sai màu RGB | `sfx/glitch-cut.mp3` | 14 | 0.47s | 0.85 |
| 5 | `fade-down` | **Fade Down** | Cảnh mới từ mép trên trượt rơi thẳng đứng xuống dưới theo gia tốc trọng lực kết hợp mờ dần | `sfx/fade-woosh.mp3` | 14 | 0.47s | 0.90 |
| 6 | `blink` | **Blink** | Hiệu ứng chớp mắt: 2 mí mắt cong màu đen khép chặt đúng tại tâm 50% rồi mở bừng ra | `sfx/click.mp3` | 8 | 0.27s | 0.95 |
| 7 | `wave-right` | **Wave Right** | Dải sóng lỏng sin hữu cơ quét từ trái sang phải mang theo bọt sóng mực trắng hé lộ cảnh mới | `sfx/wave-sparkle.mp3` | 16 | 0.53s | 0.90 |
| 8 | `swipe-left` | **Swipe Left** | Cảnh cũ bị vuốt trôi cực nhanh sang trái (-100%) kèm vệt sáng Kinetic Blade và motion blur | `sfx/whoosh-fast.mp3` | 10 | 0.33s | 0.95 |
| 9 | `comic-cut` | **Comic Cut** | Xé đôi ảnh theo đường răng cưa dọc giữa dạt sang hai bên, để lộ nền giấy truyện tranh chấm bi Manga Halftone | `sfx/comic-paper-tear.mp3` | 20 | 0.67s | 0.95 |

---

## II. Quy Tắc Ngắt Âm Thanh Dứt Điểm (Anti-Bleed Hard Cutoff Rule)

> [!IMPORTANT]
> **Hiệu ứng xong thì tiếng SFX phải dừng hẳn luôn:**
> - Tiếng SFX của hiệu ứng chuyển cảnh bắt buộc phải được giới hạn chính xác trong phạm vi khung hình chuyển cảnh (`durationInFrames`).
> - Trong 2 khung hình cuối cùng của chuyển cảnh, âm lượng SFX phải được nội suy (interpolate) dốc thẳng đứng về `0.0`.
> - Tuyệt đối không để âm thanh vang dội hoặc kéo dài tràn sang cảnh thoại kế tiếp.

---

## III. Hướng Dẫn Khai Báo Trong File EDL (JSON Schema)

Khi khai báo trong cấu trúc EDL JSON, mỗi transition trong `tracks.transitions` bắt buộc phải tự động kích hoạt SFX tương ứng trong `tracks.sfx` hoặc thông qua module phát tích hợp:

```json
{
  "tracks": {
    "transitions": [
      {
        "type": "phone-reveal",
        "startMs": 12000,
        "endMs": 12733,
        "durationFrames": 22
      },
      {
        "type": "paper-ball",
        "startMs": 24000,
        "endMs": 24667,
        "durationFrames": 20
      }
    ],
    "sfx": [
      {
        "file": "sfx/phone-shutter-1.mp3",
        "startMs": 12000,
        "volume": 0.95,
        "purpose": "phone-reveal transition lock"
      },
      {
        "file": "sfx/paper-ball-yt.mp3",
        "startMs": 24000,
        "volume": 0.95,
        "purpose": "paper-ball transition lock"
      }
    ]
  }
}
```

---

## IV. Lời Khuyên Ứng Dụng Thực Tế (Best Practices)

1. **Quy tắc 2–3 hiệu ứng chủ đạo**: Không dùng toàn bộ 9 hiệu ứng trong một video ngắn; chỉ chọn 2–3 hiệu ứng phù hợp nhất với phong cách (ví dụ: `glare-ii` + `swipe-left` + `glitch`) để tạo sự nhất quán thẩm mỹ.
2. **Đồng điệu màu thương hiệu**: Các hiệu ứng có ánh sáng (`glare-ii`, `glitch`) cần ăn khớp với dải màu vàng rực `#FFE600` đặc trưng của thương hiệu.
3. **Tuyệt đối tuân thủ Registry**: Không thêm effect name lạ hay tự viết hàm CSS chuyển cảnh tự do.
