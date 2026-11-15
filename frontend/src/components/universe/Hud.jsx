import { useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { Box, Menu, MessageSquareQuote, X } from "lucide-react";
import { profile } from "../../data/profile";
import { universe, useUniverse } from "../../store/universe";
import { scrollToSection as scrollTo } from "../../hooks/useScrollStations";
import { exitFocus } from "../../lib/focus";
import { useExhibits } from "../../store/exhibits";

// Navigating from the HUD always leaves focus mode first.
const scrollToSection = (id) => {
  exitFocus();
  scrollTo(id);
};
import { STATIONS } from "../../three/stations";
import { SECTIONS } from "../../data/sections";
import ApiStatusDot from "../ui/ApiStatusDot";
import { prefillContact } from "../../lib/contact";

function ModeToggle() {
  const mode = useUniverse((s) => s.mode);
  const webgl = useUniverse((s) => s.webgl);
  const immersive = mode === "immersive";
  return (
    <button
      type="button"
      onClick={() => universe.setMode(immersive ? "lite" : "immersive")}
      disabled={!webgl}
      title={
        webgl
          ? immersive
            ? "Switch to the lightweight 2D version"
            : "Switch to the immersive 3D version"
          : "3D needs WebGL, which this browser doesn't support"
      }
      className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] whitespace-nowrap text-fg-muted uppercase transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
    >
      {immersive ? <Box size={14} className="text-cyan" aria-hidden="true" /> : <Box size={14} aria-hidden="true" />}
      <span className="sm:hidden">{immersive ? "2D" : "3D"}</span>
      <span className="hidden sm:inline">{immersive ? "2D view" : "View in 3D"}</span>
    </button>
  );
}

export default function Hud() {
  const done = useUniverse((s) => s.introDone);
  const station = useUniverse((s) => s.station);
  const focused = useExhibits((s) => s.focused);
  const mode = useUniverse((s) => s.mode);
  const current = STATIONS[Math.min(station, STATIONS.length - 1)];
  const activeId = SECTIONS.find((s) => s.stations.includes(station))?.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <m.div
      initial={false}
      animate={{ opacity: done ? 1 : 0 }}
      transition={{ duration: 0.9 }}
      className={done ? "" : "pointer-events-none"}
    >
      <header className="fixed inset-x-0 top-0 z-40">
        {/* Soft backdrop so page content scrolling underneath never collides with the nav */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-ink-950/90 via-ink-950/55 to-transparent" />
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8"
          aria-label="Main"
        >
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="group flex items-center gap-3 text-left"
          >
            <span className="gradient-border relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-850/80 font-display text-sm font-bold text-fg backdrop-blur">
              {profile.initials}
              <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan">AI INTELLIGENCE UNIVERSE</span>
              <span className="font-display text-sm font-semibold text-fg">{profile.name}</span>
            </span>
            <span className="sr-only">Back to top</span>
          </button>

          <ul className="glass hidden items-center gap-1 rounded-full p-1 md:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  aria-current={activeId === s.id ? "true" : undefined}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeId === s.id ? "text-fg" : "text-fg-muted hover:text-fg"}`}
                >
                  {activeId === s.id && (
                    <m.span
                      layoutId="hud-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-holo-cyan/50 bg-gradient-to-r from-holo-cyan/20 via-holo-blue/20 to-holo-purple/25 shadow-[0_0_18px_-2px_rgba(0,229,255,0.55)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ApiStatusDot className="hidden sm:inline-flex" />
            <ModeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="glass grid h-9 w-9 place-items-center rounded-full text-fg md:hidden"
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <m.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mx-4 rounded-2xl border border-line-strong bg-ink-950/95 p-2 shadow-2xl backdrop-blur md:hidden"
            >
              <ul>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(s.id)}
                      aria-current={activeId === s.id ? "true" : undefined}
                      className={`w-full rounded-xl px-4 py-3 text-left text-base ${activeId === s.id ? "bg-white/[0.06] text-fg" : "text-fg-muted"}`}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-line px-4 pt-3 pb-2">
                <ApiStatusDot />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {/* Phones: a persistent "Hire me" button, shown after the hero (which has its own call button) and hidden at the contact form. */}
      {!focused && activeId !== "contact" && activeId !== "home" && (
        <button
          type="button"
          onClick={() => prefillContact()}
          className="btn-primary fixed right-4 bottom-4 z-40 !px-5 !py-3 shadow-[0_10px_30px_-8px_rgba(0,229,255,0.6)] md:hidden"
        >
          <MessageSquareQuote size={18} aria-hidden="true" />
          Hire me
        </button>
      )}

      {/* Station readout: desktop only, purely informational. */}
      {mode === "immersive" && !focused && (
        <div
          className="pointer-events-none fixed bottom-8 left-3 z-30 hidden rotate-180 font-mono text-[10px] tracking-[0.25em] text-fg-subtle uppercase [writing-mode:vertical-rl] min-[1400px]:flex min-[1400px]:items-center min-[1400px]:gap-3"
          aria-hidden="true"
        >
          <p>
            Sector {String(station + 1).padStart(2, "0")} / {String(STATIONS.length).padStart(2, "0")}
            <span className="mx-2 text-cyan">·</span>
            {current?.label}
          </p>
          <div className="flex flex-col gap-1.5">
            {STATIONS.map((s, i) => (
              <span
                key={s.id}
                className={`h-8 w-0.5 transition-colors duration-500 ${i === station ? "bg-cyan" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>
      )}
    </m.div>
  );
}
