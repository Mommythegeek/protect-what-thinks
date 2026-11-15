# PRF paper: process log, v3 to v6

**What this file is.** A dated record of how *Beyond Turn-Based AI* (the Persistent Relational Field paper) went from v3 to v6 on 15 November 2026: what came in, what was decided, what was changed, what was found wrong, and what is still open. It is written so that a reader who was not there can check each step.

**Who did what.** Carla de Préval directs the work and takes the decisions recorded below. The PRF paper stream (an AI session, Claude) is the only writer of the PRF paper. The Signal Engine session (another AI session) verifies and reports, and does not write the paper. The Mother World Model stream (a third AI session) is the only writer of *Beyond Solipsistic Robotics*. No human specialist took part in any step logged here.

All times are Paris time, 15 November 2026.

---

## 1. Starting point

- Published version: v3, in Drive (`PRF_Short_Technical_Paper_v3.md`, `.pdf`) and in the repo as `Beyond_Turn-Based_AI_PRF_v3.pdf`.
- 10 November: Carla asked how the paper could be pushed further. The PRF stream proposed five additions (an order-sensitivity argument, continuity distillation, a forgetting bound, a fix for the allostatic regulator, ACM in related work). No go was given, and nothing was written.

## 2. Ownership rule (22:46)

Carla decided: one writer per file. PRF content is decided and written in the PRF stream. BSR is led by the Mother World Model stream. Other sessions pass findings as dated `HANDOFF_` files in Drive. The reason was a collision on 12 November, when two sessions rewrote the same artifact within five minutes of each other.

## 3. What came in (handoffs read at 22:58)

1. `HANDOFF_2026-11-15_PRF Crick and Lisman prior art, the Hu et al. upgrade, and a threshold-order conjecture` (Signal Engine). Four findings: the paper did not cite the persistence-under-turnover literature that starts with Crick (1984) and Lisman (1985); the Hu et al. citation was weaker than the published paper; a new conjecture from Hsieh et al. (2026) that survival under turnover needs a minimum structural order; the counter-evidence (Mohar et al. 2025; Chen et al. 2014).
2. `PRF_Short_Technical_Paper_v4_DRAFT_SignalEngine.md` (Signal Engine). A draft with those findings inserted into the v3 text. Stated by its authors to be material, not a version.
3. `HANDOFF_2026-11-15_PRF Toy test revises the threshold conjecture, plus a verification table` (Signal Engine, monthly run). Three additions: a toy run showing a best memory size under interference and no cliff; a suggested sentence on Levine et al. (2019); a suggested wording for who verified what, with a table. It also listed three reference details that differ between the first handoff and the Signal Engine's own ledger.

## 4. Building v5 (23:00 to 23:09)

**Method.** The v4 draft in Drive had passed through a Google Doc conversion that damaged the equations and removed the bold type. v5 was therefore built from the clean local v3 source by a script (`build_v5.py`) that applies each insert at a named anchor and stops if an anchor is missing or duplicated. The new paragraphs of the v4 draft were copied in; the rest of v3 was left byte-identical.

**Taken from the Signal Engine, as written:** §2.8 lineage and counter-evidence; the Hu et al. paragraphs in §2.2 and the clause in §1; the biological prior-art paragraph in §4.

**Taken with a change:**
- The threshold conjecture. The second handoff's toy run contradicted the first handoff's prediction, so §2.8 and the §6 sweep state a conjecture that can come out either way (a best retention rank tracking the number of independent relations).
- The verification wording. The handoff suggested "stress-tested with three model families (Gemini, GPT, Claude)". The PRF stream holds the Gemini and Claude passes and has no record of a GPT pass on §2.7, so the paper says the GPT pass is reported by the author.
- The Levine et al. sentence. The handoff described the result in terms of bond dimension. The arXiv abstract was read and does not use that term, so the sentence in §4 is worded more loosely.

**Added by the PRF stream (the five proposals of 10 November), all marked candidate:**
- §2.9, order-sensitive state and retrieval over records.
- §2.10, a conditional bound on the decay of a released trace.
- §2.7, the allostatic regulator as an inferred state with a supervised hyperprior.
- §3, training by distillation from a full-history teacher.
- §4 and §6, ACM (Li et al., 2026) as prior work and as baseline C6b.

**Two claims of 10 November that did not survive being written down, and were not put in the paper:**
- "A provable separation between a log and a persistent state." Written out, the argument is a trilemma. A complete ordered log does determine the state, at a cost that grows with the history, and a note store that kept a correct running summary would itself be a persistent state. §2.9 says so.
- "Certified forgetting that no external store can match." The bound covers only the direct contribution of a trace. The imprint it left elsewhere is not covered, and external stores have the same problem. §2.10 claims an analysable decay rate and does not claim certified erasure.

