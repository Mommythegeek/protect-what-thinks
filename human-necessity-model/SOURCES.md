# Sources for the Human Necessity Model

Every reference the model, the README and the companion article rely on, with a link wherever one exists. Where the publisher's page is paywalled, an open copy or a public summary is given as well. Links were checked on 20 October 2026 unless marked otherwise.

## In the article only

- Vaswani et al., "Attention Is All You Need", 2017. https://arxiv.org/abs/1706.03762

## Data the model is checked against

| Source | What we use | Link |
|---|---|---|
| Wilmers, Catipon, Massenkoff and McCrory, "How Employment is Changing at Anthropic", Anthropic, 16 Oct 2026 | Junior share of technical hires 27% → 9%; agent hours six to one; meetings up 20%; "Claude sessions amount to around 80% idly waiting for human input" | https://www.anthropic.com/research/employment-at-anthropic |
| Brynjolfsson, Chandar and Chen, "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence", Stanford Digital Economy Lab, 2025 | Young workers in AI-exposed occupations | https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/ |
| Stanford Digital Economy Lab, "No Widespread Displacement, but the AI Employment Gap for Young Workers Has Widened to 19%", August 2026 | 22–25-year-olds about 19% below counterfactual | https://digitaleconomy.stanford.edu/news/canariesaug26/ |
| Budzyń et al., "Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: a multicentre, observational study", The Lancet Gastroenterology & Hepatology 10(10), 896–903, 2025 | Unaided adenoma detection 28.4% → 22.4% after three months of AI use, four Polish centres; bound on the erosion coefficient δ | https://doi.org/10.1016/S2468-1253(25)00133-5 · open copy: https://wrap.warwick.ac.uk/id/eprint/191005 |
| Infocomm Media Development Authority (Singapore), Model AI Governance Framework for Agentic AI, updated 20 May 2026 | Human override rate and review time as audit measures; "a low rate may signal rubber-stamping behaviours" | https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/updated-model-ai-governance-framework-for-agentic-ai · summary: https://aideliverybrief.substack.com/p/singapore-has-a-word-for-it-rubber |
| Davenport and Srinivasan, "Companies Are Laying Off Workers Because of AI's Potential, Not Its Performance", Harvard Business Review, January 2026 | Companies "reducing headcount in anticipation of what AI might be able to do in the near future" | https://hbr.org/2026/01/companies-are-laying-off-workers-because-of-ais-potential-not-its-performance |

## Mechanisms the equations borrow

| Source | Mechanism in the model | Link |
|---|---|---|
| Hemenway Falk and Tsoukalas, "The AI Layoff Trap", arXiv:2603.20617, March 2026 | Each firm feels only its share of the spending lost when it lays people off, so rivals over-automate (ψ, rivalry dial, extra-automation tile) | https://arxiv.org/abs/2603.20617 · simulator: https://ailayoffs.rajnandan.com/ |
| Cao, "Generative Models Erode Human Temporal Learning Through Market Selection", ICML 2026 | People check only when the expected quality gap exceeds the cost of checking (inspection share P, override rate O) | https://arxiv.org/abs/2606.06572 |
| Autor and Thompson, "Expertise", NBER Working Paper 33941; Journal of the European Economic Association, 2025 | Automating inexpert vs expert tasks moves wages and employment in opposite directions (which-tasks-first dial) | https://www.nber.org/papers/w33941 |
| Acemoglu and Restrepo, "Automation and New Tasks: How Technology Displaces and Reinstates Labor", Journal of Economic Perspectives 33(2), 2019 | New tasks refill human work (ν) | https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3 (not re-checked) |
| Merton, "The Self-Fulfilling Prophecy", The Antioch Review 8(2), 1948 | Anticipation loop | https://doi.org/10.2307/4609267 (not re-checked) |
| MacKenzie, An Engine, Not a Camera: How Financial Models Shape Markets, MIT Press, 2006 | Performativity of models | https://doi.org/10.7551/mitpress/9780262134606.001.0001 (not re-checked) |
| Aghion and Tirole, "Formal and Real Authority in Organizations", Journal of Political Economy 105(1), 1997 | Formal sign-off vs decision capacity | https://doi.org/10.1086/262063 (not re-checked) |
| Bainbridge, "Ironies of Automation", Automatica 19(6), 1983 | Skill decay of the human left to monitor | https://doi.org/10.1016/0005-1098(83)90046-8 (not re-checked) |
| Elish, "Moral Crumple Zones: Cautionary Tales in Human-Robot Interaction", Engaging Science, Technology, and Society 5, 2019 | Who carries blame after a failure | https://doi.org/10.17351/ests2019.260 (not re-checked) |
| Shen and Tamkin, "How AI assistance impacts the formation of coding skills", Anthropic, January 2026 (arXiv:2601.20245) | One-hour trial, 52 mostly junior engineers: immediate quiz 50% with AI vs 67% without, not significantly faster (junior-learning dial) | https://www.anthropic.com/research/AI-assistance-coding-skills |
| Randazzo et al., Harvard Business School Working Paper 26-036, 2025 | 244 BCG consultants: centaurs, cyborgs and self-automators; self-automators built neither domain nor AI skills (junior-learning dial) | https://www.hbs.edu/ris/Publication%20Files/26-036_e7d0e59a-904c-49f1-b610-56eb2bdfe6f9.pdf |
| Workday, "Companies Are Leaving AI Gains on the Table", 14 January 2026 | 3,200 employees: nearly 40% of AI time savings lost to rework (checking is work) | https://newsroom.workday.com/2026-01-14-New-Workday-Research-Companies-Are-Leaving-AI-Gains-on-the-Table |
| Demirer, Musolff and Yang, "Writing Code vs. Shipping Code", NBER Working Paper 35275, 2026 | Autonomous agents: commits about +240%, releases about +30% (pending review-bottleneck check) | https://www.nber.org/papers/w35275 |
| Chen and Stratton, "Artificial Intelligence in the Firm: Bottlenecks in Software Production", 2026 | 718 firms: review time +49%, no significant gain in issues resolved (pending check) | coverage: https://techradar.com/pro/ai-agents-are-great-at-writing-new-code-but-then-the-human-bottleneck-slows-everything-down |
| Faros, AI Engineering Report, 2026 | 22,000 developers: incidents per pull request roughly tripled at high adoption (pending check) | https://www.faros.ai/research/ai-acceleration-whiplash |
| Acemoglu, Autor and Johnson, "Building Pro-Worker Artificial Intelligence", NBER Working Paper 34854, 2026 | Only new-task-creating technology is unambiguously pro-worker; incentives favour automation | https://www.nber.org/papers/w34854 |
| Collège de France seminar "Economic Scenarios for AI & the Future of Work" (Aghion, Hazan, with the Windfall Trust), 17 September 2026: pre-reading and synthesis | Junior hiring credit proposal (lever); the synthesis also describes a scenario, "Nobody Was Fired", not published separately | https://work-next-page.lovable.app/ (the seminar's own page) |
| Cahuc, Carcillo and Le Barbanchon, "The Effectiveness of Hiring Credits", Review of Economic Studies, 2019 | Limits of the junior hiring credit (France 2009) | https://doi.org/10.1093/restud/rdy011 |
| INSEE Première 2120, July 2026 | 18% of French firms with 10+ staff used AI in 2025; 58% of those with 250+ (France profile) | https://www.insee.fr/fr/statistiques/9025878 |
| Apec barometer, November 2025 | Entry-level manager hiring −19% in 2024 (France profile) | https://www.banquedesterritoires.fr/les-previsions-demploi-des-cadres-en-berne-affectent-les-jeunes-diplomes |
| France Compétences, 2026 budget (board vote 27 November 2025) | Nearly €1.5bn below 2025 (France profile: apprenticeship not raised above the EU) | reported by Centre Inffo |
| Brynjolfsson, Chandar and Chen, Canaries August 2026 update | 19% below counterfactual at June 2026 data, 15% at July 2025 data (two-date check) | https://digitaleconomy.stanford.edu/news/canariesaug26/ |
| Kulveit et al., "Gradual Disempowerment", arXiv:2501.16946, 2025 | Long-range scenario region | https://arxiv.org/abs/2501.16946 |

