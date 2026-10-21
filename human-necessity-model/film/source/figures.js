// Figures and props, drawn flat like woodblock prints. Local units: ground at (0,0), facing right (+x).
import { clamp, lerp, TAU, mulberry } from '/core/lib.js';
import { PAL, smooth, poly, mix, rgba, mk, W, H } from './print.js';

const INK = PAL.sumi;
function shape(x, pts, fill, lw, closed = true, sm = true) {
  x.beginPath(); sm ? smooth(x, pts, closed) : poly(x, pts);
  if (fill) { x.fillStyle = fill; x.fill(); }
  if (lw) { x.lineWidth = lw; x.strokeStyle = x.__ink || INK; x.lineJoin = 'round'; x.stroke(); }
}
function limb(pts, ws) {
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    L.push([pts[i][0] - dy * ws[i] / 2, pts[i][1] + dx * ws[i] / 2]); R.push([pts[i][0] + dy * ws[i] / 2, pts[i][1] - dx * ws[i] / 2]);
  }
  return L.concat(R.reverse());
}
const rot = ([px, py], [cx, cy], a) => { const c = Math.cos(a), s = Math.sin(a); return [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c]; };

// a ghost layer: draw fn into an offscreen canvas, then paste it with fills fading to paper and lines to grey
const GH = { c: null };
export function ghosted(x, fade, fn) {
  if (fade <= 0.001) { fn(x, 1); return; }
  if (!GH.c) GH.c = mk(W, H);
  const g = GH.c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  const m = x.getTransform(); g.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
  fn(g, 1 - fade);
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1 - fade * .96; x.drawImage(GH.c, 0, 0); x.restore();
}

