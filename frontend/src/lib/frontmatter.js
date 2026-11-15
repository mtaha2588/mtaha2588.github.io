/**
 * Tiny front-matter parser for the Markdown notes (works in the browser and Node).
 *   ---
 *   title: My post
 *   date: 2026-11-15
 *   description: One-line summary
 *   draft: false
 *   ---
 *   Markdown body…
 */
export function parseFrontMatter(raw) {
  const text = raw.replace(new RegExp("^" + String.fromCharCode(0xfeff)), "");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim().replace(/^["']|["']$/g, "");
    if (value === "true") value = true;
    else if (value === "false") value = false;
    data[m[1]] = value;
  }
  return { data, body: match[2] };
}

/** Slug from a notes file name: "2026-11-15-how-i-scope.md" → "how-i-scope". */
export function noteSlug(fileName) {
  return fileName
    .replace(/^.*[\\/]/, "")
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}
