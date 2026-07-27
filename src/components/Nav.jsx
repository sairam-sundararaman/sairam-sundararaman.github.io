import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, LayoutGroup } from "motion/react";
import { cn } from "../lib/utils";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/cv", label: "CV" },
];

function NavItem({ to, label, end, onClick, showIndicator }) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className="relative py-1">
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "font-mono text-[13px] tracking-wide uppercase transition-colors duration-200",
              isActive ? "text-cyan" : "text-mist hover:text-ink"
            )}
          >
            {label}
          </span>
          {showIndicator && isActive && (
            <motion.span
              layoutId="nav-active-indicator"
              className="absolute -bottom-1 left-0 right-0 h-px bg-cyan"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-10">
        <NavLink to="/" className="font-display text-lg text-ink">
          Sairam Sundararaman
        </NavLink>

        <LayoutGroup>
          <nav className="hidden items-center gap-10 sm:flex">
            {LINKS.map((l) => (
              <NavItem key={l.to} {...l} showIndicator />
            ))}
          </nav>
        </LayoutGroup>

        <button
          className="text-ink sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-out sm:hidden",
          open ? "max-h-48" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-line px-6 py-4">
          {LINKS.map((l) => (
            <div key={l.to} className="py-2">
              <NavItem {...l} onClick={() => setOpen(false)} />
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
