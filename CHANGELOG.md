# Changelog

## SPINE Scenario 4: first simulation results (November 2026)

Vincent Bezard ran a first version of Scenario 4, proposed by Charles Martin Jones Jr in issue #1: reliable information keeps 100% of steps within the simulator's limits, misleading information corrected after 25 steps keeps 61.8% and then recovers, misleading information throughout keeps 0%. Details in **BSR_Scenario4_first_results.md**. Thanks to Vincent for running it. The paper itself is unchanged.

## Beyond Solipsistic Robotics — V7.6 → V7.7 (November 2026)

**One open question added. Nothing else changed.** Section 6.1 now asks who writes the robot's memory of the person and when it expires: interpretations (preferences, permissions) that lapse unless the person confirms them, and dated measurements that never lapse, so that a slow decline stays visible against a fixed baseline. Two measures are proposed for CAMA: the share of active interpretations the person has confirmed within their expiry window, and the delay in detecting a simulated slow decline. The idea fails if expiry does more harm through lost context than it prevents. It is recorded as a question to pursue, not as part of the architecture.

One reference added: Dash et al. (2026), arXiv:2602.01450. Four other sources suggested with the proposal are not cited because they have not yet been checked against the published papers.

**Credit.** Proposed by the monthly cross-reading of recent literature (Signal Engine, November 2026), run for Carla de Préval in another AI session and passed on in writing. V7.6 and its source are in `archive/`.

## Beyond Solipsistic Robotics — V7.5 → V7.6 (November 2026)

Four citation fixes. No equation changed. V7.5 said its own references to Da Costa et al. (2020) had not been re-verified. They have now been checked against the published article (*J. Math. Psych.* 99:102447) and both arXiv versions (arXiv:2001.07203), which carry the same equation numbers.

**1. Eq. 14, not Eq. 16.** The two-term form of Eq. 1 is the second line of Da Costa et al.'s Eq. 14, which they give as a lower bound on G: G(π) ≥ −E_Q[ln P(o_τ)] − E_Q[D_KL[Q(s_τ, A|o_τ, π) ‖ Q(s_τ, A|π)]]. It is an equality when the posterior is exact, because the term dropped, the expected evidence bound, is then zero. Section 4.1 now states that condition. Their Eq. 16 is a four-term decomposition (extrinsic value, expected evidence bound, salience, novelty).

**2. Eq. 13 transcribed correctly.** Their Eq. 13 defines risk over hidden states and parameters: G(π) = D_KL[Q(s_τ, A|π) ‖ P(s_τ, A)] + E_{Q(s_τ, A|π)}[H[P(o_τ|s_τ, A)]]. Risk over outcomes, which this paper uses, is their Eq. 15 and rests on an approximation. They write preferences as P(o_τ); the notation P(o|C) is from Parr et al. (2022). This paper omits the model parameters A and now says so.

**3. "Pragmatic" is not their word.** Da Costa et al. write extrinsic and intrinsic value. "Pragmatic" and "epistemic" are now attributed to Parr et al. (2022). The identity in Eq. 1a is standard and is ours, not theirs.

**4. Wolbrecht et al. (2008) rescoped.** Their paper shows that patients reduce their own effort when the robot will do the work, measured during the movements. It did not test therapeutic outcome and says recovery runs on a much longer time constant. Section 4.0 now cites it for effort and not for capacity. The claim that capacity grows and decays, (N3), stays this paper's own assumption. DOI added: 10.1109/TNSRE.2008.918389.

**Credit.** The four points were found by a separate citation check of V7.5, run for Carla de Préval in another AI session and passed on in writing. Appendix A and **BSR_Section4_Open_Maths_Points.md** carry the same corrections. The V7.4 → V7.5 entry below is kept as written, including the attribution corrected here. V7.5 and its source are in `archive/`; the editable source of V7.6 is `Beyond_Solipsistic_Robotics_v7.6_source.docx`.

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
