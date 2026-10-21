// The eleven prints of the scroll. paint(x, t, P) draws one sheet in sheet coordinates (W×H).
// P(g, fn) prints group g (0 background, 1 figures, 2 labels) with the block-by-block reveal.
import { clamp, lerp, seg, ss, eio, eo, ei, TAU, mulberry, hash } from '/core/lib.js';
import { W, H, FR, PAL, mix, rgba, bokashi, kasumi, carve, line, fillPath, drawSeal, sealCanvas, printTex, smooth, poly, mk } from './print.js';
import { kneeler, crane, desk, printSheet, soroban, zabuton, block, ghosted } from './figures.js';
import { T, VO, SHEET, DURS } from './story.js';

const RUNS = await (await fetch('runs.json')).json();
const SANS = "'Shippori Mincho B1'";
const at = (t, a, d = .35) => clamp((t - a) / d);

// ——— shared scenery: a porcelain room, cobalt line-work, a round window onto drifting lanterns ———
let NOW = 0;
function wall(x, y1, col = PAL.plaster) {
  const g = x.createLinearGradient(0, 0, 0, y1); g.addColorStop(0, '#dfe6ef'); g.addColorStop(1, col);
  x.fillStyle = g; x.fillRect(0, 0, W, y1); printTex(x, .03, .25);
  // whiplash tendrils in pale cobalt, art-nouveau style, climbing the wall
  x.save(); x.strokeStyle = rgba(PAL.cobalt, .16); x.lineCap = 'round';
  const R = mulberry(23);
  for (let i = 0; i < 7; i++) {
    let px = 620 + R() * 460, py = y1, a = -Math.PI / 2 + (R() - .5) * .6; x.lineWidth = 2 + R() * 3; x.beginPath(); x.moveTo(px, py);
    for (let k = 0; k < 40; k++) { a += Math.sin(k * .35 + i) * .09; px += Math.cos(a) * 12; py += Math.sin(a) * 12; x.lineTo(px, py); if (py < 60) break; }
    x.stroke(); x.beginPath(); for (let k = 0; k < 24; k++) { const aa = k * .45, rr = 14 * (1 - k / 26); x.lineTo(px + Math.cos(aa) * rr, py + Math.sin(aa) * rr); } x.stroke();
  }
  x.restore();
}
function beams(x, y1) {
  x.fillStyle = PAL.sumi; x.fillRect(0, 60, W, 6); x.fillRect(0, y1 - 8, W, 8);
  x.fillStyle = rgba(PAL.cobalt, .5); x.fillRect(0, 72, W, 2);
}
function floor(x, y0, y1 = H) {
  const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#d9e1eb'); g.addColorStop(1, '#eef2f7');
  x.fillStyle = g; x.fillRect(0, y0, W, y1 - y0); printTex(x, .04, .25);
  x.strokeStyle = rgba(PAL.cobalt, .22); x.lineWidth = 1.6;
  for (let k = -6; k < 14; k++) { const x0 = k * 140; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 - (y1 - y0) * .55, y1); x.stroke(); }
  x.strokeStyle = rgba(PAL.cobalt, .14); for (let y = y0 + 150; y < y1; y += 190) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
}
// a vermilion paper lantern drifting like a jellyfish
export function lantern(x, cx, cy, r, t, seed = 1, a = 1) {
  const R = mulberry(seed); x.save(); x.globalAlpha = a;
  for (let i = 0; i < 9; i++) {
    const bx = cx - r * .7 + i * r * .175, L = r * (1.4 + R() * 1.2), ph = R() * TAU, pts = [];
    for (let k = 0; k <= 10; k++) { const v = k / 10; pts.push([bx + Math.sin(t * 1.4 + ph + v * 4) * r * .18 * v, cy + r * .1 + v * L]); }
    x.strokeStyle = i % 3 ? 'rgba(239,155,142,.55)' : 'rgba(216,58,42,.55)'; x.lineWidth = 1.2 + R(); x.beginPath(); smooth(x, pts); x.stroke();
  }
  const pulse = 1 + .05 * Math.sin(t * 1.8 + seed);
  const g = x.createRadialGradient(cx, cy - r * .3, r * .1, cx, cy, r * pulse);
  g.addColorStop(0, '#f7b3a6'); g.addColorStop(.6, '#e0412e'); g.addColorStop(1, 'rgba(184,40,28,.9)');
  x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, r * pulse, r * .78 * pulse, 0, Math.PI, 0); x.quadraticCurveTo(cx, cy + r * .25, cx - r * pulse, cy); x.fill();
  x.strokeStyle = 'rgba(255,235,228,.55)'; x.lineWidth = 1.2;
  for (let k = -2; k <= 2; k++) { x.beginPath(); x.ellipse(cx, cy, Math.abs(k) * r * .2 + 2, r * .76 * pulse, 0, Math.PI, 0); x.stroke(); }
  x.restore();
}
function roundWindow(x, cx, cy, r, t = NOW) {
  x.save(); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.clip();
  const g = x.createLinearGradient(0, cy - r, 0, cy + r); g.addColorStop(0, '#c9d8ec'); g.addColorStop(1, '#6f8fc4');
  x.fillStyle = g; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  // light from the surface
  x.fillStyle = 'rgba(255,255,255,.18)'; for (let k = 0; k < 5; k++) { x.beginPath(); x.ellipse(cx - r + k * r * .5 + Math.sin(t * .4 + k) * 12, cy - r * .9, r * .22, r * .06, 0, 0, TAU); x.fill(); }
  lantern(x, cx - r * .38, cy - r * .2 + Math.sin(t * .8) * 10, r * .26, t, 3);
  lantern(x, cx + r * .4, cy - r * .5 + Math.sin(t * .6 + 2) * 12, r * .18, t, 5, .85);
  lantern(x, cx + r * .15, cy + r * .35 + Math.sin(t * .7 + 4) * 8, r * .13, t, 8, .7);
  x.restore();
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.stroke();
  x.strokeStyle = PAL.cobalt; x.lineWidth = 9; x.beginPath(); x.arc(cx, cy, r + 9, 0, TAU); x.stroke();
  x.strokeStyle = PAL.sumi; x.lineWidth = 1.6; x.beginPath(); x.arc(cx, cy, r + 17, 0, TAU); x.stroke();
  // vermilion tendrils curling round the frame
  x.strokeStyle = PAL.ver; x.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const a0 = -2.4 + i * 1.35, pts = []; x.lineWidth = 4 - i * .5;
    for (let k = 0; k <= 20; k++) { const a = a0 + k * .05, rr = r + 22 + Math.sin(k * .5 + i) * 8 + k * 1.4; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    x.beginPath(); smooth(x, pts); x.stroke();
    const e = pts[pts.length - 1]; x.beginPath(); for (let k = 0; k < 18; k++) { const aa = k * .5, q = 9 * (1 - k / 20); x.lineTo(e[0] + Math.cos(aa) * q, e[1] + Math.sin(aa) * q); } x.stroke();
  }
}
// horizontal label slip (cream, thick + thin border, optional red seal at left)
export function slip(x, cx, cy, lines, { size = 34, w, pad = 26, seal = null, fill = '#f7f9fc', align = 'center', bold = false, col = PAL.sumi, tab } = {}) {
  x.font = `${bold ? 700 : 500} ${size}px ${SANS}`;
  const tw = Math.max(...lines.map(s => x.measureText(s).width)), sw = seal ? size * 1.5 : 0;
  const ww = w || tw + pad * 2 + sw, hh = lines.length * size * 1.28 + pad * 1.1, x0 = cx - ww / 2, y0 = cy - hh / 2;
  x.fillStyle = fill; x.fillRect(x0, y0, ww, hh);
  if (tab) { x.fillStyle = tab; x.fillRect(x0, y0, 14, hh); }
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.strokeRect(x0, y0, ww, hh); x.lineWidth = 1.2; x.strokeRect(x0 + 6, y0 + 6, ww - 12, hh - 12);
  x.fillStyle = col; x.textBaseline = 'middle'; x.textAlign = align;
  const tx = align === 'center' ? cx + sw / 2 : x0 + pad + sw;
  lines.forEach((s, i) => x.fillText(s, tx, y0 + pad * .55 + size * 1.28 * (i + .5)));
  if (seal) { const sc = sealCanvas(seal, size * 1.05, { seed: 5 }); x.save(); x.globalCompositeOperation = 'multiply'; x.drawImage(sc, x0 + pad * .6, cy - sc.height / 2); x.restore(); }
  return { x0, y0, w: ww, h: hh };
}
function bigText(x, s, cx, cy, size, col = PAL.sumi, weight = 700, font = SANS) { x.font = `${weight} ${size}px ${font}`; x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, cx, cy); }

