/**
 * 3D geometric accent shapes via Three.js (@remotion/three) — premium "3D visualize"
 * without font dependencies. A rotating metallic shape (cube/sphere/torus) flies in
 * with a label beneath it. Frame-driven rotation = deterministic render.
 * Use to visualize abstract concepts (a turning gear-like torus, a rising cube...).
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { enterExit } from "../anim";
import { topBandStyle, faceAwareTopPad, useLayout } from "../layout";
import { DISPLAY_FONT } from "../fonts";

type ShapeKind = "cube" | "sphere" | "torus" | "diamond";

const Mesh: React.FC<{ kind: ShapeKind; rot: number; accent: string }> = ({ kind, rot, accent }) => {
  const common = {
    rotation: [rot * 0.6, rot, rot * 0.3] as [number, number, number],
  };
  // Physical material with clearcoat → glossy "lacquered" premium look (threejs
  // best-practice for product-style 3D). flatShading keeps crisp facets; clearcoat
  // adds a reflective top layer without needing a network envmap.
  const mat = (
    <meshPhysicalMaterial
      color={accent}
      metalness={0.9}
      roughness={0.18}
      clearcoat={1}
      clearcoatRoughness={0.12}
      reflectivity={0.8}
      emissive={accent}
      emissiveIntensity={0.18}
      flatShading
    />
  );
  return (
    <mesh {...common}>
      {kind === "cube" && <boxGeometry args={[1.6, 1.6, 1.6]} />}
      {kind === "sphere" && <icosahedronGeometry args={[1.25, 1]} />}
      {kind === "torus" && <torusKnotGeometry args={[0.95, 0.32, 80, 12]} />}
      {kind === "diamond" && <octahedronGeometry args={[1.45, 0]} />}
      {mat}
    </mesh>
  );
};

export const Shape3D: React.FC<{ text?: string; accent: string; kind?: ShapeKind }> = ({
  text,
  accent,
  kind = "diamond",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const e = enterExit(frame, fps, durationInFrames, 14);
  const { faceCenterYPct } = useLayout();
  const rot = frame / fps; // continuous spin (time-based, fps-independent)
  const size = 360;

  return (
    <AbsoluteFill style={{ ...topBandStyle(), paddingTop: faceAwareTopPad(faceCenterYPct), justifyContent: "flex-start", opacity: e }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ width: size, height: size }}>
          <ThreeCanvas width={size} height={size} camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.35} />
            {/* key + fill + rim (3-point lighting for premium metallic read) */}
            <directionalLight position={[4, 5, 6]} intensity={3.5} color="#ffffff" />
            <pointLight position={[-5, -2, 2]} intensity={2.2} color={accent} />
            <pointLight position={[0, 2, -5]} intensity={3} color="#ffffff" />{/* rim from behind */}
            <Mesh kind={kind} rot={rot} accent={accent} />
          </ThreeCanvas>
        </div>
        {text ? (
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 900,
              fontSize: 52,
              color: "#fff",
              textTransform: "uppercase",
              textShadow: "0 4px 16px rgba(0,0,0,0.6)",
              transform: `translateY(${interpolate(e, [0, 1], [20, 0])}px)`,
            }}
          >
            {text}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
