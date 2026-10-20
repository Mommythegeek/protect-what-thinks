// Exports the model's median trajectories and regional shares into src/data.json, straight from the published tool.
import { readFileSync, writeFileSync } from "node:fs"; import vm from "node:vm";
const html = readFileSync(process.argv[2], "utf8");
const js = html.match(/<script>([\s\S]*)<\/script>/)[1].replace("buildControls(); syncInputs(); render();", "");
const ctx = { console, localStorage: { getItem: () => null, setItem: () => {} } }; vm.createContext(ctx);
vm.runInContext(js + "\nthis.api={monteCarlo,DEFAULTS,SECTORS,q,bands,setR:(r)=>{region=r},eff:()=>effective(),setState:(o)=>{state=Object.assign({},DEFAULTS,o)}};", ctx);
const A = ctx.api;
A.setState(A.SECTORS["Software"]); A.setR("Global");
const mc = A.monteCarlo(A.eff(), 500, 2026, 2060);
const series = {}; for (const k of ["m","I","J","E","R","F"]) series[k] = A.bands(mc.runs, k).map(p => +p.p50.toFixed(4));
const shares = {};
for (const reg of ["European Union","United States","China"]) { A.setState(A.SECTORS["Software"]); A.setR(reg); const r = A.monteCarlo(A.eff(), 500, 2026, 2060); const i=2060-2026;
  shares[reg] = { sig: r.org[0], R: A.q(r.runs.map(x=>x[i].R), .5) }; }
const version = html.match(/v(\d+\.\d+) · model (\d+\.\d+)/);
writeFileSync(process.argv[3], JSON.stringify({ version: version[1], model: version[2], years: mc.runs[0].map(r=>r.t), series, shares }, null, 1));
console.log(JSON.stringify(shares));
