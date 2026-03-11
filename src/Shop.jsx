import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const C = {
  bg: "#FAFAFA", bgDark: "#F3F0FF",
  violet: "#6D28D9", violetLight: "#7C3AED", violetPale: "#EDE9FE",
  yellow: "#F59E0B", yellowLight: "#FCD34D", yellowPale: "#FFFBEB",
  dark: "#1C1027", mid: "#4B3F6B", muted: "#8B7BA8", white: "#FFFFFF",
  border: "rgba(109,40,217,0.12)", borderYellow: "rgba(245,158,11,0.3)",
  success: "#059669", successPale: "#ECFDF5",
};

// ─── CATALOGUE PRODUITS ───────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "guide-01",
    type: "pdf",
    badge: "BEST-SELLER",
    badgeColor: C.yellow,
    number: "01",
    title: "Gérer son Stock & Prévoir la Demande",
    subtitle: "Guide complet avec formules, Excel et cas pratique 50 références",
    price: 29,
    pages: 35,
    level: "Débutant — Intermédiaire",
    tags: ["Stock de sécurité", "EOQ", "Prévision", "Excel"],
    points: [
      "4 méthodes de prévision de la demande (Moyenne mobile, Lissage exp., Holt-Winters, ML)",
      "Formule complète du stock de sécurité avec application numérique",
      "Calcul EOQ — quantité économique de commande",
      "Tableau de bord Excel clé en main + cas pratique 50 références",
      "Plan d'action 30 jours prêt à l'emploi",
    ],
    color: C.violet,
    supabase_file: "guide-01-stock-prevision.pdf",
  },
  {
    id: "guide-02",
    type: "pdf+xlsx",
    badge: "INCLUS : EXCEL",
    badgeColor: C.violet,
    number: "02",
    title: "Template Planification Commandes Fournisseurs",
    subtitle: "Calendrier 12 mois, EOQ automatique, alertes multi-fournisseurs",
    price: 19,
    pages: 25,
    level: "Intermédiaire",
    tags: ["EOQ", "Calendrier", "Multi-fournisseurs", "Alertes"],
    points: [
      "Référentiel fournisseurs complet (lead time, MOQ, conditions)",
      "Calcul EOQ automatique pour 10+ références",
      "Calendrier visuel des commandes sur 12 mois glissants",
      "Formule de date de commande = Date besoin - Lead Time - Jours sécurité",
      "Template Excel directement opérationnel",
    ],
    color: C.violet,
    supabase_file: "guide-02-planification.pdf",
  },
  {
    id: "guide-03",
    type: "pdf",
    badge: "TECHNIQUE",
    badgeColor: C.mid,
    number: "03",
    title: "Dashboard Power BI Logistique",
    subtitle: "10 KPI préconfigurés — fichier .pbix + guide DAX complet",
    price: 39,
    pages: 28,
    level: "Intermédiaire",
    tags: ["Power BI", "DAX", "KPI", ".pbix"],
    points: [
      "10 KPI opérationnels : OTIF, Rupture, Rotation, Délai, NPS...",
      "Modèle en étoile (Fact/Dim) clé en main",
      "20+ formules DAX documentées et expliquées",
      "Connexion à Excel, SQL Server, ERP ou Google Sheets",
      "Guide d'actualisation automatique",
    ],
    color: C.violet,
    supabase_file: "guide-03-dashboard-powerbi.pdf",
  },
  {
    id: "guide-04",
    type: "pdf",
    badge: null,
    badgeColor: null,
    number: "04",
    title: "Python pour la Logistique",
    subtitle: "5 scripts prêts à l'emploi — nettoyage, prévision, rapports, alertes",
    price: 29,
    pages: 30,
    level: "Débutant",
    tags: ["Python", "Automation", "Alertes email", "Dashboard Plotly"],
    points: [
      "Script 1 : Nettoyage automatique Excel (doublons, valeurs manquantes, types)",
      "Script 2 : Prévision demande par lissage exponentiel pour tous vos SKUs",
      "Script 3 : Rapport hebdomadaire automatique",
      "Script 4 : Alertes email automatiques quand stock < point de commande",
      "Script 5 : Dashboard interactif Plotly en HTML",
    ],
    color: C.violet,
    supabase_file: "guide-04-python.pdf",
  },
  {
    id: "guide-05",
    type: "pdf",
    badge: "LEAD MAGNET",
    badgeColor: C.success,
    number: "05",
    title: "Checklist Audit Logistique Express",
    subtitle: "50 points de contrôle en 5 domaines — score et plan d'action",
    price: 9,
    pages: 18,
    level: "Tous niveaux",
    tags: ["Audit", "Checklist", "Score", "Plan d'action"],
    points: [
      "5 domaines : Stocks, Prévision, Transport, Entrepôt, SI",
      "50 points notés de 0 à 2 — score sur 100",
      "Interprétation automatique : Critique / Fragile / Performant / Excellence",
      "Plan d'action prioritaire basé sur vos 3 scores les plus faibles",
      "Idéal pour un audit express en 2h",
    ],
    color: "#059669",
    supabase_file: "guide-05-checklist.pdf",
  },
  {
    id: "guide-06",
    type: "pdf",
    badge: null,
    badgeColor: null,
    number: "06",
    title: "Supply Chain Résiliente",
    subtitle: "5 leviers pour résister aux crises — pandémies, pénuries, géopolitique",
    price: 29,
    pages: 30,
    level: "Intermédiaire — Avancé",
    tags: ["Résilience", "Risques", "Disruptions", "Continuité"],
    points: [
      "Cartographie et scoring de tous vos risques supply chain",
      "Stratégie dual-sourcing et diversification géographique",
      "Calcul du stock tampon en cas de disruption",
      "4 niveaux de visibilité bout-en-bout",
      "Plan de continuité pour 4 scénarios de crise",
    ],
    color: C.violet,
    supabase_file: "guide-06-resilience.pdf",
  },
  {
    id: "guide-07",
    type: "pdf+xlsx",
    badge: "INCLUS : EXCEL",
    badgeColor: C.violet,
    number: "07",
    title: "Analyse ABC-XYZ",
    subtitle: "Segmentez votre stock pour concentrer vos efforts là où ça compte",
    price: 19,
    pages: 26,
    level: "Intermédiaire",
    tags: ["ABC", "XYZ", "Segmentation", "Pareto"],
    points: [
      "Analyse ABC : classement par valeur de consommation (loi de Pareto)",
      "Analyse XYZ : coefficient de variation pour mesurer la régularité",
      "Matrice croisée ABC×XYZ : 9 segments avec actions spécifiques",
      "Cas pratique : -15.3% de capital immobilisé sur 200 références",
      "Excel automatisé : saisissez vos ventes → résultats instantanés",
    ],
    color: C.violet,
    supabase_file: "guide-07-abc-xyz.pdf",
  },
  {
    id: "guide-08",
    type: "pdf",
    badge: "PACK COMPLET",
    badgeColor: "#7C3AED",
    number: "08",
    title: "Pack Freelance Logistique",
    subtitle: "Tout pour lancer votre activité de consultant supply chain",
    price: 49,
    pages: 32,
    level: "Débutant — Intermédiaire",
    tags: ["Freelance", "Tarifs", "Clients", "Contrat"],
    points: [
      "Grille tarifaire complète selon profil (250 à 1 500 €/j)",
      "Canal d'acquisition : LinkedIn, réseau, Malt, blog/SEO",
      "Pitch 30 secondes + exemple complet",
      "Structure de proposition commerciale en 6 sections",
      "Modèle de contrat + clauses indispensables inclus",
    ],
    color: "#7C3AED",
    supabase_file: "guide-08-freelance.pdf",
  },
  // Templates Excel
  {
    id: "template-01",
    type: "xlsx",
    badge: "TEMPLATE EXCEL",
    badgeColor: "#059669",
    number: "T1",
    title: "Template Gestion Stock & Stock de Sécurité",
    subtitle: "Formules SS, EOQ, alertes statut — 20 références prêtes à l'emploi",
    price: 19,
    pages: null,
    level: "Tous niveaux",
    tags: ["Excel", "Formules", "Dashboard", "Alertes"],
    points: [
      "3 onglets : DONNEES (formules) + DASHBOARD (alertes) + PARAMETRES",
      "Calcul automatique SS, Point de commande, EOQ, Couverture pour 20 SKUs",
      "Statut auto : RUPTURE / CRITIQUE / COMMANDER / OK avec mise en forme conditionnelle",
      "Dashboard avec KPI et top 20 alertes classées par urgence",
      "Cellules bleues = saisie | Cellules noires = formules automatiques",
    ],
    color: "#059669",
    supabase_file: "Template01_Gestion_Stock_Securite.xlsx",
  },
  {
    id: "template-02",
    type: "xlsx",
    badge: "TEMPLATE EXCEL",
    badgeColor: "#059669",
    number: "T2",
    title: "Template Planification Commandes Fournisseurs",
    subtitle: "EOQ automatique + calendrier 12 mois + référentiel fournisseurs",
    price: 19,
    pages: null,
    level: "Tous niveaux",
    tags: ["Excel", "EOQ", "Calendrier", "Fournisseurs"],
    points: [
      "3 onglets : FOURNISSEURS + CALCUL EOQ + CALENDRIER 12 MOIS",
      "EOQ calculé automatiquement pour 10 références",
      "Calendrier visuel des commandes (CMDE) sur 12 mois glissants",
      "Coût total annuel = (D/EOQ)×Co + (EOQ/2)×Ch calculé automatiquement",
      "Extensible à votre catalogue complet",
    ],
    color: "#059669",
    supabase_file: "Template02_Planification_Commandes.xlsx",
  },
  {
    id: "template-03",
    type: "xlsx",
    badge: "TEMPLATE EXCEL",
    badgeColor: "#059669",
    number: "T3",
    title: "Template Analyse ABC-XYZ",
    subtitle: "Classement automatique ABC + XYZ + matrice croisée — 20 références",
    price: 19,
    pages: null,
    level: "Tous niveaux",
    tags: ["Excel", "ABC", "XYZ", "Segmentation"],
    points: [
      "4 onglets : VENTES + ANALYSE ABC + ANALYSE XYZ + MATRICE ABC-XYZ",
      "Classement ABC par LARGE() — automatique sans tri manuel",
      "CV calculé via AVERAGE/STDEV → classe X/Y/Z automatique",
      "Matrice croisée VLOOKUP entre les deux analyses",
      "Mise en forme conditionnelle : rouge/orange/vert selon segment",
    ],
    color: "#059669",
    supabase_file: "Template03_Analyse_ABC_XYZ.xlsx",
  },
  {
    id: "template-04",
    type: "xlsx",
    badge: "TEMPLATE EXCEL",
    badgeColor: "#059669",
    number: "T4",
    title: "Template Dashboard KPI Logistique",
    subtitle: "10 KPI calculés automatiquement + dashboard visuel + tendances",
    price: 19,
    pages: null,
    level: "Tous niveaux",
    tags: ["Excel", "KPI", "Dashboard", "OTIF"],
    points: [
      "3 onglets : DONNEES KPI + KPI CALCULES + DASHBOARD VISUEL",
      "OTIF, Rupture, Rotation, Délai, Coût/commande, NPS — tout calculé",
      "Dashboard : 5 cartes KPI + tableau 12 mois avec tendances ▲▼",
      "Niveau global : BON / A AMELIORER / CRITIQUE automatique",
      "12 mois d'exemple prêts à remplacer par vos données",
    ],
    color: "#059669",
    supabase_file: "Template04_Dashboard_KPI_Logistique.xlsx",
  },
];