// the workshop interior, reused by several prints
function workshop(x, P, o = {}) {
  P(0, x => { wall(x, 640); beams(x, 640); roundWindow(x, 300, 330, 190); floor(x, 640); });
}

// ——— 0 · the seal ———
function v0(x, t, P) {
  P(0, x => { x.fillStyle = rgba(PAL.paperD, .5); x.fillRect(0, 0, W, H); });
  // the person behind the seal, printed pale, appears with "the judgment behind it"
  const e = ss(at(t, T.eye, 1.2));
  if (e > 0) { x.save(); x.globalAlpha = e * .9; ghosted(x, .5, g => kneeler(g, 860, 1060, { s: 720, dir: -1, hair: 'master', bow: .35, kimono: PAL.porc, kimono2: PAL.white, obi: PAL.beniP, pattern: 'sometsuke', flow: 1, t })); x.restore(); }
  const p = at(t, T.stamp0, .45);
  drawSeal(x, '判', 360, 520, 300, p, { seed: 4, rot: -.03 });
  if (t > T.kanji) {
    const a = ss(at(t, T.kanji, .5));
    x.save(); x.globalAlpha = a;
    slip(x, 330, 800, ['判  ·  han'], { size: 40, bold: true });
    slip(x, 330, 888, ['seal   =   judgment'], { size: 34 });
    x.restore();
  }
}

