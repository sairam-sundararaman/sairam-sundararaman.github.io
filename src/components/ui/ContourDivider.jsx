import { cn } from "../../lib/utils";

/**
 * A thin, quiet contour-line rule used between sections — a small
 * recurring bit of texture, kept understated everywhere outside the hero.
 */
export function ContourDivider({ className }) {
  return (
    <svg
      className={cn("w-full h-6 text-line", className)}
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 12 C 100 2, 180 22, 280 14 S 460 2, 560 12 S 740 22, 840 10 S 1020 2, 1200 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
