import { UserRound } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";

interface QueueLoaderProps {
  label?: string;
  variant?: "fullscreen" | "inline";
  className?: string;
}

const FIGURE_DELAYS = ["0s", "0.35s", "0.7s", "1.05s"];

/**
 * Signature loading state: a little line of people shuffling forward,
 * one stepping through the counter window at the front.
 */
const QueueLoader = ({
  label = "Hang tight…",
  variant = "fullscreen",
  className,
}: QueueLoaderProps) => {
  const fullscreen = variant === "fullscreen";
  const figureSize = fullscreen ? "w-8 h-8" : "w-6 h-6";
  const iconSize = fullscreen ? 32 : 24;
  const step = fullscreen ? "3rem" : "2.25rem"; // figure width + gap

  const figures = (
    <div
      className={cn("flex items-center", fullscreen ? "gap-4 ml-4" : "gap-3 ml-3")}
      style={{ "--ql-step": step } as CSSProperties}
    >
      {FIGURE_DELAYS.map((delay) => (
        <span
          key={delay}
          className={cn("ql-figure shrink-0", figureSize)}
          style={{ animationDelay: delay }}
        >
          <UserRound
            size={iconSize}
            className="text-ink-muted"
            strokeWidth={1.75}
          />
        </span>
      ))}
    </div>
  );

  const counter = (
    <div
      className={cn(
        "relative z-10 bg-ink text-canvas rounded-lg flex flex-col items-center justify-center border-2 border-ink",
        fullscreen ? "w-16 h-20 gap-2" : "w-11 h-14 gap-1",
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse"
        aria-hidden
      />
      <span className="font-mono text-[8px] uppercase tracking-widest">
        {fullscreen ? "Q" : "…"}
      </span>
    </div>
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col",
        fullscreen ? "items-center justify-center gap-7 py-20" : "items-center gap-3",
        className,
      )}
    >
      <div className="flex items-center">
        {counter}
        {figures}
      </div>
      <p
        className={cn(
          "font-mono uppercase tracking-[0.28em] text-ink-muted animate-pulse",
          fullscreen ? "text-xs" : "text-[10px]",
        )}
      >
        {label}
      </p>
    </div>
  );
};

export default QueueLoader;
