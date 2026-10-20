HUMAN NECESSITY MODEL · REVIEW LOG
v1.0 → v1.1 (model 0.3 → 0.4) · 20 October 2026

Plain title: Four independent reviews of the Human Necessity Model, and what changed because of them
Poetic title: The Model That Asked to Be Contradicted

Method. Four reviewers worked independently, each briefed as one target reader, each reading the full
HTML and running the model headless where relevant. None saw the others' reports. They were Claude
subagents, not human experts; this log is the dress rehearsal for human review, not a substitute for it.

================================================================
REVIEWER 1 · LABOUR ECONOMIST (AI-lab economic research team)
================================================================
Verdict: "would not cite this as a model today; a well-documented thought experiment."

Findings and responses
- Long-run outcomes forced by the equations (capability always reaches 1; judgment can only fall).
  FIXED: capability ceiling below 100% set by physical work and feedback speed; judgment now relaxes
  toward junior hiring and decays in proportion to the stock, so it can stabilise or recover.
- No wage or price channel; adoption driven by capability alone. PARTLY FIXED: machine cost-advantage
  dial (automation only where machines are cheaper, rising 2 points a year) and demand-response dial.
  Still no equilibrium; stated in Known limits.
- Automated share could exceed what machines can do. FIXED: plans (I) separated from actual automation
  A = min(I, M)·κ. The gap is reported as years of plans running ahead of capability.
- Calibration fitted to its own data; proxies in wrong units. FIXED IN WORDING: renamed "plausibility
  checks", presets declared in advance, units labelled, start years added. Fitting with held-out data
  remains to do.
- Argmax scenario scores overstate knowledge. FIXED: scenarios are now regions of outcomes with explicit
  conditions; shares can overlap; no "dominant" winner.
- Real authority unmeasured. FIXED IN NAME AND STRUCTURE: renamed "decision capacity (index)"; evidence
  access added through an opacity dial. Mapping to override rates and review time is listed as the
  measurement step.
- Parameter products not identifiable. FIXED IN TEXT: stated on the page.
- Model and user uncertainty mixed. PARTLY FIXED: jitter is now dial-specific and reflected at edges;
  separate bands remain to do.
- No feedback. FIXED: belief learns when plans outrun capability; a failure above a random threshold
  triggers imposed friction (liability and apprenticeship up, cost framing down).
- Junior index not 100 in 2026. FIXED: normalised to the start year inside each run.
- Overclaiming wording. FIXED: "illustrative, not estimated" stamp; reading sentence reworded.
- Atlas lens costs credibility. FIXED: moved to a collapsed experimental section, off by default,
  excluded from exports unless selected.

================================================================
REVIEWER 2 · SOCIOLOGIST OF WORK / ANTHROPOLOGIST OF TECHNOLOGY
================================================================
Verdict: "would use it in teaching as a worked example of mechanisms; would not cite its numbers."

- Hidden human labour missing (Casilli; Gray and Suri). ACKNOWLEDGED: tile renamed "human work in this
  domain"; Known limits entry added. Module to build.
- "Real authority" not Aghion–Tirole's definition; aggregate presented as individual. FIXED: renamed,
  evidence-access term added, reading sentence speaks of an index for the domain.
- Moral crumple zone on the wrong quantity. FIXED: "signature-decision gap" for F − R; crumple zone
  reserved for blame after failure.
- Scenario scores not comparable. FIXED (see above).
- Calibration too weak; Canaries date and figure. CHECKED: the August 2026 Canaries update exists
  (ages 22–25 about 19% below counterfactual, about 11% absolute fall). Wording corrected.
- Atlas lens technologically deterministic and self-serving. FIXED: off by default, labelled as the
  author's reading of vendor self-presentation, Claude conflict stated.
- Cost framing a fixed dial, not a mechanism. PARTLY FIXED: it now falls after a failure.
- No worker agency. PARTLY FIXED: worker-voice dial (collective bargaining, WGA 2023 precedent) slows
  plans. Resistance, workarounds and drift listed as missing.
- Gender, class, geography missing. ACKNOWLEDGED in Known limits.
- Apprenticeship and taste reified; the Merton loop runs through deskilling, not capability. FIXED IN
  TEXT: stated in the mechanism; taste marked as not measured.
- Field study design: adopted as the plan (sites, unit of observation, methods, ethics). See below.

================================================================
REVIEWER 3 · COMPLEX-SYSTEMS MODELLER / FORECASTING METHODOLOGIST
================================================================
- BUG: "crash" scenario won with no crash (constant +0.3·pipeline). FIXED: scenario is now "a failure
  occurred by the horizon".
- Judgment could never grow (0 of 20,000 runs). FIXED: relaxation form; now some runs keep judgment.
- BUG: junior index not 1 in 2026. FIXED.
- Argmax over incomparable scores; status-quo threshold drove results. FIXED: regions, no threshold.
- BUG: raising capability lowered early capability (k and midpoint fought). FIXED: fixed steepness,
  capability shifts the midpoint only; monotonicity test passes (2027: 0.04 → 0.46 across the sweep).
- Calibration circular; global horizon mutated in a loop. FIXED: horizon passed as a parameter;
  circularity stated.
- Five dials had no effect on trajectories. FIXED: liability now protects review time; the others are
  labelled "affects scenario regions only".
- One-at-a-time tornado misranks uncertainty (Sobol: γ, λ, δ, ρ dominate). PARTLY FIXED: dials and
  coefficients now shown separately. Sobol indices to publish offline.
- Uniform ±10 jitter; edge bias. FIXED: wider for judgment-only dials, reflected at bounds.
- Precision overstated. FIXED IN TEXT: Monte Carlo error about ±2 points stated.

