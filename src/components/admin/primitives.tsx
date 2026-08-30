"use client";

import {
  useEffect,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/* --------------------------------- Button -------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-body font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum";

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-plum text-cream hover:bg-plum-deep",
  secondary:
    "bg-white text-plum-deep ring-1 ring-inset ring-plum-deep/15 hover:bg-lilac-soft/50",
  ghost: "bg-transparent text-plum-deep hover:bg-plum-deep/5",
  danger:
    "bg-white text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50",
};

const BTN_SIZE: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentProps<"button">) {
  return (
    <button
      className={cn(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size], className)}
      {...props}
    />
  );
}

/* ---------------------------------- Card --------------------------------- */

export function Card({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-plum-deep/10 bg-white shadow-[0_1px_2px_rgba(61,22,54,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------- Form bits ------------------------------ */

const CONTROL =
  "w-full rounded-lg border border-plum-deep/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-mauve/60 focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum";

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(CONTROL, "min-h-20", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(CONTROL, "pr-8", className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wide text-mauve"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-mauve">{hint}</p>
      ) : null}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  labelledBy,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  labelledBy?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum",
        checked ? "bg-plum" : "bg-plum-deep/20",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

/* --------------------------------- Badge --------------------------------- */

export function Badge({
  className,
  tone = "neutral",
  ...props
}: {
  tone?: "neutral" | "lilac" | "amber" | "sky" | "green" | "red";
} & ComponentProps<"span">) {
  const tones = {
    neutral: "bg-plum-deep/8 text-plum-deep",
    lilac: "bg-lilac-soft text-plum-deep",
    amber: "bg-amber-100 text-amber-800",
    sky: "bg-sky-100 text-sky-800",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-700",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------- Spinner -------------------------------- */

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-14 text-center">
      <p className="font-display text-lg text-plum-deep">{title}</p>
      {children ? <p className="text-sm text-mauve">{children}</p> : null}
    </div>
  );
}

/* ----------------------------- Overlay (modal/drawer) ------------------- */

function useOverlay(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
}

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useOverlay(onClose);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-cream shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-plum-deep/10 px-5 py-3.5">
          <h2 className="font-display text-lg text-plum-deep">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-mauve hover:bg-plum-deep/5 hover:text-plum-deep"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-plum-deep/10 bg-white/60 px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

export function Drawer({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useOverlay(onClose);
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-cream shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-plum-deep/10 px-5 py-3.5">
          <h2 className="font-display text-lg text-plum-deep">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-mauve hover:bg-plum-deep/5 hover:text-plum-deep"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-plum-deep/10 bg-white/60 px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
