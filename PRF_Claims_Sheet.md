# PRF claims sheet: what the paper asserts and how to break each claim

### For reviewers, to be read before any changelog, review or process log

**Paper:** *Beyond Turn-Based AI: A Persistent Relational Field Primitive for Lifting False Episodicity*, short technical paper, v6 (Carla de Préval, November 2026).
**This sheet matches:** v6. It is updated whenever the paper changes.

## How to use this sheet

This sheet lists the claims of the paper, the assumptions each one rests on, and the result that would show it to be wrong. It contains no history and no one's verdict.

1. Read the claim here, then the section of the paper it points to.
2. Form your own assessment and write it down.
3. Only then open Appendix A and the Changelog at the end of the paper, the repository changelog, the process log, or any other review.

For each claim, please say one of: holds as stated, holds under narrower conditions (state them), fails (give the counterexample or the source), or cannot be judged without an experiment or a specialist (say which). A rebuttal with evidence is as useful as a confirmation.

A plain-language gloss follows each claim, because the author is not a trained scientist and reads every review.

---

## A. Mathematical claims

### A1. The state stays bounded (§2.6)

**Claim.** If the drift obeys ‖f(Φ,x,a)‖ ≤ L‖Φ‖ + b and the symmetric part of the damping operator has smallest eigenvalue μ > L at all times, then ‖Φ(t)‖ ends up inside a ball of radius b/(μ − L). With additive white noise the bound holds for the second moment, not for each path.
**In plain terms.** The memory state cannot grow without limit, as long as damping is stronger than the drive.
**Assumptions.** Bounded inputs. The damping operator changes slowly compared with the state. The linear-growth bound holds for the trained network.
**What would falsify it.** An error in the Lyapunov computation. A system meeting both conditions whose state diverges. A showing that a fast, learned, state-dependent damping operator breaks the argument inside the stated conditions.

### A2. The fast dynamics are descent on a variational free energy (§2.7)

**Claim.** For a two-level Gaussian generative model under the Laplace approximation, gradient descent on the free energy gives the PRF fast dynamics, provided (i) the damping operator is a symmetric positive-definite precision matrix, (ii) the drive has the form g′(Φ)ᵀΠ_σ(σ − g(Φ)), and (iii) the allostatic reference is an inferred latent. The reading is restricted to perception and state estimation. No claim is made about action selection.
**In plain terms.** Under three conditions, the update rule is the standard predictive-coding rule, so the "active inference" label is earned for perception only.
**Assumptions.** Gaussian model at both levels. Laplace approximation. Separation of timescales between the fast state and the slow reference.
**What would falsify it.** A term that does not match when the two equations are compared. A showing that condition (ii) cannot be met by a learned drive reading a frozen transformer. A showing that the result is trivially true of any damped system and therefore earns nothing.

### A3. Supervision can enter as a prior without breaking A2 (§2.7)

**Claim.** The reference ν is inferred online by ν̇ = h′(ν)ᵀΠ_ψ(Φ − h(ν)) − Π_ν(ν − ν̄), while measured viability labels train only the hyperprior ν̄ = r_ω(c) offline. This is an empirical-Bayes arrangement and satisfies condition (iii) of A2.
**In plain terms.** Labels set the starting expectation. Inference does the rest.
**Assumptions.** The same timescale separation. A regressor r_ω that fits.
**What would falsify it.** A showing that fitting ν̄ on labels makes the combined procedure no longer a descent on one free energy. A showing that the update for ν is not the gradient of the stated model.

### A4. One condition gives both the free-energy reading and stability, on the forgetting block only (§2.7, §2.11)

**Claim.** On the forgetting block, requiring the damping operator to be a precision matrix yields A2 and the bound A1 together. On the retention block this does not hold, because the prior there is not Gaussian.
**What would falsify it.** A showing that the two requirements are not the same condition on the forgetting block, or that the restriction to that block is unnecessary.

