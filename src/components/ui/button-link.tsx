import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "plum" | "outline";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-transform duration-150 will-change-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-plum-deep text-cream hover:bg-plum",
  plum: "bg-plum text-cream hover:bg-plum-deep",
  ghost: "bg-transparent text-cream ring-1 ring-inset ring-cream/60 hover:bg-cream/10",
  outline:
    "bg-cream text-plum-deep ring-1 ring-inset ring-mauve/50 hover:ring-plum-deep",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-7 py-3.5 text-sm",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<"a">) {
  return (
    <a
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
