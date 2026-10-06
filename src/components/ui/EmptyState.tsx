import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn("text-center py-16 px-6", className)}>
    <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-xl border-2 border-dashed border-line text-ink-muted rotate-[-4deg]">
      {icon}
    </div>
    <h2 className="text-2xl font-extrabold text-ink tracking-tight">{title}</h2>
    {description && (
      <p className="text-ink-muted font-medium mt-2 max-w-sm mx-auto">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
