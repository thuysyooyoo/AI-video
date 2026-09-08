# Quy Chuẩn Ghép Cặp 9 Hiệu Ứng Chuyển Cảnh CapCut & SFX Khóa Cứng

> [!IMPORTANT]
> **Single Source of Truth (Nguồn Chân Lý Duy Nhất)**:
> Toàn bộ 9 hiệu ứng chuyển cảnh CapCut và tệp SFX khóa cứng 1:1, thời lượng frame (@30fps), âm lượng và cơ chế dựng 2 lớp được định nghĩa và quản lý tập trung tại:
>
> 1. **Mã nguồn thực thi (Code Registry)**: [`src/components/capcut-transitions-registry.ts`](../src/components/capcut-transitions-registry.ts)
> 2. **Component dựng 2 lớp**: [`src/components/CapCutTwoLayerTransitions.tsx`](../src/components/CapCutTwoLayerTransitions.tsx)
> 3. **Tài liệu hướng dẫn Agent**: [`references/transitions-guide.md`](../references/transitions-guide.md) (hoặc `.agents/skills/tisa-ai-editor-agent/references/transitions-guide.md`)

---

## Danh Sách 9 Cặp Hiệu Ứng & SFX (Tra Cứu Nhanh)

| STT | Mã Hiệu Ứng | Tên CapCut | SFX Khóa Cứng | Frame (@30fps) |
|:---:|---|---|---|:---:|
| 1 | `glare-ii` | Glare II | `sfx/glare-burn.mp3` | 16f (~0.53s) |
| 2 | `phone-reveal` | Phone Reveal | `sfx/phone-shutter-1.mp3` | 22f (~0.73s) |
| 3 | `paper-ball` | Paper Ball | `sfx/paper-ball-yt.mp3` | 20f (~0.67s) |
| 4 | `glitch` | Glitch | `sfx/glitch-cut.mp3` | 14f (~0.47s) |
| 5 | `fade-down` | Fade Down | `sfx/fade-woosh.mp3` | 14f (~0.47s) |
| 6 | `blink` | Blink | `sfx/click.mp3` | 8f (~0.27s) |
| 7 | `wave-right` | Wave Right | `sfx/wave-sparkle.mp3` | 16f (~0.53s) |
| 8 | `swipe-left` | Swipe Left | `sfx/whoosh-fast.mp3` | 10f (~0.33s) |
| 9 | `comic-cut` | Comic Cut | `sfx/comic-paper-tear.mp3` | 20f (~0.67s) |

- **Anti-Bleed Rule**: SFX kết thúc cùng lúc với hiệu ứng (volume dốc về 0.0 RMS ở 2 frame cuối, unmount Sequence).
- **Lệnh cấm**: Tuyệt đối không sử dụng bất kỳ hiệu ứng chuyển cảnh nào ngoài danh mục 9 hiệu ứng trên.
- **Chi tiết & EDL Schema**: Xem toàn bộ hướng dẫn cấu trúc EDL JSON và mẫu khai báo tại [`references/transitions-guide.md`](../references/transitions-guide.md) (hoặc `.agents/skills/tisa-ai-editor-agent/references/transitions-guide.md`).

