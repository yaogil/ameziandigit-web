/**
 * useSEO.jsx — AmezianDigit
 * Hook React qui met à jour dynamiquement toutes les balises <head>
 * (title, meta, Open Graph, Twitter Card, Schema.org)
 * selon la page visitée (/  /blog  /blog/:slug  /shop  /admin)
 *
 * Usage dans chaque composant racine :
 *   import useSEO from './useSEO';
 *   useSEO('home');              // page d'accueil
 *   useSEO('blog');              // liste articles
 *   useSEO('blog_post', post);  // article individuel (passer l'objet post)
 *   useSEO('shop');              // boutique
 */

import { useEffect } from 'react';

const BASE_URL  = 'https://ameziandigit.com';
const OG_IMAGE  = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'AmezianDigit';
const AUTHOR    = 'Yaovi Gilbert AMEZIAN';

// ── Helpers ──────────────────────────────────────────────────────────────────
const setMeta = (selector, attr, value) => {
  if (!value) return;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const parts = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/);
    if (parts) el.setAttribute(parts[1], parts[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setCanonical = (url) => {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el); }
  el.href = url;
};

const setSchema = (id, data) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
};

const removeSchema = (id) => {
  const el = document.getElementById(id);
  if (el) el.remove();
};

// ── Config par page ───────────────────────────────────────────────────────────
const PAGES = {

  // ── ACCUEIL ──────────────────────────────────────────────────────────────
  home: {
    title:       `Consultant Supply Chain & Data Engineering Freelance | ${SITE_NAME}`,
    description: `Consultant freelance Supply Chain & Data Engineering. Optimisation logistique, gestion de stocks e-commerce, dashboards Power BI. Résultats prouvés : −17% coûts logistiques. ${AUTHOR} — Rabat, Maroc.`,
    url:         `${BASE_URL}/`,
    breadcrumbs: [{ name: 'Accueil', item: `${BASE_URL}/` }],
  },

  // ── BLOG — liste ─────────────────────────────────────────────────────────
  blog: {
    title:       `Blog Logistique & Data Supply Chain | ${SITE_NAME}`,
    description: `Analyses, guides pratiques et veille sur l'optimisation logistique, la gestion de stocks e-commerce, le Data Engineering et la Supply Chain résiliente. Par ${AUTHOR}.`,
    url:         `${BASE_URL}/blog`,
    breadcrumbs: [
      { name: 'Accueil', item: `${BASE_URL}/` },
      { name: 'Blog',    item: `${BASE_URL}/blog` },
    ],
  },

  // ── BOUTIQUE ─────────────────────────────────────────────────────────────
  shop: {
    title:       `Guides & Outils Logistique à Télécharger | ${SITE_NAME}`,
    description: `Téléchargez nos guides pratiques : gestion de stocks, prévision de demande, planification des commandes, dashboards Power BI. Outils Excel et Python pour optimiser votre supply chain.`,
    url:         `${BASE_URL}/shop`,
    breadcrumbs: [
      { name: 'Accueil',  item: `${BASE_URL}/` },
      { name: 'Boutique', item: `${BASE_URL}/shop` },
    ],
  },
};

// ── Hook principal ────────────────────────────────────────────────────────────
const useSEO = (page, data = null) => {
  useEffect(() => {

    // ── Cas article de blog individuel ──────────────────────────────────────
    if (page === 'blog_post' && data) {
      const post = data;
      const url  = `${BASE_URL}/blog/${post.slug}`;
      const img  = OG_IMAGE;

      // Title & description
      document.title = `${post.title} | ${SITE_NAME}`;
      setMeta('meta[name="description"]',        'content', post.excerpt || post.abstract);
      setMeta('meta[name="author"]',             'content', post.author || AUTHOR);

      // Canonical
      setCanonical(url);

      // Open Graph
      setMeta('meta[property="og:type"]',        'content', 'article');
      setMeta('meta[property="og:url"]',         'content', url);
      setMeta('meta[property="og:title"]',       'content', post.title);
      setMeta('meta[property="og:description"]', 'content', post.excerpt || post.abstract);
      setMeta('meta[property="og:image"]',       'content', img);

      // Twitter
      setMeta('meta[name="twitter:title"]',       'content', post.title);
      setMeta('meta[name="twitter:description"]', 'content', post.excerpt || post.abstract);
      setMeta('meta[name="twitter:image"]',       'content', img);

      // Schema — BlogPosting
      setSchema('schema-page', {
        '@context':       'https://schema.org',
        '@type':          'BlogPosting',
        '@id':            `${url}#blogpost`,
        'headline':       post.title,
        'description':    post.excerpt || post.abstract,
        'datePublished':  post.published_at || post.date,
        'dateModified':   post.updated_at   || post.published_at || post.date,
        'url':            url,
        'inLanguage':     'fr-FR',
        'author': {
          '@type': 'Person',
          '@id':   `${BASE_URL}/#person`,
          'name':  post.author || AUTHOR,
        },
        'publisher': {
          '@type': 'Organization',
          '@id':   `${BASE_URL}/#organization`,
          'name':  SITE_NAME,
          'logo':  { '@type': 'ImageObject', 'url': `${BASE_URL}/logo.png` },
        },
        'image': { '@type': 'ImageObject', 'url': img, 'width': 1200, 'height': 630 },
        'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
        'keywords':         Array.isArray(post.tags) ? post.tags.join(', ') : (post.category || ''),
        'articleSection':   post.category || 'Supply Chain',
      });

      // Schema — BreadcrumbList article
      setSchema('schema-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Blog',    'item': `${BASE_URL}/blog` },
          { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': url },
        ],
      });

      return;
    }

    // ── Cas page standard (home / blog / shop) ──────────────────────────────
    const cfg = PAGES[page] || PAGES.home;

    // Title & metas de base
    document.title = cfg.title;
    setMeta('meta[name="description"]', 'content', cfg.description);

    // Canonical
    setCanonical(cfg.url);

    // Open Graph
    setMeta('meta[property="og:type"]',        'content', 'website');
    setMeta('meta[property="og:url"]',         'content', cfg.url);
    setMeta('meta[property="og:title"]',       'content', cfg.title);
    setMeta('meta[property="og:description"]', 'content', cfg.description);
    setMeta('meta[property="og:image"]',       'content', OG_IMAGE);

    // Twitter
    setMeta('meta[name="twitter:title"]',       'content', cfg.title);
    setMeta('meta[name="twitter:description"]', 'content', cfg.description);
    setMeta('meta[name="twitter:image"]',       'content', OG_IMAGE);

    // Schema — WebPage générique
    setSchema('schema-page', {
      '@context':   'https://schema.org',
      '@type':      'WebPage',
      '@id':        `${cfg.url}#webpage`,
      'url':         cfg.url,
      'name':        cfg.title,
      'description': cfg.description,
      'inLanguage':  'fr-FR',
      'isPartOf':   { '@id': `${BASE_URL}/#website` },
      'author':     { '@id': `${BASE_URL}/#person` },
    });

    // Schema — BreadcrumbList
    setSchema('schema-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': cfg.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': b.name,
        'item': b.item,
      })),
    });

    // Nettoyage si on revient sur home depuis un article
    if (page === 'home') {
      removeSchema('schema-blog-post');
    }

  }, [page, data]);
};

export default useSEO;