// ——— a kneeling person (seiza), side view ———
// o: { s: pixel height, dir: 1 right / -1 left, kimono, obi, hair: 'master'|'apprentice', bow 0..1, reach 0..1, seal: bool,
//      chisel: 0..1 (apprentice carving), lw }
export function kneeler(x, px, py, o = {}) {
  const s = o.s || 300, u = s / 110, dir = o.dir || 1, lw = (o.lw || 2.6) / u;
  const KI = o.kimono || PAL.prusD, KI2 = o.kimono2 || PAL.prus, OBI = o.obi || PAL.beni, SKIN = PAL.skin;
  x.save(); x.translate(px, py); x.scale(u * dir, u);
  const bow = o.bow || 0, reach = o.reach || 0;
  if (o.flow) hairFlow(x, o.t || 0, bow, lw, o.flow);
  // skirt mass (folded legs)
  shape(x, [[-34, 0], [-37, -11], [-28, -24], [0, -27], [22, -25], [31, -13], [32, 0]], KI, lw);
  x.lineWidth = lw * .6; x.strokeStyle = INK; x.beginPath(); x.moveTo(-6, -26); x.quadraticCurveTo(4, -12, 2, 0); x.stroke();
  // back sleeve (far arm)
  shape(x, [[-14, -72], [-26, -44], [-24, -30], [-10, -32], [-6, -56]], mix(KI, PAL.sumi, .25), lw);
  // torso
  const torso = [[-25, -22], [-24, -50], [-17, -70], [-6, -77], [8, -75], [13, -62], [15, -40], [19, -23]];
  shape(x, torso, KI2, lw);
  // pattern: sometsuke scrolls (cobalt on porcelain) for the master, shibori dots for the others
  x.save(); x.beginPath(); smooth(x, torso, true); x.clip();
  const R = mulberry(o.seed || 3);
  if (o.pattern === 'sometsuke') sometsuke(x, -28, -80, 50, 60, lw, R);
  else { x.fillStyle = rgba(PAL.white, .55); for (let i = 0; i < 26; i++) { x.beginPath(); x.arc(-26 + R() * 44, -76 + R() * 54, .9 + R() * .8, 0, TAU); x.fill(); } }
  x.restore();
  if (o.pattern === 'sometsuke') { x.save(); x.beginPath(); smooth(x, [[-34, 0], [-37, -11], [-28, -24], [0, -27], [22, -25], [31, -13], [32, 0]], true); x.clip(); sometsuke(x, -38, -28, 72, 30, lw, R); x.restore(); }
  // obi + bow at the back
  shape(x, [[-25, -37], [-24, -53], [15, -52], [17, -37]], OBI, lw, true, false);
  x.lineWidth = lw * .5; x.beginPath(); x.moveTo(-24, -45); x.lineTo(16, -44.5); x.stroke();
  if (o.hair === 'master') shape(x, [[-36, -58], [-26, -55], [-26, -33], [-37, -36], [-40, -47]], OBI, lw, true, false);
  // collar
  shape(x, [[1, -77], [5, -77], [12, -60], [9, -59]], PAL.white, lw * .6, true, false);
  // head (bows around the neck)
  const piv = [3, -76], A = bow * .55;
  const R2 = p => rot(p, piv, A);
  const face = [[-1, -97], [8, -99], [14, -93], [15.5, -87], [18, -85], [15, -83], [15.5, -79.5], [9, -76.5], [2, -79]].map(R2);
  shape(x, face, SKIN, lw * .8, true, true);
  if (o.hair === 'master') {
    shape(x, [[-6, -84], [-7, -95], [-1, -101], [8, -101.5], [13, -97], [7, -95.5], [1, -92], [0, -84]].map(R2), INK, 0);
    shape(x, [[-11, -103], [-4, -111], [6, -110], [9, -104], [1, -100]].map(R2), INK, 0);              // shimada bun
    x.strokeStyle = PAL.beni; x.lineWidth = lw * 1.1; const k0 = R2([-14, -100]), k1 = R2([12, -108]);
    x.beginPath(); x.moveTo(k0[0], k0[1]); x.lineTo(k1[0], k1[1]); x.stroke();                            // kanzashi
    x.fillStyle = PAL.beni; const kb = R2([12.5, -108.5]); x.beginPath(); x.arc(kb[0], kb[1], 2.4, 0, TAU); x.fill();
  } else {
    shape(x, [[-5, -84], [-6, -95], [0, -100.5], [9, -100.5], [12, -96], [6, -95], [0, -91], [0, -84]].map(R2), INK, 0);
    shape(x, [[-2, -101], [4, -105], [9, -103.5], [5, -100.5]].map(R2), INK, 0);                     // small topknot
  }
  x.strokeStyle = INK; x.lineWidth = lw * .5;
  const e0 = R2([9.5, -89]), e1 = R2([13, -89.3]); x.beginPath(); x.moveTo(e0[0], e0[1]); x.lineTo(e1[0], e1[1]); x.stroke();
  // front arm: shoulder → elbow → hand
  const sh = [6, -68], el = [lerp(16, 22, reach), lerp(-44, -50, reach)], ha = [lerp(26, 46 + (o.armLen || 0), reach), lerp(-40, -44 + (o.handDy || 0), reach)];
  if (o.chisel !== undefined) { const c = o.chisel; el[0] = 18; el[1] = -46; ha[0] = 36 + 3 * Math.sin(c * TAU); ha[1] = -34 + 2 * Math.cos(c * TAU); }
  shape(x, [[-2, -72], [12, -70], el.map((v, i) => v + (i ? 6 : 2)), [el[0] - 8, el[1] + 6], [-4, -40]], KI2, lw);      // sleeve
  shape(x, limb([[el[0] - 2, el[1]], ha], [7, 5]), KI2, lw, true, false);
  shape(x, [[ha[0] - 1, ha[1] - 3], [ha[0] + 6, ha[1] - 3.5], [ha[0] + 8, ha[1] - 1], [ha[0] + 6, ha[1] + 2.5], [ha[0] - 1, ha[1] + 2.5]], SKIN, lw * .7);
  if (o.seal) { // the seal block in her hand, pointing down
    shape(x, [[ha[0] + 1, ha[1] - 4], [ha[0] + 7, ha[1] - 4], [ha[0] + 7, ha[1] + 12], [ha[0] + 1, ha[1] + 12]], PAL.woodL, lw * .6, true, false);
    x.fillStyle = PAL.beni; x.fillRect(ha[0] + 1, ha[1] + 10, 6, 2.5);
  }
  if (o.chisel !== undefined) { x.strokeStyle = INK; x.lineWidth = lw * 1.2; x.beginPath(); x.moveTo(ha[0] + 3, ha[1]); x.lineTo(ha[0] + 13, ha[1] + 8); x.stroke(); }
  x.restore();
  return { hand: [px + dir * ha[0] * u, py + ha[1] * u] };
}

