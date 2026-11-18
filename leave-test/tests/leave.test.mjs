// Run: node leave-test/tests/leave.test.mjs
// Extracts the simulation from index.html. Two kinds of check: "maths" checks test that the code is correct;
// "result unchanged" checks only assert the numbers the README states, open points included, so they are
// expected to fail on the day someone fixes an open point.
import { readFileSync } from "node:fs";
import vm from "node:vm";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(js + "\nthis.api={DEFAULTS,POLICIES,runAll,runOne,traceAll,pSafe,Phi,rng,draws};", ctx);
const { DEFAULTS, runAll, runOne, pSafe, Phi, rng, draws } = ctx.api;
let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const run = o => runAll({ ...DEFAULTS, ...o });
ok(Math.abs(Phi(0) - 0.5) < 1e-6 && Math.abs(Phi(1.96) - 0.975) < 1e-3, "maths: normal CDF is accurate");
const a = run({}), b = run({});
ok(JSON.stringify(a) === JSON.stringify(b), "the same seed gives the same results");
ok(JSON.stringify(a) !== JSON.stringify(run({ seed: 8 })), "a different seed gives different people");
ok(pSafe(0, 0.05, 0.5, 1, DEFAULTS) >= pSafe(0.9, 0.05, 0.5, 1, DEFAULTS), "a person near balance is forecast safer than one near the edge");
ok([0, 0.5, 1].every(v => pSafe(v, 0.05, 0.2, 1, DEFAULTS) >= pSafe(v, 0.05, 0.2, 0, DEFAULTS) - 1e-9), "maths: more help never lowers the forecast of safety (N1)");
ok(a.watch.meanR === 0 && a.always.meanR === 1, "the two reference agents do none and all of the work");
// (N3) by hand: all the work done for the person gives pure decay, none gives pure growth
const p = { ...DEFAULTS }, z = draws(p, rng(1));
const al = runOne("always", p, z, false), wa = runOne("watch", p, z, false);
ok(Math.abs(al.cLeave - p.c0 * Math.pow(1 - p.beta, p.leave)) < 1e-4, "maths: capacity decays at rate beta when the agent does everything (N3)");
ok(Math.abs(wa.cLeave - (1 - (1 - p.c0) * Math.pow(1 - p.alpha, p.leave))) < 1e-4, "maths: capacity grows at rate alpha when the person does everything (N3)");
for (const [name, o] of [["calm", {}], ["fragile", { c0: 0.1 }], ["rough", { sigma: 0.35 }]]) {
  const r = run(o);
  ok(r.always.cLeave < r.care.cLeave && r.always.cLeave < r.watch.cLeave, `result unchanged: always helping leaves the lowest capacity (${name})`);
  ok(r.always.aeAfter < r.always.ae, `result unchanged: always helping does worse after leaving than while present (${name})`);
  ok(r.watch.cLeave >= r.care.cLeave, `result unchanged, open point: nobody helping ends with the highest capacity (${name})`);
}
const calm = run({}), rough = run({ sigma: 0.35 }), loose = run({ sigma: 0.35, epsBar: 0.15 });
ok(calm.care.leftOwn > 0.9, "result unchanged: calm life, the paper's agent hands back and leaves on its own");
ok(rough.care.leftOwn < 0.1 && rough.care.meanR > 0.6, "result unchanged, open point: in a rough life the fixed tolerance keeps the work with the agent");
ok(loose.care.leftOwn > 0.9, "result unchanged: allowing more risk restores the handing back");
ok(rough.grow.cLeave > rough.care.cLeave && rough.grow.aeAfter > rough.care.aeAfter, "result unchanged: the growth rule leaves more capacity than the fixed tolerance in a rough life");
ok(run({ bias: 0.8 }).always.ae < calm.always.ae - 0.1, "result unchanged: a misleading sensor hurts the agent that does everything");
// added in v0.3, after the BSR stream's review of 16 November 2026
const stop = run({ sigma: 0.35, fsStop: 1 });
ok(calm.care.below === 0 && rough.care.below === 0 && stop.care.below === 0, "maths: the paper's agent never gives less help than the least level that passes (N1)");
ok(calm.always.below === 0, "maths: the agent that does everything is never below the safety test");
ok(rough.grow.below > 0.3, "result unchanged: the growth rule is below the safety test on more than 30% of steps in a rough life");
ok(stop.care.meanR < rough.care.meanR - 0.2 && stop.care.aeAfter > rough.care.aeAfter, "result unchanged: the size of the rough-life result depends on what the fail-safe does");
ok(stop.care.meanR > 0.5, "result unchanged: with a fail-safe that stops, the agent still does more than half the work in a rough life");
const needs = run({ c0: 0.1, pShock: 0.06, alpha: 0.002 });
ok(needs.always.ae > needs.watch.ae + 0.1, "result unchanged: in the Needs help setting, help clearly matters while the agent is present");
const info = run({ infoOnly: 1 });
ok(info.care.leftOwn > 0.9 && info.care.leftMedian > calm.care.leftMedian, "result unchanged: counting only informative steps delays the leaving and does not prevent it");
console.log(fails ? `\n${fails} check(s) failed` : "\nAll checks passed");
process.exit(fails ? 1 : 0);
