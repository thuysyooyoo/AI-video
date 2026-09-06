/**
 * Font loading — fixes Vietnamese glyph rendering.
 * Be Vietnam Pro is a Google font designed specifically for Vietnamese diacritics
 * (đ, ữ, ậ, ợ...). System fonts like Arial render these incorrectly.
 * Exposes ready-to-use fontFamily strings for captions/graphics.
 */
import { loadFont as loadBeVietnam } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadBaloo } from "@remotion/google-fonts/Baloo2";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";

const beVietnam = loadBeVietnam("normal", { weights: ["400", "700", "800"] });
const montserrat = loadMontserrat("normal", { weights: ["700", "800", "900"] });
// b-roll hook stack fonts (both verified: vietnamese subset present)
const baloo = loadBaloo("normal", { weights: ["700", "800"] });
const patrickHand = loadPatrickHand("normal", { weights: ["400"] });

// Body/caption font — full Vietnamese support
export const BODY_FONT = beVietnam.fontFamily;
// Display/heading font — also has Vietnamese, heavier for hooks/CTA
export const DISPLAY_FONT = montserrat.fontFamily;
// Rounded chunky font — b-roll hook title strips (TikTok look)
export const ROUND_FONT = baloo.fontFamily;
// Casual handwritten font — b-roll sub-hook + CTA lines
export const SCRIPT_FONT = patrickHand.fontFamily;

export const fontsReady = Promise.all([
  beVietnam.waitUntilDone(),
  montserrat.waitUntilDone(),
  baloo.waitUntilDone(),
  patrickHand.waitUntilDone(),
]);

/**
 * Vietnamese-safe line-height. Uppercase VN diacritics (Ấ Ề Ỗ Ữ) stack above
 * cap-height; with line-height ~1.0 they get clipped on wrap / by overflow.
 * Use this for ALL uppercase Vietnamese text.
 */
export const VI_SAFE_LINE_HEIGHT = 1.22;
/** extra top padding (em) to protect single-line diacritics from top clipping */
export const VI_DIACRITIC_PAD = "0.14em";
