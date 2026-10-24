const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Curly apostrophes where they belong ("I'm", "Winter '26"). */
export const typo = (s: string) => s.replace(/(\w)'(\w)/g, '$1\u2019$2').replace(/(^|\s)'(\d)/g, '$1\u2019$2');

/** Escape text, then turn [label](https://url) into links. For trusted, repo-local strings only. */
export function inline(s: string): string {
  return esc(typo(s)).replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    (_m, text, url) => `<a href="${url}" rel="noopener">${text}</a>`,
  );
}
