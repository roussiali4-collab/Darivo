const L = require("./_lib");
module.exports = (req, res) => {
  L.send(res, 200, `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${L.site(req)}/sitemap.xml\n`, "s-maxage=3600", "text/plain; charset=utf-8");
};
