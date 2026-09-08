/**
 * CAPCUT TRANSITIONS & SFX REGISTRY (KHO TRUNG TÂM HIỆU ỨNG & ÂM THANH)
 * -----------------------------------------------------------------------------
 * Nguồn chân lý duy nhất (Single Source of Truth) định nghĩa cố định (hardcoded/fixed):
 * 1. Danh mục 9 hiệu ứng chuyển cảnh chuẩn CapCut 1:1.
 * 2. Tệp âm thanh SFX đặc trưng BẮT BUỘC đi kèm từng hiệu ứng.
 * 3. Thời lượng chuẩn theo số frame (30fps) và mili-giây.
 * 4. Quy tắc ngắt âm dứt điểm (Hard Cutoff & Anti-Bleed Rule).
 */

export interface CapCutTransitionDefinition {
  id: string;
  name: string;
  capcutName: string;
  tag: string;
  durationFrames: number; // Thời lượng chuẩn (frames tại 30fps)
  durationSec: number;    // Thời lượng chuẩn (giây)
  sfxFile: string;        // Đường dẫn file âm thanh tương đối trong public/
  sfxName: string;        // Tên mô tả âm thanh hiển thị trên giao diện HUD
  sfxSource: string;      // Nguồn gốc âm thanh (YouTube URL / Foley)
  sfxVolume: number;      // Âm lượng thiết kế (0..1)
  iconBg: string;         // Màu nhận diện trên HUD
  visualDesc: string;     // Mô tả hiệu ứng thị giác
  mechanicalRule: string; // Lý do âm học & cơ học bắt buộc ghép cặp với SFX này
}

