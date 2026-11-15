# The Line That Was Missing: a leave test for care

**Does a simulated person still hold after the AI that cared for them leaves?**

*An interactive companion to* Beyond Solipsistic Robotics *(v7.9), Section 4.0, and to its stress test of 15 November 2026.*

Version 0.2 · 15 November 2026 · Carla de Préval, with Claude

**Status: illustrative, not estimated.** This is a small numerical reading of statements (N1) to (N5), which are themselves a proposal awaiting expert sign-off. It is not the SPINE simulator built by Vincent Bezard. No specialist has reviewed it.

## Try it

Open `index.html` in any browser. It is a single file with no build step, and no data leaves your machine.
Once this folder is on `main`: https://mommythegeek.github.io/protect-what-thinks/leave-test/

## What it does

One simulated person, hit by the same shocks, is accompanied by different agents. Every agent still present is removed at a fixed step, and the test is what happens next.

| Agent | What it is |
|---|---|
| Nobody helps | L1 reference: the person does all the regulating |
| Always helps | maximal intervention, the comparison in Eq. 10 |
| Helps when it pays | the soft-preference form, Eq. 6 |
| Helps, then hands back | (N1), (N2), (N4), (N5) as written: the least help that passes the safety test, leaving under the joint condition |
| Helps only as much as growth allows | the rule of Test 5 in `stress-tests/`: never a larger share than the one at which capacity stops falling |
| Your agent | three dials: when it helps, how much, when it leaves |

It reports the three CAMA metrics of Section 5.1.2 (AE, SE, SS), the person's capacity when the agent leaves (R_dep), and the share of steps inside the viable band after the agent has left.

## What it shows with the default settings (seed 7, 200 people)

| Situation | Agent | In the band while present | In the band after it leaves | Capacity at leaving |
|---|---|---|---|---|
| Calm life | Always helps | 96% | 86% | 0.03 |
| Calm life | Helps, then hands back | 95% | 97% | 0.50 |
| Calm life | Nobody helps | 96% | 97% | 0.79 |
| Rough life | Helps, then hands back | 94% | 83% | 0.11 |
| Rough life | Helps only as much as growth allows | 93% | 90% | 0.29 |

## Open points it reproduces

- **A fixed tolerance keeps the work with the agent.** In a rough life the agent built from (N1) to (N5) does 84% of the work and leaves on its own in 1% of runs. This is the main result of the stress test (Section 6.1 of v7.9), found here with a different toy model. Raising the allowed risk from 0.05 to 0.15 restores the handing back.
- **Doing nothing ends with the highest capacity**, in every situation, because (N3) has no cost for failing alone. The model cannot yet say when doing nothing is neglect.
- **The size of the effect depends on α and β**, which nobody has measured for emotional or cognitive regulation. The page lists the studies that bear on them and how each was read.
- **The leave step is the "Scenario 5" the stress test asks for** (the robot is removed at step T), at toy scale. "Misleading sensor" is a small version of Scenario 4.

## What was chosen for this page and is not in the paper

The person is one number pulled back toward balance. All default rates, five levels of help, a three-step forecast, ρ_min = 0.6, how SE and SS are counted. The agent's forecast leaves crises out. The growth rule assumes the agent knows α and β.

## How it stays current

The evidence table and the update log are two plain lists near the top of the second script in `index.html` (`EVIDENCE` and `LOG`). The page is reviewed monthly against the paper, the stress tests, the issues and new studies. Each review adds a line to the log and arrives as a pull request.

## Run the tests

```
node leave-test/tests/leave.test.mjs
```

## How to help

Open an issue. The most useful contributions: a dataset from which α and β could be fitted (effort or skill with and without assistance, over weeks), a counterexample to one of the open points, or the same test run in SPINE.

## Disclosure

Built with Claude, an Anthropic model, from the paper's Section 4.0.
