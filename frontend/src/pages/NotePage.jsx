import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";
import { findNote, formatDate } from "../lib/notes";
import { useSeo } from "../hooks/useSeo";
import BackgroundCanvas from "../components/layout/BackgroundCanvas";
import Footer from "../components/layout/Footer";
import NotFoundPage from "./NotFoundPage";

// Links inside notes are written as "/#contact" etc.; prefix the deploy base path when there is one.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function NotePage() {
  const { slug } = useParams();
  const note = findNote(slug);
  useSeo({ title: note?.title ?? "Note", description: note?.description, path: `/notes/${slug}` });
  // Notes are written by the site owner and bundled at build time, so their HTML is trusted.
  const html = useMemo(() => {
    if (!note) return "";
    const out = marked.parse(note.body, { async: false });
    return BASE ? out.replace(/href="\//g, `href="${BASE}/`) : out;
  }, [note]);
  if (!note) return <NotFoundPage />;

  return (
    <>
      <BackgroundCanvas />
      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6">
        <Link to="/notes" className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft size={16} aria-hidden="true" /> All notes
        </Link>
        <article className="mt-10">
          <header>
            {note.date && (
              <time dateTime={note.date} className="font-mono text-xs text-fg-subtle">
                {formatDate(note.date)}
              </time>
            )}
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
              {note.title}
            </h1>
            {note.description && <p className="mt-4 text-lg text-fg-muted">{note.description}</p>}
          </header>
          <div className="prose-note mt-10" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
