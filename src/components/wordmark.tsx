import Link from "next/link";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

export function Wordmark({
  className,
  showDevanagari = true,
  href = "/",
}: {
  className?: string;
  showDevanagari?: boolean;
  href?: string | null;
}) {
  const content = (
    <span className="flex items-baseline gap-2.5">
      <span className={cn("wordmark text-plum-deep", className)}>
        {SITE.wordmark}
      </span>
      {showDevanagari && (
        <span className="font-body text-[0.7rem] tracking-wide text-mauve">
          {SITE.devanagari}
        </span>
      )}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label={`${SITE.name} home`}>
      {content}
    </Link>
  );
}
