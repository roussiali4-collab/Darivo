const L = require("./_lib");
const PER = 24;

module.exports = async (req, res) => {
  const S = L.site(req);
  const lang = String(req.query.lang || ""), tab = String(req.query.tab || "");
  const city = req.query.city ? String(req.query.city) : "";
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  if (!L.LANGS.includes(lang) || !L.TABS.includes(tab) || (city && !L.CITY_IDS.includes(city))) return L.notFound(res, lang, S);

  const [list, cs] = await Promise.all([
    L.sb(L.q({ tab, city, limit: PER, offset: (page - 1) * PER })),
    L.facets(tab)   // tiny grouped view: cities that have listings in this tab + counts (no table scan, no count=exact)
  ]);
  if (list.error) return L.unavailable(res, lang, S);   // never cache an outage as "no listings"
  if (cs.error) cs.rows = [];
  const cities = [...new Set(cs.rows.map(r => r.city || "agadir"))].filter(c => L.CITY_IDS.includes(c));
  list.total = cs.error ? list.rows.length : city ? L.sumN(cs.rows.filter(r => (r.city || "agadir") === city)) : L.sumN(cs.rows);
  const E = L.esc, cn = city ? L.cityName(city, lang) : "";
  const h1 = city ? `${L.tr(tab, lang)} ${L.tr("in", lang)} ${cn}` : L.tr(tab, lang);
  const base = L.listPath(lang, tab, city);
  const path = page > 1 ? `${base}?page=${page}` : base;
  const pages = Math.max(1, Math.ceil(list.total / PER));
  const title = `${h1}${page > 1 ? " – " + page : ""} | Darivo`;
  const desc = `${L.tr("tag", lang)}: ${h1}${list.total ? ` (${list.total})` : ""}.`;
  const pg = n => n > 1 ? `${base}?page=${n}` : base;

  const body = `<nav class="bc"><a href="/">${E(L.tr("home", lang))}</a> › ${city ? `<a href="${L.listPath(lang, tab)}">${E(L.tr(tab, lang))}</a> › ${E(cn)}` : E(L.tr(tab, lang))}</nav>
<h1>${E(h1)}</h1>
<nav class="nav" aria-label="Categories">${L.TABS.map(k => `<a href="${L.listPath(lang, k, city)}"${k === tab ? ' aria-current="true"' : ""}>${E(L.tr(k, lang))}</a>`).join("")}</nav>
<nav class="nav" aria-label="Cities"><a href="${L.listPath(lang, tab)}"${!city ? ' aria-current="true"' : ""}>${E(L.tr("allc", lang))}</a>${cities.map(c => `<a href="${L.listPath(lang, tab, c)}"${c === city ? ' aria-current="true"' : ""}>${E(L.cityName(c, lang))}</a>`).join("")}</nav>
${list.rows.length ? `<div class="grid">${list.rows.map(i => L.card(i, lang)).join("")}</div>` : `<p>${E(L.tr("noitems", lang))}</p>`}
${pages > 1 ? `<nav class="pgn">${page > 1 ? `<a class="btn alt" rel="prev" href="${pg(page - 1)}">${E(L.tr("prev", lang))}</a>` : ""}<span>${page} / ${pages}</span>${page < pages ? `<a class="btn alt" rel="next" href="${pg(page + 1)}">${E(L.tr("next", lang))}</a>` : ""}</nav>` : ""}`;

  const html = L.shell({ lang, site: S, path, pathFor: x => (page > 1 ? `${L.listPath(x, tab, city)}?page=${page}` : L.listPath(x, tab, city)),
    title, desc, noindex: !list.rows.length, body,
    ld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: h1, url: S + path }] });
  L.send(res, list.rows.length ? 200 : 404, html, cs.error ? "s-maxage=30" : "s-maxage=300, stale-while-revalidate=3600");
};
