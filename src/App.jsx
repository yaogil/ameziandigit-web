import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ────────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1,
    slug: "liu-et-al-2025-super-disruptions",
    date: "2025-06",
    tag: "IRP & Résilience",
    readTime: "8 min",
    title: "Liu et al. (2025) : Adaptation structurelle sous super-disruptions",
    subtitle: "Comment reconfigurer dynamiquement un réseau IRP lorsque les hypothèses de base s'effondrent simultanément.",
    abstract: "Les modèles classiques d'Inventory Routing Problem supposent une stochasticité bornée : les perturbations restent dans un espace probabiliste connu. Liu et al. (2025) introduisent le concept de « super-disruption » — un régime où plusieurs paramètres critiques (demande, capacité de transport, lead time) dérivent simultanément hors de leur domaine historique.",
    keyPoints: [
      "Reformulation du IRP sous incertitude non-stationnaire",
      "Adaptation structurelle endogène via recours multi-étapes",
      "Validation sur données réelles (chaîne pétrochimique, 2021–2023)",
      "Réduction de 23% du coût total logistique sous scénarios de disruption extrême",
    ],
    methodology: "Programmation stochastique à deux étapes + robustesse distributionnelle (Wasserstein ball). Implémentation Python/Gurobi.",
  },
  {
    id: 2,
    slug: "irp-demande-stochastique",
    date: "2025-03",
    tag: "Modélisation",
    readTime: "6 min",
    title: "IRP sous demande stochastique : Comparaison MIP vs. DP",
    subtitle: "Analyse comparative des approches de programmation mixte-entière et de programmation dynamique sur des instances industrielles.",
    abstract: "La résolution exacte du IRP reste NP-difficile même en contexte déterministe. Sous demande stochastique, l'espace d'état explose. Cet article compare deux paradigmes : la reformulation MIP avec scénarios (SAA) et la programmation dynamique approximative (ADP).",
    keyPoints: [
      "Benchmark SAA vs. ADP sur 40 instances VRPLIB adaptées",
      "Analyse de la scalabilité selon le nombre de clients (20–200)",
      "Compromis qualité-temps de calcul sous contraintes industrielles",
      "Recommandations pratiques de sélection d'approche",
    ],
    methodology: "Python + OR-Tools (SAA) / Tensorflow (ADP). Expériences sur cluster HPC.",
  },
];

const SERVICES = [
  {
    id: "audit", number: "01", title: "Audit de Performance",
    description: "Diagnostic complet de vos flux logistiques : identification des inefficiences par l'analyse KPI, cartographie des goulots, et benchmarking sectoriel. Rapport actionnable avec hiérarchisation des leviers d'optimisation.",
    tags: ["KPI Analysis", "Data Audit", "Diagnostic"],
  },
  {
    id: "modelisation", number: "02", title: "Modélisation d'Optimisation Robuste",
    description: "Conception et résolution de modèles IRP adaptés à votre contexte : demande stochastique, contraintes de capacité, résilience sous disruption. Approches exactes (MIP/Gurobi) ou heuristiques selon l'échelle.",
    tags: ["IRP", "Robust Optimization", "Stochastic Programming"],
  },
  {
    id: "outils", number: "03", title: "Outils Décisionnels Personnalisés",
    description: "Développement d'applications Python et dashboards interactifs : simulateurs de scénarios, optimiseurs embarqués, tableaux de bord opérationnels. Du modèle mathématique à l'interface métier.",
    tags: ["Python", "Dashboards", "Decision Tools"],
  },
];

const METHODOLOGY_STEPS = [
  { id: "collect", code: "01", title: "Collecte & Structuration", description: "Extraction, nettoyage et structuration des données historiques. Identification des patterns de demande, des contraintes opérationnelles et des variables critiques.", items: ["ERP / WMS Integration", "Data Quality Assessment", "Feature Engineering"] },
  { id: "model", code: "02", title: "Modélisation Mathématique", description: "Formulation du problème d'optimisation adapté au contexte : choix du paradigme (IRP, VRP, SP), traitement de l'incertitude, définition des objectifs et contraintes.", items: ["Problem Formulation", "Uncertainty Modeling", "Solver Selection"] },
  { id: "decide", code: "03", title: "Décision Résiliente", description: "Génération et évaluation de scénarios, analyse de sensibilité, livraison d'une politique de décision opérationnalisable et robuste aux perturbations.", items: ["Scenario Analysis", "Sensitivity Testing", "Policy Deployment"] },
];

