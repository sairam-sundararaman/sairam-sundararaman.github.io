import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-line bg-white/60 p-7 sm:p-8 transition-colors duration-300 hover:border-azure/40",
        className
      )}
      {...props}
    />
  );
}

export function CardEyebrow({ className, ...props }) {
  return <div className={cn("font-mono text-xs tracking-widest text-steel uppercase mb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-display text-xl sm:text-2xl leading-snug text-ink", className)} {...props} />;
}
