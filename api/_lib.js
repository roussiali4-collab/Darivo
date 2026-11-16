// Shared helpers for the SEO pages (Vercel serverless, CommonJS)
const SB = process.env.SUPABASE_URL || "https://eofewxkyehcvqtkxbbyy.supabase.co";
const KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_luhudHRiIZpPVhiopdaBMw_aLR9fm8k";
const LANGS = ["ar", "fr", "en", "es", "de", "it"];
const LI = { en: 0, fr: 1, es: 2, de: 3, it: 4, ar: 5 };
const REAL = ["apartments", "studio", "maison", "villas", "rooms", "hostel", "land"];
const DAILY_CATS = ["apartments", "villas", "maison", "studio", "rooms", "hostel"];
const SALE_CATS = ["apartments", "villas", "maison", "studio", "land"];
const ACTS = ["surf", "jetski", "yacht"];
const SVCS = ["delivery", "massage", "tourtransport", "tourguide", "carrental"];
const TABS = ["rent", "sale", "services", "activities"];
const PAGES = ["about", "contact", "terms", "privacy"];
const BUSINESS = { name: "Darivo", email: process.env.CONTACT_EMAIL || "darivoservice@gmail.com", whatsapp: process.env.CONTACT_WHATSAPP || "212772564307" };
const COLS = "id,c,city,n,phone,whatsapp,email,offer,area,a,p,am,svc,img,imgs,thumb,d,ts";

