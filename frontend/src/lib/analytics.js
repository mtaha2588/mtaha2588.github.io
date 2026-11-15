/**
 * Optional, privacy-friendly page-view counting with GoatCounter
 * (no cookies, no personal data). Enabled only when the build has
 * VITE_GOATCOUNTER_CODE set (e.g. "mtaha" for mtaha.goatcounter.com);
 * otherwise nothing is loaded.
 */
const CODE = (import.meta.env.VITE_GOATCOUNTER_CODE || "").trim();
let loading = null;

function load() {
  if (!CODE || typeof document === "undefined") return null;
  loading ??= new Promise((resolve) => {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
    // Count manually so single-page navigation is tracked too.
    s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
    s.onload = () => resolve(window.goatcounter);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return loading;
}

/** Records one page view for `path` (no-op when analytics is off or blocked). */
export function trackPageView(path) {
  load()?.then((gc) => gc?.count?.({ path }));
}
