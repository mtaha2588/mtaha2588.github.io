import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NOTES, formatDate } from "../lib/notes";
import { useSeo } from "../hooks/useSeo";
import { SITE } from "../data/site";
import BackgroundCanvas from "../components/layout/BackgroundCanvas";
import Footer from "../components/layout/Footer";

export default function NotesPage() {
  useSeo({
    title: "Notes",
    description: `Notes by ${SITE.name} on AI automation, machine learning and web development.`,
    path: "/notes",
  });
  return (
    <>
      <BackgroundCanvas />
      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft size={16} aria-hidden="true" /> Back to the universe
        </Link>
        <p className="eyebrow mt-10">Notes</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Notes on AI, ML &amp; the web
        </h1>
        <p className="mt-4 text-fg-muted">Short write-ups on how I approach projects and what I learn building them.</p>

        {NOTES.length ? (
          <ul className="mt-10 space-y-4">
            {NOTES.map((n) => (
              <li key={n.slug}>
                <Link
                  to={`/notes/${n.slug}`}
                  className="glass group block rounded-xl !bg-ink-950/70 p-5 transition-colors hover:border-cyan/40"
                >
                  {n.date && (
                    <time dateTime={n.date} className="font-mono text-[11px] text-fg-subtle">
                      {formatDate(n.date)}
                    </time>
                  )}
                  <h2 className="mt-1.5 flex items-center justify-between gap-3 font-display text-xl font-semibold text-fg">
                    {n.title}
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-fg-muted transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </h2>
                  {n.description && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{n.description}</p>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-fg-muted">No notes published yet.</p>
        )}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
