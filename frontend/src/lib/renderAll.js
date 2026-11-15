import { useSyncExternalStore } from "react";

/*
 * "Render every section now" switch for LazySection. Flipped by in-page
 * navigation (scrollToSection) so a jump to #contact lands on real
 * content, with every section above it already at its final height.
 */
let renderAll = false;
const listeners = new Set();

export function renderAllSections() {
  if (renderAll) return false;
  renderAll = true;
  listeners.forEach((l) => l());
  return true;
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useRenderAll = () => useSyncExternalStore(subscribe, () => renderAll);

/**
 * Calls `fn` once no section placeholders remain (their code has loaded and
 * rendered), or after `timeoutMs` at the latest.
 */
export function whenSectionsReady(fn, timeoutMs = 4000) {
  const start = performance.now();
  const check = () => {
    const waiting = document.querySelector("[data-section-placeholder]");
    if (!waiting || performance.now() - start > timeoutMs) fn();
    else requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
}
