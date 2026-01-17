import React, { useState, useCallback } from "react";
import type { QueueTicket } from "../types/queue";
import { QueueContext } from "./QueueContext";

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // LAZY INITIALIZER: Prevents cascading render errors by syncing with storage BEFORE render
  const [activeTicket, setActiveTicket] = useState<QueueTicket | null>(() => {
    const saved = localStorage.getItem("active_ticket");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Convert string date back to Date object if necessary
      return { ...parsed, joinedAt: new Date(parsed.joinedAt) };
    } catch {
      return null;
    }
  });

  const joinQueue = useCallback(
    (shopId: string, shopName: string, avgServiceTime: number) => {
      // Application: Using "Standard Time" for queue estimation
      const position = Math.floor(Math.random() * 5) + 1;
      const newTicket: QueueTicket = {
        shopId,
        shopName,
        position,
        joinedAt: new Date(),
        estimatedWait: position * avgServiceTime, // Standard time calculation
      };

      setActiveTicket(newTicket);
      localStorage.setItem("active_ticket", JSON.stringify(newTicket));
    },
    []
  );

  const leaveQueue = useCallback(() => {
    setActiveTicket(null);
    localStorage.removeItem("active_ticket");
  }, []);

  return (
    <QueueContext.Provider value={{ activeTicket, joinQueue, leaveQueue }}>
      {children}
    </QueueContext.Provider>
  );
};
