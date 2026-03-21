const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PDF_URL = "COLLE_ICI_TON_URL_SUPABASE";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email } = JSON.parse(event.body || "{}");
  if (!email) {
    return { statusCode: 400, body: "Email manquant" };
  }

  try {
    const pdfRes = await fetch(PDF_URL);
    const pdfBuffer = await pdfRes.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Gilbert AMEZIAN <gilbert@ameziandigit.com>",
        to: [email],
        subject: "Votre guide est là 👇",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#4B3F6B;">
            <div style="background:#1C1027;padding:32px;margin-bottom:32px;">
              <span style="font-weight:800;font-size:18px;color:#fff;">AMEZIAN<span style="color:#F59E0B;">DIGIT</span></span>
            </div>
            <div style="padding:0 32px 32px;">
              <p>Bonjour,</p>
              <p>Merci d'avoir téléchargé le guide — il est joint à cet email.</p>
              <p>En 18 pages, vous trouverez :</p>
              <ul>
                <li>La formule du stock de sécurité (exemple chiffré pas à pas)</li>
                <li>Le calcul EOQ pour commander au bon moment</li>
                <li>Les méthodes de prévision de demande e-commerce</li>
                <li>Les formules Excel prêtes à copier</li>
              </ul>
              <p>Ce guide est conçu pour être applicable immédiatement — chaque formule est accompagnée d'un exemple réel.</p>
              <p>Si vous voulez aller plus loin :</p>
              <div style="text-align:center;margin:32px 0;">
                <a href="https://ameziandigit.com/shop"
                   style="background:#6D28D9;color:#fff;padding:14px 32px;text-decoration:none;font-family:monospace;font-size:13px;letter-spacing:0.08em;display:inline-block;">
                  VOIR LA BOUTIQUE →
                </a>
              </div>
              <p>Templates Excel Gestion Stock, Analyse ABC-XYZ, Dashboard KPI — tous avec formules réelles.</p>
              <p>Des questions ? Répondez directement à cet email, je lis tous les messages.</p>
              <p>Bonne lecture,<br/><strong>Gilbert</strong><br/>
              Consultant Supply Chain & Data Engineering<br/>
              <a href="https://ameziandigit.com" style="color:#6D28D9;">ameziandigit.com</a></p>
              <hr style="border:none;border-top:1px solid #EDE9FE;margin:32px 0;"/>
              <p style="font-size:12px;color:#8B7BA8;">P.S. Si vous perdez du temps à ajuster vos niveaux de stock manuellement chaque semaine, un outil de pilotage adapté ferait une vraie différence. On peut en parler si vous le souhaitez.</p>
            </div>
          </div>
        `,
        attachments: [{
          filename: "Guide_Gestion_Stock_Ecommerce_AmezianDigit.pdf",
          content: pdfBase64,
        }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return { statusCode: 500, body: "Erreur envoi email" };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Erreur serveur" };
  }
};
```

---

## Étape 4 — Ajouter la clé API dans Netlify

**Netlify → Site settings → Environment variables → Add variable** :
```
RESEND_API_KEY
re_5uaB7kMz_GKQBszEefVt1tXsngHtBUcU1