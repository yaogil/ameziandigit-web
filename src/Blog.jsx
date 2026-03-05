import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const C = {
  bg: "#FAFAFA", bgDark: "#F3F0FF",
  violet: "#6D28D9", violetLight: "#7C3AED", violetPale: "#EDE9FE",
  yellow: "#F59E0B", yellowPale: "#FFFBEB",
  dark: "#1C1027", mid: "#4B3F6B", muted: "#8B7BA8", white: "#FFFFFF",
  border: "rgba(109,40,217,0.12)", borderYellow: "rgba(245,158,11,0.3)",
};

const CATEGORIES = ["Tous", "Supply Chain", "Veille IA & Data", "Tutoriel Python", "Cas client"];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function ArticleFull({ post, onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 32px" }}>
      <button onClick={onBack} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", backgroundColor: C.violetPale, border: `1px solid ${C.border}`, color: C.violet, padding: "8px 16px", cursor: "pointer", marginBottom: 40 }}>
        ← RETOUR AU BLOG
      </button>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.violet, border: `1px solid ${C.border}`, padding: "3px 10px", backgroundColor: C.violetPale }}>{post.category}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>{formatDate(post.published_at)} — {post.read_time}</span>
      </div>

      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", color: C.dark, margin: "0 0 16px 0", lineHeight: 1.15 }}>
        {post.title}
      </h1>

      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 17, color: C.violet, margin: "0 0 40px 0", fontStyle: "italic", lineHeight: 1.6 }}>
        {post.excerpt}
      </p>

      <div style={{ width: "100%", height: 4, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})`, marginBottom: 40 }} />

      {/* Article content rendered as paragraphs */}
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: C.mid, lineHeight: 1.85 }}>
        {post.content.split("\n\n").map((para, i) => {
          if (para.startsWith("## ")) {
            return <h2 key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: C.dark, margin: "36px 0 16px 0" }}>{para.replace("## ", "")}</h2>;
          }
          if (para.startsWith("### ")) {
            return <h3 key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: C.violet, margin: "28px 0 12px 0" }}>{para.replace("### ", "")}</h3>;
          }
          if (para.startsWith("- ")) {
            return (
              <ul key={i} style={{ margin: "12px 0 16px 0", paddingLeft: 0, listStyle: "none" }}>
                {para.split("\n").map((item, j) => (
                  <li key={j} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                    <span style={{ color: C.yellow, fontWeight: 700, flexShrink: 0 }}>—</span>
                    <span>{item.replace("- ", "")}</span>
                  </li>
                ))}
              </ul>
            );
          }
          if (para.startsWith("> ")) {
            return (
              <blockquote key={i} style={{ borderLeft: `3px solid ${C.yellow}`, paddingLeft: 20, margin: "24px 0", color: C.dark, fontStyle: "italic", fontSize: 17 }}>
                {para.replace("> ", "")}
              </blockquote>
            );
          }
          return <p key={i} style={{ marginBottom: 20 }}>{para}</p>;
        })}
      </div>

      {/* Author block */}
      <div style={{ marginTop: 60, padding: "32px", backgroundColor: C.violetPale, border: `1px solid ${C.border}`, display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${C.violet}, ${C.yellow})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: C.white }}>YA</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark }}>{post.author}</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.muted, marginTop: 4 }}>
            Consultant Freelance — IRP & Optimisation Robuste · ameziandigit.com
          </div>
        </div>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", padding: "4px 12px", backgroundColor: C.yellowPale, color: "#92400E", border: `1px solid ${C.borderYellow}` }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onSelect }) {
  return (
    <div onClick={() => onSelect(post)} style={{ backgroundColor: C.white, cursor: "pointer", border: `1px solid ${C.border}`, transition: "all 0.2s", overflow: "hidden" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(109,40,217,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Color bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${post.cover_color || C.violet}, ${C.yellow})` }} />

      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.violet, padding: "3px 10px", border: `1px solid ${C.border}`, backgroundColor: C.violetPale, letterSpacing: "0.1em" }}>
            {post.category}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>{post.read_time}</span>
        </div>

        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: C.dark, margin: "0 0 12px 0", lineHeight: 1.25 }}>
          {post.title}
        </h3>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.mid, margin: "0 0 24px 0", lineHeight: 1.6 }}>
          {post.excerpt}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>{formatDate(post.published_at)}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 16, height: 2, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})` }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.violet }}>Lire</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("Tous");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const filtered = posts.filter((p) => {
    const matchCat = category === "Tous" || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selected) return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", paddingTop: 80 }}>
      <ArticleFull post={selected} onBack={() => setSelected(null)} />
    </div>
  );

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ backgroundColor: C.dark, padding: "100px 32px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(109,40,217,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(109,40,217,0.06) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <a href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.1em" }}>ACCUEIL</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.yellow, letterSpacing: "0.1em" }}>BLOG</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 16px 0", lineHeight: 1.1 }}>
            Actualités &<br /><span style={{ color: C.yellow }}>Veille Tech</span>
          </h1>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: 0, lineHeight: 1.7 }}>
            Supply Chain, IA & Data, Optimisation — analyses et insights publiés par Yaovi Gilbert AMEZIAN.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: "20px 32px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <input
            type="text" placeholder="Rechercher un article..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 14px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.dark, outline: "none", width: 240, backgroundColor: C.bg }}
            onFocus={(e) => { e.target.style.borderColor = C.violet; }}
            onBlur={(e) => { e.target.style.borderColor = C.border; }}
          />
          {/* Category filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em",
                padding: "6px 14px", cursor: "pointer", border: `1px solid ${category === cat ? C.violet : C.border}`,
                backgroundColor: category === cat ? C.violet : "transparent",
                color: category === cat ? C.white : C.muted,
                transition: "all 0.15s",
              }}>
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 32px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.muted, letterSpacing: "0.1em" }}>CHARGEMENT...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: C.dark, marginBottom: 12 }}>Aucun article trouvé</div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.muted }}>
              {search ? `Aucun résultat pour "${search}"` : "Les articles seront publiés prochainement."}
            </p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, letterSpacing: "0.1em", marginBottom: 32 }}>
              {filtered.length} ARTICLE{filtered.length > 1 ? "S" : ""}
            </div>
            {/* Featured first post */}
            {filtered[0] && category === "Tous" && !search && (
              <div onClick={() => setSelected(filtered[0])} style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, cursor: "pointer", marginBottom: 24, overflow: "hidden", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.boxShadow = "0 12px 40px rgba(109,40,217,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ height: 6, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})` }} />
                <div style={{ padding: "48px" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.yellow, padding: "3px 10px", backgroundColor: C.yellowPale, border: `1px solid ${C.borderYellow}`, letterSpacing: "0.15em" }}>À LA UNE</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.violet, padding: "3px 10px", border: `1px solid ${C.border}`, backgroundColor: C.violetPale }}>{filtered[0].category}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>{filtered[0].read_time}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)", color: C.dark, margin: "0 0 16px 0", lineHeight: 1.2, maxWidth: 700 }}>
                    {filtered[0].title}
                  </h2>
                  <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: C.mid, margin: "0 0 24px 0", lineHeight: 1.7, maxWidth: 680 }}>
                    {filtered[0].excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 2, background: `linear-gradient(90deg, ${C.violet}, ${C.yellow})` }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.violet, letterSpacing: "0.1em" }}>LIRE L'ARTICLE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining posts grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {(category === "Tous" && !search ? filtered.slice(1) : filtered).map((post) => (
                <PostCard key={post.id} post={post} onSelect={setSelected} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer mini */}
      <div style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.dark, padding: "24px 32px", textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          © 2025 — Yaovi Gilbert AMEZIAN · ameziandigit.com
        </span>
      </div>
    </div>
  );
}