// key|en|fr|es|de|it|ar
const TXT = {};
`rent|Rent|Location|Alquiler|Mieten|Affitto|كراء
sale|For sale|À vendre|En venta|Kaufen|In vendita|للبيع
services|Services|Services|Servicios|Dienstleistungen|Servizi|خدمات
activities|Activities|Activités|Actividades|Aktivitäten|Attività|أنشطة
forrent|Monthly rent|Location mensuelle|Alquiler mensual|Monatsmiete|Affitto mensile|كراء شهري
forsale|For sale|À vendre|En venta|Zu verkaufen|In vendita|للبيع
fordaily|Daily rent|Location journalière|Alquiler diario|Tagesmiete|Affitto giornaliero|كراء يومي
month|month|mois|mes|Monat|mese|شهر
day|day|jour|día|Tag|giorno|يوم
wa|WhatsApp|WhatsApp|WhatsApp|WhatsApp|WhatsApp|واتساب
call|Call|Appeler|Llamar|Anrufen|Chiama|اتصال
mail|Email|E-mail|Correo|E-Mail|E-mail|بريد
home|Home|Accueil|Inicio|Startseite|Home|الرئيسية
sqm|m²|m²|m²|m²|m²|م²
amen|Amenities|Équipements|Servicios|Ausstattung|Servizi|المرافق
similar|Similar listings|Annonces similaires|Anuncios similares|Ähnliche Anzeigen|Annunci simili|إعلانات مشابهة
reviews|Reviews|Avis|Opiniones|Bewertungen|Recensioni|الآراء
openapp|Write a review / open in the app|Donner votre avis / ouvrir dans l'appli|Escribir opinión / abrir en la app|Bewertung schreiben / in der App öffnen|Scrivi una recensione / apri nell'app|اكتب رأيك / افتح في التطبيق
noitems|No listings yet.|Aucune annonce pour le moment.|Aún no hay anuncios.|Noch keine Anzeigen.|Nessun annuncio.|لا توجد إعلانات بعد.
next|Next|Suivant|Siguiente|Weiter|Avanti|التالي
prev|Previous|Précédent|Anterior|Zurück|Indietro|السابق
allc|All cities|Toutes les villes|Todas las ciudades|Alle Städte|Tutte le città|كل المدن
tag|Free classified ads in Morocco|Petites annonces gratuites au Maroc|Anuncios gratuitos en Marruecos|Kostenlose Kleinanzeigen in Marokko|Annunci gratuiti in Marocco|إعلانات مجانية في المغرب
in|in|à|en|in|a|في
nf|Page not found|Page introuvable|Página no encontrada|Seite nicht gefunden|Pagina non trovata|الصفحة غير موجودة
wamsg|Hello, I saw your ad “{n}” on Darivo.|Bonjour, j'ai vu votre annonce « {n} » sur Darivo.|Hola, vi tu anuncio «{n}» en Darivo.|Hallo, ich habe Ihre Anzeige „{n}“ auf Darivo gesehen.|Ciao, ho visto il tuo annuncio «{n}» su Darivo.|السلام عليكم، شفت إعلانكم «{n}» على Darivo.
apartments|Apartments|Appartements|Apartamentos|Wohnungen|Appartamenti|شقق
studio|Studios|Studios|Estudios|Studios|Monolocali|استوديوهات
maison|Houses|Maisons|Casas|Häuser|Case|منازل
villas|Villas|Villas|Villas|Villen|Ville|فيلات
rooms|Rooms|Chambres|Habitaciones|Zimmer|Camere|غرف
hostel|Hostels|Auberges|Albergues|Hostels|Ostelli|هوستل
land|Land plots|Terrains|Terrenos|Grundstücke|Terreni|بقع أرضية
explore|Services|Services|Servicios|Dienstleistungen|Servizi|خدمات
delivery|Delivery|Livraison|Entrega a domicilio|Lieferservice|Consegne|التوصيل
massage|Massage|Massage|Masajes|Massage|Massaggi|المساج
tourtransport|Tourist transport|Transport touristique|Transporte turístico|Touristentransport|Trasporto turistico|نقل سياحي
tourguide|Tourist guide|Guide touristique|Guía turístico|Reiseführer|Guida turistica|الدليل السياحي
carrental|Car rental|Location de voiture|Alquiler de coches|Autovermietung|Noleggio auto|كراء السيارات
surf|Surfing|Surf|Surf|Surfen|Surf|ركوب الأمواج
jetski|Jet ski|Jet ski|Jet ski|Jetski|Jet ski|جيت سكي
yacht|Yachts|Yachts|Yates|Yachten|Yacht|يخوت
wifi|Wi-Fi|Wi-Fi|Wi-Fi|WLAN|Wi-Fi|واي فاي
pool|Pool|Piscine|Piscina|Pool|Piscina|مسبح
parking|Parking|Parking|Aparcamiento|Parkplatz|Parcheggio|موقف سيارات
ac|Air conditioning|Climatisation|Aire acondicionado|Klimaanlage|Aria condizionata|تكييف
breakfast|Breakfast|Petit-déjeuner|Desayuno|Frühstück|Colazione|فطور
kitchen|Kitchen|Cuisine|Cocina|Küche|Cucina|مطبخ
seaview|Sea view|Vue mer|Vista al mar|Meerblick|Vista mare|إطلالة بحرية
pets|Pets allowed|Animaux acceptés|Se admiten mascotas|Haustiere erlaubt|Animali ammessi|يسمح بالحيوانات
airport|Airport pickup|Transfert aéroport|Traslado aeropuerto|Flughafentransfer|Transfer aeroporto|استقبال من المطار
halal|Halal food|Cuisine halal|Comida halal|Halal-Essen|Cibo halal|طعام حلال
about|About us|À propos|Sobre nosotros|Über uns|Chi siamo|من نحن
contact|Contact us|Contactez-nous|Contáctenos|Kontakt|Contattaci|اتصل بنا
terms|Terms|Conditions|Condiciones|AGB|Termini|الشروط
privacy|Privacy|Confidentialité|Privacidad|Datenschutz|Privacy|الخصوصية`
  .split("\n").forEach(r => { const a = r.split("|"); TXT[a[0]] = a.slice(1); });
const tr = (k, l) => { const r = TXT[k]; return r ? (r[LI[l]] || r[0]) : k; };

