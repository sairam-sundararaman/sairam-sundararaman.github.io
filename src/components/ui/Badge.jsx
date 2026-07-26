import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-mono text-[11px] tracking-wide uppercase",
  {
    variants: {
      variant: {
        light: "border border-line text-steel px-3 py-1",
        dark: "border border-line-dark text-mist px-3 py-1",
        accent: "bg-azure/10 text-azure px-3 py-1",
        "accent-dark": "bg-cyan/10 text-cyan px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
