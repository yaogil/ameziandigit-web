import { useState, useEffect, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1,
    slug: "liu-et-al-2025-super-disruptions",
    date: "2025-06",
    tag: "IRP & Résilience",
    readTime: "8 min",
    title: "Liu et al. (2025) : Adaptation structurelle sous super-disruptions",
    subtitle:
      "Comment reconfigurer dynamiquement un réseau IRP lorsque les hypothèses de base s'effondrent simultanément.",
    abstract:
      "Les modèles classiques d'Inventory Routing Problem supposent une stochasticité bornée : les perturbations restent dans un espace probabiliste connu. Liu et al. (2025) introduisent le concept de « super-disruption » — un régime où plusieurs paramètres critiques (demande, capacité de transport, lead time) dérivent simultanément hors de leur domaine historique. L'article propose une reformulation robuste du IRP intégrant une adaptation structurelle endogène : les décisions de routage et de stockage deviennent des fonctions de variables d'état observables, non de distributions a priori figées.",
    keyPoints: [
      "Reformulation du IRP sous incertitude non-stationnaire",
      "Adaptation structurelle endogène via recours multi-étapes",
      "Validation sur données réelles (chaîne pétrochimique, 2021–2023)",
      "Réduction de 23% du coût total logistique sous scénarios de disruption extrême",
    ],
    methodology:
      "Programmation stochastique à deux étapes + robustesse distributionnelle (Wasserstein ball). Implémentation Python/Gurobi.",
  },
  {
    id: 2,
    slug: "irp-demande-stochastique",
    date: "2025-03",
    tag: "Modélisation",
    readTime: "6 min",
    title: "IRP sous demande stochastique : Comparaison MIP vs. DP",
    subtitle:
      "Analyse comparative des approches de programmation mixte-entière et de programmation dynamique sur des instances industrielles.",
    abstract:
      "La résolution exacte du IRP reste NP-difficile même en contexte déterministe. Sous demande stochastique, l'espace d'état explose. Cet article compare deux paradigmes : la reformulation MIP avec scénarios (SAA) et la programmation dynamique approximative (ADP). Les résultats montrent une complémentarité structurelle selon la granularité temporelle et la taille du réseau.",
    keyPoints: [
      "Benchmark SAA vs. ADP sur 40 instances VRPLIB adaptées",
      "Analyse de la scalabilité selon le nombre de clients (20–200)",
      "Compromis qualité-temps de calcul sous contraintes industrielles",
      "Recommandations pratiques de sélection d'approche",
    ],
    methodology:
      "Python + OR-Tools (SAA) / Tensorflow (ADP). Expériences sur cluster HPC.",
  },
];

const SERVICES = [
  {
    id: "audit",
    number: "01",
    title: "Audit de Performance",
    description:
      "Diagnostic complet de vos flux logistiques : identification des inefficiences par l'analyse KPI, cartographie des goulots, et benchmarking sectoriel. Rapport actionnable avec hiérarchisation des leviers d'optimisation.",
    tags: ["KPI Analysis", "Data Audit", "Diagnostic"],
  },
  {
    id: "modelisation",
    number: "02",
    title: "Modélisation d'Optimisation Robuste",
    description:
      "Conception et résolution de modèles IRP adaptés à votre contexte : demande stochastique, contraintes de capacité, résilience sous disruption. Approches exactes (MIP/Gurobi) ou heuristiques selon l'échelle.",
    tags: ["IRP", "Robust Optimization", "Stochastic Programming"],
  },
  {
    id: "outils",
    number: "03",
    title: "Outils Décisionnels Personnalisés",
    description:
      "Développement d'applications Python et dashboards interactifs : simulateurs de scénarios, optimiseurs embarqués, tableaux de bord opérationnels. Du modèle mathématique à l'interface métier.",
    tags: ["Python", "Dashboards", "Decision Tools"],
  },
];

const METHODOLOGY_STEPS = [
  {
    id: "collect",
    code: "01",
    title: "Collecte & Structuration",
    description:
      "Extraction, nettoyage et structuration des données historiques. Identification des patterns de demande, des contraintes opérationnelles et des variables critiques.",
    items: ["ERP / WMS Integration", "Data Quality Assessment", "Feature Engineering"],
  },
  {
    id: "model",
    code: "02",
    title: "Modélisation Mathématique",
    description:
      "Formulation du problème d'optimisation adapté au contexte : choix du paradigme (IRP, VRP, SP), traitement de l'incertitude, définition des objectifs et contraintes.",
    items: ["Problem Formulation", "Uncertainty Modeling", "Solver Selection"],
  },
  {
    id: "decide",
    code: "03",
    title: "Décision Résiliente",
    description:
      "Génération et évaluation de scénarios, analyse de sensibilité, livraison d'une politique de décision opérationnalisable et robuste aux perturbations.",
    items: ["Scenario Analysis", "Sensitivity Testing", "Policy Deployment"],
  },
];