// ——— 1 · the workshop ———
function apprentices(x, t, fades = [0, 0, 0], y = 715) {
  const xs = [175, 360, 545];
  xs.forEach((px, i) => {
    zabuton(x, px - 10, y + 4, 150, PAL.beniL);
    block(x, px + 92, y - 18, 64);
    ghosted(x, fades[i], g => kneeler(g, px, y, { s: 200, dir: 1, kimono: PAL.greyD, kimono2: PAL.ai, obi: PAL.ochre, hair: 'apprentice', bow: .5, chisel: (t * .9 + i * .33) % 1, seed: i + 5 }));
  });
}
function master(x, t, o = {}) {
  return kneeler(x, o.x ?? 820, o.y ?? 1010, { s: o.s ?? 430, dir: -1, hair: 'master', kimono: PAL.porc, kimono2: PAL.white, obi: PAL.ver, pattern: 'sometsuke', flow: o.flow ?? 1, t, bow: o.bow ?? 0, reach: o.reach ?? .2, seal: o.seal, seed: 2, armLen: o.armLen, handDy: o.handDy });
}
function deskAndPrint(x, stamped, o = {}) {
  desk(x, o.x0 ?? 330, o.y0 ?? 880, o.w ?? 330);
  printSheet(x, (o.x0 ?? 330) + 170, (o.y0 ?? 880) - 10, 150, 30, { skew: 16 });
  if (stamped > 0) drawSeal(x, '判', (o.x0 ?? 330) + 224, (o.y0 ?? 880) - 14, 26, stamped, { seed: 8 });
}
function v1(x, t, P) {
  workshop(x, P);
  P(1, x => {
    apprentices(x, t);
    const look = ss(at(t, T.look, .8)), st = at(t, T.look + (DURS.C5 || 3) - .9, .3);
    deskAndPrint(x, st);
    master(x, t, { bow: .15 + .55 * look, reach: .25 + .55 * ss(at(t, T.look + (DURS.C5 || 3) - 1.5, .5)), seal: true });
  });
}

// ——— 2 · the cranes ———
const CR = [[0, 520, 860], [1, 640, 930], [2, 400, 950], [3, 560, 1010], [4, 690, 1040], [5, 430, 1060]];   // index, landing x, y
function v2(x, t, P) {
  workshop(x, P);
  P(1, x => {
    apprentices(x, t);
    deskAndPrint(x, 0, { x0: 330, y0: 820 });
    master(x, t, { x: 860, y: 990, s: 400, bow: .2, reach: .2 });
    // cranes fly in through the window and settle in a queue in front of the desk
    CR.forEach(([i, lx, ly]) => {
      const t0 = T.cranes + i * .55, u = clamp((t - t0) / 2.4); if (u <= 0) return;
      const e = eio(u), sx = 300, sy = 330;
      const px = lerp(sx, lx, e) + Math.sin(u * 5 + i) * 30 * (1 - e), py = lerp(sy, ly, e) - Math.sin(u * Math.PI) * 120;
      const flap = u < 1 ? Math.sin((t - t0) * 7 + i) : -.15 + .05 * Math.sin(t * 1.3 + i);
      crane(x, px, py, lerp(70, 120, e), { flap, sheet: true, tilt: u < 1 ? -.15 : 0, t: t + i, seed: i + 3 });
    });
  });
  P(2, x => {
    if (t > T.ratio) { x.save(); x.globalAlpha = ss(at(t, T.ratio, .5)); slip(x, 800, 250, ['6 agent hours', 'for 1 human hour'], { size: 36, bold: true, seal: '鶴' }); x.restore(); }
    if (t > T.wait) {
      const a = ss(at(t, T.wait, .5)), f = ss(at(t, T.wait + .3, 1.6)) * .8;
      x.save(); x.globalAlpha = a;
      const x0 = 565, y0 = 345, w = 470, h = 64;
      x.fillStyle = '#f7f9fc'; x.fillRect(x0, y0, w, h); x.fillStyle = PAL.beniL; x.fillRect(x0, y0, w * f, h);
      x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.strokeRect(x0, y0, w, h);
      x.font = `700 30px ${SANS}`; x.fillStyle = PAL.sumi; x.textBaseline = 'middle'; x.textAlign = 'left';
      x.fillText(`${Math.round(f * 100)}%  waiting for her eye`, x0 + 18, y0 + h / 2);
      x.restore();
    }
  });
}

// ——— 3 · the abacus (the dashboard) ———
function v3(x, t, P) {
  P(0, x => { x.fillStyle = PAL.wood; x.fillRect(0, 0, W, H); printTex(x, .25, .5); x.fillStyle = rgba(PAL.woodD, .35); for (let y = 90; y < H; y += 120) x.fillRect(0, y, W, 6); });
  P(1, x => {
    const n = 9, beads = [];
    const k = Math.max(0, Math.floor((t - T.abacus - .6) / .32));
    for (let i = 0; i < n; i++) beads.push(Math.min(9, Math.floor(hash(i * 3.1 + Math.floor((k + i * 2) / 3)) * 10 * clamp(k / 6))));
    const red = ss(at(t, T.cost, .7));
    soroban(x, 110, 420, 860, 420, beads, { red, lw: 3 });
    printSheet(x, 300, 1000, 260, 70, { skew: 30 });
    crane(x, 760, 1010, 140, { flap: -.1, sheet: true });
  });
  P(2, x => {
    slip(x, W / 2, 230, ['the dashboard'], { size: 38, bold: true, seal: '算' });
    if (t > T.cost) { x.save(); x.globalAlpha = ss(at(t, T.cost, .5)); slip(x, W / 2, 930, ['looking  →  waiting  →  cost'], { size: 36, col: PAL.beni, bold: true }); x.restore(); }
  });
}

