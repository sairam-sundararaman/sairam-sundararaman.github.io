import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import { Badge } from "../components/ui/Badge";
import { ContourDivider } from "../components/ui/ContourDivider";
import content from "../data/content.json";

export function About() {
  const { about, news, researchRole, education } = content;
  const bioRef = useRevealOnScroll({ stagger: ".bio-p" });
  const newsRef = useRevealOnScroll({ stagger: ".news-row" });

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-3xl px-5 pb-4 pt-16 sm:px-8 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-azure">About</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">A bit more about me</h1>

        <div ref={bioRef} className="mt-8 space-y-5 text-[15px] leading-relaxed text-steel sm:text-base">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="bio-p reveal-child">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {researchRole.interests.map((tag) => (
            <Badge key={tag} variant="accent">
              {tag}
            </Badge>
          ))}
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-steel">Currently</dt>
            <dd className="mt-1 text-ink">
              {researchRole.title}, {researchRole.lab} · {researchRole.institution}
            </dd>
            <dd className="text-sm text-steel">Advised by {researchRole.advisor.name}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-steel">Studying</dt>
            <dd className="mt-1 text-ink">{education.degree}</dd>
            <dd className="text-sm text-steel">{education.institution}, advised by {education.advisor.name}</dd>
          </div>
        </dl>
      </section>

      <ContourDivider className="mx-auto max-w-3xl px-5 text-line sm:px-8" />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <h2 className="mb-8 font-display text-2xl text-ink">News</h2>
        <div ref={newsRef} className="space-y-1">
          {news.map((n, i) => (
            <div
              key={i}
              className="news-row reveal-child flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="shrink-0 font-mono text-xs text-steel sm:w-24">{n.date}</span>
              <span className="text-ink">{n.text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
