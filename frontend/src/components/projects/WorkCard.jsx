import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Lock, PlayCircle } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import ProjectVisual from "./ProjectVisual";
import { GithubIcon } from "../ui/BrandIcons";
import { scrollToSection } from "../../hooks/useScrollStations";

const BASE = import.meta.env.BASE_URL;

/**
 * One project in the work list: thumbnail, title, status, stack,
 * highlights, then "GitHub repository ↗ · Live demo ↗ · Case study".
 * Each link appears only when it exists:
 *  - Live demo: the hosted app (links.demo) if there is one, otherwise
 *    the interactive demo on this page (exhibit.sectionId).
 *  - GitHub repository: only for public repos (links.github).
 */
export default function WorkCard({ project, index, exhibit, active, onHover }) {
  const { links = {} } = project;
  const tech = project.technologies?.slice(0, 4) ?? [];
  const points = project.highlights?.slice(0, 3) ?? [];
  const hover = onHover
    ? {
        onPointerEnter: () => onHover(true),
        onPointerLeave: () => onHover(false),
        onFocus: () => onHover(true),
        onBlur: () => onHover(false),
      }
    : {};

  const linkClass =
    "inline-flex items-center gap-1 rounded text-sm font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-cyan hover:decoration-cyan";

  return (
    <article
      {...hover}
      className={`glass group flex h-full flex-col overflow-hidden rounded-2xl !bg-ink-950/80 transition-colors sm:flex-row lg:flex-col ${active ? "border-cyan/50" : "hover:border-cyan/30"}`}
    >
      <Link
        to={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[16/10] shrink-0 overflow-hidden border-b border-line bg-ink-900 sm:aspect-auto sm:w-[40%] sm:border-r sm:border-b-0 lg:aspect-[16/10] lg:w-full lg:border-r-0 lg:border-b"
      >
        {project.thumbnail ? (
          <img
            src={BASE + project.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            width="960"
            height="600"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ProjectVisual project={project} className="absolute inset-0" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug font-semibold text-fg">
          <span className="mr-1.5 font-mono text-sm text-cyan/80">{String(index + 1).padStart(2, "0")}.</span>
          <Link to={`/projects/${project.slug}`} className="hover:text-cyan">
            {project.title}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
        </div>
        {tech.length > 0 && <p className="mt-2 text-xs text-fg-subtle">{tech.join(" · ")}</p>}

        {points.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
            {points.map((pt) => (
              <li key={pt} className="flex gap-2.5">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                {pt}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-2 pt-4">
          {links.github ? (
            <>
              <a href={links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <GithubIcon size={14} /> GitHub repository <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <span className="text-fg-subtle" aria-hidden="true">
                ·
              </span>
            </>
          ) : (
            project.privateRepo && (
              <>
                <span className="inline-flex items-center gap-1 text-sm text-fg-subtle">
                  <Lock size={13} aria-hidden="true" /> Private repository
                </span>
                <span className="text-fg-subtle" aria-hidden="true">
                  ·
                </span>
              </>
            )
          )}
          {links.demo ? (
            <>
              <a href={links.demo} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <PlayCircle size={14} aria-hidden="true" /> Live demo <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <span className="text-fg-subtle" aria-hidden="true">
                ·
              </span>
            </>
          ) : (
            exhibit && (
              <>
                <button type="button" onClick={() => scrollToSection(exhibit.sectionId)} className={linkClass}>
                  <PlayCircle size={14} aria-hidden="true" /> Try the live demo
                </button>
                <span className="text-fg-subtle" aria-hidden="true">
                  ·
                </span>
              </>
            )
          )}
          <Link to={`/projects/${project.slug}`} className={linkClass}>
            Case study <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </article>
  );
}
