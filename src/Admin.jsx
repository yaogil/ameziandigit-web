import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = "amezian2025";

const C = {
  bg: "#FAFAFA", bgDark: "#F3F0FF",
  violet: "#6D28D9", violetLight: "#7C3AED", violetPale: "#EDE9FE",
  yellow: "#F59E0B", yellowPale: "#FFFBEB",
  dark: "#1C1027", mid: "#4B3F6B", muted: "#8B7BA8", white: "#FFFFFF",
  border: "rgba(109,40,217,0.12)", success: "#059669", successPale: "#ECFDF5",
  danger: "#DC2626", dangerPale: "#FEF2F2",
};

const CATEGORIES = ["Supply Chain", "Veille IA & Data", "Tutoriel Python", "Cas client"];

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const emptyForm = {
  title: "", slug: "", excerpt: "", content: "",
  category: "Supply Chain", tags: "", read_time: "5 min",
  cover_color: "#6D28D9", published: false,
};

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("list"); // list | new | edit
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (auth) fetchPosts();
  }, [auth]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuth(true); setAuthError(""); }
    else setAuthError("Mot de passe incorrect.");
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return showToast("Titre et contenu obligatoires.", "error");
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      published_at: new Date().toISOString(),
    };
    let error;
    if (editId) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("blog_posts").insert([payload]));
    }
    setSaving(false);
    if (error) { showToast("Erreur : " + error.message, "error"); return; }
    showToast(editId ? "Article mis à jour." : "Article publié.");
    fetchPosts();
    setView("list");
    setForm(emptyForm);
    setEditId(null);
  };

  const handleEdit = (post) => {
    setForm({ ...post, tags: Array.isArray(post.tags) ? post.tags.join(", ") : "" });
    setEditId(post.id);
    setView("edit");
  };

  const handleTogglePublish = async (post) => {
    await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    showToast(post.published ? "Article dépublié." : "Article publié en ligne.");
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet article définitivement ?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    showToast("Article supprimé.");
    fetchPosts();
  };

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!auth) return (
    <div style={{ minHeight: "100vh", backgroundColor: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: 400, backgroundColor: C.white, padding: "56px 48px", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 10, height: 10, background: `linear-gradient(135deg, ${C.violet}, ${C.yellow})`, borderRadius: 3, transform: "rotate(45deg)" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: C.dark }}>
            AMEZIAN<span style={{ color: C.violet }}>DIGIT</span> <span style={{ color: C.muted, fontWeight: 400, fontSize: 12 }}>/ Admin</span>
          </span>
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: C.dark, margin: "0 0 8px 0" }}>Accès administration</h2>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.muted, margin: "0 0 28px 0" }}>Panneau de gestion du blog</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet }}>MOT DE PASSE</label>
          <input
            type="password" placeholder="••••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ padding: "14px 16px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.dark, outline: "none" }}
            onFocus={(e) => { e.target.style.borderColor = C.violet; }}
            onBlur={(e) => { e.target.style.borderColor = C.border; }}
            autoFocus
          />
          {authError && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.danger, margin: 0 }}>{authError}</p>}
          <button onClick={handleLogin} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.12em", padding: "14px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, color: C.white, border: "none", cursor: "pointer" }}>
            ACCÉDER AU PANNEAU
          </button>
        </div>
      </div>
    </div>
  );

  // ── FORM (new / edit) ──────────────────────────────────────────────────────
  const isForm = view === "new" || view === "edit";
  if (isForm) return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
      {/* Topbar */}
      <div style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => { setView("list"); setForm(emptyForm); setEditId(null); }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em" }}>
            ← RETOUR
          </button>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: C.dark }}>
            {view === "edit" ? "Modifier l'article" : "Nouvel article"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, letterSpacing: "0.1em" }}>PUBLIÉ</span>
            <button onClick={() => setForm({ ...form, published: !form.published })} style={{
              width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
              backgroundColor: form.published ? C.violet : "#D1D5DB", position: "relative", transition: "background 0.2s",
            }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: C.white, position: "absolute", top: 3, left: form.published ? 21 : 3, transition: "left 0.2s" }} />
            </button>
          </label>
          <button onClick={handleSave} disabled={saving} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "8px 24px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, color: C.white, border: "none", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "SAUVEGARDE..." : "SAUVEGARDER"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet }}>TITRE *</label>
            <input
              type="text" placeholder="Titre de votre article..." value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
              style={{ padding: "14px 16px", border: `1px solid ${C.border}`, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: C.dark, outline: "none", backgroundColor: C.white }}
              onFocus={(e) => { e.target.style.borderColor = C.violet; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; }}
            />
          </div>

          {/* Excerpt */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet }}>RÉSUMÉ (accroche)</label>
            <textarea rows={2} placeholder="Une phrase d'accroche courte..." value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              style={{ padding: "14px 16px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.dark, outline: "none", resize: "vertical", backgroundColor: C.white }}
              onFocus={(e) => { e.target.style.borderColor = C.violet; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; }}
            />
          </div>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet }}>CONTENU * (Markdown simplifié)</label>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted }}>## Titre · ### Sous-titre · - Liste · &gt; Citation</span>
            </div>
            <textarea rows={20} placeholder={"## Introduction\n\nVotre contenu ici...\n\n## Section 1\n\nTexte de la section...\n\n- Point clé 1\n- Point clé 2\n\n> Citation importante\n\n## Conclusion\n\nVotre conclusion..."}
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              style={{ padding: "16px", border: `1px solid ${C.border}`, fontFamily: "'DM Mono', monospace", fontSize: 13, color: C.dark, outline: "none", resize: "vertical", backgroundColor: C.white, lineHeight: 1.7 }}
              onFocus={(e) => { e.target.style.borderColor = C.violet; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Category */}
          <div style={{ backgroundColor: C.white, padding: "20px", border: `1px solid ${C.border}` }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, display: "block", marginBottom: 10 }}>CATÉGORIE</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.dark, outline: "none", backgroundColor: C.bg }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Read time */}
          <div style={{ backgroundColor: C.white, padding: "20px", border: `1px solid ${C.border}` }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, display: "block", marginBottom: 10 }}>TEMPS DE LECTURE</label>
            <input type="text" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.dark, outline: "none", backgroundColor: C.bg }}
              onFocus={(e) => { e.target.style.borderColor = C.violet; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; }}
            />
          </div>

          {/* Tags */}
          <div style={{ backgroundColor: C.white, padding: "20px", border: `1px solid ${C.border}` }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, display: "block", marginBottom: 10 }}>TAGS (séparés par virgule)</label>
            <input type="text" placeholder="IRP, Python, E-commerce" value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.dark, outline: "none", backgroundColor: C.bg }}
              onFocus={(e) => { e.target.style.borderColor = C.violet; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; }}
            />
          </div>

          {/* Color */}
          <div style={{ backgroundColor: C.white, padding: "20px", border: `1px solid ${C.border}` }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, display: "block", marginBottom: 10 }}>COULEUR ACCENT</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["#6D28D9", "#F59E0B", "#1C1027", "#059669", "#DC2626", "#0EA5E9"].map((color) => (
                <button key={color} onClick={() => setForm({ ...form, cover_color: color })}
                  style={{ width: 28, height: 28, backgroundColor: color, border: form.cover_color === color ? `3px solid ${C.dark}` : "2px solid transparent", borderRadius: 4, cursor: "pointer" }}
                />
              ))}
            </div>
          </div>

          {/* Slug */}
          <div style={{ backgroundColor: C.white, padding: "20px", border: `1px solid ${C.border}` }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.violet, display: "block", marginBottom: 10 }}>SLUG URL</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, outline: "none", backgroundColor: C.bg }}
            />
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, padding: "14px 24px", backgroundColor: toast.type === "error" ? C.dangerPale : C.successPale, border: `1px solid ${toast.type === "error" ? "rgba(220,38,38,0.2)" : "rgba(5,150,105,0.2)"}`, fontFamily: "'DM Mono', monospace", fontSize: 12, color: toast.type === "error" ? C.danger : C.success, zIndex: 999 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );

  // ── LIST ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
      {/* Topbar */}
      <div style={{ backgroundColor: C.dark, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, background: `linear-gradient(135deg, ${C.violet}, ${C.yellow})`, borderRadius: 2, transform: "rotate(45deg)" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: C.white }}>
            AMEZIAN<span style={{ color: C.yellow }}>DIGIT</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400, fontSize: 12, marginLeft: 8 }}>/ Admin Blog</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/blog" target="_blank" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textDecoration: "none", padding: "6px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
            VOIR LE BLOG
          </a>
          <button onClick={() => { setAuth(false); setPassword(""); }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", padding: "6px 14px" }}>
            DÉCONNEXION
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: C.dark, margin: "0 0 8px 0" }}>Gestion du Blog</h1>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.muted, margin: 0 }}>
              {posts.length} article{posts.length > 1 ? "s" : ""} · {posts.filter((p) => p.published).length} publié{posts.filter((p) => p.published).length > 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setView("new"); }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", padding: "12px 28px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, color: C.white, border: "none", cursor: "pointer", boxShadow: `0 4px 16px rgba(109,40,217,0.3)` }}>
            + NOUVEL ARTICLE
          </button>
        </div>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: C.dark, marginBottom: 12 }}>Aucun article</div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: C.muted, marginBottom: 24 }}>Créez votre premier article de blog.</p>
            <button onClick={() => setView("new")} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", padding: "10px 24px", backgroundColor: C.violet, color: C.white, border: "none", cursor: "pointer" }}>
              CRÉER UN ARTICLE
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {posts.map((post) => (
              <div key={post.id} style={{ backgroundColor: C.white, padding: "20px 24px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 20, transition: "border-color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.violet; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
              >
                {/* Color indicator */}
                <div style={{ width: 4, height: 48, backgroundColor: post.cover_color || C.violet, flexShrink: 0, borderRadius: 2 }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.violet, padding: "2px 8px", backgroundColor: C.violetPale, border: `1px solid ${C.border}` }}>{post.category}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: post.published ? C.success : C.muted, padding: "2px 8px", backgroundColor: post.published ? C.successPale : "#F9FAFB", border: `1px solid ${post.published ? "rgba(5,150,105,0.2)" : C.border}` }}>
                      {post.published ? "PUBLIÉ" : "BROUILLON"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {post.title}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, marginTop: 2 }}>
                    {new Date(post.created_at).toLocaleDateString("fr-FR")} · {post.read_time}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => handleTogglePublish(post)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", padding: "7px 14px", backgroundColor: post.published ? "#F9FAFB" : C.violetPale, color: post.published ? C.muted : C.violet, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                    {post.published ? "DÉPUBLIER" : "PUBLIER"}
                  </button>
                  <button onClick={() => handleEdit(post)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", padding: "7px 14px", backgroundColor: C.yellowPale, color: "#92400E", border: `1px solid rgba(245,158,11,0.2)`, cursor: "pointer" }}>
                    MODIFIER
                  </button>
                  <button onClick={() => handleDelete(post.id)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", padding: "7px 14px", backgroundColor: C.dangerPale, color: C.danger, border: `1px solid rgba(220,38,38,0.2)`, cursor: "pointer" }}>
                    SUPPRIMER
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, padding: "14px 24px", backgroundColor: toast.type === "error" ? C.dangerPale : C.successPale, border: `1px solid ${toast.type === "error" ? "rgba(220,38,38,0.2)" : "rgba(5,150,105,0.2)"}`, fontFamily: "'DM Mono', monospace", fontSize: 12, color: toast.type === "error" ? C.danger : C.success, zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
