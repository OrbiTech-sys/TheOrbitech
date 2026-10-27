/**
 * Checks the SEO basics of every page over HTTP, the way a crawler sees them.
 *
 *   node scripts/verify-seo.mjs                                   # local: http://localhost:3000
 *   node scripts/verify-seo.mjs https://theorbitechsolution.com   # the live site
 *
 * Exits with 1 if any check fails. No dependencies: plain fetch and regular expressions.
 */
/* eslint-disable @typescript-eslint/no-unused-expressions -- each check reads as `condition ? ok() : fail()` */

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const origin = "https://theorbitechsolution.com";
// External hosts that structured data may point to: live demos, social profiles, schema.org.
const allowedHosts = [
  "theorbitechsolution.com",
  "schema.org",
  "orbit-operations.vercel.app",
  "propertymanagementsystem-six.vercel.app",
  "aidochat.vercel.app",
  "ecommerceorbitech.vercel.app",
  "www.linkedin.com",
  "www.instagram.com",
  "www.facebook.com",
];
const expectNoindex = new Set(["/privacy"]);

let failures = 0;
const fail = (where, message) => {
  failures += 1;
  console.log(`  ✗ ${where}: ${message}`);
};
const ok = (where, message) => console.log(`  ✓ ${where}: ${message}`);

const toLocal = (url) => (url.startsWith(origin) ? base + url.slice(origin.length) : url);
const pathOf = (url) => new URL(url).pathname;

