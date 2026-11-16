const L = require("./_lib");
const CHUNK = 1000; // ads per sitemap file (= PostgREST page size, one request each)

// /sitemap.xml                  -> index (one entry per language per chunk)
// /sitemaps/{lang}/0            -> static pages + list pages (from the grouped view, no scan)
// /sitemaps/{lang}/{n>=1}       -> ads (n-1)*CHUNK .. n*CHUNK-1, newest first
module.exports = async (req, res) => {
  const S = L.site(req), lang = req.query.lang;
  const H = { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" };
  Object.entries(H).forEach(([k, v]) => res.setHeader(k, v));
  const today = new Date().toISOString().slice(0, 10);

  const fc = await L.facets();
  if (fc.error) { res.statusCode = 503; res.setHeader("Cache-Control", "no-store"); return res.end(); }
  const total = L.sumN(fc.rows), chunks = Math.ceil(total / CHUNK);

  if (!lang) { // sitemap index
    const locs = [];
    L.LANGS.forEach(l => { for (let p = 0; p <= chunks; p++) locs.push(`<sitemap><loc>${S}/sitemaps/${l}/${p}</loc><lastmod>${today}</lastmod></sitemap>`); });
    return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locs.join("")}</sitemapindex>`);
  }
  if (!L.LANGS.includes(lang)) return L.notFound(res, "en", S);
  const p = Math.max(0, parseInt(req.query.p, 10) || 0);
  if (p > chunks) return L.notFound(res, "en", S);

  const alts = pathFor => L.LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${L.esc(S + pathFor(x))}"/>`).join("") +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${L.esc(S + pathFor("en"))}"/>`;
  const url = (pathFor, last) => `<url><loc>${L.esc(S + pathFor(lang))}</loc>${last ? `<lastmod>${last}</lastmod>` : ""}${alts(pathFor)}</url>`;
  const out = [];

  if (p === 0) {
    if (lang === "ar") out.push(`<url><loc>${S}/</loc></url>`);
    const combos = new Map();
    fc.rows.forEach(r => {
      const t = L.tabOf(r), c = r.city || "agadir", ts = +r.ts || 0;
      [t + "|", t + "|" + c].forEach(k => combos.set(k, Math.max(combos.get(k) || 0, ts)));
    });
    L.PAGES.forEach(pg => out.push(url(x => `/${x}/${pg}`, today)));
    combos.forEach((ts, k) => { const [t, c] = k.split("|"); out.push(url(x => L.listPath(x, t, c), ts > 0 ? new Date(ts).toISOString().slice(0, 10) : today)); });
  } else {
    const r = await L.sb(L.q({ cols: "id,n,c,city,offer,svc,ts", limit: CHUNK, offset: (p - 1) * CHUNK }));
    if (r.error) { res.statusCode = 503; res.setHeader("Cache-Control", "no-store"); return res.end(); }
    r.rows.forEach(i => {
      const ts = +i.ts, last = ts > 0 ? new Date(ts).toISOString().slice(0, 10) : "";
      out.push(url(x => L.adPath(i, x), last));
    });
  }
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${out.join("")}</urlset>`);
};
