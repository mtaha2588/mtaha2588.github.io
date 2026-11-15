import { Suspense, lazy, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, universe, useUniverse } from "../store/universe";
import { exhibits, useExhibits } from "../store/exhibits";
import { focusExhibit, lockScroll } from "../lib/focus";
import { useScrollStations } from "../hooks/useScrollStations";
import { useSeo } from "../hooks/useSeo";
import { wakeApi } from "../store/apiStatus";
import { useExhibitData } from "../hooks/useExhibitData";
import { EXHIBITS } from "../three/exhibits/layout";
import Hud from "../components/universe/Hud";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import ExhibitionsOverview from "../components/sections/ExhibitionsOverview";
import LazySection from "../components/layout/LazySection";
import { renderAllSections, whenSectionsReady } from "../lib/renderAll";
import Footer from "../components/layout/Footer";

// Everything below the first two screens is code-split and loads as it's needed.
const ExhibitSection = lazy(() => import("../components/sections/ExhibitSection"));
const SlopeAssessor = lazy(() => import("../components/demos/SlopeAssessor"));
const WorkflowRunner = lazy(() => import("../components/demos/WorkflowRunner"));
const LeadSimulator = lazy(() => import("../components/demos/LeadSimulator"));
const LabSection = lazy(() => import("../components/sections/LabSection"));
const SkillsSection = lazy(() => import("../components/sections/SkillsSection"));
const AboutSection = lazy(() => import("../components/sections/AboutSection"));
const ContactSection = lazy(() => import("../components/sections/ContactSection"));
const GallerySection = lazy(() => import("../components/sections/GallerySection"));
const FaqSection = lazy(() => import("../components/sections/FaqSection"));
// 3D-only overlays.
const FocusOverlay = lazy(() => import("../components/universe/FocusOverlay"));
const Intro = lazy(() => import("../components/universe/Intro"));

/**
 * The main experience. Layers, back to front:
 *   UniverseStage - fixed WebGL canvas (or the CSS backdrop in 2D mode)
 *   <main>        - scrollable HTML sections; each one is a camera station
 *   Hud           - fixed navigation & readouts
 *   Intro         - the cinematic opening overlay
 */
export default function UniversePage() {
  useSeo({ path: "/" });
  useExhibitData();
  useEffect(() => wakeApi(), []);
  const mode = useUniverse((s) => s.mode);
  const immersive = mode === "immersive";

  useEffect(() => {
    if (!immersive) universe.set({ introDone: true });
  }, [immersive]);

  useScrollStations(immersive);

  const focused = useExhibits((s) => s.focused);
  const introDone = useUniverse((s) => s.introDone);
  const { hash, search } = useLocation();
  const navigate = useNavigate(); // stable across renders
  const focusParam = new URLSearchParams(search).get("focus");

  // Arriving with #section (e.g. "Back to the universe" from a case study): scroll there.
  useEffect(() => {
    if (!introDone || !hash) return;
    // The target and everything above it must be real content (not placeholders) before scrolling.
    renderAllSections();
    let live = true;
    whenSectionsReady(() => live && document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" }));
    return () => {
      live = false;
    };
  }, [introDone, hash]);

  // Arriving with ?focus=<exhibit> ("Explore in 3D" on a case study): fly straight into focus mode.
  useEffect(() => {
    if (!introDone || !focusParam || !immersive) return;
    const id = setTimeout(() => {
      focusExhibit(focusParam);
      navigate({ pathname: "/", search: "" }, { replace: true });
    }, 300);
    return () => clearTimeout(id);
  }, [introDone, focusParam, immersive, navigate]);

  // Leaving the page must never leave scrolling locked or the camera in focus mode.
  useEffect(
    () => () => {
      exhibits.set({ focused: null, hovered: null });
      Object.assign(motion.focus, { blend: 0, zoom: 1 });
      motion.focusKey = null;
      lockScroll(false);
      document.documentElement.style.overflow = "";
      document.body.style.cursor = "";
    },
    [],
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-ink-800 focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      {/* HUD comes first in the DOM so keyboard users reach the navigation right after the skip link. */}
      <Hud />
      <main
        id="main"
        aria-hidden={focused ? true : undefined}
        // pointer-events-none on <main> itself: only its panels take clicks, so pointer events reach the 3D scene behind it.
        className={`pointer-events-none relative z-10 transition-opacity duration-700 ${focused ? "opacity-0 [&_*]:!pointer-events-none" : "opacity-100"}`}
      >
        <HeroSection />
        {/* Below the fold: in 2D mode each section renders as the visitor approaches it. */}
        <LazySection id="services" station={1}>
          <ServicesSection />
        </LazySection>
        <LazySection id="projects" station={2}>
          <ExhibitionsOverview />
        </LazySection>
        <LazySection id={EXHIBITS.avalanche.sectionId} station={3}>
          <ExhibitSection ex={EXHIBITS.avalanche} station={3} number="01" demo={<SlopeAssessor />} />
        </LazySection>
        <LazySection id={EXHIBITS.agent.sectionId} station={4}>
          <ExhibitSection ex={EXHIBITS.agent} station={4} number="02" demo={<WorkflowRunner />} variant="holo" />
        </LazySection>
        <LazySection id={EXHIBITS.car.sectionId} station={5}>
          <ExhibitSection ex={EXHIBITS.car} station={5} number="03" demo={<LeadSimulator />} />
        </LazySection>
        <LazySection id="gallery" station={6}>
          <GallerySection />
        </LazySection>
        <LazySection id="lab" station={7}>
          <LabSection />
        </LazySection>
        <LazySection id="skills" station={8}>
          <SkillsSection />
        </LazySection>
        <LazySection id="about" station={9}>
          <AboutSection />
        </LazySection>
        <LazySection id="contact" station={10}>
          <ContactSection />
        </LazySection>
        <LazySection id="faq">
          <FaqSection />
        </LazySection>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      {immersive && (
        <Suspense fallback={null}>
          <FocusOverlay />
          <Intro />
        </Suspense>
      )}
    </>
  );
}