// cobalt scroll-and-leaf motif painted on porcelain
export function sometsuke(x, x0, y0, w, h, lw, R) {
  x.strokeStyle = PAL.cobalt; x.fillStyle = PAL.cobalt; x.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const cx = x0 + R() * w, cy = y0 + R() * h, r = 3 + R() * 4, a0 = R() * TAU;
    x.lineWidth = lw * .55; x.beginPath();
    for (let k = 0; k <= 26; k++) { const a = a0 + k * .32, rr = r * (1 - k / 30); x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    x.stroke();
    for (let k = 0; k < 3; k++) { const a = a0 + k * 2.1, lx = cx + Math.cos(a) * (r + 3), ly = cy + Math.sin(a) * (r + 3); x.beginPath(); x.ellipse(lx, ly, 2.6, 1.1, a + 1.2, 0, TAU); x.fill(); }
  }
  x.lineWidth = lw * .4; for (let i = 0; i < 5; i++) { const yy = y0 + R() * h; x.beginPath(); x.moveTo(x0, yy); x.bezierCurveTo(x0 + w * .3, yy - 6, x0 + w * .6, yy + 6, x0 + w, yy - 2); x.stroke(); }
}
// long indigo hair streaming behind the head, as if under water
function hairFlow(x, t, bow, lw, amt = 1) {
  const R = mulberry(9), hx = -4, hy = -100 + bow * 6;
  for (let i = 0; i < 30; i++) {
    const L = (80 + R() * 60) * amt, ph = R() * TAU, sp = .6 + R() * .5, spread = (R() - .3) * 26, drift = .35 + R() * .5;
    const pts = [];
    for (let k = 0; k <= 14; k++) {
      const u = k / 14, w1 = Math.sin(t * sp * 1.5 + ph - u * 4.5) * 12 * u, w2 = Math.sin(t * .5 + ph * 1.7 - u * 2) * 8 * u;
      pts.push([hx - 8 * Math.min(u * 4, 1) - u * L * drift + spread * u + w1, hy + 8 * Math.min(u * 4, 1) + u * L * .85 + w2 * .5]);
    }
    x.strokeStyle = i % 5 === 0 ? PAL.prus : i % 7 === 0 ? PAL.cobalt : PAL.sumi; x.globalAlpha = .5 + .5 * R(); x.lineWidth = lw * (3.2 - 2 * R()); x.lineCap = 'round';
    x.beginPath(); smooth(x, pts); x.stroke();
  }
  x.globalAlpha = 1;
}

// ——— origami crane, side view facing right. flap: −1 wings down … 1 wings up; s = wingspan-ish pixels ———
export function crane(x, px, py, s, o = {}) {
  const u = s / 100, lw = (o.lw || 2.2) / u, dir = o.dir || 1, flap = o.flap ?? .6, fill = o.fill || '#e8513c', fold = o.fold || '#b3301f';
  x.save(); x.translate(px, py); x.scale(u * dir, u); x.rotate(o.tilt || 0);
  if (o.tendrils !== 0) {   // translucent threads trailing below, like a jellyfish
    const t = o.t || 0, R = mulberry(o.seed || 4), n = 7;
    for (let i = 0; i < n; i++) {
      const bx = -16 + i * 6, L = 40 + R() * 45, ph = R() * TAU, pts = [];
      for (let k = 0; k <= 10; k++) { const v = k / 10; pts.push([bx - v * 14 + Math.sin(t * 2.2 + ph + v * 5) * 6 * v, 4 + v * L]); }
      x.strokeStyle = i % 3 ? 'rgba(232,81,60,.38)' : 'rgba(34,81,168,.32)'; x.lineWidth = lw * (i % 3 ? .9 : .6); x.lineCap = 'round';
      x.beginPath(); smooth(x, pts); x.stroke();
      if (i % 3 === 0) { const e = pts[pts.length - 1]; x.fillStyle = 'rgba(232,81,60,.55)'; x.beginPath(); x.arc(e[0], e[1], 2.2, 0, TAU); x.fill(); }
    }
  }
  if (o.ink) x.__ink = o.ink;
  const wy = -62 * flap;
  // far wing
  shape(x, [[-6, -6], [lerp(-2, -10, (flap + 1) / 2), wy * .9], [14, -6]], mix(fill, fold, .55), lw, true, false);
  // tail, body, neck
  shape(x, [[-12, -2], [-44, -34], [-40, -35], [-4, 0]], fill, lw, true, false);
  shape(x, [[-22, 0], [0, -11], [26, 0], [0, 9]], fill, lw, true, false);
  x.fillStyle = fold; x.beginPath(); poly(x, [[-22, 0], [0, 9], [26, 0], [0, 2]]); x.fill();
  x.strokeStyle = o.ink || INK; x.lineWidth = lw; x.beginPath(); poly(x, [[-22, 0], [0, -11], [26, 0], [0, 9]]); x.stroke();
  shape(x, [[14, -3], [40, -42], [36, -43], [20, 0]], fill, lw, true, false);
  shape(x, [[38, -42], [50, -38], [37, -38]], fill, lw, true, false);
  // near wing
  shape(x, [[-4, -5], [lerp(4, -4, (flap + 1) / 2), wy], [18, -5]], fill, lw, true, false);
  x.strokeStyle = fold; x.lineWidth = lw * .7; x.beginPath(); x.moveTo(7, -5); x.lineTo(lerp(4, -4, (flap + 1) / 2) * .5 + 3, wy * .55); x.stroke();
  if (o.sheet) { // a small print held in the beak
    x.fillStyle = PAL.porc; x.strokeStyle = o.ink || INK; x.lineWidth = lw * .7; x.beginPath(); poly(x, [[46, -38], [62, -40], [64, -20], [48, -18]]); x.fill(); x.stroke();
    x.fillStyle = rgba(PAL.prus, .6); x.fillRect(51, -34, 9, 6);
  }
  x.__ink = undefined;
  x.restore();
}

