import { Download } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ContourDivider } from "../components/ui/ContourDivider";
import { RichText } from "../components/ui/RichText";
import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import content from "../data/content.json";

function SectionLabel({ children }) {
  return <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-mist">{children}</p>;
}

function TimelineRow({ title, meta, period, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-6">
      <div className="font-mono text-xs uppercase tracking-wide text-mist">{period}</div>
      <div>
        <h3 className="font-display text-lg text-ink">{title}</h3>
        {meta && <p className="mt-1 text-sm text-mist">{meta}</p>}
        {children && <div className="mt-2 text-sm leading-relaxed text-mist">{children}</div>}
      </div>
    </div>
  );
}

export function CV() {
  const { education, researchRole, achievements, talks, teaching, resumeFile, site } = content;
  const revealRef = useRevealOnScroll({ stagger: ".cv-block" });

  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 pb-10 pt-16 sm:px-10 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Curriculum Vitae</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{site.name}</h1>
        <p className="mt-3 max-w-xl text-mist">
          {researchRole.title}, {researchRole.lab} · {researchRole.institution}
        </p>

        <div className="mt-8">
          <Button as="a" href={resumeFile} download variant="outline">
            <Download size={14} /> Download PDF
          </Button>
        </div>
      </section>

      <ContourDivider className="mx-auto max-w-4xl px-6 text-line sm:px-10" />

      <section ref={revealRef} className="mx-auto max-w-4xl divide-y divide-line px-6 pb-24 sm:px-10">
        <div className="cv-block reveal-child py-10">
          <SectionLabel>Education</SectionLabel>
          <TimelineRow title={education.institution} period={education.years} meta={`${education.degree} · GPA ${education.gpa}`} />
        </div>

        <div className="cv-block reveal-child py-10">
          <SectionLabel>Research Experience</SectionLabel>
          <TimelineRow
            title={`${researchRole.title}, ${researchRole.lab}`}
            period={researchRole.period}
            meta={`${researchRole.institution} · Advisor: ${researchRole.advisor.name}`}
          >
            <p>
              <RichText text={researchRole.description} />
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-wide text-mist">{researchRole.interests.join(" / ")}</p>
          </TimelineRow>
        </div>

        <div className="cv-block reveal-child py-10">
          <SectionLabel>Achievements</SectionLabel>
          <ul className="space-y-4">
            {achievements.map((a) => (
              <li key={a.text} className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 font-mono text-xs text-mist">{a.year}</span>
                <span className="text-ink">
                  <RichText text={a.text} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cv-block reveal-child py-10">
          <SectionLabel>Talks &amp; Presentations</SectionLabel>
          <ul className="space-y-4">
            {talks.map((t) => (
              <li key={t.text} className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 font-mono text-xs text-mist">{t.year}</span>
                <span className="text-ink">
                  <RichText text={t.text} /> <span className="text-mist">— {t.venue}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cv-block reveal-child py-10">
          <SectionLabel>Co-Curriculars &amp; Volunteering</SectionLabel>
          <ul className="space-y-4">
            {teaching.map((t) => (
              <li key={t.text} className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 font-mono text-xs text-mist">{t.year}</span>
                <span className="text-ink">
                  <RichText text={t.text} /> <span className="text-mist">— {t.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
