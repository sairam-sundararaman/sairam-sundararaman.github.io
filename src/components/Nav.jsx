import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/cv", label: "CV" },
];

function NavItem({ to, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "font-mono text-[13px] tracking-wide uppercase transition-colors duration-200",
          isActive ? "text-cyan" : "text-mist hover:text-white"
        )
      }
    >
      {label}
    </NavLink>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line-dark bg-void/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <NavLink to="/" className="font-display text-lg text-white">
          Sairam Sundararaman
        </NavLink>

        <nav className="hidden items-center gap-8 sm:flex">
          {LINKS.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </nav>

        <button
          className="text-white sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-line-dark bg-void transition-[max-height] duration-300 ease-out sm:hidden",
          open ? "max-h-48" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
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
