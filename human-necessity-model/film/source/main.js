// The Seal Remains — main: camera on a handscroll, sheets, subtitles, catchphrase cards, end card, sound events
import { clamp, lerp, seg, ss, eio, eo, hash, TAU } from '/core/lib.js';
import { W, H, FR, PAL, TX, buildTextures, stampFn, drawSeal, sealCanvas, cartouche, rgba } from './print.js';
import { VIEWS, TITLES, slip } from './views.js';
import { T, VO, CARD, CARDS, SHEET, NSHEET, DUR, SL, DURS, LINES } from './story.js';

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const QS = new URLSearchParams(location.search);
const SANS = "'Shippori Mincho B1'";
await Promise.all([
  document.fonts.load(`400 40px 'Yuji Syuku'`, '判工房鶴算盤空席円相五百欧米未完直筆開？社法'),
  document.fonts.load(`500 40px ${SANS}`, 'Aa判'), document.fonts.load(`700 40px ${SANS}`, 'Aa'),
]);
buildTextures();

const LINE = Object.fromEntries(LINES.map(l => [l.id, l]));
// long clips are split into sentence chunks, each boundary snapped to the nearest pause in Carla's voice
function chunks(text, max = 88) {
  const sent = text.match(/[^.?!:]+[.?!:]+["”]?\s*|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean), out = [];
  for (const s of sent) { if (out.length && (out[out.length - 1] + ' ' + s).length <= max && out[out.length - 1].length < 34) out[out.length - 1] += ' ' + s; else out.push(s); }
  return out;
}
export const SUBS = [];
for (const [id, t0] of Object.entries(VO)) {
  const l = LINE[id]; if (!l || !l.sub) continue;
  const d = DURS[id] || 3, cs = l.sub.length > 95 ? chunks(l.sub) : [l.sub], tot = cs.reduce((a, c) => a + c.length, 0);
  let acc = 0, a = t0;
  cs.forEach((c, k) => {
    acc += c.length; let b = t0 + d * acc / tot;
    if (k < cs.length - 1 && l.gaps?.length) { const g = l.gaps.reduce((p, q) => Math.abs(t0 + q - b) < Math.abs(t0 + p - b) ? q : p); if (Math.abs(t0 + g - b) < 1.2) b = t0 + g; }
    else if (k === cs.length - 1) b = t0 + Math.max(1.8, d + .5);
    SUBS.push({ id, t0: a, t1: b, text: c }); a = b;
  });
}
SUBS.sort((p, q) => p.t0 - q.t0);
SUBS.forEach((s, i) => { if (SUBS[i + 1] && s.t1 > SUBS[i + 1].t0 - .08) s.t1 = SUBS[i + 1].t0 - .08; });

// ——— the scroll: sheet i sits at world x = i * PITCH ———
const PITCH = W + 150, TOTAL = (NSHEET - 1) * PITCH + W;
const C = i => [i * PITCH + W / 2, H / 2];
function camera(t) {
  let cx = C(0)[0], cy = H / 2, z = 1;
  for (let i = 1; i < NSHEET; i++) {
    const s = T['slide' + i];
    if (t >= s[0] && t < s[1]) { const u = eio(seg(t, s[0], s[1])); cx = lerp(C(i - 1)[0], C(i)[0], u); z = 1 - .06 * Math.sin(u * Math.PI); return { cx, cy, z }; }
    if (t >= s[1]) cx = C(i)[0];
  }
  // a slow push on every sheet; the peak pushes further
  const i = cur(t), a = SHEET[i][0], b = SHEET[i][1];
  z = 1 + (i === 7 ? .035 : .02) * ss(seg(t, a, b));
  // the ending: pull back to the whole scroll
  if (t >= T.pull) { const u = eio(seg(t, T.pull, T.pull + 2.8)), zEnd = (W * .95) / (4.2 * PITCH); z = Math.exp(lerp(Math.log(z), Math.log(zEnd), u)); cx = lerp(cx, TOTAL - 2.1 * PITCH + 75, u); cy = lerp(cy, H / 2 - 80, u); }
  return { cx, cy, z };
}
const cur = t => { let i = 0; for (let k = 0; k < NSHEET; k++) if (t >= SHEET[k][0] - SL) i = k; return i; };
const mat = c => [c.z, 0, 0, c.z, W / 2 - c.z * c.cx, H / 2 - c.z * c.cy];

// printing reveal per sheet and group
function revealFor(i, g, t) {
  const t0 = (i === 7 ? T.print7 : SHEET[i][0] - .55) + g * .32;
  if (i === 0) return clamp((t - (.1 + g * .2)) / .35);
  return clamp((t - t0) / .38);
}
function drawSheet(i, t, M) {
  ctx.save(); ctx.setTransform(...M);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  if (i % 2) { ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); ctx.drawImage(TX.paper, 0, 0); ctx.restore(); } else ctx.drawImage(TX.paper, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x0, FR.y0, FR.x1 - FR.x0, FR.y1 - FR.y0); ctx.clip();
  const P = (g, fn) => { const r = revealFor(i, g, t); if (r >= 1) fn(ctx); else stampFn(ctx, fn, r, [[4, -5], [-6, 4], [5, 5]][g]); };
  VIEWS[i](ctx, t, P);
  ctx.restore();
  // border
  const rb = revealFor(i, 0, t);
  stampFn(ctx, x => { x.strokeStyle = PAL.sumi; x.lineWidth = 3.4; x.strokeRect(FR.x0, FR.y0, FR.x1 - FR.x0, FR.y1 - FR.y0); x.lineWidth = 1.3; x.strokeRect(FR.x0 - 9, FR.y0 - 9, FR.x1 - FR.x0 + 18, FR.y1 - FR.y0 + 18); }, rb, [4, -5]);
  // chapter: vertical cartouche (kanji) at the right edge + English title slip at the top left
  const rt = revealFor(i, 2, t);
  if (rt > 0 && !(i === 7 && t < T.print7)) {
    stampFn(ctx, x => {
      cartouche(x, 985, 70, TITLES[i][0], { series: '', w: 66, size: 44 });
      x.font = `700 30px ${SANS}`; const tw = x.measureText(TITLES[i][1]).width, x0 = 66, y0 = 64, w = tw + 104, h = 56;
      x.fillStyle = '#f7f9fc'; x.fillRect(x0, y0, w, h); x.fillStyle = PAL.beniL; x.fillRect(x0, y0, 56, h);
      x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.strokeRect(x0, y0, w, h); x.lineWidth = 1.2; x.strokeRect(x0 + 5, y0 + 5, w - 10, h - 10);
      x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 26px ${SANS}`; x.fillText(['一','二','三','四','五','六','七','八','九','十','十一','十二'][i], x0 + 28, y0 + h / 2 + 1);
      x.textAlign = 'left'; x.font = `700 30px ${SANS}`; x.fillText(TITLES[i][1], x0 + 74, y0 + h / 2 + 2);
    }, rt, [0, -10]);
  }
  ctx.globalAlpha = 1; ctx.drawImage(TX.fiber, 0, 0);
  ctx.restore(); ctx.restore();
}
function drawMount(M) {
  ctx.save(); ctx.setTransform(...M);
  ctx.fillStyle = PAL.mount; ctx.fillRect(-140, -90, TOTAL + 280, H + 180);
  ctx.globalAlpha = .5; ctx.globalCompositeOperation = 'multiply';
  for (let X = -140; X < TOTAL + 140; X += W) ctx.drawImage(TX.paper, X, -90, W, H + 180);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = PAL.mountD; ctx.fillRect(-140, -90, TOTAL + 280, 30); ctx.fillRect(-140, H + 60, TOTAL + 280, 30);
  const g = ctx.createLinearGradient(-260, 0, -140, 0); g.addColorStop(0, '#8f7a55'); g.addColorStop(.4, '#d8c69c'); g.addColorStop(1, '#8a744e');
  ctx.fillStyle = g; ctx.fillRect(-260, -120, 120, H + 240);
  ctx.restore();
}

// ——— subtitles: a cream slip with a red seal, near the bottom ———
function wrap(text, max, font) { ctx.font = font; const ws = text.split(' '), out = []; let l = ''; for (const w of ws) { const tl = l ? l + ' ' + w : w; if (ctx.measureText(tl).width > max && l) { out.push(l); l = w; } else l = tl; } if (l) out.push(l); return out; }
function subtitle(t) {
  if (QS.has('nosub')) return;
  const s = SUBS.find(s => t >= s.t0 - .05 && t < s.t1); if (!s) return;
  const a = clamp((t - s.t0 + .05) / .2), fo = 1 - clamp((t - (s.t1 - .22)) / .22);
  const font = `500 36px ${SANS}`, lines = wrap(s.text, 860, font), lh = 46, h = lines.length * lh + 34, w = 960, x0 = (W - w) / 2, y0 = H - 66 - h;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fo;
  stampFn(ctx, x => {
    x.fillStyle = 'rgba(247,249,252,.95)'; x.fillRect(x0, y0, w, h);
    x.strokeStyle = PAL.sumi; x.lineWidth = 2.6; x.strokeRect(x0, y0, w, h); x.lineWidth = 1; x.strokeRect(x0 + 5, y0 + 5, w - 10, h - 10);
    x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = font;
    lines.forEach((l, k) => x.fillText(l, W / 2 + 18, y0 + 17 + lh * (k + .5) + 1));
  }, a, [0, 0]);
  const sc = sealCanvas('判', 34, { seed: 17 }); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = fo * a * .9; ctx.drawImage(sc, x0 + 18, y0 + h / 2 - sc.height / 2);
  ctx.restore();
}

// ——— catchphrase cards ———
function card(t) {
  for (const [k, [t0, t1]] of Object.entries(CARD)) {
    if (t < t0 || t >= t1 + .35) continue;
    const a = clamp((t - t0) / .35), fo = 1 - clamp((t - t1) / .35), lines = CARDS[k];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = .55 * a * fo; ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = fo;
    const L = Math.max(...lines.map(s => s.length)), size = L > 34 ? 44 : L > 26 ? 52 : 64;
    stampFn(ctx, x => {
      x.font = `700 ${size}px ${SANS}`; const tw = Math.max(...lines.map(s => x.measureText(s).width)), w = Math.min(980, tw + 120), h = lines.length * size * 1.3 + 110, x0 = (W - w) / 2, y0 = H / 2 - h / 2 - 60;
      x.fillStyle = '#f7f9fc'; x.fillRect(x0, y0, w, h); x.fillStyle = PAL.beniL; x.fillRect(x0, y0 + h - 26, w, 26);
      x.strokeStyle = PAL.sumi; x.lineWidth = 4; x.strokeRect(x0, y0, w, h); x.lineWidth = 1.5; x.strokeRect(x0 + 8, y0 + 8, w - 16, h - 16);
      x.fillStyle = PAL.sumi; x.textAlign = 'center'; x.textBaseline = 'middle';
      lines.forEach((s, i) => { x.fillStyle = i === lines.length - 1 && lines.length > 1 ? PAL.beni : PAL.sumi; x.fillText(s, W / 2, y0 + 45 + size * 1.3 * (i + .5)); });
      card._b = { x0, y0, w, h };
    }, a, [0, -12]);
    if (card._b) drawSeal(ctx, '判', card._b.x0 + card._b.w - 30, card._b.y0 + card._b.h + 10, 76, clamp((t - t0 - .5) / .3), { seed: 31, rot: .05 });
    ctx.restore();
  }
}

// ——— end card over the whole scroll ———
function endCard(t) {
  const a = ss(seg(t, T.end, T.end + .8)); if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a * .9; ctx.fillStyle = '#1c1a17'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = a;
  ctx.fillStyle = PAL.paper; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 74px ${SANS}`; ctx.fillText('The Seal Remains', W / 2, 270);
  ctx.font = `500 34px ${SANS}`; ctx.fillText('When people still sign, but no longer judge', W / 2, 345);
  ctx.font = `500 30px ${SANS}`; ctx.fillStyle = PAL.beniL;
  ctx.fillText('Run the model in your browser', W / 2, 520); ctx.fillStyle = PAL.paper; ctx.font = `700 30px ${SANS}`;
  ctx.font = `700 25px ${SANS}`; ctx.fillText('mommythegeek.github.io/protect-what-thinks/human-necessity-model', W / 2, 568);
  ctx.font = `500 30px ${SANS}`; ctx.fillStyle = PAL.beniL; ctx.fillText('Code, sources, mistakes: open an issue', W / 2, 680);
  ctx.fillStyle = PAL.paper; ctx.font = `700 30px ${SANS}`; ctx.fillText('github.com/Mommythegeek/protect-what-thinks', W / 2, 728);
  ctx.font = `500 30px ${SANS}`; ctx.fillStyle = PAL.paper; ctx.fillText('The article is in the post.', W / 2, 840);
  ctx.font = `500 22px ${SANS}`; ctx.globalAlpha = a * .75;
  ['Written by Carla de Préval · Made entirely in code with Claude (Anthropic)', 'Ukiyo-e engine: Lemo-Opuscar (MIT) · Voice: Carla de Préval', 'Data: Human Necessity Model v1.3 · Anthropic figures: “How employment', 'is changing at Anthropic”, 16 Oct 2026'].forEach((l, k) => ctx.fillText(l, W / 2, 1090 + k * 36));
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); drawSeal(ctx, '判', W / 2, 980, 86, clamp((t - T.end - .6) / .3), { seed: 40, normal: true }); ctx.restore();
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#161a22'; ctx.fillRect(0, 0, W, H);
  const cam = camera(t), M = mat(cam);
  drawMount(M);
  const half = (W / 2) / cam.z * 1.15;
  for (let i = 0; i < NSHEET; i++) {
    const x0 = i * PITCH; if (x0 + W < cam.cx - half || x0 > cam.cx + half) continue;
    const Mi = [M[0], M[1], M[2], M[3], M[4] + M[0] * x0, M[5]];
    const ti = t >= T.pull ? Math.min(t, SHEET[i][1] - (CARD['ABCDE'[0]] ? .01 : 0)) : t;
    drawSheet(i, t >= T.pull && i < NSHEET - 1 ? SHEET[i][1] - .05 : ti, Mi);
  }
  if (t < T.pull) { subtitle(t); }
  card(t);
  endCard(t);
}

// ——— sound and cue events for the mixer ———
function events() {
  const ev = [], add = (type, t, o = {}) => ev.push({ t: +t.toFixed(3), type, ...o });
  for (const [id, t0] of Object.entries(VO)) add('vo', t0, { id });
  for (let i = 1; i < NSHEET; i++) add('scroll', T['slide' + i][0], { d: SL });
  for (let i = 1; i < NSHEET; i++) if (i !== 7) { add('block', SHEET[i][0] - .6); add('baren', SHEET[i][0] - .5, { d: .4 }); }
  add('baren', .1, { d: .4 }); add('seal', T.stamp0, { v: 1.2 });
  add('seal', T.look + (DURS.C5 || 3) - .9, { v: .8 });
  for (let i = 0; i < 6; i++) add('flap', T.cranes + i * .55, { d: 2.4 });
  for (let k = 0; k < 22; k++) add('bead', T.abacus + .6 + k * .32, { v: .5 + (k % 3) * .2 });
  add('taiko', T.cost);
  for (let i = 0; i < 5; i++) { const cx = 120 + i * 100, tc = T.empty + .1 + cx / 570 * 3.4; add('snip', tc - .05, { v: .8 }); add('flap', tc + .1, { d: 1.6 }); }
  for (let k = 0; k < 9; k++) { const q = k + 1, u = (-.9 + Math.sqrt(.81 + 4 * .35 * TAU * q)) / (2 * .35); add('tick', T.enso + 3.2 + u, { v: .7 }); }
  for (let i = 0; i < 6; i++) add('bell', T.seals + 1.2 + i * .7, { v: .25 });
  add('seal', T.pct + 1.3, { v: .9 });
  add('brush', T.enso + .2, { d: 2.6 });
  add('rain', T.falls, { d: (DURS.C21 || 7) + 1.4 });
  add('ma', T.ma, { d: 1.5 });
  add('baren', T.print7, { d: .45 }); add('block', T.print7 - .1);
  for (let tt = T.print7 + .4 + 1.25 * .62; tt < CARD.C[0]; tt += 1.25) add('seal', tt, { v: .75 });
  for (let i = 0; i < 2; i++) for (let k = 0; k < 100; k += 4) add('tick', T.seal8 + .6 + i * 1.6 + k * .022, { v: .35 });
  for (const k of Object.keys(CARD)) { add('taiko', CARD[k][0] + .02, { v: k === 'C' ? 1.3 : 1 }); add('seal', CARD[k][0] + .5, { v: .9 }); }
  add('seal', T.q, { v: .8 });
  for (let i = 0; i < 4; i++) add('seal', T.seals + .9 + i * (DURS.C34 || 4) * .9 / 5, { v: .8 });
  add('scroll', T.pull, { d: 3.2 }); add('bell', T.end + .6);
  for (const [k, v] of Object.entries(T)) if (typeof v === 'number') add('mark', v, { k });
  for (let i = 0; i < NSHEET; i++) add('sheet', SHEET[i][0], { i, end: SHEET[i][1] });
  for (const [k, [a, b]] of Object.entries(CARD)) add('card', a, { k, end: b });
  return ev.sort((a, b) => a.t - b.t);
}

window.render = render; window.DUR = DUR; window.EV = events(); window.SUBS = SUBS; window.T = T; window.CARD = CARD;
window.TEXTS = t => { const s = SUBS.find(s => t >= s.t0 && t < s.t1); return s ? [{ id: 'sub', text: s.text, x0: 60, y0: 1150, x1: 1020, y1: 1290 }] : []; };
render(parseFloat(QS.get('t') ?? '3'));
window.READY = true;
