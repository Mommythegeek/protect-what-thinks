# Human Necessity Model

**A scenario model of how fast firms cut junior hiring, how long experienced judgment lasts, and when a human signature stops meaning a human decision.**

*When is a human still necessary, and when does the dashboard stop being able to tell?*

Version 1.2 · model 0.4 · 20 October 2026 · Carla de Préval, with Claude
Companion to the essay *The Human You Never Fired* (Intelligence Not Optimization).

**Status: illustrative, not estimated.** The coefficient ranges are reasoned, not fitted. The plausibility checks are in-sample, and three of the four currently miss. This is published so it can be broken and repaired in the open.

## Try it

Open `index.html` in any browser. It is a single file with no build step and no data leaving your machine.
Hosted copy: enable GitHub Pages for this repository, then the tool lives at `https://mommythegeek.github.io/protect-what-thinks/human-necessity-model/`.

## What it models, in one paragraph

Firms plan automation on the capability they *expect*, not the capability that exists, and they cut junior hiring on those plans. Fewer juniors drain the stock of experienced judgment. Dashboards that count human review as latency take away the time to use what judgment remains, and opaque agents take away the evidence. Liability keeps the human signature in place. The result can be a person who still signs but no longer decides. The model runs this loop 500 times per setting, from 2026 to 2060, for one kind of work at a time, with stylised profiles for the United States, the European Union and China.

## The one result worth arguing about first

With identical work and identical machines, the EU profile keeps the most decision capacity in people, yet lands most often in "the signature remains, the decision has left" (94% of software runs by 2060, against 27% for the US profile). Liability holds the signature in place while real decision capacity drains. Whether that is a property of the world or of this model's equations is exactly what reviewers are asked to test.

## Where the model is known to be wrong

- It cannot reproduce Anthropic's one-year collapse in junior technical hiring (27% → 9% of hires, 2025–2026). A smooth anticipation curve is too gentle. The report ties the shift to specific model releases, which suggests belief moves in shocks.
- It is slightly too gentle on young workers in AI-exposed occupations (Stanford "Canaries", August 2026: about 19% below counterfactual).
- It leaves radiology headcount just short of growing from 2016 to 2026, when in reality it grew. Demand is under-weighted.
- It has no layer for hidden human labour (annotators, raters, moderators) and no population layer for agents coordinating with one another.
- Regional profiles are stylised dial shifts, not estimates. India and the Global South are missing.
- Taste is not measured. "Decision capacity" is an index, not yet mapped to observable override rates or review times.

The full list, with every reviewer finding and the response to each, is in `REVIEW-LOG.md`.

## How to help

Open an issue with the template **"Where is the model wrong?"**. The most useful contributions, in order:

1. A dataset that can fit or test a coefficient (entry-level hiring by occupation, override rates in clinical AI, time spent on review).
2. A backtest: bank tellers after ATMs, radiology since 2016, translation since 2017, aviation manual flying since 2009.
3. A structural objection: an equation that is wrong, a missing loop, a variable that cannot be measured.
4. A regional profile you know from the inside, with its sources.
5. A field site: a team willing to log, for six months, how often human review changes an outcome.

## Run the tests

```
node human-necessity-model/tests/model.test.mjs
```

The tests check properties the reviews asked for (indices start at 1, capability is monotone, protective dials never lower decision capacity, results are reproducible from the seed) and print the plausibility checks.

## Disclosure

Built with Claude, an Anthropic model, and partly calibrated on Anthropic's own published workforce data. The four first reviews were structured reviews by Claude agents briefed as a labour economist, a sociologist of work, a forecasting methodologist and an information designer. Human review starts now.

## Cite

de Préval, C. (2026). *Human Necessity Model* (v1.2, model 0.4) [Interactive scenario model]. Intelligence Not Optimization. https://github.com/Mommythegeek/protect-what-thinks/tree/main/human-necessity-model
