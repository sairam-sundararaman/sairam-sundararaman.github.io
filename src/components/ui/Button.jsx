import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium font-body transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-azure text-white hover:bg-[#2450c4]",
        ghost:
          "border border-ink/15 text-ink hover:border-azure hover:text-azure dark:border-white/20 dark:text-white dark:hover:border-cyan dark:hover:text-cyan",
        "ghost-dark": "border border-white/20 text-white hover:border-cyan hover:text-cyan",
        link: "text-azure underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  }
);

const Button = forwardRef(({ className, variant, size, as: Comp = "button", ...props }, ref) => {
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
