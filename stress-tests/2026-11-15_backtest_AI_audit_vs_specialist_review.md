# Backtest: the AI audit before Thijs van de Laar's review caught none of his five maths corrections

*15 November 2026. Built from our own record, in answer to a question from the monthly literature cross-reading (Signal Engine). One paper and five items, so this is a case, not a statistic.*

## The test

Before V6.5 went to Thijs van de Laar, an AI audit of the paper was run ("V6.3 Stress Test", May 2026, 22 items). Thijs then reviewed V6.5 (30 May 2026) and made five corrections to the mathematics of Section 4. The three equations concerned were identical in the audited version and the reviewed version. Question: how many of his five had the AI audit already flagged?

| Thijs's correction | Flagged by the AI audit beforehand? |
|---|---|
| Eq. 1: the Expected Free Energy decomposition is not a standard form | No |
| Eq. 4: probability not defined, I_t not defined, a sequence tested against a set of single values | No |
| Eq. 6: a distribution conditioned on a set, which is not defined | No |
| Section 4.3.1: "non-equivalence" framed against an equivalence nobody expected | No. The audit named this section as the most important to have verified, without saying what was wrong |
| Eq. 7: "information gain saturation" does not match what the term means in the field | No |

**Result: 0 of 5.** The audit's own summary read "none are fatal" and said the paper "could ship after these fixes". It did recommend sending the maths sections to an expert. It knew where it could not see. It did not know what was wrong there.

## What the AI passes did catch

- **Internal consistency.** The audit's nine FIX items were all real: prompt counts, a table caption, section numbering, a claim in the abstract that went beyond the data.
- **Numbers.** Vincent Bezard's instrument caught drift between the manuscript and the live tool (panel of 14 effective judges, not 18; six models with a negative slope, not ten).
- **Prior art and overclaims.** Two later adversarial AI reviews found the three missing prior works (Du et al. 2020, Alshiekh et al. 2018, Hadfield-Menell et al. 2016), several overclaims, and the question of whether Proposition 1 is trivial. Thijs had not raised the missing prior art.

## What happened after a specialist pointed at the errors

- **The AI-assisted pre-review of the maths (V7.2, Appendix A)** turned Thijs's five points into worked diagnoses and added two of its own (Eq. 2, the "viability subspace"). Those two are still unconfirmed by any specialist.
- **The same pre-review cited the wrong equations** in Da Costa et al. 2020 (16 for 14, and Eq. 13 mis-transcribed). Nobody had opened the article.
- **V7.5 (this session) repeated the misattribution** in the body of the paper. Its numerical check passed, because that check tests whether two formulas agree with each other, not whether they are the ones the cited article prints.
- **A third AI session caught it** in one evening by reading the article in three renderings.

## What this says

The AI checks missed one class completely: whether mathematics that AI had written was well formed (undefined symbols, type errors, non-standard forms). They were reliable on a different class: arithmetic, internal consistency, prior art, overclaims.

Citations sit in between. An AI check that opens the source catches errors. An AI check that reasons from memory repeats them, and a second AI agreeing with the first adds nothing. This supports the Signal Engine conjecture that agreement between AI checkers is weaker evidence than it looks, with one refinement: what made the third check work was the source in front of it, not a different model.

## The table below became Appendix B of the paper in V7.9

| Claim | Section | Checked by | How | Status |
|---|---|---|---|---|
| Eq. 1 form and labels | 4.1 | Thijs van de Laar (found); AI (corrected, V7.5); AI (attribution, V7.6) | Review; numerical identity check; article read in three renderings | Awaiting specialist sign-off |
| Eq. 2 domains | 4.2 | AI pre-review only | Reasoning, no source | Unconfirmed |
| Viability function vs set | 4.2 | AI pre-review only | Reasoning | Unconfirmed |
| Eq. 4 chance constraint | 4.3 | Thijs van de Laar (found); AI (proposed fix) | Review | Open |
| Eq. 6 soft formulation | 4.3.1 | Thijs van de Laar (found); AI (proposed fix) | Review | Open |
| Proposition 1 | 4.3.1 | Thijs van de Laar (framing); AI (triviality question) | Review | Open |
| Eq. 7 saturation | 4.4 | Thijs van de Laar (found); AI (proposed fix) | Review | Open |
| Section 4.0, (N3), tie-break point | 4.0 | AI only | Simulation in code | Unreviewed |
| Withdrawal joint condition consistency | 4.5, 5.1, 5.2.3 | Charles Martin Jones Jr (found) | Reading | Fixed in V7.4 |
| Probe statistics | 5.4 | Vincent Bezard's verifier | Deterministic re-run on frozen export | Reproducible |
| Citations to Da Costa 2020, Wolbrecht 2008 | 4.0, 4.1 | AI, with the articles open | Source read | Verified V7.6 |

## Rule proposed for all future checks

A check counts only if the checker opened the primary source or ran the computation, and the record says which. Mathematics written with AI is not checked until a specialist has read it.
