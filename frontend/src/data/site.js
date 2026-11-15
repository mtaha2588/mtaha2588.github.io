/**
 * Site-wide SEO settings, shared by the app (runtime <head> updates) and
 * scripts/postbuild.mjs (static per-page HTML for GitHub Pages).
 * Plain JS with no imports, so Node can load it too.
 */
const env = (typeof import.meta !== "undefined" && import.meta.env) || {};
const nodeEnv = (typeof process !== "undefined" && process.env) || {};

export const SITE = {
  url: (env.VITE_SITE_URL || nodeEnv.SITE_URL || "https://mtaha2588.github.io").replace(/\/+$/, ""),
  name: "Muhammad Taha",
  title: "Muhammad Taha | AI Automation, Machine Learning & Web Development",
  description:
    "Muhammad Taha builds AI automations, machine-learning and computer-vision systems, business websites and geospatial analysis for startups and small businesses. Based in Pakistan, working with US, UK and EU time zones.",
  image: "/og-image.png",
  twitter: "", // e.g. "@yourhandle" (optional)
};

/** "Case study | Muhammad Taha" style titles; the home page uses SITE.title. */
export const pageTitle = (title) => (title ? `${title} | ${SITE.name}` : SITE.title);