export const CAPCUT_TRANSITIONS_REGISTRY: Record<string, CapCutTransitionDefinition> = {
  "glare-ii": {
    id: "glare-ii",
    name: "01. GLARE II",
    capcutName: "Glare II",
    tag: "0:06 CapCut",
    durationFrames: 16,
    durationSec: 0.533,
    sfxFile: "sfx/glare-burn.mp3",
    sfxName: "Film Burn / Warm Flare",
    sfxSource: "Thư viện Foley cuộn phim nhựa bị phơi sáng",
    sfxVolume: 0.9,
    iconBg: "#FF9900",
    visualDesc: "Chớp lóa quang học vàng kem ấm tỏa từ tâm ra ngoài (Radial bloom & anamorphic flare).",
    mechanicalRule: "Lóa sáng ống kính phim nhựa bắt buộc đi kèm tiếng xèo cháy/rít sáng ấm của cuộn phim (Film Burn).",
  },
  "phone-reveal": {
    id: "phone-reveal",
    name: "02. PHONE REVEAL",
    capcutName: "Phone Reveal",
    tag: "0:08 CapCut",
    durationFrames: 22,
    durationSec: 0.733,
    sfxFile: "sfx/phone-shutter-1.mp3",
    sfxName: "Camera Shutter #1 (YouTube)",
    sfxSource: "YouTube: https://www.youtube.com/watch?v=NYHzq7VnUJE (SFX #1, đúng 1 tiếng tách đanh gọn)",
    sfxVolume: 0.95,
    iconBg: "#2B2D31",
    visualDesc: "Khung điện thoại iPhone 15 Pro chứa Clip B phóng to xuyên tâm mở tràn toàn màn hình.",
    mechanicalRule: "Khung camera điện thoại xuất hiện và chụp bắt cảnh mới bắt buộc đi kèm đúng 1 tiếng màn trập 'tách' sắc nhọn.",
  },
  "paper-ball": {
    id: "paper-ball",
    name: "03. PAPER BALL",
    capcutName: "Paper Ball",
    tag: "0:09 CapCut",
    durationFrames: 20,
    durationSec: 0.667,
    sfxFile: "sfx/paper-ball-yt.mp3",
    sfxName: "Paper Ball Squeeze (YouTube)",
    sfxSource: "YouTube: https://www.youtube.com/watch?v=4gzlfIg1oDg (Paper Ball Making)",
    sfxVolume: 0.95,
    iconBg: "#E0E0E0",
    visualDesc: "Cầu giấy vo tròn nhăn nhúm rách toạc từ tâm mở rộng 360 độ để lộ Clip B bên trong.",
    mechanicalRule: "Hành động vo tròn và bung nát cầu giấy bắt buộc đi kèm âm thanh vò nghiến giấy bìa giòn rụm từ YouTube.",
  },
  glitch: {
    id: "glitch",
    name: "04. GLITCH",
    capcutName: "Glitch",
    tag: "0:11 CapCut",
    durationFrames: 14,
    durationSec: 0.467,
    sfxFile: "sfx/glitch-cut.mp3",
    sfxName: "Digital Glitch Static",
    sfxSource: "Thư viện âm thanh số xung điện từ",
    sfxVolume: 0.85,
    iconBg: "#00E5FF",
    visualDesc: "Cắt lát hình ngang (Horizontal Slices) giật lệch vị trí đan xen Clip A/B kèm quang sai RGB.",
    mechanicalRule: "Nhiễu loạn tín hiệu video số bắt buộc đi kèm tiếng xung điện từ giật rẹt rẹt (Glitch Static).",
  },
  "fade-down": {
    id: "fade-down",
    name: "05. FADE DOWN",
    capcutName: "Fade Down",
    tag: "0:14 CapCut",
    durationFrames: 14,
    durationSec: 0.467,
    sfxFile: "sfx/fade-woosh.mp3",
    sfxName: "Deep Down-Woosh",
    sfxSource: "Thư viện âm thanh Low-Frequency Whoosh",
    sfxVolume: 0.9,
    iconBg: "#7C4DFF",
    visualDesc: "Clip B trượt từ đỉnh xuống đè mượt lên Clip A theo phương thẳng đứng kèm vệt mờ chuyển động.",
    mechanicalRule: "Chuyển động trọng lực rơi từ trên xuống bắt buộc đi kèm tiếng gió trầm sâu tần số thấp (Deep Woosh).",
  },
  blink: {
    id: "blink",
    name: "06. BLINK",
    capcutName: "Blink",
    tag: "0:16 CapCut",
    durationFrames: 8,
    durationSec: 0.267,
    sfxFile: "sfx/click.mp3",
    sfxName: "Click Snap (Requested)",
    sfxSource: "Thư viện UI Snap Foley",
    sfxVolume: 0.95,
    iconBg: "#111111",
    visualDesc: "Mí mắt đen khép lại đúng tâm 50% khung hình trong 3 frame rồi bung cảnh mới trong 4 frame.",
    mechanicalRule: "Chớp mắt siêu tốc 7-8 frame bắt buộc đi kèm tiếng 'click' đanh gọn dứt khoát, kết thúc trước khi cảnh mở ra.",
  },
  "wave-right": {
    id: "wave-right",
    name: "07. WAVE RIGHT",
    capcutName: "Wave Right",
    tag: "0:17 CapCut",
    durationFrames: 16,
    durationSec: 0.533,
    sfxFile: "sfx/wave-sparkle.mp3",
    sfxName: "Sparkle / Liquid Droplet (Requested)",
    sfxSource: "Thư viện bọt nước & tia sáng lung linh (Sparkle Foley)",
    sfxVolume: 0.9,
    iconBg: "#00B0FF",
    visualDesc: "Gợn sóng lỏng mực trắng quét ngang loang mở cảnh mới từ mép trái qua mép phải.",
    mechanicalRule: "Bọt sóng nước và vệt sáng quét ngang bắt buộc đi kèm tiếng lấp lánh (sparkle/bọt nước) loang theo gợn sóng.",
  },
  "swipe-left": {
    id: "swipe-left",
    name: "08. SWIPE LEFT",
    capcutName: "Swipe Left",
    tag: "0:18 CapCut",
    durationFrames: 10,
    durationSec: 0.333,
    sfxFile: "sfx/whoosh-fast.mp3",
    sfxName: "Fast Whip Whoosh",
    sfxSource: "Thư viện Whip Pan Whoosh",
    sfxVolume: 0.95,
    iconBg: "#FF5252",
    visualDesc: "Clip A trượt trái -100%, Clip B trượt vào từ +100% kèm vệt mờ chém ngang Kinetic Blade.",
    mechanicalRule: "Cú vuốt chuyển cảnh ngang siêu tốc 10 frame bắt buộc đi kèm tiếng chém gió xé gió cực nhanh (Fast Whoosh).",
  },
  "comic-cut": {
    id: "comic-cut",
    name: "09. COMIC CUT",
    capcutName: "Comic Cut",
    tag: "CapCut Pro",
    durationFrames: 20,
    durationSec: 0.667,
    sfxFile: "sfx/comic-paper-tear.mp3",
    sfxName: "Paper Tear Foley (Requested)",
    sfxSource: "Thư viện xé giấy bìa nghệ thuật (Paper Tear Foley)",
    sfxVolume: 0.95,
    iconBg: "#FFD600",
    visualDesc: "Xé đôi Clip A theo đường răng cưa dọc giữa, để lộ Clip B dạng chấm bi Manga Halftone rồi trả màu.",
    mechanicalRule: "Hai nửa mép giấy bìa xé toạc sang 2 bên bắt buộc đi kèm tiếng rách toạc giấy bìa (Paper Tear) sắc bén.",
  },
};

export const getCapCutTransitionConfig = (id: string): CapCutTransitionDefinition => {
  const cfg = CAPCUT_TRANSITIONS_REGISTRY[id];
  if (!cfg) {
    throw new Error(`[CapCutRegistry] Không tìm thấy hiệu ứng chuyển cảnh: "${id}"`);
  }
  return cfg;
};

export const ALL_CAPCUT_TRANSITION_IDS = Object.keys(CAPCUT_TRANSITIONS_REGISTRY);
