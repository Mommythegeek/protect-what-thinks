import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, PAD, SANS, SERIF } from "./theme";
import data from "./data.json";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fade and rise in from `at` seconds.
const useIn = (at: number, dur = 0.7) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [at * fps, (at + dur) * fps], [0, 1], { ...clamp, easing: ease });
};

const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number }> = ({ at, children, style, dy = 28 }) => {
  const p = useIn(at);
  return <div style={{ opacity: p, translate: `0px ${(1 - p) * dy}px`, ...style }}>{children}</div>;
};

const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.accent }) => (
  <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "0.12em", textTransform: "uppercase", color, fontWeight: 500 }}>{children}</div>
);

const Frame: React.FC<{ children: React.ReactNode; footer?: string }> = ({ children, footer }) => (
  <AbsoluteFill style={{ backgroundColor: C.paper, color: C.ink, fontFamily: SANS, padding: `${PAD + 20}px ${PAD}px`, display: "flex", flexDirection: "column", gap: 36 }}>
    {children}
    <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 64, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, color: C.faint, letterSpacing: "0.06em" }}>
      <span>HUMAN NECESSITY MODEL · v{data.version}</span>
      <span>{footer ?? "Illustrative, not estimated"}</span>
    </div>
  </AbsoluteFill>
);

// 1 · Title
export const Title: React.FC = () => {
  const strike = useIn(2.6, 0.5);
  return (
    <Frame>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 40 }}>
        <Rise at={0.2}><Eyebrow color={C.muted}>2017 · Vaswani et al. · Google</Eyebrow></Rise>
        <Rise at={0.5}>
          <div style={{ fontFamily: SERIF, fontSize: 132, lineHeight: 1.0 }}>Attention Is All You Need.</div>
        </Rise>
        <Rise at={2.2}>
          <div style={{ fontFamily: SERIF, fontSize: 132, lineHeight: 1.0, fontStyle: "italic", color: C.accent }}>
            Human attention is all you need{" "}
            <span style={{ opacity: strike, display: "inline-block", translate: `${(1 - strike) * 40}px 0px` }}>to remove.</span>
          </div>
        </Rise>
        <Rise at={3.6}>
          <div style={{ fontSize: 44, color: C.muted, lineHeight: 1.3, maxWidth: 840 }}>An open model of when people stop deciding at work.</div>
        </Rise>
      </div>
    </Frame>
  );
};