================================================================
REVIEWER 4 · INFORMATION DESIGNER (FT / Our World in Data standard)
================================================================
- Results buried below 16 dials on phones. FIXED: results first on narrow screens.
- Chart unreadable on phones. FIXED: separate phone geometry, larger text, fewer ticks, direct labels,
  decision capacity emphasised.
- No y-axis label, mixed units. FIXED.
- Scenario bars read as certainty. FIXED: regions, sorted, zeros collapsed into one line.
- Magenta doing four jobs. FIXED: separate alert colour; only two alert conditions.
- Tiles contradicted the reading sentence. FIXED: "signature exceeds decision capacity by".
- Too many dials. FIXED: four headline dials open, the rest collapsed.
- Lens a credibility risk. FIXED.
- Tornado colours clashed with chart. FIXED: neutral tones, plain names, dials and coefficients split.
- Contrast and colour-blind safety. FIXED: darker amber, lighter tint for plans line.
- Plain subtitle under the question. FIXED.
- Accessibility. FIXED: radiogroups, dynamic chart description, CSV route.

================================================================
WHAT THE PLAUSIBILITY CHECKS NOW SAY (v1.1, honest)
================================================================
- Frontier software firm 2025→2026: model too gentle (0.92 vs 0.33). A smooth anticipation curve cannot
  reproduce a one-year collapse. Finding: anticipation moves in shocks tied to model releases, which the
  Anthropic report itself describes. Next module: belief shocks.
- Canaries 2022→2026: model slightly too gentle (0.91, range 0.84–0.95, vs 0.81).
- Radiology 2016→2026: model just short (0.99 vs ≥ 1.00). Demand growth is under-weighted.
- Agents added, not substituted (2026): consistent (0.85 vs ≥ 0.60), weak proxy.
- Bank tellers: pending; needs a separate technology curve.

================================================================
NEXT, IN ORDER
================================================================
1. Belief-shock module (discrete jumps at model releases), then refit to the three checks.
2. Fit coefficients with held-out data (approximate Bayesian computation), publish Sobol indices.
3. Hidden-labour stock and population layer (agent-to-agent coordination, Moltbook-type dynamics).
4. Human review: Marc Cavazza red team; one labour economist; one sociologist of work.
5. Field study: unit = one review episode (what was shown, time allowed, override or refusal, who saw
   the evidence, who would be blamed); sites = radiology reading room, code review of agent pull
   requests, legal review team, luxury creative studio, data-annotation vendor; consent independent of
   employer, works council (CSE), GDPR impact assessment, pre-registration.

================================================================
v1.2 → v1.3 (model 0.4 → 0.5) · 20 October 2026
================================================================

Plain title: What a search for related work and four more reviews changed in the model, including its headline result

Step 1. A search for related open models and papers (sources in SOURCES.md) added five mechanisms: rivalry and lost
spending (Hemenway Falk and Tsoukalas), task order (Autor and Thompson), a checking threshold (Cao), a predicted
override rate (IMDA), and a wider erosion range (Budzyń et al.).

Step 2. Four structured reviews by Claude subagents, run independently: (1) labour economist and forecasting
methodologist, (2) sociologist of work and a vision panel, (3) a business panel (CMO, CEO, hostile CFO, head of
talent) on the article, (4) information design and QA with rendered screenshots.

Findings and responses
- CRITICAL (1): the EU-vs-US headline was produced by the definition of formal sign-off, which rises with liability.
  At 2060 decision capacity was below 0.4 in every software run, so the region share depended only on liability.
  RESPONSE: oversight duties now also protect checking (liability halves the inspection penalty); the region is
  reported alongside decision capacity; README, article and tool state the dependence. New numbers (software, 2060):
  EU 94% vs US 44% in the region; decision capacity 20 vs 15. Holding formal sign-off equal: EU 40% vs US 62%.
  The claim narrows to "European rules protect the name on the page more than the judgment behind it".
- HIGH (1): shared ownership removed the over-automation, which the source paper rules out. FIXED: ownership now
  softens lost spending in human work only; an automation-tax dial is the one lever that removes extra automation.
  Tests added across a rivalry grid.
- MEDIUM (1): the Cao mechanism said checking stops because machines got good, the benign story Cao argues against.
  FIXED: checking depends on reviewers' ability to tell good from bad (falling as output resembles skilled work)
  times the stakes, against the cost of checking; smoother logistic.
- MEDIUM (1): override-rate scale indefensible (57% in software in 2026). FIXED: O = share checked × machine error
  rate × judgment, with e0 in [0.05, 0.15]; the rubber-stamping flag moved to the share of outputs worth checking.
- LOW (1): task-order dial changed default behaviour. FIXED: factors centred on the default.
- (2) The essay's own thesis was a fixed dial. FIXED: the dashboard learns (ε): little visible checking raises cost
  framing. The override rate is labelled "one trace of review, not its value". Known limits now say necessity is
  modelled only as error-catching, and that Cao's rule stands in for deference and normalisation of deviance.
  Bainbridge (1983) credited in the article; "hedged performative written as an equation" softened to "a cousin".
  New dated prediction on published override rates.
- (3) Article: false claim that two neighbours were Anthropic's, unsourced sentence on conversations, announcer and
  aphorism buttons, an over-reaching line on Korinek. All fixed. Moltbook and Vaswani added to SOURCES.md.
- (4) Ten tiles left empty cells; links unstyled; rounding hid the Canaries miss and sub-1% rates; σ and W missing
  from the equations; run counts differed between page and tests. All fixed.

Not fixed, stated: δ still cannot reach the endoscopy result (about 4% a quarter at most, against a 21% relative fall);
three of four plausibility checks still miss; no population layer; no hidden labour; India and the Global South absent.