// ——— 4 · the empty bench ———
// a paper chain of apprentices, cut one by one by vermilion scissors
function paperPerson(x, cx, cy, h, col) {
  const u = h / 100; x.save(); x.translate(cx, cy); x.scale(u, u);
  x.fillStyle = col; x.strokeStyle = PAL.sumi; x.lineWidth = 1.6 / u;
  x.beginPath(); x.arc(0, -78, 13, 0, TAU); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(-8, -64); x.lineTo(8, -64); x.lineTo(30, -50); x.lineTo(30, -42); x.lineTo(12, -46); x.lineTo(20, 0); x.lineTo(4, 0); x.lineTo(0, -24); x.lineTo(-4, 0); x.lineTo(-20, 0); x.lineTo(-12, -46); x.lineTo(-30, -42); x.lineTo(-30, -50); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = rgba(PAL.white, .7); for (let k = 0; k < 4; k++) { x.beginPath(); x.arc(-6 + k * 4, -40 + (k % 2) * 8, 1.6, 0, TAU); x.fill(); }
  x.restore();
}
function scissors(x, cx, cy, s, open) {
  x.save(); x.translate(cx, cy); x.scale(s / 100, s / 100);
  for (const sg of [-1, 1]) {
    x.save(); x.rotate(sg * open * .35);
    x.fillStyle = PAL.ver; x.strokeStyle = PAL.sumi; x.lineWidth = 2.4;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(90, sg * 4); x.lineTo(0, sg * 12); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.ellipse(-34, sg * 16, 20, 12, sg * .3, 0, TAU); x.lineWidth = 7; x.strokeStyle = PAL.sumi; x.stroke(); x.lineWidth = 4; x.strokeStyle = PAL.ver; x.stroke();
    x.restore();
  }
  x.fillStyle = PAL.porc; x.beginPath(); x.arc(0, 0, 4, 0, TAU); x.fill();
  x.restore();
}
function v4(x, t, P) {
  workshop(x, P);
  P(1, x => {
    const N = 5, X0 = 120, X1 = 520, Y = 700, d = 3.4, t0 = T.empty + .1;
    const sxp = lerp(X0 - 120, X1 + 50, clamp((t - t0) / d));
    // the string the chain hangs from
    x.strokeStyle = rgba(PAL.sumi, .55); x.lineWidth = 2; x.beginPath(); x.moveTo(X0 - 60, Y - 66); x.lineTo(X1 + 50, Y - 66); x.stroke();
    for (let i = 0; i < N; i++) {
      const cx = lerp(X0, X1, i / (N - 1)), cut = t > t0 && sxp > cx, tc = t0 + (cx - (X0 - 120)) / (X1 + 50 - (X0 - 120)) * d;
      if (!cut) { paperPerson(x, cx, Y, 140, i % 2 ? PAL.cobalt : PAL.prus); continue; }
      const f = t - tc, fall = f * f * 260 + f * 40, a = clamp(1 - f / 2.2);
      if (a <= 0) continue;
      x.save(); x.globalAlpha = a; x.translate(cx + Math.sin(f * 3 + i) * 40 * f, Y + fall); x.rotate(Math.sin(f * 2.4 + i) * .9 * f);
      paperPerson(x, 0, 0, 140, i % 2 ? PAL.cobalt : PAL.prus); x.restore();
    }
    if (t > t0 - .4 && t < t0 + d + .6) scissors(x, sxp, Y - 66, 120, .5 + .5 * Math.sin(t * 14));
    deskAndPrint(x, 1);
    master(x, t, { bow: .25, reach: .2 });
  });
  P(2, x => {
    if (t > T.pct) {
      const a = ss(at(t, T.pct, .4)), b = ss(at(t, T.pct + 1.3, .3));
      x.save(); x.globalAlpha = a;
      slip(x, 330, 960, ['junior share of technical hires, Anthropic'], { size: 26 });
      bigText(x, '27%', 160, 1070, 100, mix(PAL.sumi, PAL.greyL, b * .6));
      if (b > 0) { x.strokeStyle = rgba(PAL.beni, b); x.lineWidth = 8; x.beginPath(); x.moveTo(70, 1070); x.lineTo(70 + 180 * b, 1070); x.stroke(); }
      bigText(x, '→', 320, 1070, 80, PAL.sumi);
      x.globalAlpha = a * b; bigText(x, '9%', 470, 1070, 130, PAL.beni);
      x.restore();
    }
    if (t > T.nomaster) {
      const a = ss(at(t, T.nomaster, .5)); x.save(); x.globalAlpha = a;
      const labs = ['today: no apprentices', 'tomorrow: no masters', 'after: no judgment'];
      labs.forEach((s, i) => { const ai = ss(at(t, T.nomaster + i * ((DURS.C13 || 4) / 3), .4)); x.globalAlpha = a * ai; slip(x, 790, 170 + i * 72, [s], { size: 28, w: 400, bold: i === 2, col: i === 2 ? PAL.beni : PAL.sumi }); });
      x.restore();
    }
  });
}