const FILTERS = [
  { id: "all", label: "Tout le catalogue" },
  { id: "pdf", label: "Guides PDF" },
  { id: "xlsx", label: "Templates Excel" },
  { id: "pdf+xlsx", label: "PDF + Excel" },
];

// ─── PURCHASE MODAL ───────────────────────────────────────────────────────────
function PurchaseModal({ product, onClose }) {
  const [step, setStep] = useState("info"); // info | form | success
  const [form, setForm] = useState({ name: "", email: "", payment: "card" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handlePurchase = async () => {
    if (!form.email || !form.name) return;
    setLoading(true);
    // Enregistrer la commande dans Supabase
    const { error } = await supabase.from("leads").insert([{
      name: form.name,
      email: form.email,
      problem: `Achat : ${product.title}`,
      budget: `${product.price} €`,
      score: 95,
      company: "Boutique AmezianDigit",
    }]);
    setLoading(false);
    setStep("success");
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        backgroundColor: "rgba(28,16,39,0.8)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 540, width: "100%", backgroundColor: C.white,
          border: `1px solid ${C.border}`, boxShadow: "0 32px 80px rgba(109,40,217,0.25)",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div style={{
          background: `linear-gradient(135deg, ${product.color || C.violet}, ${C.violetLight})`,
          padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em" }}>
              {product.type === "xlsx" ? "TEMPLATE EXCEL" : "GUIDE PDF"}
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: C.white, marginTop: 2 }}>
              {product.title}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: C.yellow,
            }}>{product.price} €</span>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer" }}>×</button>
          </div>
        </div>

        <div style={{ padding: "32px 28px" }}>
          {step === "info" && (
            <>
              <div style={{ marginBottom: 24 }}>
                {product.points.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 20, height: 20, background: `linear-gradient(135deg, ${product.color || C.violet}, ${C.yellow})`, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: C.white, fontSize: 10, fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.mid, lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "12px 16px", backgroundColor: C.bgDark, border: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.violet }}>🔒 Paiement sécurisé · Livraison immédiate par email · Satisfait ou remboursé 7j</span>
              </div>

              <button
                onClick={() => setStep("form")}
                style={{
                  width: "100%", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em",
                  padding: "16px", background: `linear-gradient(135deg, ${product.color || C.violet}, ${C.violetLight})`,
                  color: C.white, border: "none", cursor: "pointer", fontWeight: 600,
                }}
              >
                COMMANDER — {product.price} €
              </button>
            </>
          )}

          {step === "form" && (
            <>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.mid, marginBottom: 24, lineHeight: 1.6 }}>
                Renseignez vos coordonnées. Le fichier vous sera envoyé immédiatement par email après confirmation de paiement.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { key: "name", label: "Nom / Société", placeholder: "Votre nom", type: "text" },
                  { key: "email", label: "Email", placeholder: "votre@email.com", type: "email" },
                ].map(f => (
                  <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.violet, letterSpacing: "0.12em" }}>{f.label.toUpperCase()}</label>
                    <input
                      type={f.type} placeholder={f.placeholder} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{
                        padding: "12px 14px", border: `1px solid ${C.border}`,
                        fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.dark, outline: "none",
                      }}
                      onFocus={e => { e.target.style.borderColor = C.violet; }}
                      onBlur={e => { e.target.style.borderColor = C.border; }}
                    />
                  </div>
                ))}

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.violet, letterSpacing: "0.12em" }}>MÉTHODE DE PAIEMENT</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { id: "card", label: "💳 Carte bancaire" },
                      { id: "paypal", label: "🅿️ PayPal" },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setForm({ ...form, payment: p.id })}
                        style={{
                          flex: 1, padding: "10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13,
                          border: `2px solid ${form.payment === p.id ? C.violet : C.border}`,
                          backgroundColor: form.payment === p.id ? C.violetPale : C.white,
                          color: form.payment === p.id ? C.violet : C.muted, cursor: "pointer",
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", backgroundColor: C.dark,
                }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Total</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: C.yellow }}>{product.price} €</span>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={loading || !form.email || !form.name}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em",
                    padding: "16px", background: `linear-gradient(135deg, ${product.color || C.violet}, ${C.violetLight})`,
                    color: C.white, border: "none", cursor: "pointer",
                    opacity: loading || !form.email || !form.name ? 0.6 : 1,
                  }}
                >
                  {loading ? "TRAITEMENT EN COURS..." : `PAYER ${product.price} € — RECEVOIR LE FICHIER`}
                </button>
              </div>
            </>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.success}, ${C.violet})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
              }}>
                <span style={{ fontSize: 28 }}>✓</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, marginBottom: 12 }}>
                Commande enregistrée !
              </h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.mid, lineHeight: 1.7, marginBottom: 24 }}>
                Merci {form.name}. Votre fichier <strong>{product.title}</strong> vous sera envoyé à <strong>{form.email}</strong> sous quelques minutes.
              </p>
              <div style={{ backgroundColor: C.violetPale, padding: "14px 18px", marginBottom: 20 }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.violet, margin: 0 }}>
                  📧 Vérifiez aussi vos spams · Délai : 2 à 5 minutes
                </p>
              </div>
              <button onClick={onClose} style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em",
                padding: "12px 32px", backgroundColor: C.violet, color: C.white, border: "none", cursor: "pointer",
              }}>
                FERMER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onSelect }) {
  const [hovered, setHovered] = useState(false);

  const typeLabel = product.type === "xlsx"
    ? "📊 Template Excel"
    : product.type === "pdf+xlsx"
    ? "📄 PDF + 📊 Excel"
    : "📄 Guide PDF";

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: C.white,
        border: `1px solid ${hovered ? (product.color || C.violet) : C.border}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 48px rgba(109,40,217,0.15)` : "0 2px 12px rgba(109,40,217,0.05)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderTop: `3px solid ${product.color || C.violet}`,
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          backgroundColor: product.badgeColor,
          padding: "3px 8px",
        }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.12em", color: C.white, fontWeight: 700 }}>
            {product.badge}
          </span>
        </div>
      )}

      <div style={{ padding: "28px 28px 0" }}>
        {/* Number + type */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: C.white, backgroundColor: product.color || C.violet,
            padding: "4px 10px", letterSpacing: "0.1em", fontWeight: 700,
          }}>
            {product.number}
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, letterSpacing: "0.08em" }}>
            {typeLabel}
          </span>
          {product.pages && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>
              · {product.pages}p
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18,
          color: C.dark, margin: "0 0 8px 0", lineHeight: 1.25,
        }}>
          {product.title}
        </h3>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.mid,
          margin: "0 0 20px 0", lineHeight: 1.5,
        }}>
          {product.subtitle}
        </p>

        {/* 3 key points */}
        <div style={{ marginBottom: 20 }}>
          {product.points.slice(0, 3).map((pt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 4, height: 4, backgroundColor: product.color || C.violet, borderRadius: 2, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.mid, lineHeight: 1.5 }}>{pt}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {product.tags.map(t => (
            <span key={t} style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.08em",
              padding: "3px 8px",
              backgroundColor: product.type === "xlsx" ? "#ECFDF5" : C.violetPale,
              color: product.type === "xlsx" ? "#059669" : C.violet,
              border: `1px solid ${product.type === "xlsx" ? "rgba(5,150,105,0.2)" : C.border}`,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Footer price */}
      <div style={{
        marginTop: "auto",
        padding: "16px 28px",
        borderTop: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backgroundColor: hovered ? (product.type === "xlsx" ? "#ECFDF5" : C.violetPale) : C.bg,
        transition: "background 0.2s",
      }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: product.color || C.violet }}>
            {product.price} €
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: "0.08em" }}>
            {product.level}
          </div>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em",
          padding: "8px 16px",
          background: hovered ? `linear-gradient(135deg, ${product.color || C.violet}, ${C.violetLight})` : "transparent",
          color: hovered ? C.white : (product.color || C.violet),
          border: `1px solid ${product.color || C.violet}`,
          transition: "all 0.2s",
        }}>
          {hovered ? "COMMANDER →" : "VOIR LE DÉTAIL"}
        </div>
      </div>
    </div>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────────────────────