// id|en|fr|es|de|it|ar
const CITIES = `agadir|Agadir|Agadir|Agadir|Agadir|Agadir|أكادير
marrakech|Marrakech|Marrakech|Marrakech|Marrakesch|Marrakech|مراكش
casablanca|Casablanca|Casablanca|Casablanca|Casablanca|Casablanca|الدار البيضاء
rabat|Rabat|Rabat|Rabat|Rabat|Rabat|الرباط
fes|Fes|Fès|Fez|Fès|Fes|فاس
tangier|Tangier|Tanger|Tánger|Tanger|Tangeri|طنجة
essaouira|Essaouira|Essaouira|Esauira|Essaouira|Essaouira|الصويرة
chefchaouen|Chefchaouen|Chefchaouen|Chauen|Chefchaouen|Chefchaouen|شفشاون
meknes|Meknes|Meknès|Mequinez|Meknès|Meknes|مكناس
tetouan|Tetouan|Tétouan|Tetuán|Tétouan|Tetuan|تطوان
oujda|Oujda|Oujda|Uxda|Oujda|Oujda|وجدة
ouarzazate|Ouarzazate|Ouarzazate|Uarzazat|Ouarzazate|Ouarzazate|ورزازات
merzouga|Merzouga|Merzouga|Merzouga|Merzouga|Merzouga|مرزوكة
dakhla|Dakhla|Dakhla|Dajla|Dakhla|Dakhla|الداخلة`
  .split("\n").map(r => { const a = r.split("|"); return { id: a[0], n: a.slice(1) }; });
const CITY_IDS = CITIES.map(c => c.id);
const cityName = (id, l) => { const c = CITIES.find(x => x.id === id); return c ? (c.n[LI[l]] || c.n[0]) : ""; };

