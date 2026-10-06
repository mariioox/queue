import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "accent" | "outline" | "highlight" | "success";

const VARIANTS: Record<Variant, string> = {
  accent: "bg-accent text-on-accent",
  outline: "border border-line text-ink-muted",
  highlight: "bg-highlight text-ink",
  success: "bg-success text-white",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const Badge = ({
  variant = "outline",
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] font-bold px-2.5 py-1 rounded",
      VARIANTS[variant],
      className,
    )}
    {...props}
  />
);

export default Badge;
