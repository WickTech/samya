import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "center",
  className,
  tone = "plum",
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  tone?: "plum" | "cream";
}) {
  return (
    <div
      className={cn(
        "max-w-prose",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow",
            tone === "cream" && "text-lilac",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-2 text-3xl sm:text-4xl",
          tone === "cream" && "text-cream",
        )}
      >
        {title}
      </h2>
      {children && (
        <div
          className={cn(
            "mt-3 text-[0.95rem] leading-relaxed",
            tone === "cream" ? "text-lilac-soft/80" : "text-ink/65",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
