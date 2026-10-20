import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Same palette and typefaces as the Human Necessity Model (dark theme).
export const C = {
  paper: "#13151B",
  sheet: "#1A1D25",
  ink: "#E7E8E3",
  muted: "#9BA1AC",
  faint: "#757B86",
  rule: "#2D313B",
  accent: "#F2589F",
  machine: "#7EA6EA",
  machine2: "#45628F",
  junior: "#E2AA4E",
  expert: "#5BC398",
  formal: "#8D93A0",
  alert: "#FF8A80",
};

export const SERIF = "Instrument Serif";
export const SANS = "IBM Plex Sans";
export const MONO = "IBM Plex Mono";

const f = (family: string, file: string, weight: string, style = "normal") =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });

f(SERIF, "instrument-serif-latin-400-normal.woff2", "400");
f(SERIF, "instrument-serif-latin-400-italic.woff2", "400", "italic");
f(SANS, "ibm-plex-sans-latin-400-normal.woff2", "400");
f(SANS, "ibm-plex-sans-latin-500-normal.woff2", "500");
f(SANS, "ibm-plex-sans-latin-600-normal.woff2", "600");
f(MONO, "ibm-plex-mono-latin-400-normal.woff2", "400");
f(MONO, "ibm-plex-mono-latin-500-normal.woff2", "500");

export const W = 1080;
export const H = 1350;
export const PAD = 96;
