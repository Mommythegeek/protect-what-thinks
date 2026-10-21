// The Seal Remains — the single timeline. Every picture, sound and subtitle reads these numbers.
// Voice: Carla's own narration (Plaud, 21 Oct 2026, 15:33), cut by carla/slice.py into voices_carla/.
const J = async f => { try { const r = await fetch(f); if (r.ok) return await r.json(); } catch (e) { } return null; };
export const VDIR = 'voices_carla';
export const DURS = (await J(VDIR + '/dur.json')) || {};
export const LINES = (await J(VDIR + '/lines.json')) || [];

export const SL = 1.15;          // handscroll slide between sheets
export const GAP = 0.34;         // pause after each spoken line

export const CARDS = {
  A: ['Looking became waiting.', 'Waiting became a cost.'],
  B: ['Bet on the machine.', "If you're wrong, someone else pays."],
  C: ['The seal remains.', 'The judgment is gone.'],
  D: ['In Europe, the law guarantees the seal.', 'Unfortunately, not the judgment behind it.'],
  E: ['Help me fix it.'],
};

// sheet: index on the scroll; ops run in order
// ['vo', id, {mark: offset}] places marks inside a clip; ['cardvo', card, clip, min] shows a card while Carla reads it
const SEQ = [
  [0, [['hold', .9], ['mark', 'stamp0'], ['hold', .8], ['vo', 'C1'], ['mark', 'kanji'], ['vo', 'C2'], ['mark', 'eye'], ['vo', 'C3'], ['hold', .2]]],
  [1, [['hold', .9], ['vo', 'C4'], ['mark', 'look'], ['vo', 'C5'], ['hold', .2]]],
  [2, [['hold', .3], ['mark', 'cranes'], ['vo', 'C6'], ['mark', 'ratio'], ['vo', 'C7'], ['mark', 'wait'], ['vo', 'C8'], ['hold', .3]]],
  [3, [['hold', .3], ['mark', 'abacus'], ['vo', 'C9'], ['vo', 'C10'], ['mark', 'cost'], ['vo', 'C11'], ['cardvo', 'A', 'CA', 4.4]]],
  [4, [['hold', .3], ['mark', 'empty'], ['vo', 'C12', { pct: 3.4 }], ['mark', 'nomaster'], ['vo', 'C13'], ['vo', 'C14'], ['vo', 'C15'], ['hold', .3]]],
  [5, [['hold', .3], ['mark', 'enso'], ['vo', 'C16'], ['vo', 'C17'], ['mark', 'pays'], ['vo', 'C18'], ['cardvo', 'B', 'CB', 4.4]]],
  [6, [['hold', .3], ['vo', 'C19'], ['mark', 'dials'], ['vo', 'C20'], ['mark', 'falls'], ['vo', 'C21'], ['hold', 1.2]]],
  [7, [['mark', 'ma'], ['hold', 1.5], ['mark', 'print7'], ['hold', 1.1], ['vo', 'C22_23', { fade: 3.9 }], ['hold', 1.0], ['cardvo', 'C', 'CC', 4.6]]],
  [8, [['hold', .3], ['vo', 'C24_25', { helps: 8.0 }], ['vo', 'C26', { seal8: 2.9 }], ['cardvo', 'D', 'CD', 5.2]]],
  [9, [['hold', .3], ['vo', 'C27'], ['vo', 'C28'], ['mark', 'gaps'], ['vo', 'C29'], ['mark', 'q'], ['vo', 'C30'], ['hold', .4]]],
  [10, [['hold', .3], ['mark', 'why'], ['vo', 'C31', { co: 10.0 }], ['mark', 'reg'], ['vo', 'C33'], ['hold', .5]]],
  [11, [['hold', .3], ['mark', 'seals'], ['vo', 'C34'], ['mark', 'brush'], ['vo', 'C35'], ['cardvo', 'E', 'CE', 3.0], ['mark', 'pull'], ['hold', 3.4], ['mark', 'end'], ['hold', 6.5]]],
];

export const T = {}, VO = {}, CARD = {}, SHEET = [];   // SHEET[i] = [arrive, leave]
let t = 0;
SEQ.forEach(([i, ops], k) => {
  if (k > 0) { T['slide' + i] = [t, t + SL]; t += SL; }
  const t0 = t;
  for (const [op, a, b, c] of ops) {
    if (op === 'hold') t += a;
    else if (op === 'mark') T[a] = t;
    else if (op === 'vo') { VO[a] = t; if (b) for (const [m, o] of Object.entries(b)) T[m] = t + o; t += (DURS[a] ?? 3) + GAP; }
    else if (op === 'card') { CARD[a] = [t, t + b]; t += b; }
    else if (op === 'cardvo') { const d = Math.max(c, (DURS[b] ?? 2) + 1.4); CARD[a] = [t, t + d]; VO[b] = t + .55; t += d; }
  }
  SHEET[i] = [t0, t];
});
export const NSHEET = SEQ.length;
export const DUR = +t.toFixed(3);
