/**
 * Tobi-style ad outcome visuals: side-by-side $9 vs $90 ad comparison, with
 * mock phone/card scenes and minimal black/red interstitials.
 */
import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { grammar, voicePop } from "../anim";
import { BODY_FONT, DISPLAY_FONT } from "../fonts";

type Variant = "talking" | "spotlight" | "black-card" | "red-alert" | "list" | "book";

const PALETTE = {
  paper: "#F4F2EC",
  ink: "#16120E",
  shadow: "#22150F",
  espresso: "#3B2317",
  umber: "#55351E",
  cognac: "#794C25",
  antique: "#A67435",
  gold: "#D1B66F",
  olive: "#4B4126",
  noir: "#252614",
  red: "#8D1114",
};

export const AdComparisonScene: React.FC<{
  text: string;
  emphasis?: string;
  items?: string[];
  sourceClip?: string;
  variant?: Variant;
}> = ({ text, emphasis, items = [], sourceClip, variant = "talking" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = grammar("data", frame, fps, durationInFrames).opacity;
  const left = voicePop(frame, fps, "confident", 2);
  const right = voicePop(frame, fps, "confident", 9);
  const handle = "@you";

  return (
    <AbsoluteFill style={{ opacity: e, background: PALETTE.paper, overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background:
          `radial-gradient(circle at 8% 8%, rgba(34,21,15,0.22), transparent 18%),
           radial-gradient(circle at 95% 92%, rgba(75,65,38,0.26), transparent 23%),
           linear-gradient(180deg, rgba(255,255,255,0.62), rgba(244,242,236,0.95))`,
      }} />
      <AdPhone
        label="$9 ADS"
        small
        grayscale
        progress={left}
        x={236}
        y={455}
        sourceClip={sourceClip}
        variant="talking"
        caption={items[0] || "basic clip"}
      />
      <AdPhone
        label="$90 ADS"
        progress={right}
        x={604}
        y={420}
        sourceClip={sourceClip}
        variant={variant}
        caption={text}
        emphasis={emphasis}
        items={items}
      />
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 138,
        textAlign: "center",
        fontFamily: DISPLAY_FONT,
        fontSize: 44,
        fontWeight: 950,
        color: PALETTE.ink,
      }}>
        {handle}
      </div>
    </AbsoluteFill>
  );
};

const AdPhone: React.FC<{
  label: string;
  x: number;
  y: number;
  progress: number;
  sourceClip?: string;
  variant: Variant;
  caption: string;
  emphasis?: string;
  items?: string[];
  small?: boolean;
  grayscale?: boolean;
}> = ({ label, x, y, progress, sourceClip, variant, caption, emphasis, items = [], small = false, grayscale = false }) => {
  const w = small ? 270 : 392;
  const h = small ? 520 : 690;
  const tx = interpolate(progress, [0, 1], [small ? -60 : 70, 0]);
  const scale = interpolate(progress, [0, 1], [0.92, 1]);
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      transform: `translate(-50%, -50%) translateX(${tx}px) scale(${scale})`,
      opacity: progress,
    }}>
      <div style={{
        fontFamily: DISPLAY_FONT,
        fontWeight: 900,
        fontSize: small ? 34 : 44,
        color: PALETTE.ink,
        textAlign: "center",
        marginBottom: -2,
      }}>
        {label}
      </div>
      <div style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: small ? 18 : 24,
        background: variant === "talking" ? PALETTE.espresso : "#050505",
        overflow: "hidden",
        border: small ? "2px solid rgba(0,0,0,0.16)" : `3px solid ${PALETTE.gold}`,
        boxShadow: small
          ? "0 15px 35px rgba(0,0,0,0.26)"
          : `0 18px 44px rgba(34,21,15,0.38), 0 0 0 1px rgba(209,182,111,0.35)`,
        filter: grayscale ? "grayscale(1)" : undefined,
      }}>
        {variant === "talking" ? (
          <TalkingAd sourceClip={sourceClip} caption={caption} emphasis={emphasis} />
        ) : variant === "spotlight" ? (
          <SpotlightAd caption={caption} />
        ) : variant === "red-alert" ? (
          <RedAlertAd caption={caption} />
        ) : variant === "list" ? (
          <ListAd items={items} />
        ) : variant === "book" ? (
          <BookAd caption={caption} />
        ) : (
          <BlackCardAd caption={caption} emphasis={emphasis} />
        )}
      </div>
    </div>
  );
};

