# Stress tests and checks of *Beyond Solipsistic Robotics*

The way this paper is checked, by people and by AI, is part of the research. This folder is the record: every check we have a record of, who or what made it, how, what it found and what it missed. It is extended at every revision. The same record is printed as Appendix B of the paper.

A check counts only if the checker read the primary source or ran the computation. The "how" line says which.

Records before June 2026 are partial. Private correspondence is not published here; a reviewer's findings are summarised only where they are already acknowledged in the paper.

## Files

- `2026-11-15_BSR_v7.6_stress_test.md`: five tests run in code on Section 4. Main result: with a fixed tolerance, the safety filter keeps the work with the robot and the person's capacity falls.
- `bsr_stress_test.py`: the script that reproduces every number in that note. Run `python3 bsr_stress_test.py` (needs numpy).
- `2026-11-15_backtest_AI_audit_vs_specialist_review.md`: how many of the specialist's five maths corrections an earlier AI audit had flagged. Answer: none.

## Log

| Date | Version | Checker | How | Found | Missed or still open |
|---|---|---|---|---|---|
| May 2026 | V6.3 | AI audit of the whole paper | Reading, no sources opened | 22 items, 9 real inconsistencies, fixed | All five errors later found in the Section 4 maths |
| 30 May 2026 | V6.5 | Thijs van de Laar, specialist | Reading | 20+ points, five in the maths; recommended splitting the paper | Did not raise the missing prior art |
| June 2026 | V7.1 | Vincent Bezard's verifier | Deterministic re-run on the frozen export | Statistics had drifted from the live tool; verdicts unchanged; fixed | |
| 2026 | V7.2 | AI-assisted maths pre-review (Appendix A) | Reasoning, article not opened | Worked diagnoses of the five points, two more added | Two wrong equation references |
| 2026 | V7.2 to V7.3 | Two adversarial AI reviews | Reading, literature search | Three missing prior works, overclaims, the Proposition 1 question | |
| Nov 2026 | V7.3 | Charles Martin Jones Jr, reader (issue #1) | Reading | Withdrawal trigger stated inconsistently; fixed in V7.4; proposed Scenario 4 | |
| Nov 2026 | V7.4 | Vincent Bezard, SPINE | Simulation | First Scenario 4 results (see `BSR_Scenario4_first_results.md`) | |
| 15 Nov 2026 | V7.5 | AI correction of Eq. 1 | Numerical identity check, 2,000 cases | Identity holds | Attribution to Da Costa et al. was wrong; the check could not see it |
| 15 Nov 2026 | V7.6 | AI citation check | Da Costa et al. 2020 and Wolbrecht et al. 2008 read at the source | Four errors of attribution and scope; fixed | Other references not re-read |
| 15 Nov 2026 | V7.6 | AI stress test of Section 4 | Five toy models in code | Fixed tolerance produces dependence; horizon empties the safe set; second stage never chooses; sensor blindness passes the epistemic test | Not reviewed by a specialist |
| 15 Nov 2026 | V7.7, V7.8 | Reading of five suggested sources | Four read in full text | Three of four accompanying summaries overstated their source; two papers cited | One paper read only through its press release |

## What no check has done yet

No specialist has signed off any equation of Section 4. No experiment in CAMA or SPINE has tested the architecture beyond the first Scenario 4 run. The capacity assumption (N3) has not been measured on data.
