import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Box, ExternalLink, MessageSquare, PlayCircle } from "lucide-react";
import { useProject } from "../hooks/useProjects";
import { useSeo } from "../hooks/useSeo";
import { prefillContact } from "../lib/contact";
import { useUniverse } from "../store/universe";
import { EXHIBIT_LIST } from "../three/exhibits/layout";
import BackgroundCanvas from "../components/layout/BackgroundCanvas";
import Footer from "../components/layout/Footer";
import ProjectVisual from "../components/projects/ProjectVisual";
import StatusBadge from "../components/ui/StatusBadge";
import Reveal from "../components/ui/Reveal";
import { GithubIcon } from "../components/ui/BrandIcons";
import NotFoundPage from "./NotFoundPage";

function Block({ eyebrow, title, children }) {
  return (
    <Reveal as="section" className="border-t border-line py-12 sm:py-14">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </Reveal>
  );
}

const Prose = ({ children }) => <p className="max-w-3xl leading-relaxed text-fg-muted">{children}</p>;

/**
 * Full case study for one project. Every fact comes from projects.json / the projects API.
 * Order: Problem → Who it helps → Approach → Architecture → Current status → Stack → Demo/GitHub → CTA.
 * Sections without content are skipped and the numbering closes up.
 */
export default function ProjectPage() {
  const { slug } = useParams();
  const { project, previous, next } = useProject(slug);
  const webgl = useUniverse((s) => s.webgl);
  useSeo({
    title: project ? `${project.title}: case study` : "Project",
    description: project?.summary,
    path: `/projects/${slug}`,
  });
  if (!project) return <NotFoundPage />;
  const exhibit = EXHIBIT_LIST.find((e) => e.slug === project.slug);
  const links = project.links ?? {};
  const hasLinks = Boolean(links.demo || links.github || exhibit);

  const actionLinks = (
    <>
      {links.demo && (
        <a href={links.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <PlayCircle size={18} aria-hidden="true" /> Live demo <ExternalLink size={15} aria-hidden="true" />
        </a>
      )}
      {exhibit && (
        <Link
          to={{ pathname: "/", hash: `#${exhibit.sectionId}` }}
          className={links.demo ? "btn-ghost" : "btn-primary"}
        >
          <PlayCircle size={18} aria-hidden="true" /> Try the {links.demo ? "demo here" : "live demo"}
        </Link>
      )}
      {exhibit && webgl && (
        <Link to={`/?focus=${exhibit.key}`} className="btn-ghost">
          <Box size={18} aria-hidden="true" /> Explore in 3D
        </Link>
      )}
      {links.github && (
        <a href={links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <GithubIcon size={18} /> GitHub repository <ExternalLink size={15} aria-hidden="true" />
        </a>
      )}
    </>
  );

  const layers = project.architecture?.layers ?? [];
  const blocks = [
    project.problem && {
      key: "problem",
      eyebrow: "Problem",
      title: "The problem",
      body: <Prose>{project.problem}</Prose>,
    },
    project.whoItHelps && {
      key: "who",
      eyebrow: "Who it helps",
      title: "Who it helps",
      body: <Prose>{project.whoItHelps}</Prose>,
    },
    project.solution && {
      key: "approach",
      eyebrow: "Approach",
      title: "The approach",
      body: <Prose>{project.solution}</Prose>,
    },
    layers.length > 0 && {
      key: "architecture",
      eyebrow: "Architecture",
      title: "How it's built",
      body: (
        <>
          {project.architecture.overview && <Prose>{project.architecture.overview}</Prose>}
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {layers.map((layer, i) => (
              <li key={layer.name} className="glass relative rounded-xl p-4">
                <p className="font-mono text-[11px] tracking-wider text-cyan uppercase">
                  {String(i + 1).padStart(2, "0")} · {layer.name}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
                  {layer.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {i < layers.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="absolute top-1/2 -right-3.5 hidden -translate-y-1/2 text-cyan/60 lg:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </>
      ),
    },
    project.features?.length > 0 && {
      key: "features",
      eyebrow: "Features",
      title: "Key features",
      body: (
        <ul className="grid gap-4 sm:grid-cols-2">
          {project.features.map((f) => (
            <li key={f.title} className="glass rounded-xl p-5">
              <p className="font-medium text-fg">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{f.description}</p>
            </li>
          ))}
        </ul>
      ),
    },
    project.currentStatus && {
      key: "status",
      eyebrow: "Current status",
      title: "Where it stands today",
      body: (
        <div className="flex max-w-3xl flex-col items-start gap-3">
          <StatusBadge status={project.status} />
          <Prose>{project.currentStatus}</Prose>
        </div>
      ),
    },
    project.technologies?.length > 0 && {
      key: "stack",
      eyebrow: "Stack",
      title: "Technologies used",
      body: (
        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <li key={t} className="chip !px-3 !py-1.5 !text-sm">
              {t}
            </li>
          ))}
        </ul>
      ),
    },
    project.screenshots?.length > 0 && {
      key: "screenshots",
      eyebrow: "Screenshots",
      title: "Screenshots",
      body: (
        <ul className="grid gap-4 sm:grid-cols-2">
          {project.screenshots.map((sh) => (
            <li key={sh.src}>
              <figure className="glass overflow-hidden rounded-xl">
                <img src={sh.src} alt={sh.caption || project.title} loading="lazy" className="w-full" />
                {sh.caption && <figcaption className="p-3 text-sm text-fg-muted">{sh.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      ),
    },
    project.challenges?.length > 0 && {
      key: "challenges",
      eyebrow: "Challenges",
      title: "Challenges & learning",
      body: (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {project.challenges.map((c) => (
              <div key={c.title} className="glass rounded-xl p-5">
                <p className="font-medium text-fg">{c.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{c.description}</p>
              </div>
            ))}
          </div>
          {project.learnings?.length > 0 && (
            <ul className="mt-6 space-y-2 text-fg-muted">
              {project.learnings.map((l) => (
                <li key={l} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                  {l}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    },
    hasLinks && {
      key: "links",
      eyebrow: "Demo & code",
      title: "See it for yourself",
      body: <div className="flex flex-wrap gap-3">{actionLinks}</div>,
    },
  ].filter(Boolean);

  return (
    <>
      <BackgroundCanvas />
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <Link
          to={{ pathname: "/", hash: "#projects" }}
          className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to the universe
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase">{project.category}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-fg-muted">{project.tagline}</p>
          {hasLinks && <div className="mt-6 flex flex-wrap gap-3">{actionLinks}</div>}
        </header>

        <div className="glass gradient-border mt-10 aspect-[5/3] overflow-hidden rounded-2xl">
          {project.thumbnail ? (
            <img
              src={import.meta.env.BASE_URL + project.thumbnail}
              alt={project.thumbnailAlt || `Screenshot of ${project.title}`}
              width="960"
              height="600"
              className="h-full w-full object-cover"
            />
          ) : (
            <ProjectVisual project={project} />
          )}
        </div>
        <p className="mt-3 text-xs text-fg-subtle">
          Descriptions reflect the project's design and current development scope. No production metrics are claimed.
        </p>

        {blocks.map((b, i) => (
          <Block key={b.key} eyebrow={`${String(i + 1).padStart(2, "0")} · ${b.eyebrow}`} title={b.title}>
            {b.body}
          </Block>
        ))}

        <Reveal
          as="section"
          className="glass gradient-border mt-4 flex flex-col items-start gap-5 rounded-2xl !bg-ink-950/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <h2 className="font-display text-2xl font-semibold text-fg">Want something like this? Let's talk.</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
              Tell me about your problem. I'll reply with honest feedback, a suggested approach and a fixed quote.
            </p>
          </div>
          <Link
            to={{ pathname: "/", hash: "#contact" }}
            onClick={() =>
              prefillContact("", `I saw your "${project.title}" case study and I'd like something similar: `)
            }
            className="btn-primary shrink-0"
          >
            <MessageSquare size={18} aria-hidden="true" /> Let's talk
          </Link>
        </Reveal>

        <nav className="mt-8 grid gap-4 border-t border-line pt-10 sm:grid-cols-2" aria-label="More projects">
          {previous ? (
            <Link to={`/projects/${previous.slug}`} className="glass group rounded-xl p-5">
              <span className="flex items-center gap-2 text-xs text-fg-subtle">
                <ArrowLeft size={14} aria-hidden="true" /> Previous project
              </span>
              <span className="mt-2 block font-display text-lg text-fg">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/projects/${next.slug}`} className="glass group rounded-xl p-5 text-right">
              <span className="flex items-center justify-end gap-2 text-xs text-fg-subtle">
                Next project <ArrowRight size={14} aria-hidden="true" />
              </span>
              <span className="mt-2 block font-display text-lg text-fg">{next.title}</span>
            </Link>
          )}
        </nav>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
