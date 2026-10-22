// Run: node human-necessity-model/tests/model.test.mjs
// Extracts the model from index.html and checks properties the reviews asked for.
import { readFileSync } from "node:fs";
import vm from "node:vm";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = html.match(/<script>([\s\S]*)<\/script>/)[1].replace("buildControls(); syncInputs(); render();", "");
const ctx = { console, localStorage: { getItem: () => null, setItem: () => {} } };
vm.createContext(ctx); vm.runInContext(js + "\nthis.api={simulate,monteCarlo,q,DEFAULTS,SECTORS,REGIONS,CALIB,midC};", ctx);
const { simulate, monteCarlo, q, DEFAULTS, CALIB, midC } = ctx.api;
let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const cm = midC(), at = (d, y, k) => simulate(Object.assign({}, DEFAULTS, d), cm).rows.find(r => r.t === y)[k];
const r0 = simulate(DEFAULTS, cm).rows[0];
ok(Math.abs(r0.J - 1) < 1e-9 && Math.abs(r0.H - 1) < 1e-9 && r0.E === 1, "junior hiring, human work and judgment start at 1 in 2026");
for (const y of [2027, 2033, 2040]) { const v = [0, 25, 50, 75, 100].map(c => at({ cap: c }, y, "m")); ok(v.every((x, i) => i === 0 || x >= v[i - 1]), `capability is monotone in the capability dial (${y})`); }
const pr = [0, 25, 50, 75, 100].map(c => at({ pipeline: c }, 2040, "R")); ok(pr.every((x, i) => i === 0 || x >= v0(pr, i)), "apprenticeship protection never lowers decision capacity (2040)");
function v0(a, i) { return a[i - 1] - 1e-9; }
const lr = [0, 50, 100].map(c => at({ liability: c }, 2040, "R")); ok(lr[2] >= lr[0], "liability does not lower decision capacity (2040)");
let up = 0; for (let s = 0; s < 500; s++) { const rows = simulate(Object.assign({}, DEFAULTS, { cap: 20, belief: 10, pipeline: 90 }), cm).rows; if (rows.at(-1).E > 0.6) up++; }
ok(up > 0, "experienced judgment can be sustained under protective settings");
const wr = [0, 50, 100].map(c => at({ rivalry: c }, 2033, "W")); ok(wr[0] <= wr[1] + 1e-9 && wr[1] <= wr[2] + 1e-9, "more rivals never lower extra automation (layoff trap)");
const ov = [30, 60, 90].map(c => at({ cap: c }, 2040, "insp")); ok(ov[0] >= ov[1] && ov[1] >= ov[2], "faster capability never raises the share of outputs worth checking (Cao)");
const jx = [0, 100].map(c => at({ expertfirst: c }, 2033, "J")); ok(jx[0] <= jx[1], "routine-first automation hits junior hiring at least as hard as expert-first");
ok([0, 30, 60, 100].every(rv => [2033, 2045].every(y => at({ ownership: 100, rivalry: rv }, y, "H") >= at({ ownership: 0, rivalry: rv }, y, "H") - 1e-9)), "sharing gains never lowers human work, at any level of rivalry");
ok(at({ ownership: 100, rivalry: 100 }, 2045, "W") > 0.01, "sharing gains does not remove over-automation (as in the layoff-trap paper)");
ok(at({ autotax: 100, rivalry: 100 }, 2045, "W") < 1e-9, "a full corrective tax removes over-automation");
ok([2033, 2045].every(y => Math.abs(at({ learnmode: 50 }, y, "E") - at({}, y, "E")) < 1e-12), "the learning dial at 50 leaves the model unchanged");
const lmr = [0, 25, 50, 75, 100].map(c => at({ learnmode: c }, 2045, "R")); ok(lmr.every((x, i) => i === 0 || x >= lmr[i - 1] - 1e-9), "juniors who work alongside the agent never lower decision capacity (2045)");
const jcr = [0, 50, 100].map(c => at({ jcredit: c, belief: 90 }, 2033, "J")); ok(jcr[0] <= jcr[1] + 1e-9 && jcr[1] <= jcr[2] + 1e-9, "a junior hiring credit never lowers junior hiring");
ok(!!ctx.api.REGIONS["France"], "France profile exists");
const a = monteCarlo(DEFAULTS, 100, 2026, 2033), b = monteCarlo(DEFAULTS, 100, 2026, 2033);
ok(JSON.stringify(a.org) === JSON.stringify(b.org), "same seed gives identical results");
console.log("\nPlausibility checks (in-sample, not validation):");
for (const c of CALIB) { if (c.na) { console.log("  pending  " + c.t); continue; }
  const mc = monteCarlo(c.preset, 300, c.start, c.year), i = c.year - c.start, v = mc.runs.map(r => r[i][c.key]);
  console.log(`  ${c.t}: target ${c.cmp === "ge" ? ">= " : ""}${c.target}, model ${q(v, .5).toFixed(2)} (range ${q(v, .1).toFixed(2)}-${q(v, .9).toFixed(2)})`); }
process.exit(fails ? 1 : 0);