**A result that cuts against the paper's own substrate, and was put in.** Carrying order-sensitive state needs non-commuting updates. Merrill, Petty & Sabharwal (2024) show that Mamba-style state-space models with diagonal transitions cannot do this. §2.9 and §3 now require non-diagonal transitions on the retention block.

**Delivered.** `PRF_Short_Technical_Paper_v5.md` and `.pdf` (22 pages) to Drive at 23:09. A branch `prf-v5` and pull request #2 on `Mommythegeek/protect-what-thinks`. The pull request was left unmerged, because the repo is public and the new mathematics had had no second check.

## 5. Stress test of v5 (23:10)

Run by the PRF stream on its own version, as a hostile reviewer. Findings as reported to Carla:

1. **Serious.** §2.4 says that with no input the state relaxes toward the allostatic reference. With the margin of §2.6 and the identification of §2.7, that relaxation has a single attractor, so everything not encoded in the small reference decays exponentially during a long silence. The paper's equations implied the opposite of its purpose. The cause was found while writing §2.10: a contracting system has fading memory, so the retention block must not be contracting.
2. The substrate claim contradicted itself: §2.9 requires non-diagonal transitions, and §3 still described the substrate as familiar primitives without costing the change.
3. The paper is no longer short (about 9,300 words in v5).
4. §2.9 is modest: two elementary items and borrowed complexity results. Real note stores may keep more order than it assumes.
5. Four citations had been added from memory and needed a source check. Three reference details from the handoff were unreconciled.
6. There is still no experiment.

## 6. Decision (23:13)

Carla: merge, flag, then repair and change, and log the entire process. In the same message: check every cited source that can be found.

## 7. Flag and merge (after 23:13)

- A "known inconsistency" paragraph naming findings 1 and 2 was added to the v5 entry of `CHANGELOG.md` and committed to the branch.
- The first merge attempt was refused. `main` had moved: the Mother World Model stream had published BSR v7.7 and v7.8 in the meantime. `main` was merged into the branch with no conflict and no BSR file altered.
- Pull request #2 was merged. v5 is on `main` with its flag.

## 8. Citation check (after the merge)

Method: one web search per citation, and a page fetch where the search did not settle it. What was checked is that the paper exists with the stated authors, venue and year. Whether each paper supports the sentence that cites it was checked only for the papers the Signal Engine session read in full.

| Citation | Result |
|---|---|
| Katsumi, Theriault, Quigley & Barrett, *Network Neuroscience* 6(4):1010-1031, 2022 | **Corrected.** The paper cited it as "Theriault, Quigley, Barrett & Katsumi" with no year. |
| Netea, trained immunity, *Cell Host & Microbe* | **Corrected.** The *Cell Host & Microbe* paper is Netea, Quintin & van der Meer, 2011. The 2020 review is in *Nature Reviews Immunology*. The paper said "*Cell Host & Microbe* 2020". |
| Tsokas et al., *Science Advances* 2024, eadl0030 | Confirmed. Issue is 10(26), 26 June 2024. The ledger was right, the first handoff's 10(8) was wrong. The paper cites no issue number. |
| Hu et al., *Neuron* 2026 | Confirmed as a *Neuron* paper from Yi Zhong's group, title "Identification of an engram ensemble mediating memory forgetting in the dentate gyrus". First author's initial not confirmed. The paper cites "Hu et al." only. |
| Hsieh et al., 2026 | Confirmed as a bioRxiv preprint of January 2026, "PKMζ-KIBRA interactions, molecular turnover, and memory". The *Molecular Brain* record was not reached. Both are now cited. |
| Lee, Chen & Nicoll, *PNAS* 2022, e2211572119 | Paper found. Issue number not reached (the page was blocked). The paper cites no issue number. |
| Levine, Sharir, Cohen & Shashua, *PRL* 122, 065301, 2019 | Confirmed. |
| Merrill, Petty & Sabharwal, "The Illusion of State in State-Space Models", 2024 | Confirmed, abstract read. |
| Merrill & Sabharwal, "The Parallelism Tradeoff", *TACL* 2023 | Confirmed. |
| Grazzi et al., "Unlocking State-Tracking in Linear RNNs Through Negative Eigenvalues", arXiv 2024, ICLR 2025 | Confirmed. |
| Jelassi et al., "Repeat After Me", ICML 2024 | Confirmed. |
| Barrington, 1989, *JCSS* | Confirmed. |
| Amit, Gutfreund & Sompolinsky, *PRL* 55:1530, 1985 | Confirmed. |
| Keramati & Gutkin, NIPS 2011 | Confirmed. |
| Behrouz et al., Titans, arXiv 2501.00663 | Confirmed. |
| Miyato et al., AKOrN, arXiv 2410.13821, ICLR 2025 | Confirmed. |
| Nan et al., Nemori, arXiv 2508.03341 | Confirmed. |
| Li et al., ACM, arXiv 2607.23809 | Confirmed, abstract read. |
| Mohar et al., *Nature Neuroscience* 2025 | Confirmed. Page numbers not checked. |
| Brainerd, *Introduction to the Mathematics of Language Study*, 1971 | Confirmed. |
| Anthropic Dreaming, 6 May 2026 | Confirmed. |
| Crick 1984; Lisman 1985; Roberson & Sweatt 1999; Bhalla & Iyengar 1999; Shuai et al. 2010; Berry et al. 2012; Akers et al. 2014; Chen et al. 2014 | Not re-checked here. The Signal Engine handoff states each was verified at the journal page or in full text. |
| Graves et al.; Gu & Dao; Hafner et al.; Schmidhuber; Schlag et al.; Rao & Ballard; Friston; Jaegle et al.; Sun et al.; Chhikara et al.; Wang et al.; Quine; Thinking Machines (May 2026) | Not checked. |
| Hopfield 1982, 1984; Krotov & Hopfield 2016; Ramsauer et al. 2020 (added in v6, §2.11) | Not checked. Added from memory. |

