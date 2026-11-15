import { BookOpen, Briefcase, ExternalLink, Globe2, GraduationCap } from "lucide-react";
import { profile } from "../../data/profile";
import { EDUCATION, EXPERIENCE, PUBLICATIONS } from "../../data/experience";
import EnvSection from "./EnvSection";

function Heading({ Icon, children }) {
  return (
    <h3 className="mt-8 flex items-center gap-2 text-xs font-semibold tracking-wider text-fg uppercase">
      <Icon size={14} className="text-holo-cyan" aria-hidden="true" />
      {children}
    </h3>
  );
}

/** A vertical timeline entry. */
function Entry({ title, subtitle, period, points = [] }) {
  return (
    <li className="relative border-l border-line pb-5 pl-5 last:pb-0">
      <span
        className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-holo-cyan bg-ink-950"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-sm font-medium text-fg">{title}</p>
        {period && <p className="font-mono text-[11px] text-fg-subtle">{period}</p>}
      </div>
      {subtitle && <p className="mt-0.5 text-xs text-cyan">{subtitle}</p>}
      {points.length > 0 && (
        <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-fg-muted">
          {points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function AboutSection() {
  const { about, availability } = profile;
  return (
    <EnvSection id="about" station={9} eyebrow="About Me" title="Mechatronics engineer, building practical AI">
      <div className="space-y-4 text-sm leading-relaxed text-fg-muted sm:text-[15px]">
        {about.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      {EXPERIENCE.length > 0 && (
        <>
          <Heading Icon={Briefcase}>Experience</Heading>
          <ol className="mt-4">
            {EXPERIENCE.map((e) => (
              <Entry key={e.org} title={e.org} subtitle={e.role} period={e.period} points={e.points} />
            ))}
          </ol>
        </>
      )}

      {EDUCATION.length > 0 && (
        <>
          <Heading Icon={GraduationCap}>Education</Heading>
          <ol className="mt-4">
            {EDUCATION.map((e) => (
              <Entry key={e.school} title={e.degree} subtitle={e.school} period={e.period} points={e.points} />
            ))}
          </ol>
        </>
      )}

      {PUBLICATIONS.length > 0 && (
        <>
          <Heading Icon={BookOpen}>Publications</Heading>
          <ul className="mt-3 space-y-2">
            {PUBLICATIONS.map((p) => (
              <li key={p.title} className="rounded-lg border border-line bg-white/[0.02] p-3">
                <p className="text-sm font-medium text-fg">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 hover:text-cyan"
                    >
                      {p.title}
                      <ExternalLink size={13} className="mt-1 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    p.title
                  )}
                </p>
                <p className="mt-1 text-xs text-fg-muted">
                  {p.venue}
                  {p.year && ` · ${p.year}`}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <Heading Icon={Globe2}>How I work</Heading>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {about.principles.map((p) => (
          <li key={p.title} className="rounded-lg border border-line bg-white/[0.02] p-3">
            <p className="text-sm font-medium text-fg">{p.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-fg-muted">{p.text}</p>
          </li>
        ))}
      </ul>

      {availability.open && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4">
          <Globe2 size={18} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-emerald-100">{availability.label}</p>
            <p className="mt-0.5 text-xs text-fg-muted">{availability.detail}</p>
          </div>
        </div>
      )}
    </EnvSection>
  );
}