## Related open models and data (nearest neighbours)

| Source | How it relates | Link |
|---|---|---|
| Lovett, "The Tragedy of the Cognitive Commons: How AI Could Disrupt the Regeneration of Professional Expertise", Human Resource Development Review, July 2026 | Names the loop this model quantifies (the "Validation Tether": overseeing AI needs the expertise AI adoption erodes) and calls for it to be modelled. Conceptual, no equations. | https://arxiv.org/abs/2607.29380 |
| Korinek, Jones, Sacher, Cotter and McCrory, "Economic Scenarios for Transformative AI", Anthropic Institute Working Paper 2026-02, September 2026 | Macroeconomic scenarios to 2030 (GDP, wages, unemployment) with a public explorer; source of the three timing presets (v1.4). Covers what this model leaves out, and leaves out judgment and sign-off. | https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf · explorer: https://www.anthropic.com/institute/econ-scenarios |
| Epoch AI, GATE: an integrated assessment model for AI automation, 2025 | Compute → automation → growth. Candidate source for the capability curve. | https://epoch.ai/blog/announcing-gate · paper: https://arxiv.org/abs/2503.04941 · playground: https://epoch.ai/gate |
| Chopra et al., "The Iceberg Index: Measuring Workforce Exposure Across the AI Economy", MIT and Oak Ridge National Laboratory, 2025 | 151 million simulated workers; about 11.7% of US wage value technically performable by AI. Candidate starting points for sector profiles. | https://arxiv.org/abs/2510.25137 |
| Anthropic Economic Index dataset | Open task-level data on automation and augmentation | https://huggingface.co/datasets/Anthropic/EconomicIndex |
| Gulcur, AI Workforce Odyssey 2026 (NetLogo, MIT licence) | Agent-based model with seniority, scarring and training seats. Template for the missing population layer. | https://github.com/asligulcur/AI_Workforce_Odyssey_2026 |

## Named in the known limits

- Casilli, *En attendant les robots* (Seuil, 2019); English edition *Waiting for Robots* (University of Chicago Press, 2025). Hidden human labour behind automation.
- Gray and Suri, *Ghost Work* (Houghton Mifflin Harcourt, 2019).
- Vaughan, *The Challenger Launch Decision* (University of Chicago Press, 1996). Normalisation of deviance.
- Moltbook, a social network for AI agents: more than 37,000 agents within a week of launch (January 2026), according to its founder Matt Schlicht. https://www.nbcnews.com/tech/rcna256738
- Bessen, "Toil and Technology", IMF Finance & Development, March 2015. Bank tellers after ATMs. https://www.imf.org/external/pubs/ft/fandd/2015/03/bessen.htm (not re-checked)