export default function Shop() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = filter === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.type === filter || (filter === "pdf" && p.type === "pdf") || (filter === "xlsx" && p.type === "xlsx") || (filter === "pdf+xlsx" && p.type === "pdf+xlsx"));

  const guides = filtered.filter(p => p.type === "pdf" || p.type === "pdf+xlsx");
  const templates = filtered.filter(p => p.type === "xlsx");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <section id="shop" style={{ paddingTop: 120, paddingBottom: 120, backgroundColor: C.bg, fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>

          {/* Header */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})` }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.violet, textTransform: "uppercase" }}>
                Boutique Digitale
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: C.dark, lineHeight: 1.1 }}>
                  Guides & Templates
                </h2>
                <p style={{ fontSize: 16, color: C.mid, maxWidth: 540, lineHeight: 1.7, marginTop: 12 }}>
                  Outils pratiques et immédiatement opérationnels pour optimiser votre supply chain.
                  Formules réelles, données d'exemple, livraison instantanée par email.
                </p>
              </div>
              {/* Trust signals */}
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { icon: "📧", label: "Livraison email immédiate" },
                  { icon: "🔒", label: "Paiement sécurisé" },
                  { icon: "↩️", label: "Satisfait ou remboursé 7j" },
                ].map(t => (
                  <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em",
                  padding: "8px 18px",
                  backgroundColor: filter === f.id ? C.violet : C.white,
                  color: filter === f.id ? C.white : C.muted,
                  border: `1px solid ${filter === f.id ? C.violet : C.border}`,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Guides PDF section */}
          {guides.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, ${C.violet}, transparent)` }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.violet }}>
                  GUIDES PDF — {guides.length} ressources
                </span>
                <div style={{ height: 2, flex: 1, background: `linear-gradient(270deg, ${C.violet}, transparent)` }} />
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 24, marginBottom: 64,
              }}>
                {guides.map(p => (
                  <ProductCard key={p.id} product={p} onSelect={setSelected} />
                ))}
              </div>
            </>
          )}

          {/* Templates Excel section */}
          {templates.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, #059669, transparent)` }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#059669" }}>
                  TEMPLATES EXCEL — {templates.length} fichiers
                </span>
                <div style={{ height: 2, flex: 1, background: `linear-gradient(270deg, #059669, transparent)` }} />
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 24,
              }}>
                {templates.map(p => (
                  <ProductCard key={p.id} product={p} onSelect={setSelected} />
                ))}
              </div>
            </>
          )}

          {/* Pack promo */}
          <div style={{
            marginTop: 80, padding: "48px 56px",
            background: `linear-gradient(135deg, ${C.dark} 0%, #2D1F3E 100%)`,
            border: `2px solid ${C.yellow}`,
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32,
          }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.yellow, marginBottom: 12 }}>
                OFFRE DÉCOUVERTE — ÉCONOMISEZ 30%
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: C.white, marginBottom: 8 }}>
                Pack Complet — 8 Guides + 4 Templates
              </h3>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                L'intégralité du catalogue AmezianDigit. Valeur : 240 €.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 42, color: C.yellow }}>
                169 €
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                au lieu de 240 €
              </div>
              <button
                onClick={() => window.location.href = "mailto:gilbert.automatisation@gmail.com?subject=Pack Complet AmezianDigit"}
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em",
                  padding: "14px 32px", backgroundColor: C.yellow, color: C.dark,
                  border: "none", cursor: "pointer", fontWeight: 700,
                  boxShadow: `0 4px 20px rgba(245,158,11,0.4)`,
                }}
              >
                COMMANDER LE PACK →
              </button>
            </div>
          </div>

          {/* Mission CTA */}
          <div style={{ marginTop: 64, padding: "40px 48px", backgroundColor: C.bgDark, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet }}>VOUS AVEZ UN PROJET SPÉCIFIQUE ?</span>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: C.mid, marginTop: 6, lineHeight: 1.6 }}>
                Ces templates ne couvrent pas votre problème ? Je peux les adapter à votre contexte ou vous proposer une mission freelance sur mesure.
              </p>
            </div>
            <a
              href="mailto:gilbert.automatisation@gmail.com"
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em",
                padding: "12px 24px", backgroundColor: "transparent",
                color: C.violet, border: `1px solid ${C.violet}`,
                textDecoration: "none", flexShrink: 0,
              }}
            >
              CONTACTER GILBERT →
            </a>
          </div>
        </div>
      </section>

      {selected && <PurchaseModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