### A5. Retention over records faces a three-way trade-off for order-sensitive state (§2.9)

**Claim.** Let the relational state be a product of operators, one per event, that do not all commute. Then: (1) a store whose content is unchanged by reordering events answers wrongly on some pair of histories; (2) a system reading at most k records, each built from at most m events, fails once the history exceeds km events, when the operators form a group; (3) a complete ordered log works but costs work proportional to the history at each resumption, and for non-solvable groups a single pass of a fixed-depth transformer does not suffice, assuming TC⁰ ≠ NC¹; (4) an incrementally updated state works at constant cost per event. The paper states that this separates incremental state from retrieval over records, and does not separate latent state from text.
**In plain terms.** If the order of events matters, a system must either pay a cost that grows with the history, lose the order, or carry a running state.
**Assumptions.** Real relationships contain order-sensitive structure. The cited complexity results (Barrington 1989; Merrill & Sabharwal 2023) apply as used.
**What would falsify it.** A counterexample to item 1 or 2. A showing that the cited results are misapplied. Evidence that real conversational histories contain too little order-sensitive structure for the argument to matter (see C2).

### A6. The retention update cannot be a diagonal selective state-space model (§2.9, §3)

**Claim.** Because diagonal selective state-space models are confined to TC⁰ (Merrill, Petty & Sabharwal 2024; Grazzi et al. 2024), the retention block needs input-dependent, non-diagonal transitions. Structured transitions (small dense blocks, or a product of a few reflections) meet the requirement at a cost linear in the retention dimension.
**What would falsify it.** A showing that the cited results do not imply this. A showing that the proposed structured transitions cannot compose non-commuting operators either, or cost more than stated.

### A7. Direct forgetting has a computable decay time (§2.10)

**Claim.** If a trace sits on identifiable coordinates, is released, is not re-presented, and decays on those coordinates at rate λ > 0, then its direct contribution to the output is below ε after (1/λ)·ln(L_o·L_S·‖c(t₀)‖/ε). The bound does not cover what the trace changed elsewhere in the state while it was held. The paper claims an analysable decay rate and does not claim certified erasure.
**In plain terms.** Once something is released, there is a formula for how long its direct influence lasts. Its indirect influence is not covered.
**Assumptions.** Localisation of the trace. A Lipschitz read operator, which the top-k selection breaks at ties. Lipschitz constants that are not so loose as to make the bound empty.
**What would falsify it.** An error in the bound. A showing that the bound is numerically vacuous for any realistic model. An argument that the uncovered indirect influence makes the stated bound useless for its purpose.

### A8. Retained content survives silence through a multi-well prior (§2.11)

