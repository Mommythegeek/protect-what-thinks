# Points mathématiques ouverts — §4 de Beyond Solipsistic Robotics

*Une vérification assistée par IA, ouverte à la correction de la communauté active inference.*

> This note is in French; the notation is standard active-inference. It concerns Section 4 of *Beyond Solipsistic Robotics* (V7.3 to V7.6). V7.5 applies a proposed correction to Eq. 1 and adds Section 4.0; V7.6 corrects the references to Da Costa et al. below after a check against the published article; the other points are unchanged since V7.3. An English version is welcome as a contribution.

Ce document liste les points du §4 (V7.3) que nous vérifions encore et que nous soumettons ouvertement à la communauté active inference. Il est ancré sur da Costa et al. (2020, *Active inference on discrete state-spaces*, J. Math. Psych. 99:102447, éq. 13 à 16) et Parr, Pezzulo & Friston (2022). Conformément au Criterion 3 de notre papier méthodologique, le sign-off d'un mathématicien active inference est requis : une formalisation assistée par IA n'est pas un warrant formel suffisant (le §4.3 du papier méthodo documente exactement ce risque). Chaque point ci-dessous est proposé comme correction à vérifier, non comme résultat établi. Objections, contre-exemples et pull requests sont les bienvenus.

---

## Eq. 1 (§4.1) — décomposition EFE invalide + mauvais label

Manuscrit : G(π,τ) = −E_Q[ln P(o_τ|C)] + E_Q[H[P(o_τ|s_τ)]], second terme décrit comme « epistemic value ».

Diagnostic. Deux problèmes distincts :

1. Mauvais label. E_Q[H[P(o_τ|s_τ)]] est le terme d'ambiguïté (entropie attendue de la vraisemblance), pas la valeur épistémique. La valeur épistémique est un gain d'information (information mutuelle entre états et observations), de signe opposé dans la fonctionnelle.
2. Décomposition non valide. La forme écrite omet le terme −H[Q(o_τ|π)]. En effet, la vraie décomposition risque+ambiguïté donne G = −E_Q[ln P(o_τ|C)] − H[Q(o_τ|π)] + E_Q[H[P(o_τ|s_τ)]], et −H[Q(o_τ)] + E_Q[H[P(o_τ|s_τ)]] = −I(o_τ; s_τ) (gain d'information). En supprimant −H[Q(o_τ)], le manuscrit n'écrit donc pas l'EFE.

Correction — choisir UNE des deux formes canoniques (da Costa 2020) :

- (a) risque sur les observations + ambiguïté (éq. 15, par approximation ; l'éq. 13 porte le risque sur les états cachés et les paramètres) : G(π) = D_KL[ Q(o_τ|π) ‖ P(o_τ|C) ] + E_{Q(s_τ|π)}[ H[P(o_τ|s_τ)] ] ; risque = divergence entre outcomes prédits et préférés ; ambiguïté = entropie attendue de la vraisemblance.
- (b) pragmatique + épistémique (chez da Costa : extrinsèque + intrinsèque ; éq. 14, deuxième ligne, donnée comme borne inférieure) : G(π) = −E_{Q(o_τ|π)}[ ln P(o_τ|C) ] − I(o_τ; s_τ | π) avec gain d'information I(o_τ; s_τ|π) = H[Q(o_τ|π)] − E_{Q(s_τ|π)}[H[P(o_τ|s_τ)]] (= valeur épistémique, à maximiser ; signe négatif dans G).

Le texte qui suit l'équation doit alors qualifier correctement chaque terme (et ne plus dire que l'entropie de la vraisemblance « capture la valeur épistémique »).

**Statut V7.5.** La forme (b) est appliquée dans le corps du texte (Eq. 1 et Eq. 1a), avec le texte corrigé. L'égalité entre (a) et (b) a été vérifiée numériquement sur 2 000 distributions discrètes aléatoires (écart maximal de l'ordre de 1e-15). Correction assistée par IA, toujours en attente de sign-off.