// Chatbot questions
const CHATBOT_STEPS = [
  { key: "name", question: "Bonjour ! Je suis l'assistant d'AmezianDigit. Comment vous appelez-vous ?", type: "text", placeholder: "Votre prénom et nom" },
  { key: "email", question: "Merci {name}. Quel est votre email professionnel ?", type: "email", placeholder: "votre@email.com" },
  { key: "company", question: "Pour quelle entreprise travaillez-vous ?", type: "text", placeholder: "Nom de votre société" },
  { key: "problem", question: "Quel est votre principal défi logistique actuellement ?", type: "select", options: ["Optimisation des stocks", "Réduction des coûts transport", "Résilience sous disruptions", "Digitalisation des flux", "Autre"] },
  { key: "budget", question: "Quel est votre budget indicatif pour ce projet ?", type: "select", options: ["< 5 000 €", "5 000 – 15 000 €", "15 000 – 50 000 €", "> 50 000 €", "À définir"] },
];

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#FAFAFA", bgDark: "#F3F0FF",
  violet: "#6D28D9", violetLight: "#7C3AED", violetPale: "#EDE9FE",
  yellow: "#F59E0B", yellowLight: "#FCD34D", yellowPale: "#FFFBEB",
  dark: "#1C1027", mid: "#4B3F6B", muted: "#8B7BA8", white: "#FFFFFF",
  border: "rgba(109,40,217,0.12)", borderYellow: "rgba(245,158,11,0.3)",
  success: "#059669", successPale: "#ECFDF5",
};

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { threshold: 0.3 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);
  return active;
}

