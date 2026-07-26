import { useEffect, useRef } from "react";
import { animate, stagger as animeStagger } from "animejs";

/**
 * Reveals an element (or its staggered children) once, the first time it
 * scrolls into view. Uses the native IntersectionObserver to decide *when*
 * (reliable, no re-triggering on scroll-back) and anime.js to do the actual
 * tweening. Fully skips motion for prefers-reduced-motion.
 *
 * @param {Object} opts
 * @param {string} [opts.stagger] - CSS selector (scoped to the ref'd element)
 *   for children to stagger-reveal. Omit to reveal the ref'd element itself.
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
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            delay: staggerSelector ? animeStagger(90) : 0,
            ease: "outExpo",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerSelector]);

  return ref;
}
