/**
 * Wrap out/edl.json into the {edl} props shape Remotion's Reel composition
 * expects, writing out/edl-props.json. Keeps edl.json as the single source
 * of truth — the wrapper is a render-time artifact, never edited by hand.
 *
 * Usage: node scripts/make-render-props.mjs [edlPath] [outPath]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const edlPath = resolve(process.argv[2] ?? "out/edl.json");
const outPath = resolve(process.argv[3] ?? "out/edl-props.json");

let edl;
try {
  edl = JSON.parse(readFileSync(edlPath, "utf-8"));
} catch (err) {
  console.error(`LOI: khong doc duoc EDL tai ${edlPath}`);
  console.error(`  ${err.message}`);
  console.error("  Chay pipeline truoc: python scripts/run-pipeline.py raw/<clip>.mp4");
  process.exit(1);
}

writeFileSync(outPath, JSON.stringify({ edl }), "utf-8");
console.log(`props -> ${outPath} (tu ${edlPath})`);
