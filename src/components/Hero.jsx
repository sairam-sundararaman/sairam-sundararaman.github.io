import { lazy, Suspense, useEffect, useRef } from "react";
import { animate, createScope } from "animejs";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import content from "../data/content.json";

const HeroScene = lazy(() => import("./three/HeroScene").then((m) => ({ default: m.HeroScene })));

export function Hero() {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        root.current.querySelectorAll(".reveal-child").forEach((el) => {
          el.style.opacity = 1;
          el.style.transform = "none";
        });
        return;
      }

      animate(".reveal-role", { opacity: [0, 1], translateY: [12, 0], duration: 700, delay: 40, ease: "outExpo" });
      animate(".reveal-name", {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 950,
        delay: (el, i) => 150 + i * 110,
        ease: "outExpo",
      });
      animate(".reveal-tagline", { opacity: [0, 1], translateY: [16, 0], duration: 700, delay: 480, ease: "outExpo" });
      animate(".reveal-ctas", { opacity: [0, 1], translateY: [16, 0], duration: 700, delay: 620, ease: "outExpo" });
    });

    return () => scope.current?.revert();
  }, []);

  const { site, researchRole } = content;

  return (
    <section ref={root} className="relative overflow-hidden">
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-20 sm:px-10 sm:pb-40 sm:pt-28">
        <p className="reveal-child reveal-role mb-6 font-mono text-xs uppercase tracking-[0.2em] text-mist">
          {researchRole.title}, {researchRole.lab} · {researchRole.institution}
        </p>

        <h1 className="font-display text-[2.75rem] leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
          <span className="reveal-child reveal-name inline-block">Sairam</span>{" "}
          <span className="reveal-child reveal-name inline-block">Sundararaman</span>
        </h1>

        <p className="reveal-child reveal-tagline mt-7 max-w-xl text-balance text-base leading-relaxed text-mist sm:text-lg">
          {site.tagline}
        </p>

        <div className="reveal-child reveal-ctas mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Button as={Link} to="/cv" arrow className="group">
            View CV
          </Button>
          <Button as="a" href="#contact" arrow className="group">
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
