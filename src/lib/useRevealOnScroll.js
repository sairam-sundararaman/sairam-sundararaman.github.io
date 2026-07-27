import { useEffect, useRef } from "react";
import { animate, stagger as animeStagger } from "animejs";

/**
 * Fades an element (or its staggered children) in when it scrolls into
 * view, and back out when it scrolls out — replays every time, either
 * direction. Kept deliberately plain: opacity + a small translateY, no
 * scale/rotation. Skips motion entirely for prefers-reduced-motion.
 *
 * @param {Object} opts
 * @param {string} [opts.stagger] - CSS selector (scoped to the ref'd element)
 *   for children to stagger on the way in. Exit is simultaneous, not
 *   staggered — enter one by one, leave together.
 */
export function useRevealOnScroll({ stagger: staggerSelector } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = staggerSelector ? el.querySelectorAll(staggerSelector) : el;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      if (targets instanceof NodeList) {
        targets.forEach((t) => {
          t.style.opacity = 1;
          t.style.transform = "none";
        });
      } else {
        targets.style.opacity = 1;
        targets.style.transform = "none";
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(targets, {
            opacity: 1,
            translateY: 0,
            duration: 650,
            delay: staggerSelector ? animeStagger(80) : 0,
            ease: "outExpo",
          });
        } else {
          animate(targets, {
            opacity: 0,
            translateY: 16,
            duration: 400,
            ease: "outQuad",
          });
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerSelector]);

  return ref;
}
