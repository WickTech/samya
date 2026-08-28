import { cn } from "@/lib/cn";

/**
 * Hand-drawn style botanical line-art, carried over from the SĀMYA
 * brand marks. Pure SVG so it scales and themes with currentColor.
 */

export function BotanicalSprig({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden
      className={cn("text-mauve/70", flip && "-scale-x-100", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="currentColor"
      >
        <path d="M60 200 C 60 150 58 90 62 20" fill="none" />
        <path d="M62 40 C 84 32 100 44 104 68 C 78 70 64 58 62 40Z" fillOpacity={0.12} />
        <path d="M60 82 C 36 74 20 86 16 110 C 42 112 56 100 60 82Z" fillOpacity={0.12} />
        <path d="M62 120 C 84 112 100 124 104 148 C 78 150 64 138 62 120Z" fillOpacity={0.12} />
        <circle cx="63" cy="18" r="6" stroke="none" fillOpacity={0.28} />
        <circle cx="52" cy="26" r="4" stroke="none" fillOpacity={0.2} />
        <circle cx="72" cy="28" r="3.5" stroke="none" fillOpacity={0.2} />
      </g>
    </svg>
  );
}

export function LeafDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)} aria-hidden>
      <span className="leaf-rule h-px flex-1" />
      <svg viewBox="0 0 48 24" className="h-4 w-9 text-mauve" fill="none">
        <path
          d="M24 2 C 30 8 38 10 46 12 C 38 14 30 16 24 22 C 18 16 10 14 2 12 C 10 10 18 8 24 2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="currentColor"
          fillOpacity={0.12}
        />
      </svg>
      <span className="leaf-rule h-px flex-1" />
    </div>
  );
}

/** Big translucent leaf cluster for section backgrounds. */
export function BotanicalField({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden
      className={cn("pointer-events-none absolute text-lilac", className)}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.5">
        <path d="M40 360 C 120 300 180 220 200 40" />
        <path d="M120 220 C 60 180 40 120 60 60 C 120 90 150 150 120 220Z" />
        <path d="M170 120 C 230 90 300 110 340 60 C 300 140 240 170 170 120Z" />
        <path d="M200 260 C 260 240 320 260 360 220 C 320 300 250 320 200 260Z" />
      </g>
    </svg>
  );
}