// 2 · Waiting
export const Waiting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(frame, [0.8 * fps, 2.4 * fps], [0, 0.8], { ...clamp, easing: ease });
  const swap = interpolate(frame, [3.4 * fps, 3.9 * fps], [0, 1], clamp);
  return (
    <Frame footer="Source: Anthropic, 16 Oct 2026">
      <Rise at={0.1}><Eyebrow>Anthropic · How employment is changing at Anthropic</Eyebrow></Rise>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 44 }}>
        <div style={{ fontFamily: SERIF, fontSize: 300, lineHeight: 0.9, color: C.accent }}>{Math.round(fill * 100)}%</div>
        <Rise at={0.4}><div style={{ fontSize: 50, lineHeight: 1.25 }}>of the clock in an agent session is the agent waiting for a person.</div></Rise>
        <div style={{ height: 76, display: "flex", border: `2px solid ${C.rule}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, background: C.accent, display: "flex", alignItems: "center", paddingLeft: 24, position: "relative" }}>
            <span style={{ fontFamily: MONO, fontSize: 28, color: C.paper, fontWeight: 500, opacity: 1 - swap, position: "absolute", left: 24 }}>WAITING</span>
            <span style={{ fontFamily: MONO, fontSize: 28, color: C.paper, fontWeight: 500, opacity: swap, position: "absolute", left: 24 }}>HUMAN REVIEW</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 18, fontFamily: MONO, fontSize: 24, color: C.muted }}>WORK</div>
        </div>
        <Rise at={4.2}><div style={{ fontSize: 44, color: C.muted, lineHeight: 1.3 }}>Count review as waiting, and cutting it becomes a performance gain.</div></Rise>
      </div>
    </Frame>
  );
};

// 3 · The loop
const NODES = [
  { t: "Firms plan on the capability they expect", s: "“reducing headcount in anticipation” · HBR, Jan 2026" },
  { t: "Junior hiring falls", s: "27% → 9% of technical hires in a year · Anthropic" },
  { t: "Experienced judgment thins", s: "the juniors who would have become experts are never hired" },
  { t: "Review looks unnecessary", s: "so it is counted as cost, and cut" },
];
export const Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 444, cy = 400, r = 300;
  const pos = (i: number) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const arc = (i: number) => {
    const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.38, a1 = a0 + Math.PI / 2 - 0.76;
    return `M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`;
  };
  const step = (i: number) => interpolate(frame, [(0.5 + i * 1.1) * fps, (1.2 + i * 1.1) * fps], [0, 1], { ...clamp, easing: ease });
  return (
    <Frame footer="Merton, 1948 · de Préval, 2026">
      <Rise at={0}><Eyebrow>The loop the model runs</Eyebrow></Rise>
      <div style={{ position: "relative", width: 888, height: 800 }}>
        <svg width={888} height={800} style={{ position: "absolute", inset: 0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.rule} strokeWidth={2} />
          {NODES.map((_, i) => {
            const p = step(i + 0.6);
            return <path key={i} d={arc(i)} fill="none" stroke={C.accent} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />;
          })}
        </svg>
        {NODES.map((n, i) => {
          const [x, y] = pos(i), p = step(i);
          const w = 360;
          return (
            <div key={i} style={{ position: "absolute", left: Math.min(Math.max(x - w / 2, 0), 888 - w), top: y - 70, width: w, opacity: p, scale: `${0.92 + 0.08 * p}`, background: C.sheet, border: `2px solid ${C.rule}`, borderRadius: 8, padding: "18px 20px" }}>
              <div style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.15 }}>{n.t}</div>
              <div style={{ fontSize: 22, color: C.muted, marginTop: 8, lineHeight: 1.3 }}>{n.s}</div>
            </div>
          );
        })}
      </div>
      <Rise at={5.4}>
        <div style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.1 }}>A self-fulfilling prophecy, <span style={{ color: C.accent, fontStyle: "italic" }}>hedged</span>: if it is wrong, someone else pays.</div>
      </Rise>
    </Frame>
  );
};

// 4 · The chart, from the model's own medians
const LINES: { k: keyof typeof data.series; col: string; w: number; dash?: string; label: string }[] = [
  { k: "m", col: C.machine, w: 4, label: "Machines can do" },
  { k: "I", col: C.machine2, w: 4, dash: "14 10", label: "Firms plan" },
  { k: "J", col: C.junior, w: 4, label: "Junior hiring" },
  { k: "E", col: C.expert, w: 5, label: "Judgment" },
  { k: "F", col: C.formal, w: 4, dash: "3 10", label: "Formal sign-off" },
  { k: "R", col: C.accent, w: 9, label: "Decision capacity" },
];
export const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yrs = data.years, n = yrs.length;
  const Wc = 888, Hc = 560, L = 60, Rr = 230, T = 20, B = 50;
  const x = (i: number) => L + (i / (n - 1)) * (Wc - L - Rr);
  const y = (v: number) => T + (1 - Math.min(v, 1.2) / 1.2) * (Hc - T - B);
  const prog = interpolate(frame, [0.6 * fps, 6.2 * fps], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const upto = Math.max(1, prog * (n - 1));
  const pathOf = (arr: number[]) => {
    let d = "";
    for (let i = 0; i <= Math.floor(upto); i++) d += (i ? "L" : "M") + x(i).toFixed(1) + " " + y(arr[i]).toFixed(1) + " ";
    const fl = Math.floor(upto), fr = upto - fl;
    if (fl < n - 1) d += "L" + (x(fl) + (x(fl + 1) - x(fl)) * fr).toFixed(1) + " " + y(arr[fl] + (arr[fl + 1] - arr[fl]) * fr).toFixed(1);
    return d;
  };
  const yr = Math.round(yrs[0] + prog * (yrs[n - 1] - yrs[0]));
  const gapIn = useIn(6.4, 0.8);
  const gi = yrs.indexOf(2045);
  const gapPath = () => {
    const top = data.series.F.slice(gi).map((v, j) => `${j ? "L" : "M"}${x(gi + j)} ${y(v)}`).join(" ");
    const bot = data.series.R.slice(gi).map((v, j) => `L${x(gi + j)} ${y(v)}`).reverse().join(" ");
    return `${top} ${bot} Z`;
  };
  // end labels, de-overlapped
  const labs = LINES.map((l) => ({ ...l, yy: y(data.series[l.k][n - 1]) + 8 })).sort((a, b) => a.yy - b.yy);
  for (let i = 1; i < labs.length; i++) if (labs[i].yy - labs[i - 1].yy < 30) labs[i].yy = labs[i - 1].yy + 30;
  return (
    <Frame footer="Software · 500 runs · median">
      <Rise at={0}><Eyebrow>Software, 2026 → 2060</Eyebrow></Rise>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <Rise at={0.2}><div style={{ fontFamily: SERIF, fontSize: 70, lineHeight: 1.05, maxWidth: 700 }}>What happens to the person who signs</div></Rise>
        <div style={{ fontFamily: MONO, fontSize: 64, color: C.muted }}>{yr}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px" }}>
        {LINES.map((l) => (
          <span key={l.k} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, color: l.k === "R" ? C.ink : C.muted, fontWeight: l.k === "R" ? 600 : 400 }}>
            <span style={{ width: 34, height: 0, borderTop: `${l.k === "R" ? 7 : 4}px ${l.dash ? (l.k === "F" ? "dotted" : "dashed") : "solid"} ${l.col}` }} />
            {l.label}
          </span>
        ))}
      </div>
      <svg width={Wc} height={Hc} style={{ flexShrink: 0 }}>
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line x1={L} x2={Wc - Rr} y1={y(v)} y2={y(v)} stroke={C.rule} strokeWidth={2} />
            <text x={L - 12} y={y(v) + 8} textAnchor="end" fontFamily={MONO} fontSize={22} fill={C.faint}>{v * 100}</text>
          </g>
        ))}
        {[2026, 2040, 2060].map((t) => (
          <text key={t} x={x(yrs.indexOf(t))} y={Hc - 14} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.faint}>{t}</text>
        ))}
        <path d={gapPath()} fill={C.accent} opacity={0.18 * gapIn} />
        {LINES.map((l) => (
          <path key={l.k} d={pathOf(data.series[l.k])} fill="none" stroke={l.col} strokeWidth={l.w} strokeDasharray={l.dash} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {labs.map((l) => (
          <text key={l.k} x={Wc - Rr + 14} y={l.yy} fontFamily={SANS} fontSize={24} fontWeight={l.k === "R" ? 600 : 500} fill={l.col} opacity={interpolate(prog, [0.9, 1], [0, 1], clamp)}>{l.label}</text>
        ))}
      </svg>
      <Rise at={6.8}>
        <div style={{ fontSize: 38, lineHeight: 1.25 }}>
          <span style={{ color: C.accent }}>The signature remains, the decision has left.</span>{" "}
          <span style={{ color: C.muted }}>Sign‑off holds while the capacity to decide drains.</span>
        </div>
      </Rise>
    </Frame>
  );
};

// 5 · Europe
export const Europe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { name: "European Union", v: data.shares["European Union"].sig },
    { name: "China", v: data.shares["China"].sig },
    { name: "United States", v: data.shares["United States"].sig },
  ];
  return (
    <Frame footer="Stylised regional profiles">
      <Rise at={0}><Eyebrow>The result to argue with first</Eyebrow></Rise>
      <Rise at={0.3}><div style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.05 }}>Software futures where the signature outlives the decision, 2060</div></Rise>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {rows.map((r, i) => {
          const p = interpolate(frame, [(1.2 + i * 0.35) * fps, (2.6 + i * 0.35) * fps], [0, 1], { ...clamp, easing: ease });
          const hi = r.name === "European Union";
          return (
            <div key={r.name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 34, marginBottom: 8 }}>
                <span style={{ fontWeight: hi ? 600 : 400 }}>{r.name}</span>
                <span style={{ fontFamily: MONO, color: hi ? C.accent : C.ink }}>{Math.round(r.v * p * 100)}%</span>
              </div>
              <div style={{ height: 32, background: C.sheet, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${r.v * p * 100}%`, height: "100%", background: hi ? C.accent : C.formal }} />
              </div>
            </div>
          );
        })}
      </div>
      <Rise at={3.4}><div style={{ fontSize: 38, lineHeight: 1.3 }}>Europe keeps more judgment than the US <span style={{ color: C.muted }}>(decision capacity {Math.round(data.shares["European Union"].R * 100)} vs {Math.round(data.shares["United States"].R * 100)})</span> and far more signatures.</div></Rise>
      <Rise at={4.8}><div style={{ fontSize: 38, lineHeight: 1.3 }}>Hold the signature equal and Europe lands there less often: <span style={{ fontFamily: MONO, color: C.expert }}>40% vs 62%</span>.</div></Rise>
      <Rise at={6.0}><div style={{ fontFamily: SERIF, fontSize: 52, lineHeight: 1.1, fontStyle: "italic", color: C.accent }}>European rules protect the name more than the judgment.</div></Rise>
    </Frame>
  );
};

