/**
 * Renders a plain string, except any `[label](url)` sequences become real
 * links. Lets content.json contain things like:
 *   "I collaborate with [the WSAI lab](https://wsai.iitm.ac.in/)."
 * without needing a separate structured field for every possible link.
 * Intentionally minimal — just link syntax, not full markdown.
 */
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export function RichText({ text, as: Tag = "span", className }) {
  if (!text) return null;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    const [, label, url] = match;
    const external = /^https?:\/\//.test(url);
    parts.push(
      <a
        key={key++}
        href={url}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="link-fill"
      >
        {label}
      </a>
    );
    lastIndex = LINK_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <Tag className={className}>{parts}</Tag>;
}
