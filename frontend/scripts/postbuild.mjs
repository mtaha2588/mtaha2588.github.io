/**
 * Runs after `vite build` (see package.json "build"). Prepares dist/ for GitHub Pages:
 *
 *  1. One static HTML file per page (/, /projects/<slug>, /notes, /notes/<slug>) with that
 *     page's <title>, description, canonical and Open Graph tags. GitHub Pages then serves
 *     deep links with HTTP 200 and crawlers see the right metadata without running JS.
 *  2. 404.html: SPA fallback for any other URL (noindex).
 *  3. .nojekyll: tells GitHub Pages to serve files as-is.
 *  4. sitemap.xml generated from projects.json and the notes.
 *  5. JSON-LD (Person + ProfessionalService) in every page.
 */
import { mkdirSync, readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, pageTitle } from "../src/data/site.js";
import { profile } from "../src/data/profile.js";
import { SERVICES } from "../src/data/services.js";
import { parseFrontMatter, noteSlug } from "../src/lib/frontmatter.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const projects = JSON.parse(readFileSync(join(root, "src/data/projects.json"), "utf8"));
const notesDir = join(root, "src/content/notes");
const notes = existsSync(notesDir)
  ? readdirSync(notesDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({ slug: noteSlug(f), ...parseFrontMatter(readFileSync(join(notesDir, f), "utf8")).data }))
      .filter((n) => !n.draft)
  : [];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function head({ title, description, path, type = "website", image }) {
  const t = esc(pageTitle(title));
  const d = esc(description || SITE.description);
  const url = SITE.url + path;
  const img = SITE.url + (image ? `/${image}` : SITE.image);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="${image ? 960 : 1200}" />`,
    `<meta property="og:image:height" content="${image ? 600 : 630}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    SITE.twitter ? `<meta name="twitter:site" content="${esc(SITE.twitter)}" />` : "",
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

function jsonLd() {
  const sameAs = [profile.github, profile.linkedin, profile.links?.fiverr, profile.links?.upwork].filter(Boolean);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE.url + "/",
    image: SITE.url + SITE.image,
    jobTitle: "AI Automation & Machine Learning Engineer",
    description: SITE.description,
    address: { "@type": "PostalAddress", addressLocality: "Rawalpindi", addressCountry: "PK" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "National University of Sciences and Technology (NUST)" },
    knowsAbout: [
      "AI automation",
      "AI agents",
      "Machine learning",
      "Computer vision",
      "Web development",
      "Google Earth Engine",
      "Geospatial analysis",
    ],
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${profile.name}: AI, Machine Learning & Web Development`,
    url: SITE.url + "/",
    image: SITE.url + SITE.image,
    description: SITE.description,
    areaServed: ["US", "GB", "EU", "Worldwide"],
    address: { "@type": "PostalAddress", addressLocality: "Rawalpindi", addressCountry: "PK" },
    founder: { "@type": "Person", name: profile.name },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.summary },
        ...(s.startingPrice
          ? { priceSpecification: { "@type": "PriceSpecification", minPrice: s.startingPrice, priceCurrency: "USD" } }
          : {}),
      })),
    },
  };
  return [person, business]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`)
    .join("\n    ");
}

/*
 * Static first paint: each page's HTML carries its heading and summary inside
 * #root, so text appears as soon as the CSS arrives instead of after the
 * JavaScript bundle runs. React replaces it on start-up. Classes are copied
 * from the real components so the hand-over is seamless (and they exist in
 * the compiled CSS).
 */
function shell(page) {
  if (page.path === "/" && !page.notFound) {
    const roles = profile.title.split(" | ").map(esc).join(" · ");
    return `<section class="relative flex min-h-[100svh] items-center pt-24 pb-24 lg:pt-28"><div class="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8"><div class="max-w-xl">
      <h1 class="mt-6 font-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight text-fg uppercase sm:text-5xl lg:text-[3.6rem]">${esc(profile.name.split(" ").slice(0, -1).join(" "))} <span class="text-cyan">${esc(profile.name.split(" ").slice(-1)[0])}</span></h1>
      <p class="mt-4 font-mono text-[12px] tracking-wide text-holo-cyan sm:text-[13px]">${roles}</p>
      <p class="mt-6 font-sans text-[1.35rem] leading-snug font-semibold tracking-tight text-fg sm:text-[1.65rem]">${esc(profile.valueLine)}</p>
      <p class="mt-5 text-base leading-relaxed text-fg-muted sm:text-[17px]">${esc(profile.intro)}</p>
      <p class="mt-4 text-sm text-fg-muted">${esc(profile.timezones)}</p>
      <p class="mt-8 flex flex-wrap gap-3"><a class="btn-primary" href="#contact">Book a free call</a><a class="btn-ghost" href="#projects">See my work</a></p>
    </div></div></section>`;
  }
  return `<main class="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <h1 class="mt-14 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">${esc(page.heading || page.title)}</h1>
      ${page.description ? `<p class="mt-4 max-w-3xl text-lg text-fg-muted">${esc(page.description)}</p>` : ""}
    </main>`;
}

const template = readFileSync(join(dist, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error('index.html is missing <div id="root"></div>');
if (!template.includes("<!--seo:start")) throw new Error("index.html is missing the <!--seo:start--> marker");
const ld = jsonLd();
const render = (page, extraHead = "") =>
  template
    .replace(/<!--seo:start[\s\S]*?<!--seo:end-->/, head(page) + (extraHead ? `\n    ${extraHead}` : ""))
    .replace("<!--jsonld-->", ld)
    .replace('<div id="root"></div>', `<div id="root">${shell(page)}</div>`);

const pages = [
  { path: "/", priority: "1.0" },
  ...projects.map((p) => ({
    path: `/projects/${p.slug}`,
    title: `${p.title}: case study`,
    heading: p.title,
    description: p.summary,
    image: p.thumbnail,
    type: "article",
    priority: "0.8",
  })),
  ...(notes.length
    ? [
        {
          path: "/notes",
          title: "Notes",
          heading: "Notes on AI, ML & the web",
          description: `Notes by ${SITE.name} on AI automation, machine learning and web development.`,
          priority: "0.6",
        },
        ...notes.map((n) => ({
          path: `/notes/${n.slug}`,
          title: n.title,
          description: n.description,
          type: "article",
          priority: "0.5",
          lastmod: n.date,
        })),
      ]
    : []),
];

for (const page of pages) {
  const file = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page));
}

writeFileSync(
  join(dist, "404.html"),
  render(
    { path: "/", title: "Page not found", notFound: true, heading: "Page not found" },
    '<meta name="robots" content="noindex" />',
  ),
);
writeFileSync(join(dist, ".nojekyll"), "");

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) =>
      `  <url><loc>${SITE.url}${p.path === "/" ? "/" : p.path}</loc><lastmod>${p.lastmod || today}</lastmod><priority>${p.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

console.log(`postbuild: ${pages.length} pages, 404.html, .nojekyll, sitemap.xml (${pages.length} URLs), robots.txt`);
