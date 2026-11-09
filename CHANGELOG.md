# Changelog

## SPINE Scenario 4: first simulation results (November 2026)

Vincent Bezard ran a first version of Scenario 4, proposed by Charles Martin Jones Jr in issue #1: reliable information keeps 100% of steps within the simulator's limits, misleading information corrected after 25 steps keeps 61.8% and then recovers, misleading information throughout keeps 0%. Details in **BSR_Scenario4_first_results.md**. Thanks to Vincent for running it. The paper itself is unchanged.

## Beyond Solipsistic Robotics — V7.3 → V7.4 (November 2026)

**Regulatory Withdrawal criterion reconciled.** Section 4.5 defines withdrawal as a joint condition: information-gain saturation, D_KL[q_t(v^h) ‖ q_{t−1}(v^h)] < δ_sat, together with demonstrated resilience, ρ_res(t) ≥ ρ_min. Two later passages described a trigger based on posterior variance alone: property P5 in Section 5.1, and the L2 parameterization in Section 5.2.3 ("withdrawal triggered when the rate of decrease in Var falls below 5% per timestep"). Read literally, that trigger would allow withdrawal from a human who is stably dependent, which is the case Section 4.5 is written to exclude. Both passages now state the joint condition of Section 4.5. No other content has changed. The changelog is also printed as the last page of the PDF.

**Credit.** Identified by Charles Martin Jones Jr (AI Bio Synergy) in [issue #1](https://github.com/Mommythegeek/protect-what-thinks/issues/1), which also proposes a fourth SPINE scenario on confidently incorrect estimates of the human's state. That proposal is under review with Vincent Bezard and is not yet part of the paper.

V7.3 is kept in `archive/` for reference.