**Statut V7.6 : renvois vérifiés sur l'article publié et corrigés.** La numérotation des éq. 13 à 16 est la même dans arXiv v1, arXiv v2 et l'article publié.

- L'éq. 13 de da Costa et al. définit le risque sur les états cachés et les paramètres : G(π) = D_KL[ Q(s_τ, A|π) ‖ P(s_τ, A) ] + E_{Q(s_τ, A|π)}[ H[P(o_τ|s_τ, A)] ]. Le risque sur les observations, utilisé en (a), est leur éq. 15, obtenue en posant un second terme KL ≈ 0.
- La forme à deux termes (b) est la deuxième ligne de leur éq. 14, écrite comme borne inférieure : G(π) ≥ −E_Q[ln P(o_τ)] − E_Q[ D_KL[ Q(s_τ, A|o_τ, π) ‖ Q(s_τ, A|π) ] ]. Il y a égalité quand le postérieur est exact (l'« expected evidence bound » s'annule). Le papier écrit Eq. 1 comme une égalité sous cette hypothèse et le dit.
- Leur éq. 16 est une décomposition en quatre termes : extrinsic value, expected evidence bound, intrinsic value sur les états (salience), intrinsic value sur les paramètres (novelty).
- Vocabulaire : da Costa et al. écrivent « extrinsic » et « intrinsic value », jamais « pragmatic » ; « pragmatic / epistemic » vient de Parr, Pezzulo & Friston (2022). Ils notent les préférences P(o_τ), sans C.
- L'identité I(o_τ; s_τ|π) = H[Q(o_τ|π)] − E_{Q(s_τ|π)}[H[P(o_τ|s_τ)]] est standard mais ne figure pas dans leur article ; elle est de nous.
- Le papier omet les paramètres A (vraisemblance supposée connue).

Question restée ouverte pour un spécialiste : l'hypothèse de postérieur exact est-elle acceptable dans le cadre dyadique de la section 4.2, ou faut-il porter le terme « expected evidence bound » ?

## Eq. 2 (§4.2) — modèle génératif joint : définitions manquantes

Manquant : domaines des variables et forme des distributions. À ajouter :

- espaces d'états/observations (ex. x^r ∈ X^r, x^h ∈ X^h, o ∈ O ; discret → catégoriel, continu → préciser) ;
- la forme des facteurs : likelihood P(o_t | x^r_t, x^h_t) et transition P(x_{t+1} | x_t, a^r_t, a^h_t) (catégorielles / Dirichlet, ou gaussiennes) ;
- le produit ∏_t explicite avec bornes.

## §4.2 — « viability subspace » : c'est une fonction, pas un sous-espace

Manuscrit : v^h_t = f(x^h_t), appelé viability subspace.

Diagnostic. f est une application, pas une relation entre sous-espaces.

Correction (notation ensembliste) : distinguer

- la projection f : X^h → V, v^h_t = f(x^h_t) (variable de viabilité) ;
- le sous-ensemble viable V^h ⊆ V (le « subspace » proprement dit), domaine dans lequel v^h_t doit rester. Réserver « viability set/subspace » à V^h.

## Eq. 4 (§4.3) — trois corrections (soulevées en relecture)

Manuscrit : Π_safe(t) = { π ∈ Π : Pr(v^h_{t+1:t+H} ∈ V^h | π, I_t) ≥ 1 − ε_t }

1. Pr non spécifiée. C'est la mesure prédictive postérieure : Pr(· | π, I_t) = ∫ (·) dQ(v^h_{t+1:t+H} | π, I_t), où Q(v^h_{t+1:t+H}|π,I_t) est la densité prédictive sous la politique. À définir explicitement.
2. I_t non défini. C'est l'état d'information (historique) à t : I_t = { y^h_{1:t}, a^r_{1:t−1} }. À définir.
3. Incohérence séquence/domaine. V^h est défini pour une entrée unique ; v^h_{t+1:t+H} ∈ V^h teste une séquence contre ce domaine → mal typé (toujours faux). Correction : quantifier sur l'horizon — Pr( ∀ τ ∈ {t+1,…,t+H} : v^h_τ ∈ V^h | π, I_t ) ≥ 1 − ε_t (de façon équivalente : v^h_{t+1:t+H} ∈ (V^h)^{⊗H}, le produit cartésien H-fois).

