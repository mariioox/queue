import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSessionReady } from "../lib/session-context";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { MapPin, Clock, LogOut, Ticket, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Booking } from "../types/queue";
import {
  Badge,
  Button,
  EmptyState,
  QueueLoader,
  TicketCard,
} from "../components/ui";

const MyQueue: React.FC = () => {
  const { user, isLoaded } = useUser();
  const ready = useSessionReady();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Memoized to prevent re-triggering the main useEffect
  const fetchPosition = useCallback(
    async (shopId: string, createdAt: string, bookingId: string) => {
      const { data, error } = await supabase.rpc("queue_position", {
        p_shop_id: shopId,
        p_created_at: createdAt,
      });

      if (error) return;
      setPositions((prev) => ({
        ...prev,
        [bookingId]: Number(data ?? 1),
      }));
    },
    [],
  );

  useEffect(() => {
    // Exit if user isn't loaded yet or the Supabase session isn't ready
    if (!isLoaded || !user || !ready) return;

    let cancelled = false;

    // Define the sync logic inside the effect to keep it clean and current
    const syncUserTickets = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(
            `
            *,
            shops:shop_id (
              name,
              location
            )
          `,
          )
          .eq("user_id", user.id)
          .in("status", ["waiting", "serving"])
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (cancelled || !data) return;

        const typedData = data as unknown as Booking[];
        setBookings(typedData);
        setLoadError(null);
        // Update positions for all active tickets
        typedData.forEach((b) => fetchPosition(b.shop_id, b.created_at, b.id));
      } catch (err) {
        if (!cancelled)
          setLoadError(
            err instanceof Error ? err.message : "Could not load your tickets.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Initial run
    syncUserTickets();

    // Set up Realtime listener for this specific user's bookings
    const channel = supabase
      .channel(`user-sync-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          syncUserTickets();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user, isLoaded, ready, fetchPosition, reloadKey]);

  const retry = () => {
    setLoading(true);
    setLoadError(null);
    setReloadKey((k) => k + 1);
  };

  // Leave Queue function
  const leaveQueue = (bookingId: string) => {
    toast.warning("Leave this line?", {
      description: "You'll lose your spot and have to join again.",
      duration: 8000,
      action: {
        label: "Leave",
      onClick: async () => {
        const { error } = await supabase.rpc("cancel_booking", {
          p_booking_id: bookingId,
        });

          if (error) {
            toast.error("Couldn't leave the queue", {
              description: error.message,
            });
            return;
          }
          setBookings((prev) => prev.filter((b) => b.id !== bookingId));
          setPositions((prev) => {
            const next = { ...prev };
            delete next[bookingId];
            return next;
          });
        },
      },
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <QueueLoader label="Updating your tickets…" />
      </div>
    );

  if (loadError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <EmptyState
          icon={<AlertTriangle size={36} />}
          title="Couldn't load your tickets"
          description={loadError}
          action={
            <Button onClick={retry} size="lg">
              Try again
            </Button>
          }
        />
      </div>
    );

  // If the user hasn't joined any queue
  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <EmptyState
          icon={<Clock size={38} />}
          title="Empty handed?"
          description="You haven't joined any queues yet."
          action={
            <Link
              to="/explore"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-accent text-on-accent shadow-[3px_3px_0_0_var(--ink)] font-mono text-xs uppercase tracking-[0.14em] font-bold hover:bg-accent-hover transition-colors"
            >
              Find a shop
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen pb-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-2">
            Live status
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">
            Your spots
          </h1>
        </div>
        <div className="bg-ink text-canvas w-10 h-10 flex items-center justify-center rounded-lg font-mono font-bold text-lg">
          {bookings.length}
        </div>
      </div>

      <div className="space-y-8">
        {bookings.map((ticket) => (
          <TicketCard
            key={ticket.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            tear={
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] text-ink-muted uppercase tracking-[0.2em]">
                    Status
                  </p>
                  <Badge
                    variant={ticket.status === "serving" ? "success" : "outline"}
                    className="mt-1"
                  >
                    {ticket.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] text-ink-muted uppercase tracking-[0.2em]">
                    Entry time
                  </p>
                  <p className="font-mono font-bold text-sm text-ink">
                    {new Date(ticket.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => leaveQueue(ticket.id)}
                  className="flex items-center gap-1.5 text-ink-muted hover:text-accent font-mono text-[10px] uppercase tracking-[0.14em] font-bold transition-colors"
                >
                  <LogOut size={13} /> Cancel
                </button>
              </div>
            }
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-extrabold text-ink uppercase tracking-tight leading-tight">
                  {ticket.shops?.name}
                </h2>
                <p className="text-ink-muted font-medium flex items-center gap-1 text-xs mt-1">
                  <MapPin size={12} className="text-accent" />{" "}
                  {ticket.shops?.location}
                </p>
              </div>
              <Ticket
                className="text-line group-hover:text-accent transition-colors"
                size={26}
              />
            </div>

            {/* Position Section */}
            <div className="py-5 text-center">
              <span className="font-mono text-[10px] text-ink-muted uppercase tracking-[0.25em]">
                Queue position
              </span>
              <div className="relative inline-block">
                <h3 className="text-[6.5rem] font-mono font-bold leading-none text-ink tracking-tighter">
                  #{positions[ticket.id] || "??"}
                </h3>
                {ticket.status === "serving" && (
                  <div className="absolute top-3 -right-12 bg-success text-white font-mono text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider animate-bounce">
                    Go now
                  </div>
                )}
              </div>
            </div>
          </TicketCard>
        ))}
      </div>
    </div>
  );
};

export default MyQueue;
