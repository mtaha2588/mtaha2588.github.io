import { Bot, BrainCircuit, CheckCircle2, Clock, Globe2, Map, MessageSquareQuote } from "lucide-react";
import { SERVICES, PROCESS } from "../../data/services";
import { prefillContact } from "../../lib/contact";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const ICONS = { bot: Bot, brain: BrainCircuit, globe: Globe2, map: Map };

const price = (s) => (s.startingPrice ? `Starting from $${s.startingPrice.toLocaleString("en-US")}` : "Custom quote");

/** Station 1: what I offer as packages, and how a project runs from first call to handover. */
export default function ServicesSection() {
  return (
    <section
      id="services"
      data-station="1"
      aria-labelledby="services-title"
      className="pointer-events-none relative py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-auto">
          <SectionHeading
            eyebrow="Services"
            title={<span id="services-title">How I can help your business</span>}
            description="Four ways I work with startups and small businesses. Every project starts with a free call and a fixed written quote."
          />
        </div>

        <ul className="pointer-events-auto grid gap-4 md:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Bot;
            return (
              <Reveal as="li" key={s.id} delay={i * 0.06} className="flex">
                <article className="glass gradient-border flex w-full flex-col rounded-2xl !bg-ink-950/75 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-holo-cyan/30 bg-holo-blue/10 text-holo-cyan">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-fg">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{s.summary}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-fg-muted">
                    <span className="font-medium text-fg">Who it's for: </span>
                    {s.forWho}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm text-fg-muted">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-cyan" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                      <div className="text-sm">
                        <p className="font-medium text-fg">{price(s)}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-subtle">
                          <Clock size={12} aria-hidden="true" /> {s.delivery}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => prefillContact(s.title)}
                        className="btn-ghost !px-4 !py-2 text-sm"
                        aria-label={`Get a quote for ${s.title}`}
                      >
                        <MessageSquareQuote size={16} aria-hidden="true" />
                        Get a quote
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="pointer-events-auto mt-12">
          <h3 className="eyebrow">How I work</h3>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="glass rounded-xl !bg-ink-950/70 p-4">
                <p className="font-mono text-[11px] tracking-wider text-cyan uppercase">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 font-medium text-fg">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
