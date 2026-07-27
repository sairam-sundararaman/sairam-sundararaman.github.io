import { Code, FileText } from "lucide-react";
import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import { RichText } from "./ui/RichText";
import content from "../data/content.json";

export function ProjectsSection() {
  const ref = useRevealOnScroll({ stagger: ".project-entry" });
  const { projects } = content;

  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
        <h2 className="mb-12 font-display text-2xl text-ink sm:text-3xl">Projects</h2>

        <div ref={ref} className="divide-y divide-line">
          {projects.map((project) => (
            <div
              key={project.title}
              className="project-entry reveal-child grid grid-cols-1 gap-3 py-9 first:pt-0 sm:grid-cols-[7rem_1fr] sm:gap-8"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-mist">{project.period}</p>

              <div>
                <h3 className="font-display text-xl leading-snug text-ink sm:text-2xl">{project.title}</h3>

                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-mist">
                  {project.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mist/50" />
                      <span>
                        <RichText text={b} />
                      </span>
                    </li>
                  ))}
                </ul>

                {(project.links.code || project.links.writeup) && (
                  <div className="mt-5 flex gap-6">
                    {project.links.code && (
                      <a
                        href={project.links.code}
                        target="_blank"
                        rel="noreferrer"
                        className="link-fill inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide"
                      >
                        <Code size={13} /> Code
                      </a>
                    )}
                    {project.links.writeup && (
                      <a
                        href={project.links.writeup}
                        target="_blank"
                        rel="noreferrer"
                        className="link-fill inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide"
                      >
                        <FileText size={13} /> Write-up
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
