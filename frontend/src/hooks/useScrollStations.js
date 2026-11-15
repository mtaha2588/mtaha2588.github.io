import { useEffect } from "react";
import { motion, universe } from "../store/universe";
import { renderAllSections, whenSectionsReady } from "../lib/renderAll";

/**
 * Connects page scrolling to the 3D camera.
 *
 * Every <section data-station="N"> gets a GSAP ScrollTrigger. While a
 * section passes through the middle of the screen, its progress is
 * turned into a continuous station value (e.g. 1.3 = 30% of the way
 * from station 1 to 2), which CameraRig reads every frame.
 *
 * GSAP's ScrollTrigger is loaded only in 3D mode: the 2D version never needs it.
 */
export function useScrollStations(enabled) {
  useEffect(() => {
    if (!enabled) return trackSectionsLite();
    let cancelled = false;
    let cleanup = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      let detach = attach(ScrollTrigger);
      // Code-split sections replace their placeholders as they load: rebuild the triggers then.
      let pending = 0;
      const mo = new MutationObserver(() => {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => {
          detach();
          detach = attach(ScrollTrigger);
        });
      });
      const main = document.getElementById("main");
      if (main) mo.observe(main, { childList: true });
      cleanup = () => {
        mo.disconnect();
        cancelAnimationFrame(pending);
        detach();
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);
}

/**
 * 2D mode: no camera, but the HUD still needs to know which section is on
 * screen (nav highlight, mobile "Hire me" button). A section counts as
 * current while it crosses the middle of the viewport.
 */
function trackSectionsLite() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) universe.set({ station: Number(e.target.dataset.station) });
      }
    },
    { rootMargin: "-50% 0px -50% 0px" },
  );
  const observeAll = () => document.querySelectorAll("[data-station]").forEach((s) => io.observe(s));
  observeAll();
  // Lazily rendered sections replace their placeholders: watch the new elements too.
  const mo = new MutationObserver(observeAll);
  const main = document.getElementById("main");
  if (main) mo.observe(main, { childList: true });
  return () => {
    io.disconnect();
    mo.disconnect();
  };
}

/** Creates one ScrollTrigger per [data-station] section; returns a cleanup function. */
function attach(ScrollTrigger) {
  const sections = [...document.querySelectorAll("[data-station]")];
  const last = sections.length - 1;

  const triggers = sections.map((section) => {
    const index = Number(section.dataset.station);
    const update = (self) => {
      const value = Math.min(Math.max(index + self.progress - 0.5, 0), last);
      motion.station = value;
      universe.set({ station: Math.round(value) });
    };
    return ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onUpdate: update,
      onToggle: (self) => self.isActive && update(self),
    });
  });

  ScrollTrigger.refresh();
  return () => triggers.forEach((t) => t.kill());
}

export function scrollToSection(id) {
  // In 2D mode later sections may still be placeholders: render them all, then scroll.
  if (renderAllSections() || document.querySelector("[data-section-placeholder]")) {
    whenSectionsReady(() => scrollNow(id));
    return;
  }
  scrollNow(id);
}

function scrollNow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  // Sections that finish rendering mid-scroll can move the target: correct once it settles.
  setTimeout(() => {
    const top = document.getElementById(id)?.getBoundingClientRect().top ?? 0;
    if (Math.abs(top) > 8) document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
  }, 1400);
}
