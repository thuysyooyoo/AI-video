/**
 * Remotion root — registers the Reel composition (9:16, 30fps).
 * Duration is derived from the EDL source duration via calculateMetadata.
 */
import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";
import { edlSchema, type Edl } from "./edl-types";
import demoEdl from "./fixtures/demo-edl.json";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Reel"
      component={Reel}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={300}
      defaultProps={{ edl: demoEdl as unknown as Edl }}
      calculateMetadata={({ props }) => {
        const edl = edlSchema.parse(props.edl);
        const { w, h, fps } = edl.format;
        return {
          width: w,
          height: h,
          fps,
          durationInFrames: Math.ceil(edl.source.durationSec * fps),
          props: { edl },
        };
      }}
    />
  );
};