const TalkingAd: React.FC<{ sourceClip?: string; caption: string; emphasis?: string }> = ({ sourceClip, caption, emphasis }) => (
  <>
    {sourceClip ? (
      <OffthreadVideo
        src={sourceClip.startsWith("http") ? sourceClip : staticFile(sourceClip)}
        muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : null}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(34,21,15,0.78))" }} />
    <div style={{
      position: "absolute",
      left: 24,
      right: 24,
      bottom: 120,
      color: "#fff",
      fontFamily: BODY_FONT,
      fontSize: 26,
      fontWeight: 700,
      textAlign: "center",
    }}>
      {caption}
    </div>
    {emphasis ? (
      <div style={{
        position: "absolute",
        left: 22,
        right: 22,
        bottom: 70,
        color: PALETTE.gold,
        fontFamily: DISPLAY_FONT,
        fontSize: 34,
        fontWeight: 950,
        textAlign: "center",
        textTransform: "uppercase",
        textShadow: "0 4px 18px rgba(0,0,0,0.75)",
      }}>
        {emphasis}
      </div>
    ) : null}
  </>
);

const SpotlightAd: React.FC<{ caption: string }> = ({ caption }) => (
  <>
    <div style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(ellipse at 50% 82%, rgba(255,255,255,0.95), transparent 18%), linear-gradient(90deg, #121212, #fafafa 47%, #fafafa 53%, #111)",
    }} />
    <div style={{ position: "absolute", left: "50%", bottom: 150, width: 22, height: 90, transform: "translateX(-50%)", background: PALETTE.ink, borderRadius: 12 }} />
    <div style={{ position: "absolute", left: "50%", bottom: 135, width: 66, height: 14, transform: "translateX(-50%)", background: PALETTE.ink, borderRadius: 999 }} />
    <div style={{ position: "absolute", left: 30, right: 30, top: 210, fontFamily: BODY_FONT, fontSize: 24, fontWeight: 900, color: "#333", textAlign: "center" }}>
      {caption}
    </div>
  </>
);

const BlackCardAd: React.FC<{ caption: string; emphasis?: string }> = ({ caption, emphasis }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      width: 210,
      minHeight: 132,
      borderRadius: 22,
      background: `linear-gradient(180deg, rgba(209,182,111,0.18), rgba(37,38,20,0.78))`,
      border: "1px solid rgba(209,182,111,0.35)",
      boxShadow: `0 0 34px rgba(209,182,111,0.25)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: 22,
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, border: `3px solid ${PALETTE.gold}`, boxShadow: `0 0 18px ${PALETTE.gold}55` }} />
      <div style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 950, color: "#fff", textAlign: "center" }}>{emphasis || caption}</div>
    </div>
  </div>
);

const ListAd: React.FC<{ items?: string[] }> = ({ items = [] }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
    {(items.length ? items : ["driving around", "smoking a cigar", "gun in hand"]).slice(0, 3).map((item, i) => (
      <div key={i} style={{
        width: 230,
        height: 48,
        borderRadius: 9,
        background: `linear-gradient(90deg, ${PALETTE.red}, #4b0809)`,
        color: "#fff",
        fontFamily: BODY_FONT,
        fontSize: 18,
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
      }}>
        {item}
      </div>
    ))}
  </div>
);

const RedAlertAd: React.FC<{ caption: string }> = ({ caption }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #E01818, ${PALETTE.red} 58%, #280304)` }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{
        position: "absolute",
        left: `${20 + i * 28}%`,
        top: 0,
        width: 100,
        height: "72%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.18), transparent)",
        clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
      }} />
    ))}
    <div style={{ position: "absolute", left: 40, right: 40, top: 250, fontFamily: BODY_FONT, fontSize: 22, fontWeight: 800, color: "#fff", textAlign: "center" }}>
      {caption}
    </div>
  </div>
);

const BookAd: React.FC<{ caption: string }> = ({ caption }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 80 }}>
    <div style={{ fontFamily: BODY_FONT, fontSize: 28, fontWeight: 500, color: PALETTE.ink }}>
      in <b>the book</b>
    </div>
    <div style={{ width: 210, height: 260, background: `linear-gradient(135deg, ${PALETTE.olive}, ${PALETTE.gold})`, boxShadow: "0 16px 34px rgba(0,0,0,0.25)" }}>
      <div style={{ padding: 20, fontFamily: DISPLAY_FONT, fontSize: 28, fontWeight: 950, color: "#fff" }}>{caption}</div>
    </div>
  </div>
);
