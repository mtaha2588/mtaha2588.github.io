import { ChevronDown, Quote } from "lucide-react";
import { FAQ, TESTIMONIALS } from "../../data/faq";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

/**
 * After the contact station (no camera station of its own: the camera
 * holds on the beacon). Testimonials show only when real ones exist.
 */
export default function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="pointer-events-none relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {TESTIMONIALS.length > 0 && (
          <div className="pointer-events-auto mb-16">
            <SectionHeading eyebrow="Testimonials" title="What clients say" />
            <ul className="grid gap-4">
              {TESTIMONIALS.map((t) => (
                <Reveal as="li" key={t.name + t.quote.slice(0, 16)}>
                  <figure className="glass rounded-2xl !bg-ink-950/75 p-6">
                    <Quote size={20} className="text-holo-cyan" aria-hidden="true" />
                    <blockquote className="mt-3 leading-relaxed text-fg">{t.quote}</blockquote>
                    <figcaption className="mt-4 text-sm text-fg-muted">
                      {t.link ? (
                        <a href={t.link} target="_blank" rel="noopener noreferrer" className="font-medium text-fg">
                          {t.name}
                        </a>
                      ) : (
                        <span className="font-medium text-fg">{t.name}</span>
                      )}
                      {[t.role, t.company].filter(Boolean).length > 0 &&
                        ` · ${[t.role, t.company].filter(Boolean).join(", ")}`}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        )}

        <div className="pointer-events-auto">
          <SectionHeading eyebrow="FAQ" title={<span id="faq-title">Common questions</span>} />
          <ul className="space-y-3">
            {FAQ.map((item) => (
              <li key={item.q}>
                <details className="glass group rounded-xl !bg-ink-950/75 open:border-cyan/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-medium text-fg sm:p-5 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-fg-muted transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-4 pb-4 text-sm leading-relaxed text-fg-muted sm:px-5 sm:pb-5">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
