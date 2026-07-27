import { useState } from "react";
import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import { ContourDivider } from "../components/ui/ContourDivider";
import { RichText } from "../components/ui/RichText";
import content from "../data/content.json";

function Portrait() {
  const [failed, setFailed] = useState(false);
  const initials = content.site.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  if (failed) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center border border-line sm:w-64">
        <span className="font-display text-4xl text-mist">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src="/headshot.jpg"
      alt={content.site.name}
      onError={() => setFailed(true)}
      className="aspect-[4/5] w-full border border-line object-cover sm:w-64"
    />
  );
}

export function About() {
  const { about, news, researchRole, education } = content;
  const bioRef = useRevealOnScroll({ stagger: ".bio-p" });
  const newsRef = useRevealOnScroll({ stagger: ".news-row" });

  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 pb-4 pt-16 sm:px-10 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">About</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">A bit more about me</h1>

        <div className="mt-10 flex flex-col gap-10 sm:flex-row">
          <div className="shrink-0">
            <Portrait />
          </div>

          <div ref={bioRef} className="space-y-5 text-[15px] leading-relaxed text-mist sm:text-base">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="bio-p reveal-child">
                <RichText text={p} />
              </p>
            ))}

            <p className="pt-1 font-mono text-xs uppercase tracking-wide text-mist">
              {researchRole.interests.join(" / ")}
            </p>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-mist">Currently</dt>
            <dd className="mt-1 text-ink">
              {researchRole.title}, {researchRole.lab} · {researchRole.institution}
            </dd>
            <dd className="text-sm text-mist">Advised by {researchRole.advisor.name}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-mist">Studying</dt>
            <dd className="mt-1 text-ink">{education.degree}</dd>
            <dd className="text-sm text-mist">
              {education.institution}, advised by {education.advisor.name}
            </dd>
          </div>
        </dl>
      </section>

      <ContourDivider className="mx-auto max-w-4xl px-6 text-line sm:px-10" />

      <section className="mx-auto max-w-4xl px-6 py-14 sm:px-10 sm:py-20">
        <h2 className="mb-8 font-display text-2xl text-ink">News</h2>
        <div ref={newsRef} className="space-y-1">
          {news.map((n, i) => (
            <div
              key={i}
              className="news-row reveal-child flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="shrink-0 font-mono text-xs text-mist sm:w-24">{n.date}</span>
              <span className="text-ink">
                <RichText text={n.text} />
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
