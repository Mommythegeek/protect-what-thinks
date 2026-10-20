import { Composition } from "remotion";
import { Film, totalFrames } from "./Film";
import "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="HumanNecessity" component={Film} durationInFrames={totalFrames(30)} fps={30} width={1080} height={1350} />
);
