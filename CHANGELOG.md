# Changelog

## Beyond Turn-Based AI (PRF) — v5 → v6 (November 2026)

Everything new in this version is a proposal, drafted with AI assistance and not checked by a specialist.

**The inconsistency flagged in v5 is repaired (§2.11, candidate).** Under the v5 equations a long silence erased retained content, because the idle dynamics had a single attractor. The retention block now has a multi-well prior, one bistable unit per coordinate, which is Lisman's switch in mathematical form. Salience sets the barrier when a trace is written and the forgetting governor lowers it. The section gives the condition for a well to survive the allostatic pull, a retention time from Kramers' formula, and a boundedness argument that needs no margin on retained coordinates.

**What the repair costs.** v3 said one assumption secured both the active-inference reading and the stability bound. That now holds on the forgetting block only (§2.7). Capacity with independent wells is about one binary choice per coordinate, and the couplings needed for distributed codes are not specified.

**The substrate is costed honestly (§3).** Non-diagonal transitions are confined to the retention block. The cost comparison in the companion long-form draft predates this and has to be redone.

**A gap test is added (§6)**, which can show the repair to be unnecessary. A toy check of the algebra is in **prf_gap_toy.py**: it is not a test of the PRF.

**Citations checked.** Two were wrong and are corrected: the allostasis reference is Katsumi, Theriault, Quigley & Barrett (*Network Neuroscience*, 2022), and the *Cell Host & Microbe* trained-immunity paper is Netea, Quintin & van der Meer (2011). The paper's own changelog lists what was confirmed and what was not reached.

**The whole process is logged** in **PRF_v3_to_v6_process_log.md**: what came in, what was decided, what was found wrong, two claims that did not survive being written down, and what is open. v5 is in `archive/`.

**Open.** A specialist reader for §2.7 and §2.9 to §2.11. The decisive experiment has not been run.

## Beyond Turn-Based AI (PRF) — v3 → v5 (November 2026)

Everything new in this version is a proposal. It was drafted with AI assistance and none of the new formal material has been checked by a specialist. No claim in v3 is withdrawn and no v3 equation has changed. A v4 draft was working material and was never published.

**Prior art the paper should have carried (§2.8, §4).** A state that is never reset and is rewritten at every step has to say what keeps a trace from being washed out. Biology has asked this since Crick (1984) and answered it in one form since Lisman (1985). The paper now states that lineage, concedes the form of the idea, and carries the counter-evidence (Mohar et al. 2025; Chen et al. 2014).

**Hu et al. (2026) cited as published (§1, §2.2)**, with its lineage and the limit of the analogy: cell ensembles in mouse dentate gyrus are not subspaces of a latent state.

**A conjecture revised by a toy run (§2.8, §6).** A linear toy memory showed a best size under interference and no cliff. The conjecture is now stated so that it can come out either way.

**Order-sensitive state (§2.9, candidate).** When relational state depends on the order of events, a system must pay a cost that grows with the history, or lose that state, or carry an incrementally updated statistic. It is a trilemma and not a proof that the PRF is better. One consequence cuts against the paper's own substrate: a diagonal selective state-space model cannot track such state (Merrill, Petty & Sabharwal, 2024), so the retention update needs non-diagonal transitions.

**A conditional bound on forgetting (§2.10, candidate)**, for the direct contribution of a released trace only, with its limits stated. The retention block must not be contracting.

**Training (§3).** Distillation from a full-history teacher replaces the simulator-and-reward signal. Proposed, not run.

**Also.** The allostatic regulator becomes an inferred state with a supervised hyperprior (§2.7, candidate). ACM (Li et al., 2026) is added to prior work and to the baselines. Appendix A records who checked what. The editable source is now in the repo as **Beyond_Turn-Based_AI_PRF_v5_source.md**; v3 is in `archive/`.

**Credit.** The Crick and Lisman omission, the Hu et al. upgrade and the toy run came from a separate literature and verification session run for Carla de Préval and passed on in writing.

**Open.** A specialist reader for §2.7, §2.9 and §2.10. The decisive experiment has not been run.

**Known inconsistency in v5, flagged at merge (15 November 2026).** A stress test run on v5 the day it was written found that §2.4, §2.6 and §2.7 together imply the opposite of what the paper wants. With no input, the state relaxes toward the allostatic reference, so anything not encoded in that small reference decays exponentially while the user is away. v5 names the cause in §2.10 (the retention block must not be contracting) and does not repair §2.4. A second finding: §2.9 requires non-diagonal transitions on the retention block, while §3 still describes the substrate as built from familiar primitives and does not cost that change. v5 is published with both flags so the trail is visible. The repair is the next version.

## SPINE Scenario 4: first simulation results (November 2026)

Vincent Bezard ran a first version of Scenario 4, proposed by Charles Martin Jones Jr in issue #1: reliable information keeps 100% of steps within the simulator's limits, misleading information corrected after 25 steps keeps 61.8% and then recovers, misleading information throughout keeps 0%. Details in **BSR_Scenario4_first_results.md**. Thanks to Vincent for running it. The paper itself is unchanged.

## Beyond Solipsistic Robotics — V7.8 → V7.9 (November 2026)

**The checking process is now part of the paper.** No equation changed.

- New **Appendix B, "Who checked what, and the record of stress tests"**: every check we have a record of, in order, with who or what made it, how, what it found and what it missed, then the status of each formal claim.
- **Section 6.1 reports the stress test of 15 November 2026.** Its main result goes against the architecture as written: with a fixed tolerance in Eq. 4 and the capacity assumption (N3), the robot keeps the work and the person's capacity falls (89% of 6,912 parameter settings in a toy model). The fixed rule also produced more viability failures over 1,500 steps (7.7) than a rule that accepts more risk early (2.5). Toy models, AI-run, not reviewed.
- **New folder `stress-tests/`**: the stress-test note, the script that reproduces it, the backtest of an AI audit against the specialist review (0 of 5 maths errors found by the AI audit), and a running log.

V7.8 and its source are in `archive/`.

## Beyond Solipsistic Robotics — V7.7 → V7.8 (November 2026)

**Two sources read and added. Nothing else changed.** V7.7 left four sources uncited because they had not been checked. All four have now been found. Two were read on arXiv and are cited in the open question of Section 6.1, with their numbers and limits:

- Min et al. (2026), arXiv:2611.08721: 14,256 simulated mental-health support conversations with a memory-equipped assistant. After a crisis the assistant omitted needed help at rates of 0.827 (anxiety), 0.614 (self-harm) and 0.593 (suicidal ideation). Their measure counts omission session by session, not across the whole history, so the decline-detection delay proposed in V7.7 is still to be built.
- Chu (2026), arXiv:2611.06545: agents' self-written handoff summaries sometimes state permissions or restrictions the record does not support. The rates are low (at most 2.4% and 1.3%, lower bounds) and the pre-specified behavioural test was not significant, so the paper says the failure exists and does not say it is common.

**Two sources left out.** Aupérin et al. (2026, *Nature Structural & Molecular Biology* 33, 985–997) was read; it concerns inheritance in nematodes and would only be an analogy here. Song et al. (2026, *Nature Communications*, DOI 10.1038/s41467-026-78922-x) could be read only through its press release and waits for a reading of the article.

V7.7 and its source are in `archive/`.

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