// ——— 5 · the loop, as an ensō ———
const STATIONS = [
  ['firms bet on the machine', -Math.PI / 2, 'crane'],
  ['fewer apprentices', 0, 'cushion'],
  ['less judgment in the room', Math.PI / 2, 'ghost'],
  ['checking cut as a cost', Math.PI, 'abacus'],
];
function v5(x, t, P) {
  P(0, x => { const g = x.createRadialGradient(W / 2, 600, 80, W / 2, 600, 700); g.addColorStop(0, '#f4f7fb'); g.addColorStop(1, '#cdd8e6'); x.fillStyle = g; x.fillRect(0, 0, W, H); printTex(x, .03, .2); });
  const cx = W / 2, cy = 590, r = 320;
  P(1, x => {
    const u = eio(at(t, T.enso + .2, 2.6));
    if (u > 0) {
      const a0 = -Math.PI / 2 - .25, a1 = a0 + TAU * .93 * u, pts = [];
      for (let k = 0; k <= 90; k++) { const a = lerp(a0, a1, k / 90), rr = r + Math.sin(a * 3) * 7; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
      carve(x, pts, 54, { taper: [.06, .25], seed: 5, jit: .4, col: rgba(PAL.sumi, .9) });
      // dry-brush bristle streaks in cobalt along the stroke
      x.strokeStyle = rgba(PAL.cobalt, .5); x.lineCap = 'round';
      for (let j = -3; j <= 3; j++) { x.lineWidth = 1.4; x.beginPath(); pts.forEach(([px, py], k) => { const a = lerp(a0, a1, k / 90), o = j * 6 + Math.sin(k * .7 + j) * 2; const qx = px + Math.cos(a) * o, qy = py + Math.sin(a) * o; k ? x.lineTo(qx, qy) : x.moveTo(qx, qy); }); x.stroke(); }
      // the brush tip, still painting
      if (u < 1) { const e = pts[pts.length - 1]; x.fillStyle = PAL.sumi; x.beginPath(); x.ellipse(e[0], e[1], 14, 30, a1, 0, TAU); x.fill(); }
    }
    STATIONS.forEach(([lab, a, icon], i) => {
      const s = ss(at(t, T.enso + .5 + i * .75, .4)); if (s <= 0) return;
      const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
      x.save(); x.globalAlpha = s; x.translate(px, py); x.scale(.6 + .4 * s, .6 + .4 * s);
      x.fillStyle = PAL.porc; x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 62, 0, TAU); x.fill(); x.stroke();
      x.strokeStyle = PAL.cobalt; x.lineWidth = 2; x.beginPath(); x.arc(0, 0, 54, 0, TAU); x.stroke();
      if (icon === 'crane') crane(x, -6, 18, 70, { flap: Math.sin(t * 5) * .7, t, seed: 2 });
      else if (icon === 'cushion') { zabuton(x, -4, 14, 80, PAL.beniL); x.font = `400 40px 'Yuji Syuku'`; x.fillStyle = rgba(PAL.sumi, .25); x.textAlign = 'center'; x.fillText('空', 0, -16); }
      else if (icon === 'ghost') { ghosted(x, .7, g => kneeler(g, 0, 40, { s: 92, dir: -1, hair: 'master', kimono: PAL.porc, kimono2: PAL.white, obi: PAL.ver, pattern: 'sometsuke' })); }
      else { soroban(x, -40, -24, 80, 48, [3, 7, 1, 9], { red: 1, lw: 1.6 }); }
      x.restore();
      x.save(); x.globalAlpha = s; const ly = py + (a < -.1 ? -92 : 94);
      slip(x, Math.min(W - 170, Math.max(170, px)), ly, [lab], { size: 23, pad: 14 }); x.restore();
    });
    // a vermilion bead runs round the loop, faster each turn
    if (t > T.enso + 3.2) {
      const tt = t - T.enso - 3.2, ang = -Math.PI / 2 + tt * tt * .35 + tt * .9;
      for (let k = 0; k < 10; k++) { const aa = ang - k * .06; x.fillStyle = rgba(PAL.ver, .9 - k * .085); x.beginPath(); x.arc(cx + Math.cos(aa) * r, cy + Math.sin(aa) * r, 13 - k * .9, 0, TAU); x.fill(); }
    }
  });
  P(2, x => {
    if (t > T.pays) { x.save(); x.globalAlpha = ss(at(t, T.pays, .4)); bigText(x, 'and again', cx, cy - 20, 52, PAL.beni, 700); bigText(x, 'and again', cx, cy + 46, 40, rgba(PAL.beni, .6), 500); x.restore(); }
  });
}

