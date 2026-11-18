# The Line That Was Missing: a leave test for care

**Does a simulated person still hold after the AI that cared for them leaves?**

*An interactive companion to* Beyond Solipsistic Robotics *(v7.9), Section 4.0, and to its stress test of 15 November 2026.*

Version 0.5 · 18 November 2026 · Carla de Préval, with Claude

**Status: illustrative, not estimated.** This is a small numerical reading of statements (N1) to (N5), which are themselves a proposal awaiting expert sign-off. It is not the SPINE simulator built by Vincent Bezard. No specialist has reviewed it.

## Try it

Open `index.html` in any browser. It is a single file with no build step. The simulation runs in your browser and nothing you set is sent anywhere. The page loads three fonts from Google Fonts, so Google sees the reader's IP address.
Once this folder is on `main`: https://mommythegeek.github.io/protect-what-thinks/leave-test/

## What you see first

Three ropes, one for each kind of help, drawn from the same 200 simulated people in the manner of kintsugi, the Japanese repair with gold. Ivory fibres are the share of people who hold, brighter and thicker when they can recover alone. Red fibres broken away are the share who do not. Gold is the share of the work the agents do, laid from the breaks inward, so a rope all in gold is people for whom everything is done. Dust is capacity being built: it rises only where people do the work themselves. Each of the four marks carries one variable of the simulation and nothing is decorative. At one step every helper leaves. The page opens on the "Needs help" setting, where help has something to prove: with constant help 88% hold and then 53%; with help that hands the work back, 87% and then 79%; left alone from the start, 74% and then 85%.

## What it does

One simulated person, hit by the same shocks, is accompanied by different agents. Every agent still present is removed at a fixed step, and the test is what happens next.

| Agent | What it is |
|---|---|
| Nobody helps | L1 reference: the person does all the regulating |
| Always helps | maximal intervention, the comparison in Eq. 10 |
| Helps when it pays | the soft-preference form, Eq. 6 |
| Helps, then hands back | (N1), (N2), (N4), (N5) in the reading most favourable to the paper: the least help that passes the safety test, leaving under the joint condition |
| Helps only as much as growth allows | the rule of Test 5 in `stress-tests/`: never a larger share than the one at which capacity stops falling. It is not inside the safe set of (N1) |
| Your agent | three dials: when it helps, how much, when it leaves |

It reports the three CAMA metrics of Section 5.1.2 (AE, SE, SS), the person's capacity when the agent leaves (R_dep), the share of steps inside the viable band after the agent has left, and the share of steps on which an agent gave less help than the safety test asks.

## What it shows with the default settings (seed 7, 200 people)

| Situation | Agent | In the band while present | In the band after it leaves | Capacity at leaving |
|---|---|---|---|---|
| Calm life | Always helps | 96% | 86% | 0.03 |
| Calm life | Helps, then hands back | 95% | 97% | 0.50 |
| Calm life | Nobody helps | 96% | 97% | 0.79 |
| Rough life | Helps, then hands back, fail-safe: a human takes over (default) | 94% | 83% | 0.11 |
| Rough life | Helps, then hands back, fail-safe: the agent stops | 89% | 91% | 0.30 |
| Rough life | Helps only as much as growth allows | 93% | 90% | 0.29 |
| Needs help | Nobody helps | 74% | 85% | 0.40 |
| Needs help | Always helps | 88% | 53% | 0.01 |
| Needs help | Helps, then hands back | 87% | 79% | 0.22 |
| Needs help | Helps only as much as growth allows | 82% | 81% | 0.27 |

## Open points it reproduces

