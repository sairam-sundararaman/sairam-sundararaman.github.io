import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const element = useOutlet();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Nav />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {element}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