// ——— 6 · the model: 500 futures fall like rain ———
const DIALS = ['how fast AI improves', 'how far ahead firms bet', 'looking counted as cost', 'apprentices protected'];
function v6(x, t, P) {
  P(0, x => { bokashi(x, 0, 0, W, 520, PAL.prusL, .55, 0, { seed: 9, col2: PAL.skyL }); });
  P(1, x => {
    // dials: bronze discs that turn
    DIALS.forEach((s, i) => {
      const cx = 180 + i * 240, cy = 210, rr = 62, turn = ss(at(t, T.dials + i * .5, 1.2)) * (1.4 + i * .3);
      x.fillStyle = PAL.ochre; x.beginPath(); x.arc(cx, cy, rr, 0, TAU); x.fill(); x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.stroke();
      x.beginPath(); x.arc(cx, cy, rr * .72, 0, TAU); x.strokeStyle = PAL.woodD; x.lineWidth = 2; x.stroke();
      x.strokeStyle = PAL.beni; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(-2.2 + turn) * rr * .78, cy + Math.sin(-2.2 + turn) * rr * .78); x.stroke();
      x.font = `500 21px ${SANS}`; x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'top';
      const ws = s.split(' '), half = Math.ceil(ws.length / 2); x.fillText(ws.slice(0, half).join(' '), cx, cy + rr + 12); x.fillText(ws.slice(half).join(' '), cx, cy + rr + 36);
    });
    // axis: years down, judgment across
    const X0 = 170, X1 = 930, Y0 = 440, Y1 = 960, yrs = RUNS.years, n = yrs.length;
    const px = v => lerp(X0, X1, clamp(v)), py = i => lerp(Y0, Y1, i / (n - 1));
    x.strokeStyle = rgba(PAL.sumi, .5); x.lineWidth = 2; x.beginPath(); x.moveTo(X0, Y0 - 10); x.lineTo(X0, Y1 + 10); x.moveTo(X1, Y0 - 10); x.lineTo(X1, Y1 + 10); x.stroke();
    x.font = `600 26px ${SANS}`; x.fillStyle = PAL.sumi; x.textAlign = 'right'; x.textBaseline = 'middle';
    x.fillText('2026', X0 - 14, Y0); x.fillText('2040', X0 - 14, py(14)); x.fillText('2060', X0 - 14, Y1);
    x.textAlign = 'center'; x.font = `500 24px ${SANS}`;
    x.fillText('no judgment', X0 + 40, Y1 + 42); x.fillText('full judgment', X1 - 50, Y1 + 42);
    x.fillText('judgment behind the seal  →', W / 2 + 40, Y1 + 42);
    const g = ss(at(t, T.falls, (DURS.C21 || 7) * .8)), upto = g * (n - 1);
    if (g > 0) {
      x.lineWidth = 1.1; x.strokeStyle = rgba(PAL.prus, .085);
      for (let r = 0; r < RUNS.runs.length; r++) {
        const R = RUNS.runs[r]; x.beginPath(); x.moveTo(px(R[0]), py(0));
        for (let i = 1; i <= Math.floor(upto); i++) x.lineTo(px(R[i]), py(i));
        x.stroke();
      }
      x.strokeStyle = PAL.beni; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(px(RUNS.med[0]), py(0));
      for (let i = 1; i <= Math.floor(upto); i++) x.lineTo(px(RUNS.med[i]), py(i)); x.stroke();
    }
  });
  P(2, x => { slip(x, W / 2, 372, ['500 simulated futures · software'], { size: 28 }); });
}

// ——— 7 · the seal remains (the peak) ———
function v7(x, t, P) {
  P(0, x => { wall(x, 560, PAL.plaster); x.fillStyle = PAL.woodD; x.fillRect(0, 540, W, 20); floor(x, 560); });
  if (t < T.print7) return;
  P(1, x => {
    const fade = ss(at(t, T.fade + .3, 3.4)) * .93;
    // the stack of stamped prints grows
    const k = Math.max(0, Math.floor((t - T.print7 - .4) / 1.25)), ph = ((t - T.print7 - .4) % 1.25) / 1.25;
    desk(x, 250, 900, 520, 26, 3);
    for (let i = 0; i < Math.min(k, 12); i++) { x.fillStyle = PAL.white; x.strokeStyle = PAL.sumi; x.lineWidth = 2; x.beginPath(); poly(x, [[400, 892 - i * 5], [610, 892 - i * 5], [632, 876 - i * 5], [422, 876 - i * 5]]); x.fill(); x.stroke(); drawSeal(x, '判', 525, 884 - i * 5, 22, 1, { seed: 9 + i }); }
    // a crane brings the next print each beat
    crane(x, lerp(-60, 330, eo(clamp(ph * 2))), 780 - 40 * Math.sin(ph * Math.PI), 130, { flap: Math.sin(t * 8), sheet: ph < .5 });
    const reach = .55 + .25 * Math.sin(clamp((ph - .45) / .35) * Math.PI);
    let hand;
    ghosted(x, fade, g => { hand = master(g, t, { x: 860, y: 1060, s: 700, bow: .45, reach, seal: false }).hand; });
    // the seal and the hand that holds it stay fully printed
    // the seal travels from her hand to the top of the stack and presses down on every beat
    const top = 876 - Math.min(k, 12) * 5, m = ss(clamp((ph - .35) / .2)) * (1 - ss(clamp((ph - .82) / .15)));
    const press = ph > .55 && ph < .75 ? 1 : 0;
    const sx = lerp(hand[0] - 20, 524, m), sy = lerp(hand[1] + 15, top - 46 + 8 * press, m);
    x.fillStyle = PAL.woodL; x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.beginPath(); poly(x, [[sx - 14, sy - 45], [sx + 14, sy - 45], [sx + 14, sy + 45], [sx - 14, sy + 45]]); x.fill(); x.stroke();
    x.fillStyle = PAL.beni; x.fillRect(sx - 14, sy + 37, 28, 10);
    if (press) { x.strokeStyle = rgba(PAL.ver, .5); x.lineWidth = 2; for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI; x.beginPath(); x.moveTo(sx + Math.cos(a) * 30, top + 4 + Math.sin(a) * 6); x.lineTo(sx + Math.cos(a) * 46, top + 4 + Math.sin(a) * 9); x.stroke(); } }
    if (fade > .5) { x.save(); x.globalAlpha = (fade - .5) * 2; slip(x, 760, 330, ['nobody behind the seal'], { size: 32, col: PAL.beni }); x.restore(); }
  });
}

