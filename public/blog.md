---
title: Blog / Recherche — Amezian Digit
description: Analyses de la littérature récente en optimisation de chaînes logistiques. Articles sur l'IRP, la programmation stochastique, et l'optimisation robuste.
url: https://ameziandigit.com/blog
last_updated: 2026-04-26
---

# Blog / Espace Expertise — Amezian Digit

Analyses de la littérature récente en optimisation de chaînes logistiques.

## Article 1 — Liu et al. (2025) : Adaptation structurelle sous super-disruptions
**Tag :** IRP & Résilience | **Date :** 2025-06 | **Lecture :** 8 min

**Sous-titre :** Comment reconfigurer dynamiquement un réseau IRP lorsque les hypothèses de base s'effondrent simultanément.

**Résumé :** Les modèles classiques d'Inventory Routing Problem supposent une stochasticité bornée. Liu et al. (2025) introduisent le concept de « super-disruption » — un régime où plusieurs paramètres critiques (demande, capacité de transport, lead time) dérivent simultanément hors de leur domaine historique.

**Points clés :**
- Reformulation du IRP sous incertitude non-stationnaire
- Adaptation structurelle endogène via recours multi-étapes
- Validation sur données réelles (chaîne pétrochimique, 2021–2023)
- Réduction de 23% du coût total logistique sous scénarios de disruption extrême

**Méthodologie :** Programmation stochastique à deux étapes + robustesse distributionnelle (Wasserstein ball). Implémentation Python/Gurobi.

---

## Article 2 — IRP sous demande stochastique : Comparaison MIP vs. DP
**Tag :** Modélisation | **Date :** 2025-03 | **Lecture :** 6 min

**Sous-titre :** Analyse comparative des approches de programmation mixte-entière et de programmation dynamique sur des instances industrielles.

**Résumé :** La résolution exacte du IRP reste NP-difficile même en contexte déterministe. Sous demande stochastique, l'espace d'état explose. Cet article compare deux paradigmes : la reformulation MIP avec scénarios (SAA) et la programmation dynamique approximative (ADP).

**Points clés :**
- Benchmark SAA vs. ADP sur 40 instances VRPLIB adaptées
- Analyse de la scalabilité selon le nombre de clients (20–200)
- Compromis qualité-temps de calcul sous contraintes industrielles
- Recommandations pratiques de sélection d'approche

**Méthodologie :** Python + OR-Tools (SAA) / Tensorflow (ADP). Expériences sur cluster HPC.
