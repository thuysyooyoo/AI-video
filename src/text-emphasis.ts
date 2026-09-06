/**
 * Pick the word worth emphasising in a Vietnamese phrase — a content word
 * (number > acronym > longest noun/verb), never a function word. Replaces the
 * old "middle word" heuristic that highlighted "thì/của/đến" half the time.
 */
const VN_FUNCTION_WORDS = new Set([
  "và", "là", "của", "có", "cái", "những", "một", "thì", "mà", "ở", "cho",
  "với", "từ", "đến", "trong", "ngoài", "khi", "nếu", "vậy", "đó", "này",
  "bạn", "mình", "cũng", "chỉ", "được", "đang", "sẽ", "đã", "không", "rất",
  "hơn", "nữa", "lên", "ra", "vào", "để", "làm", "hay", "hoặc", "nhưng",
  "thôi", "nhé", "ha", "à", "ạ", "trên", "dưới", "bên", "về", "theo", "như",
]);

export const pickEmphasisIndex = (words: string[]): number => {
  let best = -1;
  let bestScore = 0;
  words.forEach((w, i) => {
    const clean = w.toLowerCase().replace(/[.,!?:;"']/g, "");
    if (!clean || VN_FUNCTION_WORDS.has(clean)) return;
    // numbers beat everything; then acronyms/brands (all-caps in source); then length
    const score = /\d/.test(clean) ? 100 : w === w.toUpperCase() && clean.length >= 2 ? 50 + clean.length : clean.length;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
};