// ——— a low writing desk ———
export function desk(x, x0, y0, w, h = 22, lw = 2.6) {
  shape(x, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], PAL.woodD, lw, true, false);
  x.fillStyle = PAL.wood; x.fillRect(x0 + 3, y0 + 3, w - 6, h * .45);
  for (const lx of [x0 + 14, x0 + w - 34]) shape(x, [[lx, y0 + h], [lx + 20, y0 + h], [lx + 20, y0 + h + 54], [lx, y0 + h + 54]], PAL.woodD, lw, true, false);
}

// ——— a print lying on the desk (seen at a slant) ———
export function printSheet(x, cx, cy, w, h, o = {}) {
  const sk = o.skew ?? 22;
  shape(x, [[cx - w / 2 + sk, cy - h / 2], [cx + w / 2 + sk, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]], PAL.white, 2, true, false);
  // a tiny landscape: a blue band and a red sun
  x.fillStyle = rgba(PAL.prus, .75); x.beginPath(); poly(x, [[cx - w / 2 + sk * .35 + 6, cy + 2], [cx + w / 2 + sk * .35 - 6, cy + 2], [cx + w / 2 - 6, cy + h / 2 - 6], [cx - w / 2 + 6, cy + h / 2 - 6]]); x.fill();
  x.fillStyle = PAL.beni; x.beginPath(); x.arc(cx + w * .12 + sk * .5, cy - h * .12, h * .14, 0, TAU); x.fill();
}

// ——— soroban (abacus): rods vertical, beam across. beads[i] = 0..5 value per rod; cost = red tint 0..1 ———
export function soroban(x, x0, y0, w, h, beads, o = {}) {
  const n = beads.length, lw = o.lw || 2.6, beam = y0 + h * .3, red = o.red || 0;
  shape(x, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], PAL.woodD, lw, true, false);
  x.fillStyle = mix(PAL.paper, '#3b2c20', .35); x.fillRect(x0 + 14, y0 + 14, w - 28, h - 28);
  x.fillStyle = PAL.woodD; x.fillRect(x0 + 14, beam - 5, w - 28, 10);
  const sp = (w - 28) / n, bw = Math.min(sp * .86, 64), bh = bw * .52;
  for (let i = 0; i < n; i++) {
    const cx = x0 + 14 + sp * (i + .5);
    x.strokeStyle = PAL.sumiL; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, y0 + 14); x.lineTo(cx, y0 + h - 14); x.stroke();
    const v = beads[i], five = v >= 5 ? 1 : 0, ones = v - five * 5;
    const col = mix(PAL.woodL, PAL.beni, red * (o.redCols ? o.redCols[i] : 1));
    const bead = (cy) => { x.fillStyle = col; x.beginPath(); poly(x, [[cx - bw / 2, cy], [cx, cy - bh / 2], [cx + bw / 2, cy], [cx, cy + bh / 2]]); x.fill(); x.strokeStyle = INK; x.lineWidth = lw * .8; x.stroke(); };
    bead(five ? beam - 5 - bh / 2 : y0 + 14 + bh / 2);                      // heaven bead
    for (let k = 0; k < 4; k++) {                                            // earth beads
      const up = k < ones;
      bead(up ? beam + 5 + bh / 2 + k * bh : y0 + h - 14 - bh / 2 - (3 - k) * bh);
    }
  }
}

// ——— an empty cushion (zabuton) ———
export function zabuton(x, cx, cy, w, col = PAL.beniL, lw = 2.4) {
  shape(x, [[cx - w / 2, cy], [cx - w / 2 + 14, cy - w * .16], [cx + w / 2 + 6, cy - w * .16], [cx + w / 2 - 8, cy]], col, lw, true, false);
  shape(x, [[cx - w / 2, cy], [cx + w / 2 - 8, cy], [cx + w / 2 - 8, cy + 9], [cx - w / 2, cy + 9]], mix(col, PAL.sumi, .25), lw, true, false);
}

// ——— a carving block on a low bench ———
export function block(x, cx, cy, w, lw = 2.4) {
  shape(x, [[cx - w / 2, cy], [cx - w / 2 + 12, cy - w * .2], [cx + w / 2 + 12, cy - w * .2], [cx + w / 2, cy]], PAL.woodL, lw, true, false);
  shape(x, [[cx - w / 2, cy], [cx + w / 2, cy], [cx + w / 2, cy + 12], [cx - w / 2, cy + 12]], PAL.wood, lw, true, false);
  x.strokeStyle = PAL.woodD; x.lineWidth = 1.4; for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(cx - w / 2 + 12 + i * w / 4, cy - w * .2 + 4); x.lineTo(cx - w / 2 + i * w / 4 + 4, cy - 3); x.stroke(); }
}