// ─── HOOKS ──────────────────────────────────────────────────────────────────
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);
  return active;
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Nav({ active }) {
  const links = [
    { id: "hero", label: "Accueil" },
    { id: "services", label: "Services" },
    { id: "expertise", label: "Expertise" },
    { id: "methodologie", label: "Méthode" },
    { id: "contact", label: "Contact" },
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "rgba(6,12,26,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, backgroundColor: "#3B82F6", borderRadius: 2, transform: "rotate(45deg)" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#F8FAFC", letterSpacing: "0.05em" }}>
            DATA SUPPLY CHAIN
          </span>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: active === l.id ? "#3B82F6" : "#94A3B8",
                textDecoration: "none",
                transition: "color 0.2s",
                borderBottom: active === l.id ? "1px solid #3B82F6" : "1px solid transparent",
                paddingBottom: 2,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", backgroundColor: "#060C1A" }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* Radial accent */}
      <div style={{
        position: "absolute", top: "20%", right: "10%", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 820 }}>
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 40, height: 1, backgroundColor: "#3B82F6" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#3B82F6", textTransform: "uppercase" }}>
              Consultant Freelance — IRP & Optimisation Robuste
            </span>
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 1.05, color: "#F8FAFC", margin: "0 0 32px 0" }}>
            Résoudre le conflit{" "}
            <span style={{ color: "#3B82F6" }}>Stocks</span>
            {" "}vs{" "}
            <span style={{ color: "#64748B" }}>Transport</span>
            <br />sous incertitude.
          </h1>

          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 18, lineHeight: 1.7, color: "#94A3B8", maxWidth: 620, margin: "0 0 48px 0" }}>
            Les décisions logistiques optimales n'existent pas en régime déterministe. Elles se construisent dans l'incertitude, par la modélisation mathématique rigoureuse des flux, des stocks et des perturbations réelles.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#services" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.08em",
              padding: "14px 28px", backgroundColor: "#3B82F6", color: "#fff",
              textDecoration: "none", border: "none", cursor: "pointer",
              transition: "background 0.2s",
            }}>
              Voir les services
            </a>
            <a href="#expertise" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.08em",
              padding: "14px 28px", backgroundColor: "transparent", color: "#94A3B8",
              textDecoration: "none", border: "1px solid rgba(148,163,184,0.2)",
              transition: "border-color 0.2s, color 0.2s",
            }}>
              Lire les articles
            </a>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: 48, marginTop: 72, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            {[
              { value: "IRP", label: "Spécialisation principale" },
              { value: "Python", label: "Implémentation solver" },
              { value: "MIP / SP", label: "Paradigmes d'optimisation" },
            ].map((s) => (
              <div key={s.value}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#F8FAFC" }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#475569", marginTop: 4, letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" style={{ padding: "120px 0", backgroundColor: "#0A1020" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Freelance" title="Services" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 2, marginTop: 64 }}>
          {SERVICES.map((s, i) => (
            <div key={s.id} style={{
              backgroundColor: "#0D1628",
              padding: "48px 40px",
              borderTop: "2px solid #3B82F6",
              position: "relative",
              transition: "background 0.2s",
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#3B82F6", letterSpacing: "0.2em", marginBottom: 28 }}>
                {s.number}
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#F8FAFC", margin: "0 0 20px 0", lineHeight: 1.2 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#64748B", margin: "0 0 32px 0" }}>
                {s.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.tags.map((t) => (
                  <span key={t} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em",
                    padding: "4px 10px", backgroundColor: "rgba(59,130,246,0.08)",
                    color: "#3B82F6", border: "1px solid rgba(59,130,246,0.15)",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article, onSelect }) {
  return (
    <div
      onClick={() => onSelect(article)}
      style={{
        backgroundColor: "#0D1628", padding: "40px", cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.04)",
        transition: "border-color 0.2s, background 0.2s",
        display: "flex", flexDirection: "column", gap: 16,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.backgroundColor = "#101a2e"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.backgroundColor = "#0D1628"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#3B82F6", padding: "3px 8px", border: "1px solid rgba(59,130,246,0.2)", backgroundColor: "rgba(59,130,246,0.06)" }}>
          {article.tag}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#374151", letterSpacing: "0.08em" }}>
          {article.date} — {article.readTime}
        </span>
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#F8FAFC", margin: 0, lineHeight: 1.25 }}>
        {article.title}
      </h3>
      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
        {article.subtitle}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <div style={{ width: 16, height: 1, backgroundColor: "#3B82F6" }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#3B82F6", letterSpacing: "0.1em" }}>
          Lire l'analyse
        </span>
      </div>
    </div>
  );
}

function ArticleModal({ article, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      backgroundColor: "rgba(6,12,26,0.95)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "60px 20px", overflowY: "auto",
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 760, width: "100%", backgroundColor: "#0D1628",
          border: "1px solid rgba(59,130,246,0.2)", padding: "60px",
        }}
      >
        <button onClick={onClose} style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
          backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)",
          color: "#64748B", padding: "8px 16px", cursor: "pointer", marginBottom: 40,
        }}>
          FERMER
        </button>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#3B82F6", border: "1px solid rgba(59,130,246,0.3)", padding: "3px 8px" }}>{article.tag}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#374151" }}>{article.date} — {article.readTime} de lecture</span>
        </div>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: "#F8FAFC", margin: "0 0 12px 0", lineHeight: 1.15 }}>
          {article.title}
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#3B82F6", margin: "0 0 40px 0", fontStyle: "italic" }}>
          {article.subtitle}
        </p>

        <div style={{ borderLeft: "2px solid #3B82F6", paddingLeft: 24, marginBottom: 40 }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, lineHeight: 1.8, color: "#94A3B8", margin: 0 }}>
            {article.abstract}
          </p>
        </div>

        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", color: "#3B82F6", marginBottom: 20, textTransform: "uppercase" }}>
          Points clés
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {article.keyPoints.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#3B82F6", flexShrink: 0, marginTop: 2 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#94A3B8", lineHeight: 1.6 }}>{p}</span>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: "#060C1A", padding: "24px", border: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#475569", display: "block", marginBottom: 10 }}>
            MÉTHODOLOGIE
          </span>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
            {article.methodology}
          </p>
        </div>
      </div>
    </div>
  );
}

function Expertise() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="expertise" style={{ padding: "120px 0", backgroundColor: "#060C1A" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Blog / Recherche" title="Espace Expertise" />
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#475569", maxWidth: 520, margin: "16px 0 64px 0", lineHeight: 1.7 }}>
          Analyses de la littérature récente en optimisation de chaînes logistiques. Chaque article est structuré pour le praticien : abstracts synthétiques, points clés, méthodologie applicable.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 2 }}>
          {ARTICLES.map((a) => (
            <ArticleCard key={a.id} article={a} onSelect={setSelected} />
          ))}
        </div>

        <div style={{ marginTop: 24, padding: "20px", backgroundColor: "#0A1020", border: "1px dashed rgba(255,255,255,0.06)", display: "inline-block" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#374151", letterSpacing: "0.1em" }}>
            // Pour ajouter un article : modifier le tableau ARTICLES en début de fichier ou l'externaliser dans articles.json
          </span>
        </div>
      </div>

      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function Methodologie() {
  return (
    <section id="methodologie" style={{ padding: "120px 0", backgroundColor: "#0A1020" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Approche" title="Méthodologie" />
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#475569", maxWidth: 480, margin: "16px 0 80px 0", lineHeight: 1.7 }}>
          Chaque mission suit un processus structuré en trois phases, de la donnée brute à la politique de décision déployable.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }}>
          {/* Connector lines */}
          <div style={{
            position: "absolute", top: "50px", left: "calc(33% - 0px)", right: "calc(33% - 0px)", height: 1,
            background: "linear-gradient(90deg, #3B82F6, #1D4ED8)",
            zIndex: 0,
          }} />

          {METHODOLOGY_STEPS.map((step, i) => (
            <div key={step.id} style={{ padding: "0 32px", position: "relative", zIndex: 1 }}>
              {/* Number node */}
              <div style={{
                width: 48, height: 48, border: "1px solid #3B82F6",
                backgroundColor: "#0A1020", display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 32,
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#3B82F6", fontWeight: 700 }}>
                  {step.code}
                </span>
              </div>

              {/* Arrow between steps (not last) */}
              {i < 2 && (
                <div style={{
                  position: "absolute", top: 23, right: -4, zIndex: 2,
                  width: 8, height: 8, borderTop: "1px solid #3B82F6", borderRight: "1px solid #3B82F6",
                  transform: "rotate(45deg)",
                }} />
              )}

              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#F8FAFC", margin: "0 0 16px 0" }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: "#64748B", margin: "0 0 24px 0" }}>
                {step.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {step.items.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 4, backgroundColor: "#3B82F6", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#475569", letterSpacing: "0.08em" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.email || !form.message) return;
    setSent(true);
  };

  return (
    <section id="contact" style={{ padding: "120px 0", backgroundColor: "#060C1A" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Contact" title="Travaillons ensemble" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 64, alignItems: "start" }}>
          {/* Left */}
          <div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: "#64748B", marginBottom: 48 }}>
              Vous faites face à un problème de stock cyclique, de tournées sous contraintes ou d'optimisation de votre chaîne sous incertitude ? Décrivez votre problème, je reviendrai vers vous dans les 48h.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { label: "LinkedIn", value: "linkedin.com/in/votre-profil", href: "#" },
                { label: "GitHub", value: "github.com/votre-compte", href: "#" },
                { label: "Email", value: "contact@votre-domaine.com", href: "#" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#3B82F6", width: 64 }}>
                    {l.label.toUpperCase()}
                  </span>
                  <a href={l.href} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#94A3B8", textDecoration: "none", borderBottom: "1px solid rgba(148,163,184,0.2)", paddingBottom: 2, transition: "color 0.2s, border-color 0.2s" }}>
                    {l.value}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ backgroundColor: "#0D1628", padding: "60px 48px", border: "1px solid rgba(59,130,246,0.2)", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 48, height: 2, backgroundColor: "#3B82F6" }} />
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#F8FAFC", margin: 0 }}>Message envoyé.</h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: 0 }}>
                Je reviendrai vers vous dans les 48h ouvrées. En attendant, consultez les articles techniques pour mieux cerner l'approche.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "name", label: "Nom / Société", type: "text", placeholder: "Votre nom ou raison sociale" },
                { key: "email", label: "Email professionnel", type: "email", placeholder: "votre@email.com" },
              ].map((f) => (
                <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#3B82F6", textTransform: "uppercase" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{
                      backgroundColor: "#0D1628", border: "1px solid rgba(255,255,255,0.08)",
                      color: "#F8FAFC", padding: "14px 16px", fontSize: 14,
                      fontFamily: "'IBM Plex Sans', sans-serif", outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(59,130,246,0.5)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#3B82F6", textTransform: "uppercase" }}>
                  Décrivez votre problème
                </label>
                <textarea
                  rows={5}
                  placeholder="Type de chaîne logistique, volume, contraintes clés, objectif..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{
                    backgroundColor: "#0D1628", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#F8FAFC", padding: "14px 16px", fontSize: 14,
                    fontFamily: "'IBM Plex Sans', sans-serif", outline: "none",
                    resize: "vertical", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(59,130,246,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.12em",
                  padding: "16px 32px", backgroundColor: "#3B82F6", color: "#fff", border: "none",
                  cursor: "pointer", alignSelf: "flex-start", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = "#2563EB"; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = "#3B82F6"; }}
              >
                ENVOYER LE MESSAGE
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", backgroundColor: "#060C1A", padding: "32px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1E293B", letterSpacing: "0.08em" }}>
          © 2025 — Data Supply Chain Consulting
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1E293B", letterSpacing: "0.08em" }}>
          IRP · Robust Optimization · Python
        </span>
      </div>
    </footer>
  );
}

function SectionHeader({ tag, title }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 24, height: 1, backgroundColor: "#3B82F6" }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#3B82F6", textTransform: "uppercase" }}>
          {tag}
        </span>
      </div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#F8FAFC", margin: 0, lineHeight: 1.1 }}>
        {title}
      </h2>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const active = useActiveSection(["hero", "services", "expertise", "methodologie", "contact"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background-color: #060C1A; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060C1A; }
        ::-webkit-scrollbar-thumb { background: #1E3A5F; }
        @media (max-width: 768px) {
          nav > div > div:last-child { display: none; }
          section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", backgroundColor: "#060C1A", minHeight: "100vh" }}>
        <Nav active={active} />
        <Hero />
        <Services />
        <Expertise />
        <Methodologie />
        <Contact />
        <Footer />
      </div>
    </>
  );
}