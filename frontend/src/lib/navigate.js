/**
 * Client-side navigation from outside the React Router tree (e.g. HTML
 * overlays inside the 3D scene, which drei renders in their own React
 * root). BrowserRouter listens for popstate, so this behaves like <Link>.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function navigateTo(path) {
  window.history.pushState({}, "", BASE + path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export const hrefFor = (path) => BASE + path;