- **A fixed tolerance keeps the work with the agent.** In a rough life the agent built from (N1) to (N5) does 84% of the work and leaves on its own in 1% of runs. This is the main result of the stress test (Section 6.1 of v7.9), found here with a different toy model. Raising the allowed risk from 0.05 to 0.15 restores the handing back. The size depends on what the fail-safe does when no help is safe, which happens on about 15 steps in 200. If a human takes over, the agent side does 84% of the work. If the agent stops, 55%, and it leaves on its own in 61% of runs. The finding holds in both readings.
- **Doing nothing ends with the highest capacity**, in every situation, because (N3) has no cost for failing alone. The model cannot yet say when doing nothing is neglect.
- **The growth rule buys capacity with risk.** In a rough life it gives less help than the safety test asks on 41% of steps.
- **Blindness reads as nothing left to learn.** On steps that carry no information the page counts zero learning (Test 4 of the stress test). Counting only informative steps moves the leaving in a calm life from about step 63 to about step 83 and changes no conclusion.
- **With the default settings the person hardly needs help** (96% in the band alone in a calm life, 93% in a rough one), so those tables show the cost of care and almost none of its benefit. The "Needs help" setting is a person who starts low, recovers capacity slowly and meets three times more crises.
- **The size of the effect depends on α and β**, which nobody has measured for emotional or cognitive regulation. The page lists the studies that bear on them and how each was read.
- **The leave step is the "Scenario 5" the stress test asks for** (the robot is removed at step T), at toy scale. "Misleading sensor" is a small version of Scenario 4.

## What was chosen for this page and is not in the paper

The person is one number pulled back toward balance. All default rates, five levels of help, a three-step forecast, ρ_min = 0.6, how SE and SS are counted. The agent's forecast leaves crises out. The growth rule assumes the agent knows α and β.

Where the agent departs from the text of Section 4.0:

- (N2) and (N4) as written pick the cheapest safe action for the agent's own task and use capacity to break ties. The agent here has no task cost and always takes the least help that is safe. The stress test used the same reading.
- (N5) as written compares successive beliefs about the person's viability. The page compares successive estimates of the person's capacity.
- (N1) is a joint statement over the horizon. The forecast multiplies per-step probabilities as if the steps were independent, which errs on the cautious side here.
- "Fail-safe" is read by default as a human taking over all the work. A dial switches to the agent stopping.

The comparison with five current benchmarks on the page rests on their arXiv listings and abstracts, read by the session that built the page. Nobody has read those five papers in full for this page.

## How it stays current

The evidence table and the update log are two plain lists near the top of the second script in `index.html` (`EVIDENCE` and `LOG`). The page is reviewed monthly against the paper, the stress tests, the issues and new studies. Each review adds a line to the log and arrives as a pull request.

## Run the tests

Checks labelled "maths" test that the code is correct. Checks labelled "result unchanged" assert the numbers above, open points included, and are expected to fail on the day someone fixes an open point.

```
node leave-test/tests/leave.test.mjs
```

## How to help

Open an issue. The most useful contributions: a dataset from which α and β could be fitted (effort or skill with and without assistance, over weeks), a counterexample to one of the open points, or the same test run in SPINE.

## Who made what

- **Carla de Préval** wrote the paper this page runs, *Beyond Solipsistic Robotics*, with **Vincent Bezard**, who built SPINE, the real simulator. This page is a toy next to SPINE.
- **Charles Martin Jones Jr** proposed Scenario 4, the robot that is confident and wrong about the person. "Misleading sensor" is a small version of it. Vincent Bezard ran the first results.
- The studies in the evidence table belong to their authors: Kewenig, Tankelevitch, Rintel, Sarkar and Sellen (2026); Chen, Koedinger and colleagues (2026); Budzyń and colleagues (2025); Wolbrecht, Chan, Reinkensmeyer and Bobrow (2008). None of them has seen or endorsed this page.
- The page was built with Claude, an Anthropic model. A second Claude session, which keeps the paper, reviewed it on 16 November 2026 and found four errors, fixed in v0.3. No human specialist has reviewed it yet.
- The idea of a page drawn only in code came from the film in Ethan Mollick's post "Fable 5.2 and Jagged AGI".