async function get(url, init) {
  const res = await fetch(url, { redirect: "manual", ...init });
  return { status: res.status, type: res.headers.get("content-type") || "", location: res.headers.get("location"), text: await res.text() };
}

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1];
const metaContent = (html, key, value) => {
  for (const tag of html.match(/<meta [^>]*>/gi) || []) if (attr(tag, key) === value) return attr(tag, "content");
  return undefined;
};
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function visibleText(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<template[\s\S]*?<\/template>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function idRefs(value, out = []) {
  if (Array.isArray(value)) value.forEach((v) => idRefs(v, out));
  else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === "@id") out.push(value["@id"]);
    else Object.values(value).forEach((v) => idRefs(v, out));
  }
  return out;
}
function nodeIds(value, out = new Set()) {
  if (Array.isArray(value)) value.forEach((v) => nodeIds(v, out));
  else if (value && typeof value === "object") {
    if (value["@id"] && Object.keys(value).length > 1) out.add(value["@id"]);
    Object.values(value).forEach((v) => nodeIds(v, out));
  }
  return out;
}
const urlsIn = (text) => [...text.matchAll(/https?:\/\/[^\s"'<>)]+/g)].map((m) => m[0]);

// ── robots.txt and sitemap.xml ───────────────────────────────
console.log(`\nChecking ${base} (canonical origin ${origin})\n\nrobots.txt and sitemap.xml`);
const robots = await get(`${base}/robots.txt`);
if (robots.status !== 200) fail("robots.txt", `status ${robots.status}`);
else {
  robots.text.includes(`Sitemap: ${origin}/sitemap.xml`) ? ok("robots.txt", "Sitemap line points to our host") : fail("robots.txt", "Sitemap line is wrong");
  /Disallow: \/contact\/thanks/.test(robots.text) ? ok("robots.txt", "only /contact/thanks is disallowed") : fail("robots.txt", "missing Disallow: /contact/thanks");
  /Disallow: \/\s*$/m.test(robots.text) && fail("robots.txt", "a rule disallows the whole site");
}

const sitemap = await get(`${base}/sitemap.xml`);
const sitemapUrls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (sitemap.status !== 200) fail("sitemap.xml", `status ${sitemap.status}`);
sitemapUrls.every((u) => u.startsWith(origin)) ? ok("sitemap.xml", `${sitemapUrls.length} URLs, all on ${origin}`) : fail("sitemap.xml", "a URL is on another host");
/changefreq|priority/.test(sitemap.text) ? fail("sitemap.xml", "contains changefreq or priority") : ok("sitemap.xml", "no changefreq or priority");
const caseStudies = sitemapUrls.filter((u) => pathOf(u).startsWith("/work/"));
caseStudies.length === 6 ? ok("sitemap.xml", "all six case studies listed") : fail("sitemap.xml", `${caseStudies.length} case studies listed, expected 6`);
sitemapUrls.some((u) => u.includes("/contact/thanks")) && fail("sitemap.xml", "lists /contact/thanks");

// ── Pages ────────────────────────────────────────────────────
const paths = [...new Set(["/", "/services", "/work", "/studio", "/contact", "/privacy", ...sitemapUrls.map(pathOf)])];
const titles = new Map();
const descriptions = new Map();
const links = new Map();
const pages = new Map();

for (const path of paths) {
  const url = base + path;
  const res = await get(url);
  console.log(`\n${path}`);
  pages.set(path, res.text);
  if (res.status !== 200) {
    fail(path, `status ${res.status}`);
    continue;
  }
  const html = res.text;
  const noindex = /noindex/i.test(metaContent(html, "name", "robots") || "");
  const expected = path === "/" ? origin : origin + path;

  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] || "");
  const description = decode(metaContent(html, "name", "description") || "");
  titles.set(title, [...(titles.get(title) || []), path]);
  descriptions.set(description, [...(descriptions.get(description) || []), path]);
  title ? ok(path, `title (${title.length}) "${title}"`) : fail(path, "no <title>");
  description.length >= 50 ? ok(path, `description (${description.length})`) : fail(path, "missing or short description");

  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  h1s === 1 ? ok(path, "one <h1>") : fail(path, `${h1s} <h1> elements`);
  const mains = (html.match(/<main[\s>]/gi) || []).length;
  mains === 1 || fail(path, `${mains} <main> elements`);

  const canonical = (html.match(/<link [^>]*rel="canonical"[^>]*>/i) || [""])[0];
  attr(canonical, "href") === expected ? ok(path, `canonical ${expected}`) : fail(path, `canonical is ${attr(canonical, "href")}, expected ${expected}`);

  if (expectNoindex.has(path)) noindex ? ok(path, "noindex, as expected until the page is complete") : fail(path, "expected noindex");
  else noindex ? fail(path, "page is noindex") : ok(path, "indexable");
  if (noindex && sitemapUrls.includes(expected)) fail(path, "noindex page is listed in the sitemap");

  for (const [key, value] of [
    ["og:type", "website"],
    ["og:site_name", "The OrbiTech Solutions"],
    ["og:locale", "en_US"],
  ]) {
    metaContent(html, "property", key) === value || fail(path, `${key} is ${metaContent(html, "property", key)}`);
  }
  metaContent(html, "name", "twitter:card") === "summary_large_image" || fail(path, "twitter:card is not summary_large_image");
  for (const key of ["og:image:width", "og:image:height", "og:image:alt"]) metaContent(html, "property", key) || fail(path, `missing ${key}`);
  metaContent(html, "name", "keywords") && fail(path, "has a meta keywords tag");
  for (const [kind, image] of [
    ["og:image", metaContent(html, "property", "og:image")],
    ["twitter:image", metaContent(html, "name", "twitter:image")],
  ]) {
    if (!image || !image.startsWith(`${origin}/`)) {
      fail(path, `${kind} is ${image}`);
      continue;
    }
    const img = await fetch(toLocal(image));
    img.ok && (img.headers.get("content-type") || "").startsWith("image/")
      ? ok(path, `${kind} loads as ${img.headers.get("content-type")}`)
      : fail(path, `${kind} does not load as an image (${img.status})`);
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  blocks.length === 1 ? ok(path, "one JSON-LD block") : fail(path, `${blocks.length} JSON-LD blocks`);
  for (const block of blocks) {
    try {
      const data = JSON.parse(block);
      const known = nodeIds(data);
      const missing = idRefs(data).filter((ref) => !known.has(ref));
      missing.length ? fail(path, `unresolved @id: ${missing.join(", ")}`) : ok(path, "JSON-LD parses and every @id resolves");
      const foreign = urlsIn(block).filter((u) => !allowedHosts.includes(new URL(u).host));
      foreign.length ? fail(path, `JSON-LD points to ${foreign.join(", ")}`) : ok(path, "JSON-LD URLs stay on allowed hosts");
    } catch (error) {
      fail(path, `JSON-LD does not parse: ${error.message}`);
    }
  }

  // The template's old domain, written so this file does not match its own search.
  new RegExp("orbitech" + "\\.dev", "i").test(html) && fail(path, "mentions the old template domain");
  const placeholder = visibleText(html).match(/\[\s?[A-Za-z][^\]]{1,80}\]/);
  placeholder ? fail(path, `visible placeholder ${placeholder[0]}`) : ok(path, "no visible [ … ] placeholder");

  const hrefs = [...html.matchAll(/<a [^>]*href="([^"]+)"/gi)].map((m) => decode(m[1]));
  links.set(path, hrefs);
}

const dupes = (map, label) => {
  for (const [value, where] of map) where.length > 1 && fail(label, `"${value}" is shared by ${where.join(", ")}`);
};
console.log("\nUniqueness");
dupes(titles, "title");
dupes(descriptions, "description");
ok("titles", `${titles.size} distinct across ${paths.length} pages`);

// ── Internal links ───────────────────────────────────────────
console.log("\nInternal links");
const internal = new Set();
for (const hrefs of links.values())
  for (const href of hrefs) {
    if (href.startsWith("/") && !href.startsWith("//")) internal.add(href.split("#")[0] || "/");
    else if (href.startsWith(origin)) internal.add(pathOf(href));
  }
for (const href of internal) {
  const res = await get(base + href);
  if (res.status !== 200) fail(href, `internal link returns ${res.status}${res.location ? ` → ${res.location}` : ""}`);
}
ok("links", `${internal.size} distinct internal targets checked`);

// Click depth from the home page, following real <a href> links only.
const depth = new Map([["/", 0]]);
let frontier = ["/"];
for (let d = 1; d <= 3 && frontier.length; d++) {
  const nextFrontier = [];
  for (const page of frontier) {
    for (const href of links.get(page) || []) {
      const target = href.startsWith("/") ? href.split("#")[0] || "/" : null;
      if (target && !depth.has(target)) {
        depth.set(target, d);
        nextFrontier.push(target);
      }
    }
  }
  frontier = nextFrontier;
}
for (const url of sitemapUrls) {
  const d = depth.get(pathOf(url));
  d !== undefined && d <= 2 ? ok(pathOf(url), `${d} click(s) from home`) : fail(pathOf(url), "not reachable within two clicks of home");
}
const homeLinks = links.get("/") || [];
for (const route of ["/services", "/work", "/studio", "/contact", "/privacy"]) {
  homeLinks.includes(route) || fail("nav/footer", `home page does not link to ${route}`);
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
