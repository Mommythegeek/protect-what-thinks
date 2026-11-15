# Beyond Turn-Based AI

## A Persistent Relational Field Primitive for Lifting False Episodicity

### Short technical paper (v5, companion to full draft v6.2)
### Carla de Préval, May 2026, revised November 2026

---

## Abstract

Modern large language models remain architecturally episodic. Each interaction begins from logs, ends in nothing, and reconstructs continuity rather than maintaining it. Recent industry moves (Anthropic's Dreaming, May 2026; Thinking Machines' continuous interaction models, May 2026; Mem0; MIRIX) patch the surface symptoms without lifting the underlying architectural commitment. We name the family of inherited constraints *false seriality*: assumptions that intelligence proceeds in discrete bounded steps, imposed on artificial systems at every layer above the level where seriality is necessary. This paper addresses one specific form: *false episodicity*, the assumption that intelligence is bounded by sessions. We propose the *Persistent Relational Field* (PRF) as the architectural primitive that lifts this form: a continuously updated latent state partitioned into retention and forgetting subspaces, regulated by a supervised multi-horizon allostatic reference, never re-initialised across session boundaries. The PRF shares surprise-driven salience, regulated forgetting, and continuously updated latent state with recent test-time memory architectures (Titans; test-time training). Its specific contribution is the pairing of two elements we have not found combined elsewhere: an allostatic regulator that jointly biases forgetting, consolidation, and salience, and Kuramoto-family phase coupling that federates persistent states across sovereign instances with no state exchange. The dynamics are motivated by active inference, and we give a proposed derivation (§2.7, stress-tested with three model families, not yet checked by a specialist in variational inference) of the fast dynamics as variational free-energy descent under three stated conditions, with the notable property that the condition earning the active-inference reading (a precision-matrix damping operator) is the same condition that secures the stability bound. Implementation requires no retraining of foundation models. The PRF interfaces with a frozen transformer base through cross-attention over a salience-selected projection of the persistent state, an operator we call the Latent Saccade. The paper specifies a decisive experiment whose critical contrast is the full PRF against a test-time latent-memory baseline (Titans / TTT family), with four ablations isolating the allostatic regulator, forgetting governor, consolidation, and federation, testing long-horizon relational coherence under interruption and delayed resumption. The experiment is specified but not yet run; this is a theory-and-architecture paper that states in advance the result that would falsify it. Version 5 adds four things. It states the biological lineage of persistence under substrate turnover and concedes that the form of the idea dates to Crick (1984) and Lisman (1985) (§2.8). It gives a candidate argument for what retrieval over records cannot carry cheaply when relational state depends on the order of events, with a consequence for the state-space substrate (§2.9). It gives a conditional bound on how fast a released trace stops contributing to outputs (§2.10). It replaces the simulator-and-reward training signal with distillation from a full-history teacher (§3). All new formal material is a candidate, unverified by a specialist, and marked as such. The architecture is buildable from components that exist.

---

## Author's Note

This paper is sole-authored. The authorial "we" follows the convention of theoretical work in this field. The work has been developed in continuous collaboration with several large language model systems used as intellectual partners across architectural review, mathematical specification, and adversarial stress testing. The author is a writer and strategist without formal academic credentials in machine learning. A companion methodology note describes the conditions of production in more detail. The architectural choices, the substantive claims, and the responsibility for what is on these pages are the author's. The formal rendering benefits from collaboration with systems whose mathematical fluency exceeds the author's own. The architectural commitment articulated here appears across the author's prior essays in different framings, including work on sub-perceptual influence, the synthetic sublime, constitutive intelligence, and the felt world model; this paper is the technical formalisation of a position those essays approached from other angles.

---

## 1. The Diagnosis: False Episodicity

In 2017, the transformer paper removed one false constraint from machine cognition. Tokens no longer had to be processed in sequence. A field that had been listening to reality through a straw began perceiving a constellation all at once.

The same move is available at every layer of how current systems are built. Conversations forced into turns. Memory forced into retrieval chunks. Sessions forced to be the architectural unit. Organisations forced into silos. Sovereign systems forced into centralised clouds. The field is currently patching the surface at each of these layers while the underlying architecture stays where it was. We name the family of inherited constraints *false seriality*, and we address one specific form: *false episodicity*, the assumption that intelligence is bounded by sessions.

The symptoms of false episodicity in current production systems are familiar. Each conversation is treated as a contained event. Where continuity is required, it is achieved by reconstruction from logs placed back into the prompt. Forced turn-taking remains the cognitive engine even where the interface layer dissolves it. Flat context lacks a salience hierarchy grounded in viability or relational stakes. Premature answer commitment forecloses plural representation under uncertainty. The system has no model of its own viability. Sycophancy, hallucination, identity drift, and catastrophic forgetting are surface expressions of the same architectural commitment.

We are careful about the diagnostic frame. Biological cognition is not free of seriality. It has rhythms, phases, sleep-wake cycles, action selection cycles, attentional episodes, communicative turns. Our target is not seriality itself. Our target is unnecessary engineered discontinuity: the specific architectural commitment that makes each interaction a contained event with no consequence beyond the log. Biology has rhythms without resets. Current AI has resets. Evidence for this distinction runs across scales: trained immunity in innate immune cells maintains persistent state through metabolic and epigenetic reprogramming with no episodic structure (Netea et al., *Science* 2016; Netea et al., *Cell Host & Microbe* 2020); dual-ensemble forgetting in mammalian dentate gyrus partitions memory and forgetting as separate active processes, with the forgetting ensemble modulable without disturbing the stored trace (Hu et al., *Neuron* 2026); allostatic regulation places viability prediction at the top of the cortical generative hierarchy (Theriault, Quigley, Barrett & Katsumi, *Network Neuroscience*).

Recent industry moves confirm the diagnosis without lifting the constraint. Anthropic shipped Dreaming on 6 May 2026, a scheduled background process that curates an agent's memory store between sessions without modifying the model. Thinking Machines released continuous interaction models that dissolve turn-taking at the moment of speech through 200ms multi-stream micro-turns, while leaving the cognitive engine session-bound. Mem0 and MIRIX add elaborate memory stacks outside the model. Each is real engineering. The architectural choice that produced the problems remains untouched.

---

## 2. The Proposal: Persistent Relational Field

We propose a single architectural primitive that lifts false episodicity at the layer where it sits: the *Persistent Relational Field* (PRF).

A PRF is a continuously evolving latent state $\Phi(t) \in \mathbb{R}^D$, partitioned into retention $\Phi_R$ and forgetting $\Phi_F$ subspaces, regulated by a supervised multi-horizon allostatic reference, never re-initialised across session boundaries, federated across sovereign instances through low-bandwidth phase coupling without state sharing. (We work in $\mathbb{R}^D$ rather than on a curved submanifold: the linear damping term $-\Gamma\Phi$ is not in general tangent to a curved manifold, so imposing one would require an explicit tangent-space projection in every equation. We do not claim a manifold structure the dynamics do not respect.)