// ——— 8 · Europe and America ———
function seals100(x, x0, y0, n, t0, t, cell = 38) {
  for (let i = 0; i < 100; i++) {
    const cx = x0 + (i % 10) * cell, cy = y0 + Math.floor(i / 10) * cell, p = clamp((t - t0 - i * .022) / .25);
    if (p <= 0) continue;
    const hollow = i < n;
    if (hollow) drawSeal(x, '判', cx, cy, cell * .78, p, { seed: i });
    else { x.save(); x.globalAlpha = p; x.fillStyle = PAL.prusL; x.beginPath(); x.arc(cx, cy, cell * .3, 0, TAU); x.fill(); x.restore(); }
  }
}
function v8(x, t, P) {
  P(0, x => { x.fillStyle = rgba(PAL.paperD, .6); x.fillRect(0, 0, W, H); x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.beginPath(); x.moveTo(W / 2, 120); x.lineTo(W / 2, 1090); x.stroke(); });
  P(1, x => {
    const cols = [['EUROPE', 300, .20, 94], ['AMERICA', 780, .15, 44]];
    cols.forEach(([name, cx, judg, n], i) => {
      bigText(x, name, cx, 170, 48, PAL.sumi, 700);
      // the judgment gauge (index, 2026 = 100)
      const g = ss(at(t, T.helps, 1.0));
      x.font = `500 24px ${SANS}`; x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.fillText('judgment left in 2060', cx, 240);
      x.fillStyle = '#f7f9fc'; x.fillRect(cx - 170, 262, 340, 40); x.fillStyle = PAL.prus; x.fillRect(cx - 170, 262, 340 * judg * g, 40);
      x.strokeStyle = PAL.sumi; x.lineWidth = 2.5; x.strokeRect(cx - 170, 262, 340, 40);
      x.font = `700 30px ${SANS}`; x.fillStyle = PAL.sumi; x.textAlign = 'left'; x.fillText(String(Math.round(judg * 100 * g)), cx - 170 + 340 * judg * g + 12, 284);
      // 100 futures: a red seal = a seal nobody really stands behind
      seals100(x, cx - 182, 380, n, T.seal8 + .6 + i * 1.6, t, 40);
      const p = ss(at(t, T.seal8 + 2.6 + i * 1.6, .4));
      x.save(); x.globalAlpha = p; bigText(x, String(n), cx, 850, 96, PAL.beni, 700); x.font = `500 26px ${SANS}`; x.fillText('futures in 100', cx, 915); x.restore();
    });
    const k = ss(at(t, T.seal8 + .3, .5));
    x.save(); x.globalAlpha = k;
    drawSeal(x, '判', 120, 1010, 34, 1, { seed: 3 }); x.font = `500 26px ${SANS}`; x.fillStyle = PAL.sumi; x.textAlign = 'left'; x.fillText('= a seal nobody stands behind', 150, 1000); x.fillText('one future, software, 2060', 150, 1036); x.fillStyle = PAL.prusL; x.beginPath(); x.arc(120, 1080, 12, 0, TAU); x.fill(); x.fillStyle = PAL.sumi; x.fillText('= judgment still behind it', 150, 1080);
    x.restore();
  });
}

// ——— 9 · unfinished ———
function v9(x, t, P) {
  // the workshop with its key lines only: the colour blocks never landed
  P(1, x => {
    x.strokeStyle = PAL.sumi; x.lineWidth = 2.4;
    x.beginPath(); x.moveTo(0, 700); x.lineTo(W, 700); x.stroke(); for (let k = -6; k < 14; k++) { x.beginPath(); x.moveTo(k * 140, 700); x.lineTo(k * 140 - 330, 1300); x.stroke(); }
    x.save(); x.globalAlpha = .9; ghosted(x, .9, g => master(g, t, { bow: .25 })); x.restore();
    desk(x, 330, 880, 330);
    x.font = `700 34px ${SANS}`; x.fillStyle = PAL.beni; x.textAlign = 'left'; x.textBaseline = 'middle';
    x.fillText('✕  misses 3 of its 4 reality checks', 90, 180);
    x.font = `500 26px ${SANS}`; x.fillStyle = PAL.sumi; x.fillText('✕  its Europe result rests partly on my assumptions', 90, 232);
  });
  P(2, x => {
    const gaps = [['the hidden workers', 'behind the cranes', 290, 400], ['India', '', 780, 400], ['the Global South', '', 290, 580]];
    gaps.forEach(([a, b, cx, cy], i) => {
      const s = ss(at(t, T.gaps + i * .9, .4)); if (s <= 0) return;
      x.save(); x.globalAlpha = s; x.setLineDash([10, 9]); x.strokeStyle = PAL.beni; x.lineWidth = 3; x.strokeRect(cx - 170, cy - 70, 340, 140); x.setLineDash([]);
      bigText(x, a, cx, cy - (b ? 18 : 0), 30, PAL.sumi, 700); if (b) bigText(x, b, cx, cy + 22, 26, PAL.sumi, 500); x.restore();
    });
    if (t > T.q) {
      const s = ss(at(t, T.q, .5)); x.save(); x.globalAlpha = s;
      drawSeal(x, '？', 780, 590, 130, at(t, T.q, .35), { seed: 12 });
      slip(x, W / 2, 790, ['How often does a human seal', 'change what the machine proposed?', 'Nobody publishes it.'], { size: 32, align: 'center', w: 760 });
      x.restore();
    }
  });
}

