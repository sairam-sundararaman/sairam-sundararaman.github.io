import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import { ContourDivider } from "./ui/ContourDivider";
import content from "../data/content.json";

export function PublicationsSection() {
  const ref = useRevealOnScroll({ stagger: ".pub-entry" });
  const { publications } = content;

  return (
    <section>
      <ContourDivider className="text-line" />
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Publications</h2>
          {content.contact.googleScholar && (
            <a
              href={content.contact.googleScholar}
              target="_blank"
              rel="noreferrer"
              className="link-fill font-mono text-xs uppercase tracking-wide"
            >
              Google Scholar
            </a>
          )}
        </div>

        <div ref={ref} className="divide-y divide-line">
          {publications.map((pub) => (
            <div key={pub.title} className="pub-entry reveal-child py-8 first:pt-0">
              <p className="font-mono text-xs uppercase tracking-wide text-mist">
                {pub.venue} · {pub.year}
              </p>
              <h3 className="mt-3 max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl">{pub.title}</h3>
              <p className="mt-3 text-sm text-mist">{pub.authors.join(", ")}</p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {pub.links.openreview && (
                  <a
                    href={pub.links.openreview}
                    target="_blank"
                    rel="noreferrer"
                    className="link-fill font-mono text-xs uppercase tracking-wide"
                  >
                    OpenReview
                  </a>
                )}
                {pub.links.pdf && (
                  <a
                    href={pub.links.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="link-fill font-mono text-xs uppercase tracking-wide"
                  >
                    PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