## Eq. 6 (§4.3.1) — on ne conditionne pas sur un ensemble

Manuscrit : G_soft(π) = G(π) − λ · E_Q[ ln P(v^h_τ | V^h) ].

Diagnostic. V^h est un ensemble, pas une variable aléatoire → le conditionnement P(· | V^h) n'est pas défini.

Correction : introduire une distribution de préférence P=(v^h_τ) encodant la préférence pour V^h (p.ex. P=(v^h_τ) ∝ exp(−β · d(v^h_τ, V^h)), ou ∝ 1_{V^h}(v^h_τ) adoucie), et écrire G_soft(π) = G(π) − λ · E_Q[ ln P=(v^h_τ) ]. La préférence pour la viabilité devient un terme de préférence standard, ce qui rend la comparaison avec la formulation chance-constrained plus propre (cf. la note V7.0→V7.1 sur la reformulation « filtering before evaluation vs penalizing during evaluation »).

## Eq. 7 (§4.4) — « information gain saturation » : séparer deux objets

Manuscrit : ε_t = εA_c · exp(−κ · Var_{q_t}[v^h_t]), puis texte : « this is information gain saturation: the expected KL between successive posteriors has approached zero ».

Diagnostic. Eq. 7 ne régule pas le gain d'information ; elle mappe la variance postérieure → tolérance. La « saturation » est une condition séparée.

Correction : garder Eq. 7 comme tolérance précision-pondérée, et écrire le déclencheur de Regulatory Withdrawal comme une inégalité distincte sur le gain d'information (surprise bayésienne entre postérieurs successifs) : D_KL[ q_t(v^h) ‖ q_{t−1}(v^h) ] < δ_sat. Ne pas confondre les deux dans la même phrase.

## §4.3.1 — non-équivalence (déjà notée V7.0→V7.1)

La reformulation « distinction architecturale positive (filtrage avant évaluation vs pénalisation pendant) » plutôt que « rejet d'une équivalence attendue » est la bonne réponse à cette objection. Une fois Eq. 6 corrigée (préférence P= bien définie), la Proposition 1 peut s'énoncer comme : argmin_{Π_safe} G ≠ argmin_Π G_soft en général, car Π_safe restreint le domaine alors que G_soft ne change que le classement — sans invoquer une limite λ → ∞ comme null attendu.

---

## Points ouverts à vérifier

- Eq. 1 : forme (b) appliquée en V7.5 comme proposition, renvois à da Costa corrigés en V7.6 ; sign-off expert attendu, y compris sur l'hypothèse de postérieur exact. ☐
- Eq. 2 : domaines + forme des distributions. ☐
- §4.2 : séparer projection f et ensemble viable V^h. ☐
- Eq. 4 : définir Pr, I_t ; quantifier sur l'horizon. ☐
- Eq. 6 : remplacer le conditionnement sur V^h par une préférence P=. ☐
- Eq. 7 : séparer tolérance et déclencheur de saturation. ☐
- Prop. 1 : réénoncer sans la limite λ → ∞. ☐
- Nouveau en V7.5, (N3) : l'hypothèse de capacité dépendante de l'usage, c_{t+1} = c_t + α·u_t·(1 − c_t) − β·(1 − u_t)·c_t, est-elle une forme raisonnable, et comment mesurer α et β ? Wolbrecht et al. (2008) ne la soutient que pour l'effort mesuré pendant le mouvement, pas pour la capacité. ☐
- Nouveau en V7.5, Eq. 11–12 : la seconde étape ne départage que les politiques à coût égal ; faut-il une marge δ_J sur le coût ? ☐
- Nouveau en V7.5 : la règle d'arrêt conjointe (N5) est-elle optimale sous (N3) ? ☐

*Une correction, une objection ou une preuve ? Ouvrez une issue ou une pull request.*