// ─── NEWSLETTER POPUP ────────────────────────────────────────────────────────
function NewsletterPopup({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    const { error } = await supabase.from("newsletter").insert([{ email, source: "popup" }]);
    if (error && error.code !== "23505") { setStatus("error"); return; }
    setStatus("success");
    setTimeout(onClose, 2500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(28,16,39,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 480, width: "100%", backgroundColor: C.white, padding: "56px 48px", border: `1px solid ${C.border}`, boxShadow: "0 24px 80px rgba(109,40,217,0.2)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", fontSize: 20, color: C.muted, cursor: "pointer" }}>×</button>

        {/* Lead magnet badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: C.yellowPale, border: `1px solid ${C.borderYellow}`, padding: "6px 14px", marginBottom: 24 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#92400E" }}>GUIDE GRATUIT</span>
        </div>

        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: C.dark, margin: "0 0 12px 0", lineHeight: 1.2 }}>
          Recevez le guide IRP<br /><span style={{ color: C.violet }}>en pratique</span>
        </h3>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.mid, lineHeight: 1.6, margin: "0 0 28px 0" }}>
          10 pages sur la mise en œuvre d'un modèle Inventory Routing Problem dans un contexte industriel réel. Envoyé immédiatement par email.
        </p>

        {status === "success" ? (
          <div style={{ backgroundColor: C.successPale, border: `1px solid rgba(5,150,105,0.2)`, padding: "16px 20px" }}>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.success, margin: 0 }}>
              Inscrit. Le guide arrive dans votre boîte mail dans quelques minutes.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email" placeholder="votre@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ padding: "14px 16px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.dark, outline: "none", backgroundColor: C.bg }}
              onFocus={(e) => { e.target.style.borderColor = C.violet; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; }}
            />
            <button onClick={handleSubmit} disabled={status === "loading"} style={{
              fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em",
              padding: "14px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`,
              color: C.white, border: "none", cursor: "pointer",
              opacity: status === "loading" ? 0.7 : 1,
            }}>
              {status === "loading" ? "ENVOI EN COURS..." : "RECEVOIR LE GUIDE PDF"}
            </button>
            {status === "error" && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#DC2626", margin: 0 }}>Une erreur est survenue. Réessayez.</p>}
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: C.muted, margin: 0, textAlign: "center" }}>
              Pas de spam. Désabonnement en un clic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
function Chatbot({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ from: "bot", text: CHATBOT_STEPS[0].question }]);
  const [status, setStatus] = useState("idle");

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const currentStep = CHATBOT_STEPS[step];

  const addMessage = (text, from) => setMessages((m) => [...m, { from, text }]);

  const handleAnswer = async (value) => {
    const newAnswers = { ...answers, [currentStep.key]: value };
    setAnswers(newAnswers);
    addMessage(value, "user");
    setInput("");

    if (step < CHATBOT_STEPS.length - 1) {
      const next = CHATBOT_STEPS[step + 1];
      const nextQ = next.question.replace("{name}", newAnswers.name || "");
      setTimeout(() => addMessage(nextQ, "bot"), 400);
      setStep(step + 1);
    } else {
      // Score calculation
      const score = newAnswers.budget?.includes(">") ? 90 : newAnswers.budget?.includes("15 000") ? 70 : 40;
      setStatus("loading");
      const { error } = await supabase.from("leads").insert([{
        name: newAnswers.name, email: newAnswers.email,
        company: newAnswers.company, problem: newAnswers.problem,
        budget: newAnswers.budget, score,
      }]);
      if (error) { setStatus("error"); return; }
      setStatus("done");
      setTimeout(() => addMessage("Parfait. J'ai bien reçu vos informations. Yaovi Gilbert AMEZIAN vous recontactera dans les 24h pour discuter de votre projet.", "bot"), 400);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(28,16,39,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "0 24px 24px 0" }}>
      <div style={{ width: 380, backgroundColor: C.white, border: `1px solid ${C.border}`, boxShadow: "0 24px 80px rgba(109,40,217,0.2)", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.white }}>Assistant AmezianDigit</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>Qualification de projet</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "80%", padding: "10px 14px",
                backgroundColor: m.from === "user" ? C.violet : C.violetPale,
                color: m.from === "user" ? C.white : C.dark,
                fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, lineHeight: 1.5,
                borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {status === "done" ? (
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <button onClick={onClose} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "10px 24px", backgroundColor: C.violet, color: C.white, border: "none", cursor: "pointer" }}>
              FERMER
            </button>
          </div>
        ) : currentStep?.type === "select" ? (
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
            {currentStep.options.map((opt) => (
              <button key={opt} onClick={() => handleAnswer(opt)} style={{
                fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13,
                padding: "8px 14px", backgroundColor: C.violetPale,
                border: `1px solid ${C.border}`, color: C.dark, cursor: "pointer",
                textAlign: "left", transition: "background 0.15s",
              }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = C.violet; e.target.style.color = C.white; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = C.violetPale; e.target.style.color = C.dark; }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
            <input
              type={currentStep?.type || "text"}
              placeholder={currentStep?.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && input.trim() && handleAnswer(input.trim())}
              style={{ flex: 1, padding: "10px 14px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, outline: "none", color: C.dark }}
              onFocus={(e) => { e.target.style.borderColor = C.violet; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; }}
              autoFocus
            />
            <button onClick={() => input.trim() && handleAnswer(input.trim())} style={{ padding: "10px 16px", backgroundColor: C.violet, color: C.white, border: "none", cursor: "pointer", fontSize: 16 }}>
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ active, onChatOpen }) {
  const links = [
    { id: "hero", label: "Accueil" }, { id: "services", label: "Services" },
    { id: "expertise", label: "Expertise" }, { id: "methodologie", label: "Méthode" },
    { id: "contact", label: "Contact" },
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.3s ease", backgroundColor: scrolled ? "rgba(250,250,250,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, background: `linear-gradient(135deg, ${C.violet}, ${C.yellow})`, borderRadius: 3, transform: "rotate(45deg)" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: C.dark, letterSpacing: "0.04em" }}>
            AMEZIAN<span style={{ color: C.violet }}>DIGIT</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: active === l.id ? C.violet : C.muted, textDecoration: "none", borderBottom: active === l.id ? `2px solid ${C.yellow}` : "2px solid transparent", paddingBottom: 2 }}>
              {l.label}
            </a>
          ))}
          <a href="/blog" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, textDecoration: "none", borderBottom: "2px solid transparent", paddingBottom: 2, transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.target.style.color = C.violet; e.target.style.borderBottomColor = C.yellow; }}
            onMouseLeave={(e) => { e.target.style.color = C.muted; e.target.style.borderBottomColor = "transparent"; }}
          >
            Blog
          </a>
          <button onClick={onChatOpen} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "8px 16px", backgroundColor: C.violet, color: C.white, border: "none", cursor: "pointer" }}>
            PROJET ?
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onNewsletterOpen }) {
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", backgroundColor: C.white }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "64px 64px" }} />
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 700, height: 700, background: `radial-gradient(circle, ${C.violetPale} 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 300, height: 300, background: `radial-gradient(circle, ${C.yellowPale} 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 820 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})` }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: C.violet, textTransform: "uppercase" }}>Consultant Freelance — IRP & Optimisation Robuste</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 1.05, color: C.dark, margin: "0 0 32px 0" }}>
            Résoudre le conflit <span style={{ color: C.violet }}>Stocks</span> vs <span style={{ color: C.yellow }}>Transport</span><br />sous incertitude.
          </h1>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 18, lineHeight: 1.7, color: C.mid, maxWidth: 620, margin: "0 0 48px 0" }}>
            Les décisions logistiques optimales n'existent pas en régime déterministe. Elles se construisent dans l'incertitude, par la modélisation mathématique rigoureuse des flux, des stocks et des perturbations réelles.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#services" style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.08em", padding: "14px 32px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, color: C.white, textDecoration: "none", boxShadow: `0 4px 20px rgba(109,40,217,0.25)` }}>
              Voir les services
            </a>
            <button onClick={onNewsletterOpen} style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.08em", padding: "14px 32px", backgroundColor: C.yellow, color: C.dark, border: "none", cursor: "pointer", fontWeight: 600, boxShadow: `0 4px 20px rgba(245,158,11,0.25)` }}>
              Guide IRP gratuit
            </button>
          </div>
          <div style={{ display: "flex", gap: 48, marginTop: 72, paddingTop: 48, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
            {[{ value: "IRP", label: "Spécialisation principale" }, { value: "Python", label: "Implémentation solver" }, { value: "MIP / SP", label: "Paradigmes d'optimisation" }].map((s) => (
              <div key={s.value}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: C.violet }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ padding: "120px 0", backgroundColor: C.bgDark }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Freelance" title="Services" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 64 }}>
          {SERVICES.map((s, i) => (
            <div key={s.id} style={{ backgroundColor: C.white, padding: "48px 40px", borderTop: `3px solid ${i === 1 ? C.yellow : C.violet}`, boxShadow: "0 4px 24px rgba(109,40,217,0.07)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(109,40,217,0.13)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(109,40,217,0.07)"; }}
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: i === 1 ? C.yellow : C.violet, letterSpacing: "0.2em", marginBottom: 28, fontWeight: 600 }}>{s.number}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: C.dark, margin: "0 0 20px 0", lineHeight: 1.2 }}>{s.title}</h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: C.mid, margin: "0 0 32px 0" }}>{s.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.tags.map((t) => (
                  <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", padding: "4px 10px", backgroundColor: i === 1 ? C.yellowPale : C.violetPale, color: i === 1 ? "#92400E" : C.violet, border: `1px solid ${i === 1 ? C.borderYellow : C.border}` }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERTISE ────────────────────────────────────────────────────────────────
function ArticleCard({ article, onSelect }) {
  return (
    <div onClick={() => onSelect(article)} style={{ backgroundColor: C.white, padding: "40px", cursor: "pointer", border: `1px solid ${C.border}`, transition: "all 0.2s", boxShadow: "0 2px 12px rgba(109,40,217,0.05)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.boxShadow = "0 8px 32px rgba(109,40,217,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 2px 12px rgba(109,40,217,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: C.violet, padding: "3px 10px", border: `1px solid ${C.border}`, backgroundColor: C.violetPale }}>{article.tag}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>{article.date} — {article.readTime}</span>
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: C.dark, margin: "0 0 12px 0", lineHeight: 1.25 }}>{article.title}</h3>
      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.mid, margin: "0 0 24px 0", lineHeight: 1.6 }}>{article.subtitle}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 2, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})` }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.violet, letterSpacing: "0.1em" }}>Lire l'analyse</span>
      </div>
    </div>
  );
}

function ArticleModal({ article, onClose }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(28,16,39,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 20px", overflowY: "auto" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 760, width: "100%", backgroundColor: C.white, border: `1px solid ${C.border}`, padding: "60px", boxShadow: "0 24px 80px rgba(109,40,217,0.2)" }}>
        <button onClick={onClose} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", backgroundColor: C.violetPale, border: `1px solid ${C.border}`, color: C.violet, padding: "8px 16px", cursor: "pointer", marginBottom: 40 }}>FERMER</button>
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.violet, border: `1px solid ${C.border}`, padding: "3px 8px", backgroundColor: C.violetPale }}>{article.tag}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>{article.date} — {article.readTime}</span>
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: C.dark, margin: "0 0 12px 0", lineHeight: 1.15 }}>{article.title}</h2>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: C.violet, margin: "0 0 40px 0", fontStyle: "italic" }}>{article.subtitle}</p>
        <div style={{ borderLeft: `3px solid ${C.yellow}`, paddingLeft: 24, marginBottom: 40 }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, lineHeight: 1.8, color: C.mid, margin: 0 }}>{article.abstract}</p>
        </div>
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em", color: C.violet, marginBottom: 20, textTransform: "uppercase" }}>Points clés</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {article.keyPoints.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.yellow, flexShrink: 0, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.mid, lineHeight: 1.6 }}>{p}</span>
            </div>
          ))}
        </div>
        <div style={{ backgroundColor: C.violetPale, padding: "24px", border: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, display: "block", marginBottom: 10 }}>MÉTHODOLOGIE</span>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.mid, margin: 0, lineHeight: 1.6 }}>{article.methodology}</p>
        </div>
      </div>
    </div>
  );
}

function Expertise() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="expertise" style={{ padding: "120px 0", backgroundColor: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Blog / Recherche" title="Espace Expertise" />
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: C.mid, maxWidth: 520, margin: "16px 0 64px 0", lineHeight: 1.7 }}>
          Analyses de la littérature récente en optimisation de chaînes logistiques.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
          {ARTICLES.map((a) => <ArticleCard key={a.id} article={a} onSelect={setSelected} />)}
        </div>
      </div>
      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

// ─── METHODOLOGIE ─────────────────────────────────────────────────────────────
function Methodologie() {
  return (
    <section id="methodologie" style={{ padding: "120px 0", backgroundColor: C.dark }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Approche" title="Méthodologie" dark />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: 80, position: "relative" }}>
          {METHODOLOGY_STEPS.map((step, i) => (
            <div key={step.id} style={{ padding: "0 32px", position: "relative", zIndex: 1 }}>
              <div style={{ width: 52, height: 52, background: i === 1 ? `linear-gradient(135deg, ${C.yellow}, ${C.yellowLight})` : `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 36, boxShadow: i === 1 ? `0 4px 20px rgba(245,158,11,0.4)` : `0 4px 20px rgba(109,40,217,0.4)` }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: C.white, fontWeight: 700 }}>{step.code}</span>
              </div>
              {i < 2 && <div style={{ position: "absolute", top: 26, right: -8, zIndex: 2, width: 10, height: 10, borderTop: `2px solid ${C.yellow}`, borderRight: `2px solid ${C.yellow}`, transform: "rotate(45deg)" }} />}
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: C.white, margin: "0 0 16px 0" }}>{step.title}</h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: "0 0 24px 0" }}>{step.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {step.items.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 5, height: 5, backgroundColor: C.yellow, flexShrink: 0, borderRadius: 1 }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>{item}</span>
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

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async () => {
    if (!form.email || !form.message) return;
    setStatus("loading");
    const { error } = await supabase.from("contacts").insert([{ name: form.name, email: form.email, message: form.message }]);
    if (error) { setStatus("error"); return; }
    setStatus("success");
  };

  return (
    <section id="contact" style={{ padding: "120px 0", backgroundColor: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader tag="Contact" title="Travaillons ensemble" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 64, alignItems: "start" }}>
          <div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: C.mid, marginBottom: 48 }}>
              Vous faites face à un problème de stock cyclique, de tournées sous contraintes ou d'optimisation de votre chaîne sous incertitude ? Décrivez votre problème, je reviendrai vers vous dans les 48h.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { label: "LinkedIn", value: "linkedin.com/in/yaoviamezian", href: "https://linkedin.com/in/yaoviamezian" },
                { label: "GitHub", value: "github.com/yaogil", href: "https://github.com/yaogil" },
                { label: "Email", value: "gilbert.automatisation@gmail.com", href: "mailto:gilbert.automatisation@gmail.com" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.white, width: 72, backgroundColor: C.violet, padding: "4px 8px", textAlign: "center" }}>{l.label.toUpperCase()}</span>
                  <a href={l.href} target="_blank" rel="noreferrer" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.violet, textDecoration: "none", borderBottom: `1px solid ${C.border}`, paddingBottom: 2 }}
                    onMouseEnter={(e) => { e.target.style.color = C.yellow; }}
                    onMouseLeave={(e) => { e.target.style.color = C.violet; }}
                  >{l.value}</a>
                </div>
              ))}
            </div>
          </div>

          {status === "success" ? (
            <div style={{ backgroundColor: C.successPale, padding: "60px 48px", border: `1px solid rgba(5,150,105,0.2)` }}>
              <div style={{ width: 48, height: 3, background: `linear-gradient(90deg, ${C.success}, ${C.violet})`, marginBottom: 24 }} />
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: C.dark, margin: "0 0 12px 0" }}>Message envoyé.</h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.mid, lineHeight: 1.7, margin: 0 }}>Je reviendrai vers vous dans les 48h ouvrées.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "name", label: "Nom / Société", type: "text", placeholder: "Votre nom ou raison sociale" },
                { key: "email", label: "Email professionnel", type: "email", placeholder: "votre@email.com" },
              ].map((f) => (
                <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, textTransform: "uppercase" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, color: C.dark, padding: "14px 16px", fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = C.violet; }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, textTransform: "uppercase" }}>Décrivez votre problème</label>
                <textarea rows={5} placeholder="Type de chaîne logistique, volume, contraintes clés, objectif..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, color: C.dark, padding: "14px 16px", fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif", outline: "none", resize: "vertical" }}
                  onFocus={(e) => { e.target.style.borderColor = C.violet; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; }}
                />
              </div>
              {status === "error" && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#DC2626", margin: 0 }}>Une erreur est survenue. Réessayez.</p>}
              <button onClick={handleSubmit} disabled={status === "loading"} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.12em", padding: "16px 32px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, color: C.white, border: "none", cursor: "pointer", alignSelf: "flex-start", opacity: status === "loading" ? 0.7 : 1 }}>
                {status === "loading" ? "ENVOI..." : "ENVOYER LE MESSAGE"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ onChatOpen }) {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.dark, padding: "40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, background: `linear-gradient(135deg, ${C.violet}, ${C.yellow})`, borderRadius: 2, transform: "rotate(45deg)" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: C.white }}>AMEZIAN<span style={{ color: C.yellow }}>DIGIT</span></span>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2025 — Yaovi Gilbert AMEZIAN · IRP · Robust Optimization · Python</span>
        <button onClick={onChatOpen} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", padding: "8px 16px", backgroundColor: "transparent", border: `1px solid rgba(255,255,255,0.15)`, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
          DÉMARRER UN PROJET
        </button>
      </div>
    </footer>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
function SectionHeader({ tag, title, dark }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})` }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.violet, textTransform: "uppercase" }}>{tag}</span>
      </div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: dark ? C.white : C.dark, margin: 0, lineHeight: 1.1 }}>{title}</h2>
    </div>
  );
}

// ─── COOKIE BANNER ───────────────────────────────────────────────────────────
function CookieBanner() {
  const [status, setStatus] = useState("idle"); // idle | visible | accepted | rejected | settings
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const [marketingOn, setMarketingOn] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setTimeout(() => setStatus("visible"), 1500);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", JSON.stringify({ essential: true, analytics: true, marketing: marketingOn, date: new Date().toISOString() }));
    setStatus("accepted");
  };

  const reject = () => {
    localStorage.setItem("cookie_consent", JSON.stringify({ essential: true, analytics: false, marketing: false, date: new Date().toISOString() }));
    setStatus("rejected");
  };

  const saveSettings = () => {
    localStorage.setItem("cookie_consent", JSON.stringify({ essential: true, analytics: analyticsOn, marketing: marketingOn, date: new Date().toISOString() }));
    setStatus("accepted");
  };

  if (status === "idle" || status === "accepted" || status === "rejected") return null;

  if (status === "settings") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, backgroundColor: "rgba(28,16,39,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 0 0" }}>
      <div style={{ width: "100%", maxWidth: 560, backgroundColor: C.white, border: `1px solid ${C.border}`, borderBottom: "none", padding: "40px 40px 32px", boxShadow: "0 -8px 40px rgba(109,40,217,0.15)" }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: C.dark, margin: "0 0 8px 0" }}>Paramètres des cookies</h3>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.muted, margin: "0 0 24px 0", lineHeight: 1.6 }}>
          Personnalisez vos préférences. Les cookies essentiels ne peuvent pas être désactivés — ils assurent le bon fonctionnement du site.
        </p>

        {[
          { key: "essential", label: "Essentiels", desc: "Formulaires, sécurité, session. Toujours actifs.", forced: true, value: true },
          { key: "analytics", label: "Analytiques", desc: "Mesure d'audience anonymisée (visites, pages vues).", forced: false, value: analyticsOn, set: setAnalyticsOn },
          { key: "marketing", label: "Marketing", desc: "Personnalisation du contenu et suivi des conversions.", forced: false, value: marketingOn, set: setMarketingOn },
        ].map((c) => (
          <div key={c.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: C.dark, letterSpacing: "0.08em" }}>{c.label}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.muted, marginTop: 3 }}>{c.desc}</div>
            </div>
            <button
              onClick={() => !c.forced && c.set(!c.value)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: c.forced ? "not-allowed" : "pointer",
                backgroundColor: c.value ? C.violet : "#D1D5DB",
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: C.white, position: "absolute", top: 3, left: c.value ? 23 : 3, transition: "left 0.2s" }} />
            </button>
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={saveSettings} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "12px 24px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, color: C.white, border: "none", cursor: "pointer", flex: 1 }}>
            ENREGISTRER MES CHOIX
          </button>
          <button onClick={() => setStatus("visible")} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "12px 20px", backgroundColor: "transparent", color: C.muted, border: `1px solid ${C.border}`, cursor: "pointer" }}>
            RETOUR
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 400, backgroundColor: C.white, borderTop: `3px solid ${C.violet}`, boxShadow: "0 -8px 40px rgba(109,40,217,0.12)", padding: "20px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, backgroundColor: C.violet, borderRadius: 1, transform: "rotate(45deg)" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: C.violet, letterSpacing: "0.1em" }}>COOKIES & CONFIDENTIALITÉ</span>
          </div>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.mid, margin: 0, lineHeight: 1.6 }}>
            Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic. Vos données ne sont jamais vendues à des tiers.{" "}
            <a href="mailto:gilbert.automatisation@gmail.com" style={{ color: C.violet, textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>
              Politique de confidentialité
            </a>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={() => setStatus("settings")} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "10px 18px", backgroundColor: "transparent", color: C.muted, border: `1px solid ${C.border}`, cursor: "pointer" }}>
            PARAMÉTRER
          </button>
          <button onClick={reject} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "10px 18px", backgroundColor: "transparent", color: C.dark, border: `1px solid ${C.border}`, cursor: "pointer" }}>
            REFUSER
          </button>
          <button onClick={accept} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "10px 24px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, color: C.white, border: "none", cursor: "pointer", boxShadow: `0 4px 16px rgba(109,40,217,0.3)` }}>
            ACCEPTER TOUT
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  useSEO('home');
  const active = useActiveSection(["hero", "services", "expertise", "methodologie", "contact"]);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // Show newsletter popup after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowNewsletter(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background-color: #FAFAFA; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #F3F0FF; }
        ::-webkit-scrollbar-thumb { background: #6D28D9; }
        @media (max-width: 768px) {
          nav > div > div:last-child { display: none; }
          section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>

      {/* Chatbot FAB */}
      <button onClick={() => setShowChatbot(true)} style={{
        position: "fixed", bottom: 96, right: 28, zIndex: 150,
        width: 56, height: 56, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`,
        border: "none", cursor: "pointer", color: C.white, fontSize: 22,
        boxShadow: "0 8px 32px rgba(109,40,217,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        💬
      </button>

      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", backgroundColor: C.bg, minHeight: "100vh" }}>
        <Nav active={active} onChatOpen={() => setShowChatbot(true)} />
        <Hero onNewsletterOpen={() => setShowNewsletter(true)} />
        <Services />
        <Expertise />
        <Methodologie />
        <Contact />
        <Footer onChatOpen={() => setShowChatbot(true)} />
      </div>

      {showNewsletter && <NewsletterPopup onClose={() => setShowNewsletter(false)} />}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      <CookieBanner />
    </>
  );
}