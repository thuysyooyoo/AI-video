# EDL Reasoning Playbook, Talking-head (agent runs the 4 passes itself)

You (the agent) are the editor. Read the transcript → write `out/host-plan.json`
(schema: [host-plan-schema.md](host-plan-schema.md), graphic types:
[graphic-catalog.md](graphic-catalog.md)) → run the pipeline with `--llm prefed`.
Do NOT spawn a nested AI CLI subprocess. Perform the reasoning in the active Codex task.

## Inputs to read first

1. `out/transcript.json`, words + segments already remapped to the tight clip. Timestamps in the host-plan are on THIS timeline.
2. `out/cut-report.json`, how much was cut, total tight duration.
3. `out/face-zones.json` (if present), `dominantFreeZone` for `facePosition`.
4. The theme key locked at the interview (style-menu.md) + `memory/user-style-profile.md` if it exists.

## Pass 1, ANALYZE (understand before you build)

Read the full transcript, split it into **4-7 segments** by storytelling structure
(`hook → problem → point/proof... → cta`), each segment: 1-sentence gist + energy
(low/mid/high, based on idea density and delivery). Mark **8-14 keyMoments**:
phrases worth emphasizing + visualIdea (a number? a concept? a contrast? emphasis?).

Note: `energy: high` auto-generates a punch-in zoom; a `label` change generates a transition -
place them WITH INTENT, do not spray high everywhere.

## Pass 2, STRATEGY (the edit plan)

- `theme`: use the key LOCKED at the interview. Do not change it, do not "improve" it.
- `hookText` (3-6 ATTENTION-GRABBING words, uppercase) + `ctaText` (2-4 words), the engine builds the hook/CTA graphics from these 2 fields.
- `ambient`: default `"none"` (OrbitRing was removed - "ring" renders nothing). Only `sparkles` when the theme/content truly suits sparkle (rare).
- `plan[]`: walk through every keyMoment + emphasized sentence, pick the graphic type by **MEANING**
  (intent → type table in graphic-catalog.md). Each item: `sec` at the exact moment the phrase
  is spoken (the engine's word-anchor snaps precisely within ±2.5s), short `text`,
  1-sentence `reason`, plus the required fields for the type.

**Emphasize words by MEANING:** when writing a graphic's `text`, pick the WORD THAT CARRIES
THE MEANING as the keyword (the number, the strong verb, the core noun), not the longest
word or the word in the middle of the sentence.

**Staggered Audio-Synced Headline Timing (CHỈ ÁP DỤNG CHO TIÊU ĐỀ HEADLINE, KHÔNG ÁP DỤNG CHO PHỤ ĐỀ TRANSCRIPT):**
- Phân tách thời điểm xuất hiện: Phần dẫn dắt/bối cảnh (`header`, `sub`, `tag`) xuất hiện trước ở `frame 0` của graphic để neo giữ mắt người xem.
- Từ khóa vàng (`keyword`): Phải khớp thời điểm người nói phát âm (`keywordStartMs`). Trước thời điểm này từ khóa vàng ẩn hoàn toàn, khi chạm từ khóa mới bùng nổ vàng rực.
- Giữ toàn bộ headline trên màn hình đến hết câu/ý của người nói rồi cùng thoát cảnh (hold & synchronized out).
**Sentence-Completion Visual Beats (Mỗi câu nói hoàn chỉnh BẮT BUỘC có hiệu ứng đi kèm):**
- Cứ mỗi khi người nói hoàn thành **1 câu nói / 1 ý trọn vẹn**, BẮT BUỘC phải xuất hiện một hiệu ứng thị giác điện ảnh. Tuyệt đối không để xảy ra "khoảng chết thị giác" chỉ có phụ đề chạy đơn độc.
- **AI phân tích nội dung ngữ nghĩa câu nói**:
  1. *Hành động, hiện vật, chứng cứ, bối cảnh thực tế* $\rightarrow$ B-roll Full Khung Chiều Sâu kèm slow zoom & punchline vàng.
  2. *Con số, tỷ lệ, văn bản luật, điều kiện định lượng* $\rightarrow$ Kinetic Headline số liệu (`stat-punch`, `3-tier` số vàng).
  3. *Đối lập, nghịch lý, mâu thuẫn* $\rightarrow$ Hiệu ứng đối lập (`split-contrast`, `comparison`, `stacked-contrast`).
  4. *Triết lý, lời khuyên, đúc kết luận điểm* $\rightarrow$ Headline Đòn Bẩy (`asymmetric-trio`, `multiblock-flow`, `kinetic-statement`).
  5. *Chuyển hướng chủ đề, sang phân đoạn mới* $\rightarrow$ Chuyển Cảnh CapCut 2-Layer (`phone-reveal`, `paper-ball`, `comic-cut`...).
- Luân phiên các nhóm hiệu ứng giữa các câu liền kề, cấm chọn bừa hoặc lặp máy móc.

## Pass 3, SELF-CRITIQUE (before writing the file)

Review your own plan; every graphic must answer AT LEAST 1 of these 3:
**clarify information | create rhythm | guide the eye**; if it answers none = excess decoration → DROP IT.

Checklist:
- [ ] **The quota is a CEILING**: energy high ~1.8s/graphic, mid ~2.5s, low ~3.5s is the MAXIMUM density. Breathing gaps of 3-5s without graphics are normal, do NOT fill them.
- [ ] Every graphic matches what is BEING SAID at that second (cross-check the transcript).
- [ ] `illus-mark` ≤ 2 in the whole video, only at extreme emphasis points.
- [ ] Data graphics use REAL NUMBERS from the transcript; list/step graphics use real items.
- [ ] No 3 graphics of the same type in a row; no new graphic in the last 2s.
- [ ] Hook 0-3s is the densest zone; the pre-CTA 5-7s at the end raises rhythm slightly.
- [ ] Short text (statement ≤52 characters; item ≤5 words); Vietnamese with correct diacritics.
- [ ] Do NOT use long dashes (em dash U+2014, en dash U+2013) in any on-screen text (hookText, ctaText, text, items, emphasis), they read as AI writing; the engine also filters them but do not rely on that.

Fix the `plan[]` directly, then write the file. Set the `critique` block to
`{"drop": [], "add": [], "notes": "host plan is final"}`.

## Pass 4, EXECUTE + VERIFY

```powershell
# first run (no edl.json yet) or hand-edited + want a redo:
python scripts/generate-edl.py --clip "raw/<tight-clip>.mp4" --llm prefed --force-regen
python scripts/validate-edl-risk.py out/edl.json
```

Verify after gen (mandatory):
1. `strategy.theme` in `out/edit-plan.json` = the locked theme (wrong → fix the host-plan and rerun).
2. The graphics count printed to console is reasonable for the duration (quota ceiling: ~dur/2.5 is the high end).
3. `validate-edl-risk.py` reports no red errors.
4. Skim `out/edl.json`: hook/cta text correct, no graphic unexpectedly demoted (a sign of a missing field, see the catalog).

Then render: `npm run render:edl` (or the pipeline with `--render` from the start).

## Reference density (the "v7" taste, dense with intent)

A 60-100s continuous-talk video: typically **25-45 graphics** (excluding hook/cta/zoom).
Below 15 = sparse for this taste; above 55 = almost certainly stuffed (the v8 trap). This is
a reference range, not a target; content with fewer ideas gets fewer graphics.