const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Keeps letters of any script (Arabic included); strips Latin accents + Arabic harakat/tatweel.
// MUST stay identical to sg() in index.html.
const slug = i => {
  const t = String(i.n || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").normalize("NFC");
  const c = t.slice(0, /[^\x00-\x7f]/.test(t) ? 40 : 60).replace(/-+$/, "");
  return (c || "ad") + "-" + i.id;
};
const parseId = s => {
  const m = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(s);
  if (m) return m[1];
  const k = s.lastIndexOf("-");
  return k >= 0 ? s.slice(k + 1) : s;
};
const site = req => (process.env.SITE_URL ||
  ("https://" + (req.headers["x-forwarded-host"] || req.headers.host || "localhost"))).replace(/\/+$/, "");

// ---- data ----
async function sb(path, count) {
  try {
    const r = await fetch(`${SB}/rest/v1/${path}`, { headers: { apikey: KEY, ...(count ? { Prefer: "count=exact" } : {}) } });
    if (!r.ok) return { rows: [], total: 0, error: true };
    const rows = await r.json();
    let total = rows.length;
    const cr = r.headers.get("content-range");
    if (cr && /\/(\d+)$/.test(cr)) total = +cr.split("/")[1];
    return { rows, total };
  } catch (e) { return { rows: [], total: 0, error: true }; }
}
const tabFilters = tab => tab === "rent"
  ? { params: ["c=in.(" + DAILY_CATS.concat("land").join(",") + ")"], conds: ["or(offer.is.null,offer.neq.sale)"] }
  : tab === "sale" ? { params: ["c=in.(" + SALE_CATS.join(",") + ")", "offer=eq.sale"], conds: [] }
  : tab === "services" ? { params: ["c=eq.explore", "svc=in.(" + SVCS.join(",") + ")"], conds: [] }
  : { params: ["c=eq.explore", "svc=in.(" + ACTS.join(",") + ")"], conds: [] };
const cityCond = city => city === "agadir" ? "or(city.is.null,city.eq.agadir)" : "city.eq." + city;
// Only approved, non-paused listings (RLS enforces "approved" too).
function q({ tab, city, cols = COLS, limit = 24, offset = 0, params = [], conds = [] }) {
  const p = ["select=" + cols, "status=eq.approved", ...params];
  const c = ["or(paused.is.null,paused.eq.false)", ...conds];
  if (tab) { const f = tabFilters(tab); p.push(...f.params); c.push(...f.conds); }
  if (city) c.push(cityCond(city));
  p.push("and=(" + c.join(",") + ")", "order=ts.desc,id.desc", "limit=" + limit, "offset=" + offset);
  return "items?" + p.join("&");
}

// Cheap aggregate of approved, non-paused listings: one row per (c, city, offer, svc) with a count.
// Backed by the view public.listing_facets (see supabase/patch2.sql). Replaces full-table scans.
async function facets(tab, city) {
  const f = tab ? tabFilters(tab) : { params: [], conds: [] };
  const conds = [...f.conds];
  if (city) conds.push(cityCond(city));
  const p = ["select=c,city,offer,svc,n,ts", ...f.params];
  if (conds.length) p.push("and=(" + conds.join(",") + ")");
  p.push("limit=1000");
  const r = await sb("listing_facets?" + p.join("&"));
  if (!r.error) return r;
  return facetsFallback(tab, city);   // view missing (patch2.sql not run yet) or failing
}
// Slow path: aggregate approved, non-paused items in JS (max 10 000 rows). Only used when the view is unavailable.
async function facetsFallback(tab, city) {
  const m = new Map();
  for (let page = 0; page < 10; page++) {
    const r = await sb(q({ tab, city, cols: "c,city,offer,svc,ts", limit: 1000, offset: page * 1000 }));
    if (r.error) return { rows: [], total: 0, error: true };
    r.rows.forEach(x => {
      const k = [x.c, x.city || "agadir", x.offer || "", x.svc || ""].join("|"), e = m.get(k);
      if (e) { e.n++; e.ts = Math.max(e.ts, +x.ts || 0); }
      else m.set(k, { c: x.c, city: x.city || "agadir", offer: x.offer, svc: x.svc, n: 1, ts: +x.ts || 0 });
    });
    if (r.rows.length < 1000) break;
  }
  return { rows: [...m.values()], total: m.size, fallback: true };
}
const sumN = rows => rows.reduce((s, r) => s + (+r.n || 0), 0);

// ---- listing helpers ----
const isSale = i => REAL.includes(i.c) && i.offer === "sale";
const isDaily = i => REAL.includes(i.c) && i.c !== "land" && i.offer === "daily";
const offKey = i => isSale(i) ? "forsale" : isDaily(i) ? "fordaily" : "forrent";
const unitOf = i => isSale(i) ? "" : isDaily(i) ? "day" : REAL.includes(i.c) ? "month" : "";
const tabOf = i => i.c === "explore" ? (ACTS.includes(i.svc) ? "activities" : "services") : (i.offer === "sale" && SALE_CATS.includes(i.c) ? "sale" : "rent");
const dOf = (i, l) => (i.d && (i.d[l] || i.d.en || Object.values(i.d).find(Boolean))) || "";
const imgsOf = i => {
  const a = Array.isArray(i.imgs) && i.imgs.length ? i.imgs : (i.img ? [i.img] : []);
  return a.filter(u => /^https:\/\//.test(u || "")).slice(0, 6);
};
const nl = l => l === "ar" ? "ar-u-nu-latn" : l;
const money = (n, l) => new Intl.NumberFormat(nl(l), { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(n);
const nfm = (n, l) => new Intl.NumberFormat(nl(l)).format(n);
const fmtPhone = n => /^212[5-8]\d{8}$/.test(n || "")
  ? "0" + n.slice(3).replace(/^(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5") : (n ? "+" + n : "");
const adPath = (i, l) => `/${l}/ad/${encodeURIComponent(slug(i))}`;
const listPath = (l, tab, city) => city ? `/${l}/${city}/${tab}` : `/${l}/${tab}`;

// ---- HTML ----
const CSS = `:root{--ink:#0B2F4A;--sun:#F4A62A;--sea:#0E7C86;--bg:#E9E5D8;--line:#d3cebd;--mut:#5b6877}
*{box-sizing:border-box;margin:0}body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}
html[lang=ar] body{font-family:"Tajawal",system-ui,sans-serif}a{color:inherit}
.w{max-width:1100px;margin:auto;padding:0 16px}
header{background:var(--ink);color:#fff}header .w{display:flex;justify-content:space-between;align-items:center;min-height:60px;gap:12px;flex-wrap:wrap}
.logo{font-weight:800;font-size:1.25rem;text-decoration:none;color:#fff}.logo i{color:var(--sun);font-style:normal}
.lg a{color:#dcecf0;font-size:.85rem;margin-inline-start:10px;text-decoration:none}.lg a[aria-current]{color:var(--sun);font-weight:700}
.bc{padding:14px 0 4px;font-size:.88rem;color:var(--mut)}.bc a{color:var(--sea)}
h1{font-size:clamp(1.4rem,4.5vw,2.1rem);line-height:1.2;margin:8px 0}h2{font-size:1.2rem;margin:22px 0 8px}
.m{color:var(--mut);font-size:.92rem}
.gal{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:14px 0}
.gal img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;background:#ddd}
.gal img:first-child{grid-column:1/-1;aspect-ratio:16/10;border-radius:16px}
.pr{font-size:1.1rem;margin:8px 0}.pr b{font-size:1.6rem}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
.btn{display:inline-block;background:var(--sun);color:var(--ink);font-weight:700;border-radius:10px;padding:10px 16px;text-decoration:none}
.btn.wa{background:#25D366;color:#06371c}.btn.alt{background:#fff;border:2px solid var(--ink)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.chips span{background:#fff;border-radius:99px;padding:2px 12px;font-size:.85rem}
.tg{display:inline-block;background:var(--ink);color:#fff;border-radius:99px;padding:2px 12px;font-size:.78rem;font-weight:700}.tg.s{background:var(--sun);color:var(--ink)}.tg.d{background:var(--sea)}
.desc{margin:12px 0;max-width:46em}
.rv{border-top:1px solid var(--line);padding:10px 0}.rv small{color:var(--mut)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;padding:10px 0 30px}
.card{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden}
.card .pic{display:block;position:relative;aspect-ratio:4/3;background:#ddd}.card .pic img{width:100%;height:100%;object-fit:cover}
.card .tg{position:absolute;inset-block-start:10px;inset-inline-start:10px}
.card .b{padding:12px}.card h3{font-size:1rem}.card h3 a{text-decoration:none}
.nav{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.nav a{background:#fff;border:1px solid var(--line);border-radius:99px;padding:6px 14px;text-decoration:none;font-weight:700;font-size:.9rem}.nav a[aria-current]{background:var(--ink);color:#fff}
.pgn{display:flex;gap:10px;justify-content:center;margin:10px 0 30px}
.doc{max-width:46em;padding-bottom:20px}.doc p{margin:8px 0}.doc h2{margin:20px 0 6px;font-size:1.1rem}.doc .li{padding-inline-start:16px;margin:2px 0}.doc .co a{font-weight:700}
footer{background:var(--ink);color:#b7c6d3;text-align:center;padding:22px;font-size:.88rem;margin-top:30px}footer a{color:#fff}`;

function shell(o) {
  const l = o.lang, S = o.site, url = S + o.path;
  const alts = o.pathFor ? LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${S}${o.pathFor(x)}">`).join("")
    + `<link rel="alternate" hreflang="x-default" href="${S}${o.pathFor("en")}">` : "";
  const img = o.image ? `<meta property="og:image" content="${esc(o.image)}"><meta name="twitter:image" content="${esc(o.image)}">` : "";
  const ld = (o.ld || []).map(x => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, "\\u003c")}</script>`).join("");
  const fonts = l === "ar" ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap" rel="stylesheet">` : "";
  const sw = o.pathFor ? LANGS.map(x => `<a href="${o.pathFor(x)}" hreflang="${x}"${x === l ? " aria-current=\"true\"" : ""}>${x.toUpperCase()}</a>`).join("") : "";
  return `<!DOCTYPE html>
<html lang="${l}" dir="${l === "ar" ? "rtl" : "ltr"}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="robots" content="${o.noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}">
<link rel="canonical" href="${esc(url)}">${alts}
<meta name="theme-color" content="#0B2F4A">
<meta property="og:type" content="${o.ogType || "website"}"><meta property="og:site_name" content="Darivo">
<meta property="og:title" content="${esc(o.title)}"><meta property="og:description" content="${esc(o.desc)}"><meta property="og:url" content="${esc(url)}">${img}
<meta name="twitter:card" content="${o.image ? "summary_large_image" : "summary"}">
${fonts}<style>${CSS}</style>${ld}
</head><body>
<header><div class="w"><a class="logo" href="/">Dari<i>vo</i></a><nav class="lg" aria-label="Language">${sw}</nav></div></header>
<main class="w">${o.body}</main>
<footer><div>${TABS.map(k => `<a href="/${l}/${k}">${esc(tr(k, l))}</a>`).join(" · ")}</div><div style="margin-top:6px">${PAGES.map(k => `<a href="/${l}/${k}">${esc(tr(k, l))}</a>`).join(" · ")}</div><div style="margin-top:6px">© Darivo · ${esc(tr("tag", l))}</div></footer>
</body></html>`;
}

function card(i, l) {
  const im = imgsOf(i)[0];
  const th = /^https?:\/\//.test(i.thumb || "") ? i.thumb : im;
  const u = adPath(i, l);
  const tag = REAL.includes(i.c) ? `<span class="tg ${isSale(i) ? "s" : isDaily(i) ? "d" : ""}">${esc(tr(offKey(i), l))}</span>` : "";
  const un = unitOf(i);
  const meta = [cityName(i.city || "agadir", l), i.a].filter(Boolean).join(" · ") + (i.area > 0 ? ` · ${nfm(i.area, l)} ${tr("sqm", l)}` : "");
  return `<article class="card"><a class="pic" href="${u}">${th ? `<img src="${esc(th)}" alt="${esc(i.n)}" loading="lazy" width="400" height="300">` : ""}${tag}</a><div class="b"><h3><a href="${u}">${esc(i.n)}</a></h3><div class="m">${esc(meta)}</div>${i.p > 0 ? `<div class="pr"><b>${esc(money(i.p, l))}</b>${un ? " / " + esc(tr(un, l)) : ""}</div>` : ""}</div></article>`;
}

function send(res, status, body, cache, type) {
  res.statusCode = status;
  res.setHeader("Content-Type", type || "text/html; charset=utf-8");
  if (cache) res.setHeader("Cache-Control", cache);
  res.end(body);
}
// Backend (Supabase) unreachable: 503 + no cache, so a temporary outage is never cached/indexed as a 404.
function unavailable(res, lang, S) {
  const l = LANGS.includes(lang) ? lang : "en";
  send(res, 503, shell({ lang: l, site: S, path: "/", title: "Darivo", desc: "Darivo", noindex: true,
    body: `<h1>Darivo</h1><p><a class="btn" href="/">${esc(tr("home", l))}</a></p>` }), "no-store");
}
function notFound(res, lang, S) {
  const l = LANGS.includes(lang) ? lang : "en";
  send(res, 404, shell({ lang: l, site: S, path: "/", title: tr("nf", l) + " | Darivo", desc: tr("nf", l), noindex: true,
    body: `<h1>${esc(tr("nf", l))}</h1><p><a class="btn" href="/">${esc(tr("home", l))}</a></p>` }), "s-maxage=60");
}

module.exports = { facets, sumN, LANGS, TABS, PAGES, BUSINESS, CITIES, CITY_IDS, COLS, REAL, ACTS, SVCS, TXT, tr, cityName, esc, slug, parseId, site, sb, q,
  isSale, isDaily, offKey, unitOf, tabOf, dOf, imgsOf, money, nfm, fmtPhone, adPath, listPath, shell, card, send, notFound, unavailable, SALE_CATS };
