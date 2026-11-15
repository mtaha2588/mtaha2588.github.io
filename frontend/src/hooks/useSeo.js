import { useEffect } from "react";
import { SITE, pageTitle } from "../data/site";

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/**
 * Per-page <title>, description, canonical URL and Open Graph / Twitter tags.
 * The same tags are pre-rendered into each page's static HTML at build time
 * (scripts/postbuild.mjs), so crawlers that don't run JavaScript see them too.
 */
export function useSeo({ title, description, path = "/", image } = {}) {
  useEffect(() => {
    const fullTitle = pageTitle(title);
    const desc = description || SITE.description;
    const url = SITE.url + (path === "/" ? "/" : path);
    const img = SITE.url + (image || SITE.image);

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, image]);
}
