import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface TicketCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders the perforated tear line + side notches (pass a footer below it). */
  tear?: ReactNode;
}

const Notch = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "absolute w-5 h-5 rounded-full bg-canvas -translate-x-1/2 -translate-y-1/2 z-10",
      className,
    )}
  />
);

/** Ticket-stub card: paper stock, hard border, optional perforated tear. */
const TicketCard = ({
  tear,
  className,
  children,
  ...props
}: TicketCardProps) => (
  <div className={cn("relative", className)} {...props}>
    <div className="bg-card border border-line rounded-xl overflow-visible">
      {children}
      {tear && (
        <>
          <div className="relative h-0">
            <Notch className="left-0 top-0" />
            <Notch className="left-full top-0" />
          </div>
          <div className="ticket-march h-[2px] mx-3" />
          {tear}
        </>
      )}
    </div>
  </div>
);

export default TicketCard;
