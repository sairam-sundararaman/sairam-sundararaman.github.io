import { Code, FileText } from "lucide-react";
import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import { Card, CardEyebrow, CardTitle } from "./ui/Card";
import content from "../data/content.json";

export function ProjectsSection() {
  const ref = useRevealOnScroll({ stagger: ".project-card" });
  const { projects } = content;

  return (
    <section className="bg-paper-dim">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="mb-10 font-display text-2xl text-ink sm:text-3xl">Projects</h2>

        <div ref={ref} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.title} className="project-card reveal-child bg-white flex flex-col">
              <CardEyebrow>{project.period}</CardEyebrow>
              <CardTitle>{project.title}</CardTitle>

              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-steel">
                {project.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-azure/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {(project.links.code || project.links.writeup) && (
                <div className="mt-5 flex gap-5 pt-1">
                  {project.links.code && (
                    <a
                      href={project.links.code}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-azure hover:underline"
                    >
                      <Code size={13} /> Code
                    </a>
                  )}
                  {project.links.writeup && (
                    <a
                      href={project.links.writeup}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-azure hover:underline"
                    >
                      <FileText size={13} /> Write-up
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
