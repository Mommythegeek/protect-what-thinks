import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { useVideoConfig } from "remotion";
import { Chart, Cta, Europe, Loop, Title, Waiting, Wrong } from "./Scenes";

export const T = 12; // transition frames
export const SCENES = [5.4, 6.4, 8.0, 10.0, 9.4, 6.4, 6.4];
export const totalFrames = (fps: number) => SCENES.reduce((a, s) => a + Math.round(s * fps), 0) - (SCENES.length - 1) * T;

export const Film: React.FC = () => {
  const { fps } = useVideoConfig();
  const comps = [Title, Waiting, Loop, Chart, Europe, Wrong, Cta];
  const names = ["Title", "Waiting", "Loop", "Chart", "Europe", "Wrong", "Call to action"];
  return (
    <TransitionSeries>
      {comps.map((Comp, i) => (
        <React.Fragment key={names[i]}>
          {i > 0 ? <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} /> : null}
          <TransitionSeries.Sequence name={names[i]} durationInFrames={Math.round(SCENES[i] * fps)}>
            <Comp />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};
