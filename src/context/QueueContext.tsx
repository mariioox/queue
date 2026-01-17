import { createContext } from "react";
import type { QueueTicket } from "../types/queue";

interface QueueContextType {
  activeTicket: QueueTicket | null;
  joinQueue: (shopId: string, shopName: string, avgServiceTime: number) => void;
  leaveQueue: () => void;
}

export const QueueContext = createContext<QueueContextType | undefined>(
  undefined
);
