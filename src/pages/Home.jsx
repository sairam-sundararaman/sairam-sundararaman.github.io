import { Hero } from "../components/Hero";
import { PublicationsSection } from "../components/PublicationsSection";
import { ProjectsSection } from "../components/ProjectsSection";

export function Home() {
  return (
    <>
      <Hero />
      <PublicationsSection />
      <ProjectsSection />
    </>
  );
}