// ——— 10 · why fix it ———
function vWhy(x, t, P) {
  P(0, x => { x.fillStyle = PAL.paper; x.fillRect(0, 0, W, H); bokashi(x, 0, 0, W, 520, PAL.skyL, .8, 0, { seed: 9 }); });
  P(1, x => {
    // the balance: a seal on one pan, an eye on the other
    const r = ss(at(t, T.why, .8)); if (r <= 0) return;
    const tilt = .16 * Math.sin(Math.min(1, Math.max(0, (t - T.why) / 3)) * Math.PI * .5);
    x.save(); x.globalAlpha = r; const cx = W / 2, cy = 640;
    x.fillStyle = PAL.woodD; x.fillRect(cx - 9, cy, 18, 330); x.fillRect(cx - 120, cy + 320, 240, 22);
    x.translate(cx, cy); x.rotate(tilt);
    x.fillStyle = PAL.woodL; x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.fillRect(-330, -10, 660, 20); x.strokeRect(-330, -10, 660, 20);
    for (const sx of [-1, 1]) {
      x.save(); x.translate(sx * 310, 0); x.rotate(-tilt);
      x.strokeStyle = PAL.sumi; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(-90, 170); x.moveTo(0, 0); x.lineTo(90, 170); x.stroke();
      x.fillStyle = PAL.ochre; x.beginPath(); x.ellipse(0, 175, 110, 24, 0, 0, TAU); x.fill(); x.stroke();
      if (sx < 0) drawSeal(x, '判', 0, 120, 96, 1, { seed: 44 });
      else { x.fillStyle = '#f7f9fc'; x.beginPath(); x.ellipse(0, 125, 62, 34, 0, 0, TAU); x.fill(); x.lineWidth = 3; x.stroke(); x.fillStyle = PAL.prus || PAL.sumi; x.beginPath(); x.arc(0, 125, 20, 0, TAU); x.fill(); x.fillStyle = PAL.sumi; x.beginPath(); x.arc(0, 125, 8, 0, TAU); x.fill(); }
      x.restore();
    }
    x.restore();
    x.save(); x.globalAlpha = r; bigText(x, 'signature', cx - 310, 1010, 30, PAL.sumi, 700); bigText(x, 'judgment', cx + 310, 1010, 30, PAL.sumi, 700); x.restore();
  });
  P(2, x => {
    const a = ss(at(t, T.why + .3, .5));
    if (a > 0) { x.save(); x.globalAlpha = a; bigText(x, 'Used before the cuts,', W / 2, 150, 50, PAL.sumi, 700); bigText(x, 'not after.', W / 2, 218, 50, PAL.beni, 700); x.restore(); }
    const c = ss(at(t, T.co, .45));
    if (c > 0) { x.save(); x.globalAlpha = c; slip(x, W / 2, 360, ['A company: how much judgment', 'will it still have in ten years?'], { size: 30, w: 820, seal: '社', tab: PAL.prusL }); x.restore(); }
    const g = ss(at(t, T.reg, .45));
    if (g > 0) { x.save(); x.globalAlpha = g; slip(x, W / 2, 490, ['A regulator: does this rule protect', 'judgment, or only signatures?'], { size: 30, w: 820, seal: '法', tab: PAL.beni }); x.restore(); }
  });
}

// ——— 11 · your turn ———
const OPEN = ['the model', 'the code', 'the sources', 'the mistakes'];
function v10(x, t, P) {
  P(0, x => { bokashi(x, 0, 0, W, H, PAL.paperD, .7, 0, { seed: 12 }); });
  P(1, x => {
    for (let i = 0; i < 6; i++) { const t0 = T.seals + 1.2 + i * .7, u = t - t0; if (u <= 0) continue; lantern(x, 160 + i * 150 + Math.sin(u + i) * 20, 1150 - u * 70 - i * 20, 34 + (i % 3) * 10, t, 10 + i, clamp(u / 1.5) * clamp((1100 - u * 70) / 400)); }
    const d = (DURS.C34 || 4) * .9;
    OPEN.forEach((s, i) => {
      const t0 = T.seals + .9 + i * d / 5, p = at(t, t0, .3);
      drawSeal(x, '開', 180 + i * 240, 260, 110, p, { seed: 20 + i });
      if (p > 0) { x.save(); x.globalAlpha = ss(p); bigText(x, s, 180 + i * 240, 360, 30, PAL.sumi, 700); x.restore(); }
    });
    // the brush, offered to the viewer
    const b = eo(at(t, T.brush, 1.2));
    if (b > 0) {
      x.save(); x.translate(lerp(1250, 620, b), lerp(1200, 760, b)); x.rotate(-.75);
      x.fillStyle = PAL.woodL; x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.fillRect(-14, -330, 28, 360); x.strokeRect(-14, -330, 28, 360);
      x.fillStyle = PAL.beni; x.fillRect(-15, -300, 30, 18);
      fillPath(x, [[-20, 30], [20, 30], [12, 110], [0, 150], [-12, 110]], PAL.sumi);
      x.restore();
    }
  });
}

export const VIEWS = [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, vWhy, v10].map(f => (x, t, P) => { NOW = t; f(x, t, P); });
export const TITLES = [['判', 'The seal'], ['工房', 'The workshop'], ['鶴', 'The cranes'], ['算盤', 'The dashboard'], ['空席', 'The empty bench'], ['円相', 'The loop'], ['五百', 'The model'], ['判', 'The seal remains'], ['欧米', 'Europe and America'], ['未完', 'Unfinished'], ['直', 'Why fix it'], ['筆', 'Your turn']];
