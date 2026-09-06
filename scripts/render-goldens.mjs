/**
 * Golden stills — render one reference frame per style family so token/theme
 * changes are caught by eye (and by diff) instead of drifting silently.
 * Rule: a family without a golden still does not exist.
 *
 * Usage: npm run goldens   (writes goldens/<family>.png, git-tracked)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

// family -> default theme key (mirror of skill/references/style-menu.md)
const FAMILIES = {
  "edu-analysis": "ocean",
  "bold-sales": "sunset",
  "luxury-authority": "premium-gold",
  "beauty-lifestyle": "bloom",
  "creator-neon": "synthwave",
  "minimal-expert": "graphite-minimal",
  "warm-coaching": "fresh",
};
const FRAME = 60; // 2s: hook title (textFx + dim showcase) + captions on screen

const themes = JSON.parse(readFileSync("src/style-themes.json", "utf-8"));
const demo = JSON.parse(readFileSync("src/fixtures/demo-edl.json", "utf-8"));
mkdirSync("goldens", { recursive: true });

// neutral synthetic source clip (demo-edl's raw/demo.mp4 does not ship with the
// repo) — a flat dark plate is also the best canvas to judge graphics on
const GOLDEN_SRC = "public/raw/golden-src.mp4";
if (!existsSync(GOLDEN_SRC)) {
  execSync(
    `ffmpeg -y -f lavfi -i color=c=0x14161d:size=1080x1920:rate=30:duration=6 ` +
    `-f lavfi -i anullsrc=r=48000:cl=stereo -shortest -pix_fmt yuv420p "${GOLDEN_SRC}"`,
    { stdio: "inherit" },
  );
}

for (const [family, key] of Object.entries(FAMILIES)) {
  const t = themes[key];
  if (!t) {
    console.error(`SKIP ${family}: theme '${key}' not found in style-themes.json`);
    continue;
  }
  const edl = structuredClone(demo);
  edl.source = { ...edl.source, clip: "raw/golden-src.mp4" };
  edl.style = {
    ...edl.style,
    ambient: "none",
    accent: t.accent,
    accent2: t.accent2,
    highlightColor: t.highlightColor,
    captionColor: t.captionColor,
    recipe: { ...(edl.style?.recipe ?? {}), ...t },
  };
  const propsPath = `goldens/.${family}.props.json`;
  writeFileSync(propsPath, JSON.stringify({ edl }));
  console.log(`\n=== golden: ${family} (${key}) ===`);
  execSync(
    `npx remotion still Reel goldens/${family}.png --frame=${FRAME} --props=${propsPath}`,
    { stdio: "inherit" },
  );
  rmSync(propsPath);
}
console.log("\nGoldens done -> goldens/*.png");
