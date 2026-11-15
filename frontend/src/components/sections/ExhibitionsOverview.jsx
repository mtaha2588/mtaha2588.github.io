import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import WorkCard from "../projects/WorkCard";
import { useProjects } from "../../hooks/useProjects";
import { EXHIBIT_LIST } from "../../three/exhibits/layout";
import { exhibits, useExhibits } from "../../store/exhibits";

/**
 * Station 2: every project as a card (thumbnail, status, stack,
 * GitHub repository · Live demo · Case study). Projects with a 3D
 * exhibition light up their pedestal when hovered, and "Try the live
 * demo" flies to it.
 */
export default function ExhibitionsOverview() {
  const { projects } = useProjects();
  const hovered = useExhibits((s) => s.hovered);
  const exhibitFor = (slug) => EXHIBIT_LIST.find((e) => e.slug === slug);
  // Projects with live demos first, then the rest in data order.
  const ordered = [...projects].sort((a, b) => Number(!exhibitFor(a.slug)) - Number(!exhibitFor(b.slug)));

  return (
    <section
      id="projects"
      data-station="2"
      aria-labelledby="projects-title"
      className="pointer-events-none relative pt-28 pb-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-auto -mx-4 rounded-2xl bg-gradient-to-r from-ink-950/80 via-ink-950/50 to-transparent px-4 pt-4 sm:-mx-6 sm:px-6">
          <SectionHeading
            eyebrow="Work"
            title={<span id="projects-title">Projects &amp; live demos</span>}
            description="Every project with its real status. The first three have working demos you can try right here; each has a full case study."
          />
        </div>
        <ul className="pointer-events-auto grid gap-4 lg:grid-cols-2">
          {ordered.map((project, i) => {
            const ex = exhibitFor(project.slug);
            return (
              <Reveal as="li" key={project.slug} delay={(i % 2) * 0.08} className="flex">
                <WorkCard
                  project={project}
                  index={i}
                  exhibit={ex}
                  active={ex && hovered === ex.key}
                  onHover={ex ? (on) => exhibits.set({ hovered: on ? ex.key : null }) : undefined}
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
