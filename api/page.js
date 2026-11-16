const L = require("./_lib");
const LEGAL = require("./_legal");

// About / Contact / Terms / Privacy as real, crawlable pages: /{lang}/{about|contact|terms|privacy}
module.exports = (req, res) => {
  const S = L.site(req);
  const lang = String(req.query.lang || ""), page = String(req.query.page || "");
  if (!L.LANGS.includes(lang) || !L.PAGES.includes(page)) return L.notFound(res, lang, S);

  const E = L.esc, B = L.BUSINESS;
  const own = LEGAL[lang] && LEGAL[lang][page];
  const lines = own || LEGAL.en[page];            // every language has its own text; English is only a safety net
  const title = L.tr(page, lang);
  const f = x => x.replace(/\{name\}/g, B.name).replace(/\{email\}/g, B.email).replace(/\{site\}/g, S);
  const ph = String(B.whatsapp || "").replace(/\D/g, "");

  const contacts = `<div class="co"><p><a href="mailto:${E(B.email)}">✉️ ${E(B.email)}</a></p>` +
    (/^\d{9,15}$/.test(ph)
      ? `<p dir="ltr"><a href="tel:+${ph}">📞 +${ph}</a></p><p><a href="https://wa.me/${ph}" target="_blank" rel="noopener">💬 WhatsApp</a></p>`
      : "") + `</div>`;

  const html = lines.map(x => {
    if (x === "{contacts}") return contacts;
    const y = E(f(x));
    if (y.startsWith("§ ")) return `<h2>${y.slice(2)}</h2>`;
    if (y.startsWith("¶ ")) return `<p><b>${y.slice(2)}</b></p>`;
    if (y.startsWith("• ")) return `<p class="li">${y}</p>`;
    return `<p>${y.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>')}</p>`;
  }).join("\n");

  const first = lines.find(x => x !== "{contacts}" && !/^(§|¶|•)/.test(x)) || title;
  const desc = f(first).replace(/\s+/g, " ").slice(0, 155);
  const path = `/${lang}/${page}`;
  const type = page === "about" ? "AboutPage" : page === "contact" ? "ContactPage" : "WebPage";

  const body = `<nav class="bc"><a href="/">${E(L.tr("home", lang))}</a> › ${E(title)}</nav>
<article class="doc"${own ? "" : ' lang="en" dir="ltr"'}>
<h1>${E(title)}</h1>
${html}
</article>`;

  L.send(res, 200, L.shell({ lang, site: S, path, pathFor: x => `/${x}/${page}`, title: `${title} | ${B.name}`, desc, body,
    ld: [{ "@context": "https://schema.org", "@type": type, name: title, url: S + path }] }),
    "s-maxage=3600, stale-while-revalidate=86400");
};
