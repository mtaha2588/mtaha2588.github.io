import { noteSlug, parseFrontMatter } from "./frontmatter";

/**
 * Markdown notes from src/content/notes/*.md, bundled at build time.
 * File name: YYYY-MM-DD-slug.md, with front matter (title, date,
 * description, draft). Drafts are left out. Newest first.
 */
const files = import.meta.glob("../content/notes/*.md", { query: "?raw", import: "default", eager: true });

export const NOTES = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw);
    return { slug: noteSlug(path), body, ...data };
  })
  .filter((n) => n.title && !n.draft)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)));

export const findNote = (slug) => NOTES.find((n) => n.slug === slug) ?? null;

export const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};