**Claim.** With a double-well potential W(x) = ¼(x² − 1)² on each retention coordinate, barrier coefficient κ_i set by salience and lowered by the forgetting governor u_i:
(a) both wells exist while the pull toward the reference is below (2/(3√3))·κ_i ≈ 0.385·κ_i;
(b) the mean time for noise of strength D to flip a coordinate is about (π√2/κ_i)·exp(κ_i/(4D)), for D much smaller than κ_i/4;
(c) the retention block is bounded for any growth constant L, with radius of order √(d_R(L + κ_max)/κ_min);
(d) at u_i = 1 the well is gone and A7 applies.
**In plain terms.** Each remembered item is a switch with two positions. Salience sets how hard it is to flip, and forgetting makes it easier.
**Assumptions.** Independent coordinates, small noise, barriers that do not change during the escape. Capacity is about one yes-or-no choice per coordinate. Couplings between coordinates are not specified.
**What would falsify it.** An error in (a), (b) or (c). A simulation contradicting the formula in its stated range (the script `prf_gap_toy.py` in the repository lets you rerun the author's check). A showing that realistic couplings or time-varying barriers destroy the wells. A showing that the learned drive already provides persistence, which would make the change unnecessary (see C4).

---

## B. Claims about prior work and novelty

### B1. What is new is a pairing (§4, abstract)

**Claim.** Persistence, surprise-driven writing and regulated forgetting already exist (Titans, test-time training, Nemori, agentic context management). The paper's contribution is the combination of an allostatic regulator that jointly biases forgetting, consolidation and salience, with Kuramoto-family phase coupling between instances that exchanges timing and no state. The author has not found the two combined elsewhere.
**What would falsify it.** A prior paper or system that combines both.

### B2. Durable memory as a steady state under turnover is old, and the paper claims nothing on it (§2.8)

**Claim.** The lineage is Crick 1984, Lisman 1985, Roberson & Sweatt 1999, Bhalla & Iyengar 1999, with recent work on CaMKII and PKMζ-KIBRA and counter-evidence from Mohar et al. 2025 and Chen et al. 2014. The biology is used as motivation and is not offered as evidence for the architecture.
**What would falsify it.** A cited paper that does not say what the sentence citing it says. A missing earlier source. A place where the paper does lean on the biology as evidence.

### B3. Multi-well memory is the Hopfield line, and the paper claims nothing on it (§2.11)

**Claim.** What is specific to the PRF in A8 is who sets and lowers the barrier, not the multi-well energy.
**What would falsify it.** Prior work in which salience sets a barrier and a learned forgetting signal lowers it under a regulating reference.

---

## C. Empirical claims and conjectures (none has been run on a PRF)

### C1. The primary claim: the full PRF beats a test-time latent-memory model (§6)

**Claim.** On long-horizon relational coherence across 50 to 100 sessions, the full system (C8) outperforms a Titans or test-time-training baseline (C7) on pre-registered subscores, across a range of weightings.
**What would falsify it.** C8 does not beat C7. The paper states that the proposal then adds nothing beyond existing test-time memory.
**For the reviewer.** Is this the right decisive contrast? Is the evaluation independent enough of training? Is anything in the protocol tilted toward the PRF?

### C2. Order-sensitivity probe (§6, from A5)

**Prediction.** Retrieval-based conditions fail on pairs of histories with the same events in different orders as length grows. A long-context model fails beyond what one pass can compose. The PRF passes if its retention update is non-diagonal.
**What would falsify it.** The retrieval-based conditions pass (A5 has no practical bite), or the PRF fails (A6 is not met).

### C3. Coherence peaks at an intermediate retention size (§2.8, §6)

**Conjecture.** Long-horizon coherence peaks at a retention rank that tracks the number of independent relations in the history, not the number of facts, and decays at every rank when consolidation is disabled.
**What would falsify it.** Coherence rises steadily with rank, or the baseline C7 shows the same curve.

### C4. Gap test (§6, from A8)

**Prediction.** After long silences, content under the v6 retention dynamics decays no faster than the rate in A8(b). Under a single-attractor prior it decays exponentially.
**What would falsify it.** Both retain equally well, which means the learned drive supplies the persistence.

### C5. Continuity distillation generalises beyond the teacher's window (§3, §6)

**Claim.** Training the PRF to match the output distribution of the same base model given the full history yields a state that still helps on histories several times longer than the teacher's window.
**What would falsify it.** The student matches the teacher only inside the window. It has then learned compression.

### C6. Federation shares timing and no state (§2.5)

**Claim.** Instances coupled only through a phase variable coordinate without exchanging content.
**What would falsify it.** A showing that the phase signal carries recoverable state content, or an ablation (C12) showing the coupling does nothing.

---

## What the paper does not claim

- That the PRF has been built or tested.
- That any system has an inner life.
- Action selection by expected free energy.
- Certified erasure.
- That the biology proves the architecture.

## Questions a reviewer is especially well placed to answer

1. Is any claim above true but trivial?
2. Is any claim stated more strongly in the paper's abstract or conclusion than in its own section?
3. Which single claim, if it failed, would take the most of the paper with it?
4. Does each cited source say what the citing sentence says? Please name the ones you opened.
