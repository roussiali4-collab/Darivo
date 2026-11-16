const L = require("./_lib");

module.exports = async (req, res) => {
  const S = L.site(req);
  const lang = String(req.query.lang || "");
  if (!L.LANGS.includes(lang)) return L.notFound(res, "en", S);
  let raw = String(req.query.slug || "");
  // the slug may arrive percent-encoded (Arabic titles), once or twice depending on the rewrite
  for (let k = 0; k < 2 && /%[0-9a-f]{2}/i.test(raw); k++) { try { raw = decodeURIComponent(raw); } catch (e) { break; } }
  raw = raw.normalize("NFC");
  const id = L.parseId(raw);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return L.notFound(res, lang, S); // junk URL -> 404, not a 503

  const got = await L.sb(L.q({ params: ["id=eq." + encodeURIComponent(id)], limit: 1 }));
  if (got.error) return L.unavailable(res, lang, S);
  const it = got.rows[0];
  if (!it) return L.notFound(res, lang, S);

  const want = L.slug(it);
  if (raw !== want) { // old title / wrong slug -> permanent redirect to the canonical URL
    res.statusCode = 301; res.setHeader("Location", `/${lang}/ad/${encodeURIComponent(want)}`);
    res.setHeader("Cache-Control", "s-maxage=300"); return res.end();
  }

  const tab = L.tabOf(it), city = it.city || "agadir", cn = L.cityName(city, lang);
  // similar ads: same category (and same service type for services/activities), same city first, then other cities
  const sameCat = ["id=neq." + encodeURIComponent(it.id), "c=eq." + encodeURIComponent(it.c)];
  if (it.svc) sameCat.push("svc=eq." + encodeURIComponent(it.svc));
  const [relCity, relAny, rv] = await Promise.all([
    L.sb(L.q({ tab, city, params: sameCat, limit: 8 })),
    L.sb(L.q({ tab, params: sameCat, limit: 16 })),
    L.sb(`reviews?select=name,rating,text,ts&item_id=eq.${encodeURIComponent(it.id)}&order=ts.desc&limit=20`)
  ]);
  const seen = new Set(), relRows = [];
  for (const r of relCity.rows.concat(relAny.rows)) {
    if (seen.has(r.id)) continue;
    seen.add(r.id); relRows.push(r);
    if (relRows.length >= 8) break;
  }
  const rel = { rows: relRows };
  const imgs = L.imgsOf(it), url = S + L.adPath(it, lang);
  const d = L.dOf(it, lang);
  const un = L.unitOf(it);
  const kind = L.REAL.includes(it.c) ? L.tr(L.offKey(it), lang) : L.tr(it.svc || "explore", lang);
  const desc = (d || `${kind} · ${L.tr(it.c, lang)} · ${cn}${it.p > 0 ? " · " + L.money(it.p, lang) : ""}`).replace(/\s+/g, " ").slice(0, 155);
  const title = `${it.n} – ${cn} | Darivo`;
  const phone = /^\d{8,15}$/.test(it.phone || "") ? it.phone : "";
  const waNum = /^\d{9,15}$/.test(it.whatsapp || "") ? it.whatsapp : phone;
  const wa = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent(L.tr("wamsg", lang).replace("{n}", it.n))}` : "";
  const mail = it.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(it.email)
    ? `mailto:${it.email}?subject=${encodeURIComponent(it.n)}&body=${encodeURIComponent(L.tr("wamsg", lang).replace("{n}", it.n) + "\n\n" + url)}` : "";
  const revs = rv.rows;
  const stars = n => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
  const avg = revs.length ? revs.reduce((s, r) => s + (+r.rating || 0), 0) / revs.length : 0;

  const ld = [{
    "@context": "https://schema.org", "@type": "Product", name: it.n, description: d || desc, url, sku: String(it.id),
    ...(imgs.length ? { image: imgs.slice(0, 5) } : {}),
    ...(it.p > 0 ? { offers: { "@type": "Offer", price: String(it.p), priceCurrency: "MAD", availability: "https://schema.org/InStock", url } } : {})
    // NOTE: no aggregateRating here on purpose: reviews are anonymous and unmoderated (self-serving ratings risk a Google structured-data penalty).
  }, {
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: L.tr("home", lang), item: S + "/" },
      { "@type": "ListItem", position: 2, name: L.tr(tab, lang), item: S + L.listPath(lang, tab) },
      { "@type": "ListItem", position: 3, name: cn, item: S + L.listPath(lang, tab, city) },
      { "@type": "ListItem", position: 4, name: it.n, item: url }] }];

  const E = L.esc;
  const amen = (Array.isArray(it.am) ? it.am : []).filter(k => L.TXT[k]);
  const body = `<nav class="bc" aria-label="Breadcrumb"><a href="/">${E(L.tr("home", lang))}</a> › <a href="${L.listPath(lang, tab)}">${E(L.tr(tab, lang))}</a> › <a href="${L.listPath(lang, tab, city)}">${E(cn)}</a></nav>