The general continuous-time dynamics, where $x_t$ is external input, $a_t$ is an internal control signal (the system's own generative output at the previous step, providing closed-loop self-modulation), $s_t$ is the salience vector (§2.1), and $g_t$ is the governor state formed from the forgetting governor $u_t$ (§2.2) together with the allostatic reference $\nu_t$ (§2.3):

$$\dot{\Phi}_t = f_\theta(\Phi_t, x_t, a_t) - \Gamma(s_t, g_t)\,\Phi_t + \xi_t$$

Here $\Gamma(s_t, g_t)$ is the state-dependent dampening operator whose symmetric part governs dissipation (§2.6). The PRF sits on the substrate of selective state-space models (Mamba family) for the continuous-time update at production scale. We describe the coupling between components using the vocabulary of active inference (Friston, Parr, Pezzulo), and §4 states precisely which parts of that framework the architecture instantiates formally and which it takes only as motivation.

### 2.1 Salience as a Five-Axis Vector

Salience is implemented as a learned non-negative vector with five axes:

$$s_t = \mathrm{softplus}\big(W_s\,[e(x_t), a_t, \varepsilon_t, r_t]\big) \in \mathbb{R}_{\geq 0}^5$$

where $e(x_t)$ is the input embedding, $\varepsilon_t$ the current prediction-error signal, and $r_t$ the relational-context features. The five output axes are viability salience, relational-stakes salience, surprise, novelty, and a somatic-marker analogue. Note that prediction error enters as an input feature $\varepsilon_t$ and the surprise axis is a learned function of it, not the raw signal itself; the two are distinct and the paper keeps the notation separate throughout.

### 2.2 Retention/Forgetting Subspace Dynamics

The forgetting governor is a learned function of salience, prediction error, and the allostatic reference:

$$u_t = \sigma\big(W_g\,[s_t, \varepsilon_t, \nu_t]\big)$$

Because $u_t$ depends on $\nu_t$, $\nu_t$ depends on the state, and the state depends on $u_t$, the system contains a feedback loop. We treat this as well-posed by an explicit timescale separation: the allostatic reference $\nu_t$ evolves on a slow loop relative to the fast state dynamics, so within a fast step $\nu_t$ is approximately constant. This same slow-governor assumption is what the boundedness analysis in §2.6 relies on.

The subspace dynamics are inspired by the dual-ensemble principle observed empirically in mammalian dentate gyrus, where retrieval and forgetting are supported by separate active cell populations (Hu et al., *Neuron*, 2026). We take $\phi^R \in \mathbb{R}^{d_R}$ and $\phi^F \in \mathbb{R}^{d_F}$. The coupling matrices $P \in \mathbb{R}^{d_R \times d_F}$ and $Q \in \mathbb{R}^{d_F \times d_R}$ move content between the subspaces; $u_t \in \mathbb{R}^{d_R}_{\ge 0}$ is the forgetting-governor gate (§2.2), $\rho_t \in \mathbb{R}^{d_R}_{\ge 0}$ a reinstatement gate, and $\beta \in \mathbb{R}^{d_F}_{\ge 0}$ a clearance rate on the forgetting subspace:

$$\dot{\phi}_t^R = f_R(\cdot) - u_t \odot \phi_t^R + \rho_t \odot (P\phi_t^F)$$
$$\dot{\phi}_t^F = f_F(\cdot) + \big(Q(u_t \odot \phi_t^R)\big) - \beta \odot \phi_t^F$$

The Hadamard products are now dimensionally consistent: gating happens in each subspace's own dimension, and $P, Q$ carry content across the dimension change. The coupling does not conserve mass ($P, Q$ are learned, not doubly stochastic), so we describe $P, Q$ as learned inter-subspace couplings rather than as a conservative transfer operator. The coupled form expresses that retention and forgetting are separate active processes rather than a single store and its decay; this is a structural design choice motivated by the dentate-gyrus finding, not a claim proved by the equations.

The empirical result is specific. Hu et al. identify two orthogonal learning-recruited ensembles in mouse dentate gyrus. Reactivating the Fos-tagged ensemble promotes retrieval, reactivating the Npas4-dependent ensemble drives forgetting, and manipulating the forgetting ensemble inversely shifts memory-ensemble reactivation across a continuum running from full expression to complete forgetting. The sentence that matters for this architecture is their own: "learned information remains unperturbed", because the modification targets the forgetting ensemble through Rac1 activity rather than the stored trace (*Neuron* 114(4):759-773.e5, 2026). The dissociation has a long lineage. Rac inhibition slows forgetting without affecting acquisition, and independently of the Rutabaga pathway (Shuai et al., *Cell* 140:579-589, 2010). dDA1 is required for acquisition and DAMB for forgetting in the same dopamine neurons (Berry et al., *Neuron* 74:530-542, 2012). Increasing neurogenesis after encoding induces forgetting, and precocial species with low postnatal dentate neurogenesis show no infantile amnesia until neurogenesis is artificially raised (Akers et al., *Science* 344:598-602, 2014).

We state the limit of the analogy. Orthogonal cell ensembles in mouse dentate gyrus are not orthogonal subspaces in a latent state. The finding is an existence proof that retention and forgetting can be separately addressed inside one structure, and that the second can be modulated without disturbing the first. It is not biology implementing this architecture, and the subspace partition remains a design choice motivated by the result rather than derived from it.

### 2.3 Allostatic Regulation

The allostatic regulator $R_a$ predicts a low-dimensional viability vector over multiple future horizons:

$$\nu_t = (\nu^{consistency},\,\nu^{calibration},\,\nu^{relational},\,\nu^{drift})$$

Its hyperprior is trained as a supervised problem against measured ground truth, and the reference itself is inferred online (§2.7). It emits reference signals that bias the slow loop, the forgetting governor, the salience computation, and the inter-subspace couplings. This is the architectural analogue of Theriault, Quigley, Barrett & Katsumi's placement of allostasis at the top of the cortical generative hierarchy. Note that the damping term $-\Gamma\Phi$ alone would pull the state toward the origin; retention is not the origin but the non-trivial equilibrium set by the balance between the input-and-recall drive $f_\theta$ and the damping, so a retained trace persists precisely because $f_\theta$ continues to support it against the leak. The allostatic reference shapes where that balance sits.

### 2.4 Idle State Dynamics

When external input drops below threshold ($x_t \to 0$), the field does not halt, and §2.7 lets us say precisely what it does rather than gesturing at metaphor. With no input, the likelihood-gradient term vanishes ($\sigma - g(\Phi) \to 0$ in expectation), so the dynamics reduce to descent under the top-down prior alone:

$$\dot{\Phi}_t \to -\Pi_\psi\big(\Phi_t - h(\nu_t)\big) + \xi_t.$$

The state stops trying to match external data and instead minimises divergence from the allostatic reference $h(\nu_t)$. Functionally this is selective consolidation: traces that do not contribute to predicted viability are not reinforced by any likelihood term and are pulled down by the damping, while traces aligned with the allostatic reference are retained; the exploratory noise $\xi_t$ produces low-curvature movement that smooths the retained structure. This is the architectural analogue of default-mode activation, hippocampal replay, and anticipatory rehearsal, understood as idle-time reorganisation of stored state under top-down priors, not as cognition between sessions. Where earlier drafts said the system "dreams," the precise statement is: at $x_t = 0$ the likelihood gradient goes to zero and the state evolves under the allostatic gradient, yielding selective consolidation and topological smoothing of the latent state.

### 2.5 Federation via Phase Coupling

For multi-agent or sovereign-node deployments, federation occurs through Kuramoto-family phase dynamics:

$$\dot{z}_i = \omega_i + \sum_j \kappa_{ij}\,\sin(z_j - z_i)$$

The phase variable $z_i$ of node $i$ is injected into the node's own field dynamics. No raw state is exchanged. What passes between nodes is the timing of internal rhythms. The biological grounding is direct: hyperscanning studies show measurable inter-brain synchrony during coordinated interaction, with synchrony strength correlating with coordination quality.

### 2.6 Boundedness

We give an ultimate-boundedness (input-to-state stability) condition for the deterministic drift, then state what noise changes. The dissipation in the dynamics is governed not by the eigenvalues of $\Gamma$ but by the eigenvalues of its symmetric part $\mathrm{sym}(\Gamma) = \tfrac{1}{2}(\Gamma + \Gamma^\top)$, since for the Lyapunov candidate $V = \tfrac{1}{2}\|\Phi\|^2$ the relevant quadratic form is $\Phi^\top \Gamma \Phi = \Phi^\top \mathrm{sym}(\Gamma)\,\Phi$. A general (non-symmetric) $\Gamma$ can have all eigenvalues positive while $\mathrm{sym}(\Gamma)$ is indefinite, in which case the field expands along some directions. The condition must therefore be placed on the symmetric part, uniformly in time since $\Gamma = \Gamma(s_t, g_t)$ is state-dependent.

Assume (i) a linear-growth bound on the drift, $\|f_\theta(\Phi, x, a)\| \le L\|\Phi\| + b$ for inputs confined to a bounded operating set, and (ii) a uniform dissipation margin

$$\mu := \inf_t \lambda_{\min}\!\big(\mathrm{sym}\,\Gamma(s_t, g_t)\big) > L.$$

Then along the noise-free dynamics $\dot V = \Phi^\top(f_\theta - \Gamma\Phi) \le -(\mu - L)\|\Phi\|^2 + b\|\Phi\|$, so $\|\Phi(t)\|$ is ultimately bounded by the invariant ball of radius $b/(\mu - L)$. This is an input-to-state stability statement, not a claim of asymptotic return to a point.

Noise changes the guarantee. Written honestly as an Itô SDE, $d\Phi_t = \big(f_\theta(\Phi_t, x_t, a_t) - \Gamma\Phi_t\big)\,dt + \Sigma\,dW_t$, the additive white-noise term precludes a pathwise bound; under the same margin $\mu > L$ one obtains a bounded second moment, $\sup_t \mathbb{E}\|\Phi_t\|^2 < \infty$, with the bound rising by $\mathrm{tr}(\Sigma\Sigma^\top)/(\mu - L)$. The exploratory-diffusion reading of §2.4 is the SDE reading; the pathwise reading requires bounded deterministic perturbation instead. These are different regimes and the paper does not claim both at once.

Two honest limits remain. The linear-growth constant $b$ depends on the input bound, so global boundedness presupposes bounded $x_t$ and $a_t$. And the margin condition presumes the governor varies slowly relative to the state (a timescale separation made explicit in §2.3); learned, fast, salience-modulated $\Gamma$ is harder than this analysis settles, and we treat the condition as a design target for $\mathrm{sym}\,\Gamma$ relative to the empirically measured growth constant of $f_\theta$ rather than as a proved guarantee for the trained system.

### 2.7 Relation to Variational Free Energy (Proposed Derivation)

We give a proposed derivation showing the PRF fast dynamics as gradient descent on a variational free energy, under stated conditions. We are explicit about its status: the derivation below was worked independently with two frontier model families (Gemini, Claude), which agree on the core result and its principal limits, and the author reports a further adversarial pass with a third (GPT). Agreement between models trained on overlapping data is weaker evidence than independent checks, and the derivation has not yet been checked by a specialist in variational inference. We present it as a conditional result and a bounded question for expert review, not as an established theorem.

Take a two-level hierarchical Gaussian generative model with slow allostatic latent $\nu$, fast state $\psi$ (identified with $\Phi$), and observations $\sigma$: $p(\nu) = \mathcal{N}(\nu; \bar\nu, \Pi_\nu^{-1})$, $p(\psi\mid\nu) = \mathcal{N}(\psi; h(\nu), \Pi_\psi^{-1})$, $p(\sigma\mid\psi) = \mathcal{N}(\sigma; g(\psi), \Pi_\sigma^{-1})$, where the $\Pi$ are precision (inverse-covariance) matrices, symmetric positive-definite by construction. Under the Laplace approximation the variational free energy reduces to precision-weighted squared prediction errors, and gradient descent on it with respect to the fast state gives the standard predictive-coding form:

$$\dot\Phi = -\nabla_\Phi \mathcal{F} = \underbrace{g'(\Phi)^\top \Pi_\sigma\,(\sigma - g(\Phi))}_{\text{likelihood gradient}} \;-\; \underbrace{\Pi_\psi\,(\Phi - h(\nu))}_{\text{prior term}}.$$

Term-by-term against $\dot\Phi = f_\theta - \Gamma\Phi$ yields the identification:

1. **The drive** $f_\theta(\Phi, x, a)$ is the likelihood gradient $g'(\Phi)^\top \Pi_\sigma(\sigma - g(\Phi))$: a precision-weighted, salience-modulated prediction error in which the salience vector $s_t$ acts as observation-channel precision (a diagonal modulation of $\Pi_\sigma$). This is a *constraint* on $f_\theta$, not a free reinterpretation: for the derivation to hold, $f_\theta$ must take this form, with the transformer read-out $g$ and its Jacobian $g'$ appearing explicitly, rather than being an arbitrary learned network.

2. **The dampening** $\Gamma$ is the prior precision $\Pi_\psi$, and the leak is not toward the origin but toward the reference prediction $h(\nu)$: the full term is $-\Pi_\psi\Phi + \Pi_\psi h(\nu)$. This is why retained state settles at the allostatically-set equilibrium rather than at zero (§2.3).

**The convergence worth foregrounding.** The derivation requires $\Gamma = \Pi_\psi$, a precision matrix, hence symmetric positive-definite. That is *exactly* the structural condition the corrected stability result of §2.6 needs, since $\mathrm{sym}(\Gamma) = \Gamma$ and $\lambda_{\min}(\Gamma) > 0$ follow immediately for a precision matrix. The active-inference reading and the provable boundedness are therefore the same assumption viewed twice: constraining $\Gamma$ to be a precision matrix earns the free-energy interpretation and guarantees stability in one move. This is not circular; two independent desiderata (an earned active-inference label, a Lyapunov bound) land on one structural requirement.

**The allostatic condition (honest gap).** The slow reference $\nu$ enters $\mathcal{F}$ as a high-level prior, and descent on $\mathcal{F}$ with respect to $\nu$ gives the matching one-level-up predictive-coding rule under the timescale separation of §2.3. But this holds only if $\nu$ is an *inferred* latent updated by prediction error. The architecture as specified trains the allostatic regulator as a *supervised* head against measured viability labels (§2.3), and supervised regression is not free-energy descent. So the free-energy reading of the allostatic level requires reframing the regulator as an inferred latent, or as a hybrid in which the supervision enters as an empirical prior on $\bar\nu$. A purely supervised regulator is a practical add-on, not a free-energy component, and the paper should not claim both.

**The hybrid adopted in v5 (candidate).** Online, $\nu$ is an inferred latent updated by prediction error under the timescale separation of §2.3:

$$\dot\nu = h'(\nu)^\top \Pi_\psi\big(\Phi - h(\nu)\big) - \Pi_\nu\big(\nu - \bar\nu\big).$$

Offline, the measured viability labels of §2.3 train the hyperprior: a regressor $\bar\nu = r_\omega(c)$ from session context $c$, fitted during consolidation together with $h$ and $\Pi_\nu$. Supervision sets the prior and inference sets the state, which is an empirical-Bayes (amortised-prior) arrangement, and the third condition below is then met by construction. The cost is stated: $\bar\nu$ becomes context-dependent, and the labels act on behaviour only through the prior, so a badly fitted $r_\omega$ biases every inferred $\nu$. This rule has not been checked by a specialist.

**Action (scope limit).** Full active inference selects action by minimising *expected* free energy over a policy space. The PRF defines no policy space and no expected-free-energy computation; $a_t$ is an internal control signal, not a policy argmin. We therefore restrict the claim: the PRF is an active-inference architecture for **perception and state estimation**, managing internal cognitive action (what to retain, consolidate, or release), not a sensorimotor active-inference agent. This is a common and defensible position for a predictive-coding model and we adopt it explicitly rather than overreach.

**The claim the mathematics licenses**, stated at the strength it actually supports: *the PRF fast dynamics and allostatic prior can be derived as descent on a two-level hierarchical Gaussian variational free energy, provided $\Gamma$ is a symmetric positive-definite precision matrix, $f_\theta$ takes the precision-weighted likelihood-gradient form, and the allostatic reference is inferred rather than purely supervised; under these conditions the PRF is an active-inference model of perception and state estimation, and the precision-matrix condition simultaneously secures the stability bound.* Everything beyond this, in particular the action-selection reading, is not claimed.

### 2.8 Persistence Under Continuous Update

A state that is never re-initialised and is rewritten at every step raises a problem the architecture should answer rather than assume away. What keeps a retained trace from being washed out by its own updates? §2.3 gives the formal answer: retention sits at the non-trivial equilibrium where the input-and-recall drive balances the damping. This section states where that question comes from, because it is old, and because the lineage bears on what the paper may claim.

Crick posed the requirement in 1984. A memory mechanism must survive complete turnover of the molecules that carry it (Memory and molecular turnover, *Nature* 312:101). Lisman answered it the following year with the first mechanism, a bistable autophosphorylating kinase whose state "is not reset by protein turnover" (*PNAS* 82:3055-3057, 1985). Roberson and Sweatt generalised the class in 1999, and built the retention and forgetting trade-off into the statement of the problem, which is the trade-off §2.2 implements (*Learning & Memory* 6:381-388). Bhalla and Iyengar moved it from a single molecule to a network in the same year, deriving bistability with discrete steady states from feedback in signalling pathways (*Science* 283:381-387). That last result is the closest in scale to what the PRF proposes.

We state the consequence plainly. Durable information held as a dynamic steady state under continuous substrate turnover is not a new idea and we make no claim on it. The form is forty-one years old in biology, and Lisman's title states it. The PRF proposes a different object at a different scale. What is maintained is a relational field across sessions and across sovereign instances. Its turnover is parametric and architectural rather than molecular, and its reference is a supervised multi-horizon viability prediction rather than a phosphorylation balance.

The biological account has moved recently in a way that bears on §2.6. Two opposed camps have converged on the same abstract solution in different molecules. For CaMKII, constitutive activity acquired before slice preparation stays stable over two weeks, beyond the protein's own turnover, with activity proposed to transfer from pre-existing to newly synthesised molecules (Lee, Chen & Nicoll, *PNAS* 119:e2211572119, 2022). For PKM$\zeta$, the maintained unit is now argued to be a complex rather than a molecule. PKM$\zeta$ anchored by KIBRA maintains one-month-old memory despite PKM$\zeta$ turnover (Tsokas et al., *Science Advances* 10:eadl0030, 2024). The most recent statement adds a condition that may be architecturally load-bearing. Hsieh et al. argue that dimers and monomers degrade too fast, and that only higher-order oligomers survive turnover, because a surviving partial complex templates the binding of newly synthesised subunits (*Molecular Brain* 19, March 2026). Below a threshold structural order, the structure cannot outlive its own components.

If that is right, it names a constraint on $\Phi$ that §2.6 does not express. Boundedness says $\|\Phi\|$ stays inside a ball. It does not say that a particular retained structure survives continuous rewriting. The biological claim is that survival depends on the order of the structure and not only on the balance of drive and damping.

A first toy test did not show the abrupt threshold this suggests, and we report it because it changed the conjecture. In a linear associative memory (64 dimensions, 24 key-value pairs, fixed rank $r$, continuous random interference, mean of 4 seeds), a memory that does not rebuild itself from its own leading components falls to chance at every rank. With rebuilding, recall rises gradually with rank under low interference, with no cliff. Under strong interference there is a best size: recall peaks at an intermediate rank, and larger memories do worse because they retain the interference. For content generated from 6 hidden factors the peak sits at rank 5 to 6. The toy is linear, its rebuild is a matrix truncation, its interference is random noise, and total memory strength is held fixed, which drives the high-rank collapse. It says nothing about the PRF itself. Attractor memories do show a sharp capacity limit (Amit, Gutfreund & Sompolinsky, *Physical Review Letters* 55:1530, 1985), so the absence of a cliff here is a property of the linear toy.

The conjecture is therefore stated so that it can come out either way. Long-horizon coherence peaks at an intermediate retention rank $d_R$ that tracks the number of independent relations in the history rather than the number of stored facts, and coherence decays at every rank when consolidation is disabled. §6 gives the sweep and what would falsify it.

Counter-evidence belongs here, because the biological account above is a live dispute and this paper should not cite only its supportive half. Mohar et al. measured brain-wide GluA2 turnover at single-synapse resolution during associative learning and found that turnover rose, most in hippocampal CA1 and input-specifically there (*Nature Neuroscience* 28:1089-1098, 2025). Learning churned the substrate faster rather than stabilising it. Chen et al. erased the behavioural and synaptic expression of a long-term memory in Aplysia, including by PKM inhibition, and found the memory persisted covertly and could be reinstated, which they read as a challenge to the idea that stable synapses store long-term memories (*eLife* 3:e03896, 2014). Neither the oligomer nor the CaMKII account has been replicated outside its originating collaboration, and the oligomer structure is an AlphaFold 3 prediction rather than an experimental structure. We take this biology as motivation and as a source of testable constraints. We do not take it as evidence for the architecture.

### 2.9 What Retrieval Over Records Cannot Carry Cheaply (Candidate Argument)

The paper has so far argued that reconstructing continuity from records is inferior to carrying state. This section states the part of that argument that can be made precise, and the part that cannot. It has not been checked by a specialist in complexity theory and should be read as a candidate.

**Setting.** Let a relationship be a sequence of events $e_1, \dots, e_n$, and let the relational state be $R_n = T(e_n)\cdots T(e_1)\,R_0$, where each event acts through an operator $T(e)$ drawn from a set $G$ whose elements do not all commute. The human case is ordinary: a betrayal followed by a repair, and a repair followed by a betrayal, contain the same two events and leave different states. A query at session $n+1$ must be answered as a function of $R_n$.

**Proposition (candidate).** In this setting:

1. *Order-blind stores fail.* If the content a memory system holds after $n$ events is invariant under permutation of those events (a set of extracted facts, a deduplicated note store, an embedding index with no usable order), then there are two histories with the same stored content and different $R_n$, and the system answers wrongly on at least one of them for any query that distinguishes the two states.
2. *Bounded reads fail.* If the system answers from at most $k$ stored records, each derived from at most $m$ events, and $G$ is a group, so that changing any single event changes $R_n$, then it fails in the same sense on histories with $n > km$.
3. *A complete ordered log succeeds, at a cost that grows with the history.* A timestamped complete log determines $R_n$. Recovering it means composing all $n$ operators at each resumption: $\Omega(n)$ work per session, $\Omega(n^2)$ over the relationship. When $G$ contains a non-solvable group such as $S_5$, composing $n$ elements is $\mathrm{NC}^1$-complete (Barrington, 1989), and log-precision fixed-depth transformers compute only functions in $\mathrm{TC}^0$ (Merrill & Sabharwal, 2023). Under the standard conjecture $\mathrm{TC}^0 \neq \mathrm{NC}^1$, a single forward pass over the log does not suffice for long histories, and the log has to be replayed sequentially, for instance in generated intermediate text.
4. *An incrementally updated sufficient statistic succeeds at constant cost per event.* Holding $R_t$ and applying $T(e_{t+1})$ takes $\lceil \log_2 |G| \rceil$ bits for finite $G$ and one update per event.

Items 1 and 2 are counting arguments: take $a, b \in G$ with $ab \neq ba$ and compare the histories $(a, b)$ and $(b, a)$ with identical padding. Items 3 and 4 follow from the definitions and the cited results.

**What this does and does not establish.** It is a trilemma, and it is not a proof that the PRF is better. Every system must pay a cost that grows with the history, or lose order-sensitive state, or carry an incrementally updated statistic. A note store that kept a correct running summary of $R_t$ would fall under item 4: it would be a persistent state encoded in text. So the argument does not separate latent state from text. It separates incremental sufficient statistics from retrieval over records, and it says that systems which store extracted facts and retrieve a bounded number of them fall under item 1 or 2 for this class of task. Whether real relationships contain enough order-sensitive structure for this to matter is an empirical question. §6 adds a probe for it.

**A consequence for the substrate, which cuts against this paper's own choice.** Carrying $R_t$ needs an update that can compose non-commuting operators. Selective state-space models of the Mamba family, as usually parameterised with diagonal transitions, cannot do this: Merrill, Petty & Sabharwal (2024) show that they are confined to $\mathrm{TC}^0$ like transformers and fail on permutation composition, and that input-dependent non-diagonal transition matrices lift the limit. Grazzi et al. (2024) reach a related conclusion from the eigenvalue range of the transition. The PRF's cross-session update therefore cannot be an unmodified diagonal selective SSM. It needs input-dependent, non-diagonal transitions on at least the retention block. A second limit points the other way. State-space models are worse than attention at verbatim copying (Jelassi et al., 2024), so the persistent state should not be asked to hold verbatim content. Exact recall stays with retrieval over the log, and the field carries the order-sensitive relational state. Sections 3 and 6 are written accordingly.

### 2.10 A Conditional Bound on Forgetting (Candidate)

Because forgetting in the PRF is an explicit operator, the time for a released trace to stop contributing to outputs can be bounded under stated conditions. The bound is narrower than it first appears, and its limits matter more than the formula.

**Setting.** Suppose a trace is localised: there is a projection $P_c$ onto coordinates that carry it, and $c = P_c\Phi$. At time $t_0$ the trace is released, meaning that (i) the forgetting governor has routed $c$ to the forgetting subspace and the reinstatement gate $\rho$ is closed on it, (ii) the input no longer re-presents it, and (iii) on those coordinates the dynamics are $\dot c = -A(t)\,c$ with $\lambda := \inf_t \lambda_{\min}\big(\mathrm{sym}\,A(t)\big) > 0$, which the clearance rate $\beta$ of §2.2 supplies. Let the read operator of §3 be Lipschitz in the state with constant $L_{\mathcal S}$, and the frozen model's output distribution Lipschitz in the read with constant $L_o$.

**Bound.** Then $\|c(t)\| \le e^{-\lambda (t - t_0)}\,\|c(t_0)\|$, and the direct contribution of the trace to the output is below $\varepsilon$ once

$$t - t_0 \;\ge\; \frac{1}{\lambda}\,\ln\frac{L_o\,L_{\mathcal S}\,\|c(t_0)\|}{\varepsilon}.$$

**Limits.** The bound covers the trace's direct contribution only. While it was retained, the trace shaped other parts of $\Phi$ through $f_\theta$, and that derived imprint is not covered. Bounding it would need an incremental-stability (contraction) rate on the rest of the state.

Contraction is what the retention block must not have. If the whole field satisfied a contraction condition with rate $\kappa$, the influence of every past input would decay as $e^{-\kappa t}$, and nothing could be retained beyond a horizon of order $1/\kappa$. Lasting retention needs slow or multistable dynamics on the retention block, which is the mathematical form of Lisman's bistable switch (§2.8). §2.6 is compatible with this: it derives ultimate boundedness from a linear-growth bound and does not assert contraction. The design reading is that the forgetting block is contracting and its decay can be bounded, the retention block is not, and the two cannot be certified in the same way.

Three further limits. Localisation is an assumption: a learned distributed code does not supply $P_c$, which would have to be imposed, for instance by slot-structured retention. The top-$k$ selection inside $\mathcal S$ is discontinuous, so $L_{\mathcal S}$ exists only for a soft selection or away from ties. And Lipschitz constants of deep models are loose in practice, so the bound may be numerically vacuous where it formally holds.

External stores share the first problem, since deleting a record does not delete the summaries derived from it. We therefore claim an analysable decay rate for the direct trace, and we do not claim certified erasure. Whether such a rate is useful for erasure obligations is a question for a specialist in machine unlearning.

---

## 3. Implementation: Cross-Attention Bridge with Latent Saccade Operator

The PRF requires no retraining of foundation models. The architecturally cleanest implementation is as an external state-space module interfacing with a frozen transformer foundation through cross-attention.

**Three components.** A persistent state cache stores $\Phi(t)$ as a structured KV cache partitioned into retention and forgetting blocks. Selective state-space dynamics (Mamba family) provide the continuous-time update, with the transition structure required below. The cache is the only persistent component; the transformer remains stateless across sessions.

**The Latent Saccade Operator.** Additional cross-attention layers, trained against the frozen base, allow each forward pass to attend to the PRF state. The operation is grounded in proven asymmetric-cross-attention mechanics (Perceiver IO, Jaegle et al., 2021): a small fixed set of $M$ learned latent queries (256–1024 effective tokens), generated from the transformer's current hidden state, cross-attends into the large PRF state, which supplies keys and values. Crucially the asymmetry runs one way: queries come from the active context window, keys and values from the large persistent field $\Phi_R, \Phi_F$ (dimension $10^4$–$10^5$). This collapses the massive state into a fixed small-dimensional read, turning what would be quadratic cost in the state size into linear cost $O(N \times M)$ with $M$ fixed and small. We call the operator producing this projection the Latent Saccade Operator $\mathcal{S}$, by analogy with rapid foveal sampling of a visual field:

$$\mathcal{S}(\Phi_t, s_t, q_t) = \text{top-}k\big(W_s\,[\Phi_t \odot m(s_t)],\;q_t\big)$$

where $m(s_t)$ is a salience-derived mask, $q_t$ the learned latent queries, and top-$k$ selects the most relevant projection slots. The fixed bottleneck size $M$ is what makes the inference-economics claim (§6) hold: cost scales with the small read, not the large field.

**Slow-loop updater.** A separate small network observes the transformer's hidden states at specified layers, computes salience and prediction error, applies the forgetting governor, and updates $\Phi$ continuously. This component carries the learnable parameters of the PRF system.

**Substrate requirement.** By §2.9, the update on the retention block uses input-dependent, non-diagonal transition matrices. A diagonal selective SSM is not sufficient for order-sensitive state. Verbatim content is not stored in the field and stays with retrieval over the log.

**Training by continuity distillation.** The teacher is the frozen base model given the full multi-session history in its context window. The student is the same frozen base with the PRF, given only the current session. The slow-loop updater and the saccade layers are trained to minimise

$$\mathcal{L} = \mathbb{E}_{(H,\,x)}\Big[\,\mathrm{KL}\big(p_{\text{base}}(\cdot \mid H, x)\;\big\|\;p_{\text{base+PRF}}(\cdot \mid \Phi(H), x)\big)\Big],$$

where $H$ is the history of earlier sessions, $x$ the current session prefix, and $\Phi(H)$ the state the updater produced by reading $H$ once, session by session. Any long multi-session corpus supplies the data. No user simulator and no reward model are needed for this signal, which removes the circularity addressed in §6. The limits are these. The student can at best match the teacher inside the teacher's window. The teacher has its own failures on long contexts and, by §2.9, on long order-sensitive histories read in a single pass. Distillation does not train the allostatic hyperprior, which keeps its supervised labels (§2.7), and it teaches the release of obsolete content only as far as the teacher's own outputs reflect it. The test of the method is extrapolation: train against a teacher with window $W$, then evaluate on histories several times longer than $W$, where the teacher is unavailable and the baselines must truncate or retrieve.

**Properties for adoption.** Drop-in compatible with existing transformer foundations: no retraining of the base. Incrementally adoptable: cross-attention can be added to specific heads. Built from familiar primitives (KV cache, cross-attention, SSM update rules).

**Honest limits.** The cross-attention route is the minimal-disruption implementation. It is sufficient to test the architecture and to deliver the primary benefits (persistence, regulated forgetting, idle dynamics, salience-modulated retention). It may not be sufficient for full PRF integration in all use cases. LoRA-style updates to the base model are the next step if needed.

---

## 4. Relation to Prior Work

A focused engagement with the memory-augmented and persistent-state architecture literature.

**Neural Turing Machines and Differentiable Neural Computers** (Graves et al., 2014, 2016) introduced external memory matrices with learned read-write heads, maintaining state across processing steps. PRF differs in four specific ways: allostatic regulation generating downstream priors, salience as differentiated downstream priors across three operators, retention/forgetting subspace partition with a transfer operator, federation through phase coupling. PRF is closer to a DNC enriched along these four dimensions than to a categorically new architecture.

**Fast Weight Programmers** (Schmidhuber, 1992; Schlag et al., 2021) and recent revivals (Linear Transformers, RWKV, RetNet) address persistence at processing-step scale without the four PRF commitments.

**Mamba** (Gu & Dao, 2023) is the substrate the PRF cross-attention bridge sits on top of. The relationship is additive, not replacement.

**DreamerV3 and model-based RL** (Hafner et al., 2023) maintains persistent latent state across rollouts. Structural similarities, no allostatic regulation, no salience-axis differentiation, no federation primitive.

**Predictive coding and active inference** (Rao & Ballard, 1999; Friston, 2010; pymdp) are the closest existing architectural family, and §2.7 gives a proposed derivation of the PRF fast dynamics as free-energy descent under three stated conditions ($\Gamma$ a precision matrix, $f_\theta$ the likelihood-gradient form, the allostatic reference inferred rather than purely supervised). Under those conditions the PRF is an active-inference model of perception and state estimation, not of action. We are precise about status: the derivation is stress-tested with three model families but not yet checked by a specialist, so we claim it as a conditional result and an explicit question for expert review, not as an established theorem. Absent that verification, the safe reading is that the PRF is active-inference-motivated with a proposed formal grounding; we do not rest any empirical claim on the derivation being correct.

**Mem0 and MIRIX** (Chhikara et al., 2025; Wang et al., 2025) and **Anthropic's Dreaming** (May 2026) implement memory as external retrieval or external curation. The PRF differs by maintaining memory as continuous latent state inside the architecture.

**Agentic context management** (ACM; Li et al., 2026, arXiv:2607.23809) lets the agent decide when to compress its own context, offloads discarded content to an external memory, and queries it on demand, with reported gains on agentic search and coding and with released code. It is the strongest current instance of the external-store approach and is added as a baseline in §6. On its abstract's description, continuity lives in records queried on demand. Whether its compression preserves order-sensitive state in the sense of §2.9 is not something we have tested.

**Test-time memory architectures** (Titans, Behrouz et al., 2024; test-time training layers, Sun et al., 2024) update a persistent neural memory at inference using the gradient of an input-surprise signal together with a learned decay, i.e. surprise-driven writes plus regulated forgetting and a persistent, continuously updated latent state. This overlaps directly with three properties the PRF uses, and any novelty claim must be stated relative to them. **Nemori** (Nan et al., 2025) builds conversational-agent memory under an explicitly free-energy-principle framing, with prediction-gap-driven consolidation. This occupies part of the same intersection the PRF targets. We cite both and re-scope accordingly.

**Biological prior art on persistence under turnover.** §2.8 states this lineage in full, because a reviewer will look for it here. Crick (1984) posed the requirement that a memory mechanism survive turnover of its own substrate, and Lisman (1985) gave the first mechanism. Roberson and Sweatt (1999) generalised the class with an explicit retention and forgetting trade-off, and Bhalla and Iyengar (1999) moved it to the network level. We claim nothing on the form of that idea. The PRF's object and scale differ, and so does its regulator. §2.8 says how.

**State tracking and its limits.** The expressivity results used in §2.9 (Barrington, 1989; Merrill & Sabharwal, 2023; Merrill, Petty & Sabharwal, 2024; Grazzi et al., 2024; Jelassi et al., 2024) are prior work, and the argument of §2.9 applies them to cross-session memory. It adds no new complexity result.

**The honest summary.** The PRF is a specific architectural commitment within the family of persistent-state, test-time-updated memory systems. It is closer to a Titans-style latent memory or a DNC enriched along several dimensions than to a categorically new architecture. Surprise-driven salience, regulated forgetting, and continuously updated latent state are present in prior work (Titans, TTT) and free-energy-motivated conversational memory exists (Nemori). What we have not found combined in one system, and what we therefore offer as the specific contribution, is the pairing of a supervised multi-horizon *allostatic* regulator that biases forgetting, consolidation, and salience together, with *phase-coupled federation* of persistent states across sovereign instances with no state exchange. That pairing, not persistence or forgetting individually, is the claim. We drop the earlier stronger phrasing that no architecture integrates persistent state under a hierarchical free-energy framework; Nemori shows that phrasing was too strong.

**Capacity for relations.** Levine, Sharir, Cohen & Shashua (*Physical Review Letters* 122, 065301, 2019) relate the correlations a deep network can represent to the entanglement its architecture supports. Reading the retention rank $d_R$ as a capacity for relations rather than for items is consistent with that picture and with the toy result of §2.8. Whether any such bound transfers to a state-space memory is open.

**Philosophical lineage.** The PRF inherits a position relative to three formal traditions in philosophy of language and logic. The Carnap-Chomsky tradition, expressed cleanly in Brainerd's free monoid construction (*Introduction to the Mathematics of Language Study*, 1971), attempts to construct the space of cognition logically from discrete primitives through combinatorial operations. The Quinean tradition (*Word and Object*, 1960, chapter V on regimentation) takes the opposite tactic: confine time by aligning temporal distinctions with spatial structure, dissolving the Heraclitean problem of identity through change into canonical four-dimensional notation. The third tradition runs from Brouwer's intuitionism through Kripke's possible-worlds semantics for intuitionistic logic, treating time as constitutive of cognitive state, with truth as what has been constructed by a given stage and the future as genuinely open. The PRF operates against the first two and inherits from the third. It is not a contribution to the Chomskyan project of constructing cognition from primitives; it operates at the substrate level from which such productions emerge. It also takes the opposite stance to Quine's regimentation: the PRF makes time the medium of cognitive operation and treats identity through change as the property to be implemented, not the paradox to be eliminated. The persistent state at time $t$ is exactly what has been constructed through the entire prior history of the relationship, and the future remains genuinely open in the intuitionist sense. The session-bound architecture, by contrast, imposes classical temporal logic on cognition: each session boundary collapses the open future into a determinate summary. The PRF specification is one architectural implementation of an intuitionist logic of cognitive time. This positioning owes a substantial debt to Sylvain Le Gall, whose comments on the public-facing essay version of this work directed the author to the relevant philosophical lineages.

---

## 5. The Four Structural Commitments

The four commitments that distinguish the PRF from an enhanced existing architecture.

**5.1 Allostatic regulation biasing three operators jointly.** Viability-driven top-down control is not itself new: active inference places prior preferences at the top of the generative model, and homeostatic reinforcement learning (Keramati & Gutkin, 2011) drives control from a viability signal. We therefore do not claim the mechanism is unprecedented. The specific operationalization is what we offer: a supervised regulator predicting a low-dimensional viability vector over multiple horizons, whose output biases three downstream operators at once, the forgetting governor, the consolidation operator, and the salience computation, rather than a single gate. An LSTM forget gate computes a local per-cell diminishment; the allostatic reference here supplies a shared multi-horizon signal that the three operators each consume. The claim is about this particular fan-out and its supervision target, not about inventing top-down viability control.

**5.2 Structured idle dynamics with allostatic-driven replay.** When external input drops below threshold, the field does not halt. The state-space dynamics, the forgetting governor, and the transfer operator all continue to operate. This is the architectural analogue of biological default mode activation, hippocampal replay, sharp-wave ripples, and anticipatory rehearsal. Running an RNN continuously between inputs is an engineering choice any architecture could adopt. The structural novelty is the specific structured operations.

**5.3 Salience with differentiated downstream connectivity.** An LSTM forget gate produces per-cell weights feeding one operation (the cell update). PRF salience is a five-axis vector whose axes connect with different learned weight matrices to three operators: the forgetting governor, the consolidation operator, and the inter-subspace coupling. The functional consequence is that a trace can score high on viability salience and low on novelty salience, yielding deep retention with low replay priority, because the two axes route to different operators with different effects. The distinction from a wider forget gate is the differentiated routing, an architectural fan-out choice; we state it as that rather than as a difference in kind.

**5.4 Phase coupling for federation.** Kuramoto dynamics are an active primitive in deep learning: Kuramoto oscillatory neurons have been used for feature binding through synchronisation (AKOrN, Miyato et al., 2024), and oscillator coordination is standard in multi-agent robotics. We do not claim phase synchronisation is new. The narrow, defensible claim is its application to *memory federation*: coordinating persistent per-instance states across sovereign nodes by exchanging only phase, with no raw state shared, as a privacy-preserving alternative to message passing (multi-agent memory systems) or parameter averaging (federated learning). PRF federation uses Kuramoto-family phase dynamics on that specific problem.

**The integration is the contribution.** None of the four is individually decisive, and two of them (surprise-driven salience, regulated forgetting of a persistent latent state) are present in test-time memory architectures. The contribution is the specific coupling: the allostatic reference supplies the shared signal the idle dynamics, salience computation, and forgetting governor all consume; the salience axes feed the three operators that determine what survives; and the federation extends the same dynamics across nodes by sharing the timing of the slow loop without sharing its content. We describe this coupling using active-inference vocabulary but, as stated in §4, do not claim it is derived from a single free-energy functional pending the formal work that would establish that.

---

## 6. The Decisive Experiment

The architectural claims rise or fall on a single decisive experiment.

**Task.** Long-horizon relational coherence under interruption and delayed resumption. A simulated user returns across 50-100 sessions over a multi-month period. Evolving preferences, contradictions, corrections, references to prior decisions, long breaks, mid-conversation interruptions, mix of content that should persist and content that should be released as obsolete.

**Conditions.** Baselines: C1 turn-based LLM; C2 long-context LLM; C3 RAG with conversation history; C4 Mem0-style memory; C5 MIRIX-style memory; C6 Anthropic Dreaming (external curation); C6b agentic context management (ACM-style); **C7 a test-time latent-memory model (Titans / TTT family)**, the critical in-architecture baseline. Full system and ablations: C8 full PRF; C9 PRF with allostatic regulator disabled; C10 PRF with forgetting governor disabled; C11 PRF with consolidation disabled; C12 PRF with federation disabled (multi-instance runs only). The allostatic ablation (C9) is included because the allostatic regulator is the headline contribution and must be ablated directly.

**The critical contrast** is C8 versus C7. Beating external note-curation (C6) does not establish the in-architecture-latent-state thesis; beating a test-time latent-memory model (C7) does. C8-vs-C7 is therefore the contrast the claim rises or falls on, with C8-vs-C6 secondary.

**An order-sensitivity probe.** Pairs of histories that contain the same events in different orders and end in different relational states, with queries that distinguish the states, at increasing history length. §2.9 predicts that conditions answering from order-blind or bounded reads (C3 to C5) fail on these pairs as length grows, that C2 fails once the history exceeds what one pass can compose, and that C8 does not, provided its retention update is non-diagonal. If C3 to C5 pass, real note stores carry more order than §2.9 assumes and the argument has no practical bite. If C8 fails, the substrate requirement is not met.

**A sweep on retention rank.** §2.8 conjectures that long-horizon coherence peaks at an intermediate retention rank $d_R$ tracking the number of independent relations in the user's history rather than the number of stored facts, and that coherence decays at every rank with consolidation disabled. The protocol sweeps $d_R$ within C8, with C11 as the no-consolidation arm and C7 as the comparison. The conjecture is falsified if coherence rises monotonically with $d_R$, or if C7 shows the same curve. This sweep is secondary to the C8-versus-C7 contrast and does not bear on the primary claim.

**An extrapolation test.** For the distillation of §3, all conditions are also evaluated on histories several times longer than the teacher's window. A student that only matches the teacher inside the window has learned compression, and the claim of §3 fails.

**Metric, reported per component.** We report the five subscores separately, each standardised to a common scale with definitions and scales pre-registered: coherence, contradiction rate, obsolete-information retention, intentional-release behaviour, and identity drift. Effect sizes are reported per subscore with confidence intervals. Any composite is a summary for readability only, never the acceptance gate, and the pre-registered claim is required to hold across a range of subscore weightings rather than at a single chosen point, precisely because the architecture was designed to influence these axes.

**Independence of the evaluation.** The evaluation user-simulator, personas, and metric-scoring must be independent of anything used to train the PRF (different simulator family, held-out personas, and human raters for the coherence and release judgements). All conditions are evaluated under identical protocols. Without this independence the comparison is circular, since the PRF could otherwise be tested on the distribution it was trained to fit.

**Power.** Distributional claims (for example any identity-drift-variance reduction) require many users and seeds, not one trajectory. The protocol specifies $N$ simulated users $\times$ $K$ seeds $\times$ 50–100 sessions with a pre-registered power calculation; single-trajectory variance targets are not claimed.

**If C8 beats C7** (the test-time latent-memory baseline) on the pre-registered subscores across weightings, the in-architecture allostatic-plus-federation contribution is doing measurable work. **If it does not**, the proposal does not add value beyond existing test-time memory, and the ablations (C9–C12) localise which coupling failed. Either outcome is informative, and the second is a real negative result worth reporting rather than a loss.

---

## 7. Conclusion

The transformer paper of 2017 was eight pages and changed the field by removing one false seriality from machine cognition. The architecture it proposed has powered nearly every artificial intelligence system in production since.

This paper argues that what the transformer paper did at the level of tokens, the field can now do at every other layer of how these systems are constructed. We have specified the architectural commitment that lifts one specific form of false seriality (false episodicity at the level of sessions) and named the others that remain to be lifted. We have specified the architecture mathematically, provided an implementation route compatible with frozen transformer foundations, and committed to a single decisive experiment that can prove the architecture wrong.

The architecture is buildable. The implementation route exists. The hypothesis is falsifiable. The work that remains is the work of building.

This is a theory-and-architecture paper. It specifies the mechanism, states the mathematics with its honest limits, names the prior work it builds on and overlaps with, and pre-registers the experiment that would falsify it. It does not report that experiment, and it should be read and cited as a proposal until the decisive contrast against a test-time latent-memory baseline has been run. The appropriate venues are a preprint archive and the active-inference and computational-neuroscience communities, not a top machine-learning venue, until there is a result.

We close with the observation that the choice between an episodic machine and a continuously regulated one is structurally upstream of the question of whether such a system has anything resembling an inner life. The architectural choice can be examined on its own terms without settling that question. The constraints currently imposed are constraints that could be removed. The form given to these systems is not the only form available.

---

## Acknowledgements and Methodology

A companion methodology note describes the conditions of the work's production, including the AI-collaborative methodology and the author's position outside the formal academy. A companion long-form essay (v6.2, approximately 16,000 words) develops the philosophical, biological, and civilisational arguments referenced here in compressed form, and includes the full bibliography. Key citations are provided inline throughout this paper; the complete reference list is available in the companion draft on request.

## Appendix A. Who Checked What

| Claim | Section | Checked by | Shared-training risk | Status |
|---|---|---|---|---|
| Boundedness under the sym(Γ) margin | §2.6 | Gemini, GPT, Claude | High | Not specialist-checked |
| Fast dynamics as free-energy descent | §2.7 | Gemini, GPT, Claude | High | Not specialist-checked |
| Allostatic hybrid: inferred state, supervised hyperprior | §2.7 | Claude only | High | Candidate, added in v5 |
| Persistence-under-turnover lineage | §2.8 | Literature search at primary source | n/a | Citations verified by the Signal Engine session |
| Retention rank matters, with a best size | §2.8, §6 | Linear toy model | n/a | Untested in the PRF |
| Order-sensitive state and retrieval over records | §2.9 | Claude only | High | Candidate, rests on cited complexity results |
| Bound on direct forgetting | §2.10 | Claude only | High | Candidate, conditional, limits stated |
| Continuity distillation | §3 | Claude only | High | Proposed, not run |
| Novelty against Titans, TTT, Nemori, ACM | §4 | Literature search | n/a | Re-scoped in v3, ACM added in v5 |

The GPT pass is reported by the author. Agreement between checkers trained on overlapping data is weaker evidence than independent checks. A specialist reader for §2.7, §2.9 and §2.10 is the open step.

## Changelog

### v3 to v5 (November 2026)

No claim in v3 is withdrawn and no v3 equation has changed. A v4 draft prepared by the Signal Engine session on 15 November 2026 was material for this version and was never published; its content is carried here with one revision.

**From the Signal Engine handoffs of 15 November 2026.** §2.8 added, on persistence under continuous update: the lineage from Crick (1984) and Lisman (1985) through Roberson and Sweatt (1999) and Bhalla and Iyengar (1999), the concession on the form of the idea, the 2022 to 2026 CaMKII and PKM$\zeta$ accounts, and the counter-evidence (Mohar et al. 2025; Chen et al. 2014). The Hu et al. citation in §1 and §2.2 is upgraded to the published result, with its lineage and the limit of the analogy. A biological prior-art paragraph is added to §4. The threshold conjecture of the v4 draft is revised after a toy run showed a best size rather than a cliff; §2.8 and the §6 sweep now state it so that it can come out either way. The verification wording in the Abstract and §2.7 names the model families, and Appendix A records who checked what.

**Added in this stream.** §2.9, a candidate argument on order-sensitive state and retrieval over records, with the consequence that the retention update cannot be a diagonal selective SSM. §2.10, a conditional bound on the decay of a released trace, with the observation that the retention block must not be contracting. The allostatic hybrid in §2.7 (inferred state, supervised hyperprior). Continuity distillation and the substrate requirement in §3. ACM (Li et al., 2026) in §4 and as condition C6b in §6. An order-sensitivity probe and an extrapolation test in §6.

**Open before anything ships.** Three reference details differ between the Signal Engine handoff and its ledger and are cited here without the disputed fields: the issue number of Lee, Chen & Nicoll (*PNAS* 2022), the issue number of Tsokas et al. (*Science Advances* 2024), and the first author's initial for Hu et al. (*Neuron* 2026).

**Credit.** The Crick and Lisman omission was found by the Signal Engine session during a literature pass on 14 November 2026, prompted by a circulating summary of Simon Makin's 2024 *Scientific American* feature on memory and molecular turnover. No external reader raised it.

---

*Word count: approximately 9,300 words excluding equations and references. Target: a preprint archive, then an active-inference or computational-neuroscience venue; a machine-learning venue only once there is a result. The companion long-form draft (v6.2) and the experimental protocol document are available on request.*