## 9. Repair: v6 (after the citation check)

**The choice.** The single attractor comes from the Gaussian prior on the state. Three repairs were considered:
- Put the memory in slow weights updated at test time. Rejected: that is the Titans design, and it gives up the paper's claim that the state itself is the memory.
- Give the retention block near-zero damping. Rejected: it breaks the margin of §2.6 and leaves retention unprotected against noise.
- Give the retention block a multi-well prior, one bistable unit per coordinate. Chosen: it keeps the state as the memory, it is Lisman's bistable switch in mathematical form, and the forgetting governor gets a precise meaning (it lowers a barrier).

**What §2.11 states.** The energy and the new retention dynamics; the condition for a well to survive the allostatic pull (tilt below 0.385 of the barrier coefficient); a retention time from Kramers' formula, exponential in barrier over noise; a boundedness argument that needs no margin on retained coordinates; what the repair costs.

**What the repair costs, as stated in the paper.** The v3 result that one assumption secures both the active-inference reading and the stability bound now holds on the forgetting block only. Capacity with independent wells is of order one binary choice per coordinate. Strongly retained traces are hard to revise. Graded content needs another well shape. Kramers' formula is a guide once couplings are present.

**Numerical check** (`prf_gap_toy.py`, numpy, run the same evening).
- Escape time, barrier coefficient 1: simulated 60, 111 and 300 time units at noise 0.10, 0.08 and 0.06; formula 54, 101 and 287.
- Gap test, 64 retained signs, same noise: with the v5 linear pull, 62% correct after 5 time units and chance after 20. With the v6 double well, 100% correct after 400.
- Limit: the toy has no learned drive. That drive is the term that could make the repair unnecessary, and §6 now has a gap test for it.

**Other changes in v6.** §2.4 states the inconsistency and points to §2.11. §2.7 restricts the convergence claim. §3 confines non-diagonal transitions to the retention block, withdraws "familiar primitives" for the state update, and says the cost comparison of the companion draft has to be redone. §6 gains the gap test. The two citation corrections of section 8 are applied. Appendix A and the Changelog are updated.

**Method.** A second script (`build_v6.py`) applies the changes to the v5 file at named anchors, as for v5.

## 10. Where things are

- Drive, My Drive root: `PRF_Short_Technical_Paper_v5.md`, `.pdf`; `PRF_Short_Technical_Paper_v6.md`, `.pdf`; this log; `prf_gap_toy.py`. v3 and the Signal Engine's v4 draft are untouched.
- Repo `Mommythegeek/protect-what-thinks`: v6 PDF and source at the root, v3 and v5 in `archive/`, this log, the toy script, and the changelog entries.

## 11. Open

1. No human specialist has read §2.7, §2.9, §2.10 or §2.11. Every formal addition of this day was written and checked by AI sessions only, and agreement between models trained on overlapping data is weak evidence.
2. The decisive experiment has not been run. The only measured numbers are two toy runs (the Signal Engine's rank toy and the gap toy).
3. The paper is about 11,000 words. A short version for a preprint archive, with §2.9 to §2.11 moved to a companion note, has not been cut.
4. The couplings between retention coordinates, and with them the capacity for distributed codes, are not specified.
5. The cost comparison in the companion long-form draft (v6.2) predates the substrate change and is now wrong as it stands.
6. Citations not checked are listed in section 8.
