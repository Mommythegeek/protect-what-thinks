# Changelog

## SPINE Scenario 4: first simulation results (November 2026)

Vincent Bezard ran a first version of Scenario 4, proposed by Charles Martin Jones Jr in issue #1: reliable information keeps 100% of steps within the simulator's limits, misleading information corrected after 25 steps keeps 61.8% and then recovers, misleading information throughout keeps 0%. Details in **BSR_Scenario4_first_results.md**. Thanks to Vincent for running it. The paper itself is unchanged.

## Beyond Solipsistic Robotics — V7.4 → V7.5 (November 2026)

Everything new in this version is a proposal. It was drafted with AI assistance and has not been signed off by a specialist (Criterion 3 of the methodology paper).

**Eq. 1 corrected.** Section 4.1 now writes Expected Free Energy in the pragmatic and epistemic form of Da Costa et al. (2020): G = −E_{Q(o|π)}[ln P(o|C)] − I(o; s|π), with the information gain I(o; s|π) = H[Q(o|π)] − E_{Q(s|π)}[H[P(o|s)]] given as Eq. 1a. The earlier form called the ambiguity term "epistemic value" and omitted an entropy term. Thijs van de Laar identified the problem in his review. The two canonical forms were checked against each other numerically on 2,000 random discrete distributions and agree to machine precision.

**Section 4.0 added.** One new subsection states the whole proposal with probability and a generic cost, without active inference, in five labelled statements (N1) to (N5), so that a reader from reinforcement learning, control or planning can evaluate it. It adds one new assumption, (N3): the human's capacity to self-regulate grows when they do the work and decays when the robot does it for them. The precedent is the "assist-as-needed" finding in rehabilitation robotics (Wolbrecht, Chan, Reinkensmeyer & Bobrow, 2008, *IEEE TNSRE* 16(3), 286–297). It is an assumption and its rates would have to be measured.

**One new open point.** The second selection stage (Eqs. 11 and 12) only chooses among policies that tie on cost. If one policy is the unique minimiser, the stage does nothing. A cost margin would repair it; that change is not made yet.

**Wording.** "The human in the room does not appear" in Section 4.1 is replaced by a statement limited to the architectures reviewed in Section 2. Eqs. 2 to 13, Sections 5 to 7 and Appendix A are unchanged. The five other open points of Section 4 remain open. The changelog is also printed as the last page of the PDF. V7.4 is kept in `archive/`, and the editable source of V7.5 is in the repository as `Beyond_Solipsistic_Robotics_v7.5_source.docx`.

## Beyond Solipsistic Robotics — V7.3 → V7.4 (November 2026)

**Regulatory Withdrawal criterion reconciled.** Section 4.5 defines withdrawal as a joint condition: information-gain saturation, D_KL[q_t(v^h) ‖ q_{t−1}(v^h)] < δ_sat, together with demonstrated resilience, ρ_res(t) ≥ ρ_min. Two later passages described a trigger based on posterior variance alone: property P5 in Section 5.1, and the L2 parameterization in Section 5.2.3 ("withdrawal triggered when the rate of decrease in Var falls below 5% per timestep"). Read literally, that trigger would allow withdrawal from a human who is stably dependent, which is the case Section 4.5 is written to exclude. Both passages now state the joint condition of Section 4.5. No other content has changed. The changelog is also printed as the last page of the PDF.

**Credit.** Identified by Charles Martin Jones Jr (AI Bio Synergy) in [issue #1](https://github.com/Mommythegeek/protect-what-thinks/issues/1), which also proposes a fourth SPINE scenario on confidently incorrect estimates of the human's state. That proposal is under review with Vincent Bezard and is not yet part of the paper.

V7.3 is kept in `archive/` for reference.
