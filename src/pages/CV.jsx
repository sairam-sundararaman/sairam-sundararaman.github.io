import { Download } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ContourDivider } from "../components/ui/ContourDivider";
import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import content from "../data/content.json";

function SectionLabel({ children }) {
  return <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-steel">{children}</p>;
}

function TimelineRow({ title, meta, period, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-6">
      <div className="font-mono text-xs uppercase tracking-wide text-steel">{period}</div>
      <div>
        <h3 className="font-display text-lg text-ink">{title}</h3>
        {meta && <p className="mt-1 text-sm text-steel">{meta}</p>}
        {children && <div className="mt-2 text-sm leading-relaxed text-steel">{children}</div>}
      </div>
    </div>
  );
}

export function CV() {
  const { education, researchRole, achievements, talks, teaching, resumeFile, site } = content;
  const revealRef = useRevealOnScroll({ stagger: ".cv-block" });

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-4xl px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-azure">Curriculum Vitae</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{site.name}</h1>
        <p className="mt-3 max-w-xl text-steel">
          {researchRole.title}, {researchRole.lab} · {researchRole.institution}
        </p>

        <div className="mt-8">
          <Button as="a" href={resumeFile} download className="gap-2">
            <Download size={16} /> Download PDF
          </Button>
        </div>
      </section>

      <ContourDivider className="mx-auto max-w-4xl px-5 text-line sm:px-8" />

      <section ref={revealRef} className="mx-auto max-w-4xl divide-y divide-line px-5 pb-24 sm:px-8">
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
            <p>{researchRole.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {researchRole.interests.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </TimelineRow>
        </div>

        <div className="cv-block reveal-child py-10">
          <SectionLabel>Achievements</SectionLabel>
          <ul className="space-y-4">
            {achievements.map((a) => (
              <li key={a.text} className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 font-mono text-xs text-steel">{a.year}</span>
                <span className="text-ink">{a.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cv-block reveal-child py-10">
          <SectionLabel>Talks &amp; Presentations</SectionLabel>
          <ul className="space-y-4">
            {talks.map((t) => (
              <li key={t.text} className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 font-mono text-xs text-steel">{t.year}</span>
                <span className="text-ink">
                  {t.text} <span className="text-steel">— {t.venue}</span>
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
                <span className="w-14 shrink-0 font-mono text-xs text-steel">{t.year}</span>
                <span className="text-ink">
                  {t.text} <span className="text-steel">— {t.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
