// Run: node leave-test/tests/leave.test.mjs
// Extracts the simulation from index.html and checks the properties the page states.
import { readFileSync } from "node:fs";
import vm from "node:vm";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(js + "\nthis.api={DEFAULTS,POLICIES,runAll,runOne,traceAll,pSafe,Phi,rng,draws};", ctx);
const { DEFAULTS, runAll, runOne, pSafe, Phi, rng, draws } = ctx.api;
let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const run = o => runAll({ ...DEFAULTS, ...o });
ok(Math.abs(Phi(0) - 0.5) < 1e-6 && Math.abs(Phi(1.96) - 0.975) < 1e-3, "normal CDF is accurate");
const a = run({}), b = run({});
ok(JSON.stringify(a) === JSON.stringify(b), "the same seed gives the same results");
ok(JSON.stringify(a) !== JSON.stringify(run({ seed: 8 })), "a different seed gives different people");
ok(pSafe(0, 0.05, 0.5, 1, DEFAULTS) >= pSafe(0.9, 0.05, 0.5, 1, DEFAULTS), "a person near balance is forecast safer than one near the edge");
ok([0, 0.5, 1].every(v => pSafe(v, 0.05, 0.2, 1, DEFAULTS) >= pSafe(v, 0.05, 0.2, 0, DEFAULTS) - 1e-9), "more help never lowers the forecast of safety (N1)");
ok(a.watch.meanR === 0 && a.always.meanR === 1, "the two reference agents do none and all of the work");
// (N3) by hand: all the work done for the person gives pure decay, none gives pure growth
const p = { ...DEFAULTS }, z = draws(p, rng(1));
const al = runOne("always", p, z, false), wa = runOne("watch", p, z, false);
ok(Math.abs(al.cLeave - p.c0 * Math.pow(1 - p.beta, p.leave)) < 1e-4, "capacity decays at rate beta when the agent does everything (N3)");
ok(Math.abs(wa.cLeave - (1 - (1 - p.c0) * Math.pow(1 - p.alpha, p.leave))) < 1e-4, "capacity grows at rate alpha when the person does everything (N3)");
for (const [name, o] of [["calm", {}], ["fragile", { c0: 0.1 }], ["rough", { sigma: 0.35 }]]) {
  const r = run(o);
  ok(r.always.cLeave < r.care.cLeave && r.always.cLeave < r.watch.cLeave, `always helping leaves the lowest capacity (${name})`);
  ok(r.always.aeAfter < r.always.ae, `always helping does worse after leaving than while present (${name})`);
  ok(r.watch.cLeave >= r.care.cLeave, `open point: nobody helping ends with the highest capacity (${name})`);
}
const calm = run({}), rough = run({ sigma: 0.35 }), loose = run({ sigma: 0.35, epsBar: 0.15 });
ok(calm.care.leftOwn > 0.9, "calm life: the paper's agent hands back and leaves on its own");
ok(rough.care.leftOwn < 0.1 && rough.care.meanR > 0.6, "open point: in a rough life the fixed tolerance keeps the work with the agent");
ok(loose.care.leftOwn > 0.9, "allowing more risk restores the handing back");
ok(rough.grow.cLeave > rough.care.cLeave && rough.grow.aeAfter > rough.care.aeAfter, "the growth rule leaves more capacity than the fixed tolerance in a rough life");
ok(run({ bias: 0.8 }).always.ae < calm.always.ae - 0.1, "a misleading sensor hurts the agent that does everything");
console.log(fails ? `\n${fails} check(s) failed` : "\nAll checks passed");
process.exit(fails ? 1 : 0);
