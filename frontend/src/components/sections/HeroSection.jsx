import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarCheck, Download, MapPin } from "lucide-react";
import { profile } from "../../data/profile";
import { useUniverse } from "../../store/universe";
import { scrollToSection } from "../../hooks/useScrollStations";
import { prefillContact } from "../../lib/contact";
import SocialLinks from "../ui/SocialLinks";
import HoloPortrait from "../ui/HoloPortrait";
import NetworkGlobe from "../hero/NetworkGlobe";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
const item = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * First screen: a professional introduction. Name, roles, tagline, a
 * short "about me", focus areas and calls to action on the left; the
 * holographic portrait stands in front of the 3D globe on the right
 * (above the text on phones).
 */
export default function HeroSection() {
  const done = useUniverse((s) => s.introDone);
  const lite = useUniverse((s) => s.mode === "lite");
  const atTop = useUniverse((s) => s.station === 0);
  const roles = profile.title.split(" | ");

  return (
    <section
      id="home"
      aria-labelledby="hero-name"
      data-station="0"
      className="pointer-events-none relative flex min-h-[100svh] items-center overflow-x-clip pt-24 pb-24 lg:pt-28"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8">
        {/* Text is painted immediately (no entrance animation): it's the page's main content. */}
        <motion.div
          variants={container}
          initial={false}
          animate={done ? "show" : "hidden"}
          className="pointer-events-auto order-2 max-w-xl lg:order-1"
        >
          {profile.availability.open && (
            <motion.div variants={item}>
              <button
                type="button"
                onClick={() => prefillContact()}
                className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2.5 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping-soft absolute inset-0 rounded-full bg-signal" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-signal" />
                </span>
                {profile.availability.label}
              </button>
            </motion.div>
          )}

          <motion.h1
            id="hero-name"
            variants={item}
            className="mt-6 font-display text-[2.15rem] leading-[1.05] font-semibold tracking-tight text-fg uppercase [text-shadow:0_2px_30px_rgba(5,5,5,0.9)] sm:text-5xl lg:text-[3.6rem]"
          >
            {/* Last name in red, like a brand mark */}
            {profile.name.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-cyan">{profile.name.split(" ").slice(-1)}</span>
          </motion.h1>

          <motion.ul variants={item} className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5" aria-label="Roles">
            {roles.map((role, i) => (
              <li
                key={role}
                className="flex items-center gap-3 font-mono text-[12px] tracking-wide text-holo-cyan sm:text-[13px]"
              >
                {i > 0 && <span className="h-1 w-1 rounded-full bg-holo-purple" aria-hidden="true" />}
                {role}
              </li>
            ))}
          </motion.ul>

          <motion.p
            variants={item}
            className="mt-6 font-sans text-[1.35rem] leading-snug font-semibold tracking-tight text-fg [text-shadow:0_2px_24px_rgba(5,5,5,0.9)] sm:text-[1.65rem]"
          >
            {profile.valueLine}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-5 text-base leading-relaxed text-fg-muted [text-shadow:0_1px_20px_rgba(5,5,5,0.95)] sm:text-[17px]"
          >
            {profile.intro}
          </motion.p>

          <motion.p variants={item} className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
            <MapPin size={15} className="shrink-0 text-holo-cyan" aria-hidden="true" />
            {profile.timezones}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            {profile.links.calendly ? (
              <a href={profile.links.calendly} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                <CalendarCheck size={18} aria-hidden="true" />
                Book a free call
              </a>
            ) : (
              <button
                type="button"
                onClick={() => prefillContact("", "I'd like to book a free call about ")}
                className="btn-primary group"
              >
                <CalendarCheck size={18} aria-hidden="true" />
                Book a free call
              </button>
            )}
            <button type="button" onClick={() => scrollToSection("projects")} className="btn-ghost group">
              See my work
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download className="btn-ghost">
                <Download size={18} aria-hidden="true" />
                Download CV
              </a>
            )}
            <SocialLinks includeEmail={false} className="sm:ml-1" />
          </motion.div>

          {profile.trust.length > 0 && (
            <motion.ul
              variants={item}
              aria-label="Background"
              className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-[13px] text-fg-muted"
            >
              {profile.trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-holo-cyan" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={done ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto relative order-1 mx-auto w-full max-w-[14rem] sm:max-w-[17rem] lg:order-2 lg:max-w-[21rem]"
        >
          {lite && (
            <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2">
              <NetworkGlobe />
            </div>
          )}
          <HoloPortrait large />
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToSection("projects")}
        initial={{ opacity: 0 }}
        animate={{ opacity: done && atTop ? 1 : 0 }}
        transition={{ delay: atTop ? 0.6 : 0, duration: 0.6 }}
        className="pointer-events-auto absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-fg-subtle uppercase hover:text-fg sm:flex"
      >
        Scroll to explore
        <ArrowDown size={14} className="animate-bounce motion-reduce:animate-none" />
      </motion.button>
    </section>
  );
}
