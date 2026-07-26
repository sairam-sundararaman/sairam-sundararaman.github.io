import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { animate, createScope } from "animejs";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import content from "../data/content.json";

const HeroScene = lazy(() => import("./three/HeroScene").then((m) => ({ default: m.HeroScene })));

function Portrait() {
  const [failed, setFailed] = useState(false);
  const initials = content.site.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="reveal-child reveal-portrait relative mx-auto aspect-[4/5] w-56 sm:w-64 lg:w-72">
      <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-azure/40 to-cyan/40 opacity-60 blur-xl" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/15 bg-void-soft shadow-2xl">
        {!failed && (
          <img
            src="/headshot.jpg"
            alt={content.site.name}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover grayscale contrast-[1.05]"
            style={{
              maskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
            }}
          />
        )}
        {!failed && <div className="absolute inset-0 bg-gradient-to-t from-azure/25 via-transparent to-cyan/10 mix-blend-color" />}
        {failed && (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-5xl text-white/85">{initials}</span>
          </div>
        )}
      </div>
    </div>
  );
}

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

      animate(".reveal-eyebrow", { opacity: [0, 1], translateY: [16, 0], duration: 700, delay: 60, ease: "outExpo" });
      animate(".reveal-name", {
        opacity: [0, 1],
        translateY: [26, 0],
        duration: 900,
        delay: (el, i) => 180 + i * 110,
        ease: "outExpo",
      });
      animate(".reveal-portrait", { opacity: [0, 1], scale: [0.94, 1], duration: 1000, delay: 260, ease: "outExpo" });
      animate(".reveal-tagline", { opacity: [0, 1], translateY: [16, 0], duration: 700, delay: 520, ease: "outExpo" });
      animate(".reveal-ctas", { opacity: [0, 1], translateY: [16, 0], duration: 700, delay: 660, ease: "outExpo" });
      animate(".reveal-role", { opacity: [0, 1], translateY: [12, 0], duration: 700, delay: 40, ease: "outExpo" });
    });

    return () => scope.current?.revert();
  }, []);

  const { site, researchRole } = content;

  return (
    <section ref={root} className="relative overflow-hidden bg-void">
      <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-void via-void-soft to-void" />}>
        <HeroScene />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-16 lg:grid-cols-5 lg:items-center lg:pb-32 lg:pt-20">
        <div className="lg:col-span-3">
          <p className="reveal-child reveal-role mb-5 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
            {researchRole.title}, {researchRole.lab} · {researchRole.institution}
          </p>

          <p className="reveal-child reveal-eyebrow mb-3 font-mono text-xs uppercase tracking-[0.2em] text-mist">
            {site.eyebrow}
          </p>

          <h1 className="font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            <span className="reveal-child reveal-name inline-block">Sairam</span>{" "}
            <span className="reveal-child reveal-name inline-block text-gradient">Sundararaman</span>
          </h1>

          <p className="reveal-child reveal-tagline mt-6 max-w-xl text-balance text-base leading-relaxed text-mist sm:text-lg">
            {site.tagline}
          </p>

          <div className="reveal-child reveal-ctas mt-9 flex flex-wrap items-center gap-4">
            <Button as={Link} to="/cv">
              View CV
            </Button>
            <Button as="a" href="#contact" variant="ghost-dark">
              Get in touch
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Portrait />
        </div>
      </div>
    </section>
  );
}
