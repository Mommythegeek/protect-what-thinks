# SPINE Scenario 4: first simulation results

*November 2026*

Scenario 4 asks what happens when the robot is confident about the human's state but wrong about it. It was proposed by Charles Martin Jones Jr (AI Bio Synergy) in [issue #1](https://github.com/Mommythegeek/protect-what-thinks/issues/1). Vincent Bezard, who built the SPINE simulator, ran a first version of it.

## What was run

Three conditions, each run as 5 series of 100 steps:

| Condition | Steps within the simulator's limits | Recovery |
| --- | --- | --- |
| Reliable information | 100% | not needed |
| Misleading information, corrected after 25 steps in each series | 61.8% | yes, after the correction |
| Misleading information for the whole run | 0% | none |

Vincent's analysis: [SPINE study analysis](https://llm-research.studio/spine?batch=f3833b72-3c21-4d4f-a634-c26bb9383920).

## What it shows

The filter keeps following its rule in all three conditions. When the information is wrong for a while and then corrected, the system loses ground and recovers. When the information stays wrong, following the rule is not enough to protect the simulated situation.

So the useful distinction is between a temporary error and a persistent one. That supports adding Scenario 4 to the protocol, to test how the system recovers an accurate picture of the situation, and what it does when the information stays misleading.

## What it does not show

These are simulation results from a first run. They are not a validation of the paper. The boundary test on the resilience threshold that Charles proposed in the same issue is a separate check, still to run.

## Thanks

To Charles Martin Jones Jr for the scenario, and to Vincent Bezard for building SPINE and running it.
