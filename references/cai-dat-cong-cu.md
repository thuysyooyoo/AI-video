# Cài đặt công cụ

## Mục lục

1. Thành phần bắt buộc
2. Cài skill vào Codex
3. Cài công cụ theo hệ điều hành
4. Cài thư viện dự án
5. Kiểm tra hoàn tất
6. Skill hỗ trợ nên có
7. Khắc phục lỗi phổ biến

## 1. Thành phần bắt buộc

| Thành phần | Mức tối thiểu | Vai trò |
|---|---:|---|
| Codex desktop/CLI | bản hiện hành | Điều phối quy trình và lập kế hoạch dựng |
| Python | 3.10+ | Whisper, OpenCV và pipeline |
| Node.js | 18+ | Remotion và giao diện xem trước |
| npm | đi cùng Node | Cài và chạy thư viện JavaScript |
| ffmpeg + ffprobe | bản có trên PATH | Đọc, cắt, ghép và kiểm tra media |
| Dung lượng trống | tối thiểu 3 GB | Thư viện, model Whisper và file render |

Khuyến nghị Python 3.11 và Node.js LTS. Lần đầu faster-whisper có thể tải model khoảng vài trăm MB.

## 2. Cài skill vào Codex

Giải nén ZIP sao cho có cấu trúc:

```text
~/.codex/skills/tisa-ai-editor-agent/SKILL.md
```

Windows tương đương:

```text
%USERPROFILE%\.codex\skills\tisa-ai-editor-agent\SKILL.md
```

Khởi động lại Codex sau khi chép skill. Gọi thử: `Dùng $tisa-ai-editor-agent kiểm tra bộ dựng video đã sẵn sàng chưa.`

## 3. Cài công cụ theo hệ điều hành

Cho phép Codex tự phát hiện hệ điều hành và trình quản lý gói. Không chạy đồng thời nhiều trình cài cho cùng một công cụ.

### macOS

Nếu có Homebrew:

```bash
brew install node python@3.11 ffmpeg
```

### Windows

Mở PowerShell thường; chỉ dùng quyền quản trị khi trình cài yêu cầu:

```powershell
winget install OpenJS.NodeJS.LTS
winget install Python.Python.3.11
winget install Gyan.FFmpeg
```

Đóng và mở lại Codex/terminal để PATH được cập nhật.

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nodejs npm ffmpeg
```

Nếu Node từ kho hệ điều hành thấp hơn 18, dùng nguồn Node.js chính thức phù hợp hệ điều hành.

## 4. Cài thư viện dự án

Từ thư mục `tisa-ai-editor-agent`:

```bash
python scripts/setup.py
```

Script tạo `.venv`, cài Python packages bằng virtual environment và cài Node packages bằng `npm ci`. Nếu muốn chỉ kiểm tra mà không cài:

```bash
python scripts/setup.py --check-only
```

Khi chạy thủ công sau đó, ưu tiên Python trong `.venv`:

- macOS/Linux: `.venv/bin/python`
- Windows: `.venv\Scripts\python.exe`

Codex phải tự chọn đúng executable, không yêu cầu người dùng kích hoạt môi trường ảo nếu có thể chạy bằng đường dẫn tuyệt đối.

## 5. Kiểm tra hoàn tất

Chạy lần lượt:

```bash
python scripts/doctor.py
npm run typecheck
```

Điều kiện đạt:

- Doctor trả mã 0.
- Node, Python, ffmpeg và ffprobe được nhận diện.
- `faster_whisper`, `cv2`, `numpy` import được.
- `node_modules/remotion` tồn tại.
- TypeScript không báo lỗi.

## 6. Skill hỗ trợ nên có

Skill này tự vận hành được. Nếu danh mục Codex có sẵn, có thể bổ sung các skill sau để tăng khả năng xử lý chuyên sâu:

- `remotion-best-practices`: định tuyến các quy tắc Remotion.
- `remotion-captions`: caption và đồng bộ lời.
- `remotion-multimedia`: đọc, chuyển đổi và xử lý media.
- `remotion-render`: xuất video.
- `computer-use`: mở/xem video bằng giao diện khi cần QA thủ công.

Chỉ cài skill từ nguồn tin cậy và chỉ khi còn thiếu. Đây là tăng cường, không phải điều kiện chạy cơ bản.

## 7. Khắc phục lỗi phổ biến

- `ffmpeg not found`: cài ffmpeg, mở lại Codex rồi chạy doctor.
- `No module named faster_whisper`: dùng Python trong `.venv` hoặc chạy lại `scripts/setup.py`.
- `remotion not found`: chạy `npm ci` tại thư mục skill.
- Model tải lâu: chờ lần chạy đầu; kiểm tra mạng và dung lượng trống.
- Caption tiếng Việt kém: chạy `--stt-model medium`; đổi lại tốc độ chậm hơn.
- Render thiếu RAM: đóng ứng dụng nặng, giảm độ dài clip hoặc render từng phần.