<article>
<h1>${E(it.n)}</h1>
<div class="m">${L.REAL.includes(it.c) ? `<span class="tg ${L.isSale(it) ? "s" : L.isDaily(it) ? "d" : ""}">${E(kind)}</span> ` : ""}${E([L.tr(it.c, lang), cn, it.a].filter(Boolean).join(" · "))}${it.area > 0 ? ` · ${E(L.nfm(it.area, lang))} ${E(L.tr("sqm", lang))}` : ""}</div>
${imgs.length ? `<div class="gal">${imgs.map((u, k) => `<img src="${E(u)}" alt="${E(it.n)}${k ? " " + (k + 1) : ""}" ${k ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join("")}</div>` : ""}
${it.p > 0 ? `<div class="pr"><b>${E(L.money(it.p, lang))}</b>${un ? " / " + E(L.tr(un, lang)) : ""}</div>` : ""}
<div class="acts">${wa ? `<a class="btn wa" href="${E(wa)}" target="_blank" rel="noopener">💬 ${E(L.tr("wa", lang))}</a>` : ""}${phone ? `<a class="btn alt" href="tel:+${phone}" dir="ltr">📞 ${E(L.tr("call", lang))} · ${E(L.fmtPhone(phone))}</a>` : ""}${mail ? `<a class="btn alt" href="${E(mail)}">✉️ ${E(L.tr("mail", lang))}</a>` : ""}</div>
${d ? `<p class="desc">${E(d).replace(/\n/g, "<br>")}</p>` : ""}
${amen.length ? `<h2>${E(L.tr("amen", lang))}</h2><div class="chips">${amen.map(k => `<span>${E(L.tr(k, lang))}</span>`).join("")}</div>` : ""}
<h2>${E(L.tr("reviews", lang))}${revs.length ? ` · ${stars(avg)} ${avg.toFixed(1)} (${revs.length})` : ""}</h2>
${revs.slice(0, 10).map(r => `<div class="rv"><b>${E(r.name)}</b> <span>${stars(r.rating)}</span> <small>${E(new Date(+r.ts || 0).toISOString().slice(0, 10))}</small><p>${E(r.text)}</p></div>`).join("")}
<p style="margin-top:10px"><a class="btn alt" href="/#ad-${encodeURIComponent(it.id)}" rel="nofollow">${E(L.tr("openapp", lang))}</a></p>
</article>
${rel.rows.length ? `<h2>${E(L.tr("similar", lang))} · ${E(L.tr(it.c === "explore" ? (it.svc || "explore") : it.c, lang))}</h2><div class="grid">${rel.rows.map(x => L.card(x, lang)).join("")}</div>` : ""}`;

  L.send(res, 200, L.shell({ lang, site: S, path: L.adPath(it, lang), pathFor: x => L.adPath(it, x), title, desc,
    image: imgs[0], ogType: "article", ld, body }), "s-maxage=300, stale-while-revalidate=3600");
};
