import { ExternalLink } from "lucide-react";
import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import { Card, CardEyebrow, CardTitle } from "./ui/Card";
import { ContourDivider } from "./ui/ContourDivider";
import content from "../data/content.json";

export function PublicationsSection() {
  const ref = useRevealOnScroll({ stagger: ".pub-card" });
  const { publications } = content;

  return (
    <section className="bg-paper">
      <ContourDivider className="text-line" />
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Publications</h2>
          {content.contact.googleScholar && (
            <a
              href={content.contact.googleScholar}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-steel transition-colors hover:text-azure"
            >
              Google Scholar ↗
            </a>
          )}
        </div>

        <div ref={ref} className="space-y-5">
          {publications.map((pub) => (
            <Card key={pub.title} className="pub-card reveal-child">
              <CardEyebrow>
                {pub.venue} · {pub.year}
              </CardEyebrow>
              <CardTitle>{pub.title}</CardTitle>
              <p className="mt-3 font-body text-sm text-steel">{pub.authors.join(", ")}</p>

              <div className="mt-5 flex flex-wrap gap-5">
                {pub.links.openreview && (
                  <a
                    href={pub.links.openreview}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-azure hover:underline"
                  >
                    OpenReview <ExternalLink size={12} />
                  </a>
                )}
                {pub.links.pdf && (
                  <a
                    href={pub.links.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-azure hover:underline"
                  >
                    PDF <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
