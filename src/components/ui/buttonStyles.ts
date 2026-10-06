type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.14em] font-bold rounded-lg transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-50 select-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent shadow-[3px_3px_0_0_var(--ink)] hover:bg-accent-hover hover:shadow-[4px_4px_0_0_var(--ink)]",
  outline:
    "border-2 border-ink text-ink bg-transparent hover:bg-ink hover:text-canvas shadow-[3px_3px_0_0_var(--line)] hover:shadow-[4px_4px_0_0_var(--line)]",
  ghost: "text-ink-muted hover:text-ink bg-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-11 px-6 text-xs",
  lg: "h-14 px-8 text-sm",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return [BASE, VARIANTS[variant], SIZES[size], className]
    .filter(Boolean)
    .join(" ");
}