// 6 · Where it is wrong
const WRONG = [
  "Misses 3 of its 4 reality checks",
  "Erodes skill too slowly: endoscopists lost 28% → 22% unaided detection in three months",
  "No hidden labour, no population of agents",
  "No India, no Global South",
  "Nobody publishes how often review changes an outcome. I had to guess.",
];
export const Wrong: React.FC = () => (
  <Frame footer="Full review log on GitHub">
    <Rise at={0}><Eyebrow>Published with its errors</Eyebrow></Rise>
    <Rise at={0.2}><div style={{ fontFamily: SERIF, fontSize: 96, lineHeight: 1 }}>Where my model is wrong</div></Rise>
    <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 16 }}>
      {WRONG.map((w, i) => (
        <Rise key={i} at={0.9 + i * 0.75} dy={20}>
          <div style={{ display: "flex", gap: 26, alignItems: "baseline" }}>
            <span style={{ fontFamily: MONO, fontSize: 30, color: C.alert, minWidth: 40 }}>✕</span>
            <span style={{ fontSize: 42, lineHeight: 1.25, color: i === WRONG.length - 1 ? C.accent : C.ink }}>{w}</span>
          </div>
        </Rise>
      ))}
    </div>
  </Frame>
);

// 7 · Call to action
export const Cta: React.FC = () => (
  <Frame footer="Built with Claude, disclosed">
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 44 }}>
      <Rise at={0.1}><div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 0.95 }}>Help me <span style={{ fontStyle: "italic", color: C.accent }}>fix it.</span></div></Rise>
      <Rise at={0.9}>
        <div style={{ background: C.sheet, border: `2px solid ${C.rule}`, borderRadius: 10, padding: "26px 30px" }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.muted, letterSpacing: "0.08em" }}>RUN THE MODEL IN YOUR BROWSER</div>
          <div style={{ fontFamily: MONO, fontSize: 30, marginTop: 10, color: C.accent }}>mommythegeek.github.io/protect-what-thinks</div>
        </div>
      </Rise>
      <Rise at={1.5}>
        <div style={{ background: C.sheet, border: `2px solid ${C.rule}`, borderRadius: 10, padding: "26px 30px" }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.muted, letterSpacing: "0.08em" }}>CODE, SOURCES, “WHERE IS THE MODEL WRONG?”</div>
          <div style={{ fontFamily: MONO, fontSize: 30, marginTop: 10 }}>github.com/Mommythegeek/protect-what-thinks</div>
        </div>
      </Rise>
      <Rise at={2.1}><div style={{ fontSize: 42, color: C.muted }}>The article is in the post. Send me an override rate.</div></Rise>
      <Rise at={2.8}><div style={{ fontFamily: SERIF, fontSize: 48, fontStyle: "italic" }}>Carla de Préval · <span style={{ color: C.accent }}>Protéger ce qui pense</span></div></Rise>
    </div>
  </Frame>
);
