import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

// No filled pill CTAs — an outlined rectangle for the one real action
// (downloading the CV) and a plain underlined text link for everything else.
const buttonVariants = cva(
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-void disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "border border-ink/25 text-ink px-6 py-3.5 hover:border-cyan hover:text-cyan",
        text: "text-ink hover:text-cyan",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
);

const Button = forwardRef(({ className, variant, as: Comp = "button", arrow, children, ...props }, ref) => {
  return (
    <Comp className={cn(buttonVariants({ variant }), className)} ref={ref} {...props}>
      {children}
      {arrow && <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
