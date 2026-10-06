import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card border border-line rounded-xl", className)}
    {...props}
  />
);

export default Card;
