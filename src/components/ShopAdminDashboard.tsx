import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Shop, Booking } from "../types/queue";
import { Users, Clock, Play, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { estimateWaitMinutes } from "../lib/wait";
import { Badge, Button, EmptyState, QueueLoader } from "./ui";

const ShopAdminDashboard = ({ shop }: { shop: Shop }) => {
  const [queue, setQueue] = useState<Booking[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fetchQueue = useCallback(async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("shop_id", shop.id)
      .in("status", ["waiting", "serving"])
      .order("created_at", { ascending: true });

    if (error) {
      setLoadError(error.message);
      return;
    }

    const serving = data.find((b) => b.status === "serving");
    const waiting = data.filter((b) => b.status === "waiting");

    setCurrentCustomer(serving || null);
    setQueue(waiting);
    setLoadError(null);
    setLoading(false);
  }, [shop.id]);

  useEffect(() => {
    fetchQueue();

    const channel = supabase
      .channel(`shop-queue-${shop.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `shop_id=eq.${shop.id}`,
        },
        () => fetchQueue(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQueue, shop.id]);

  const handleNextCustomer = async () => {
    if (queue.length === 0 || busy) return;
    setBusy(true);

    try {
      // Security-definer RPC: completes whoever is being served,
      // then serves the oldest waiting customer — atomically.
      const { error } = await supabase.rpc("call_next", {
        p_shop_id: shop.id,
      });
      if (error) throw error;

      await fetchQueue();
    } catch (err) {
      toast.error("Couldn't call the next customer", {
        description: err instanceof Error ? err.message : undefined,
      });
      await fetchQueue();
    } finally {
      setBusy(false);
    }
  };

  // To remove current customer from queue
  const handleFinishSession = async () => {
    if (!currentCustomer || busy) return;
    setBusy(true);

    try {
      const { error } = await supabase.rpc("finish_session", {
        p_shop_id: shop.id,
      });
      if (error) throw error;
      await fetchQueue();
    } catch (err) {
      toast.error("Couldn't finish the session", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <div className="py-16">
        <QueueLoader label="Loading queue…" />
      </div>
    );

  if (loadError)
    return (
      <div className="py-16">
        <EmptyState
          icon={<AlertTriangle size={36} />}
          title="Couldn't load the queue"
          description={loadError}
          action={
            <Button
              onClick={() => {
                setLoading(true);
                fetchQueue();
              }}
            >
              Try again
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        {/* Shop info */}
        <div className="flex items-center gap-4">
          <img
            src={shop.image_url}
            className="w-16 h-16 rounded-lg object-cover border-2 border-ink"
            alt={shop.name}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {shop.name}
            </h1>
            <p className="text-ink-muted font-medium flex items-center gap-2 text-sm mt-1">
              <Badge variant="accent">{shop.category}</Badge>• {shop.location}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="bg-card px-4 py-3 rounded-lg border border-line flex items-center gap-3">
            <span className="bg-accent text-on-accent p-2 rounded">
              <Users size={16} />
            </span>
            <div>
              <p className="font-mono text-[10px] text-ink-muted uppercase tracking-[0.16em]">
                Waiting
              </p>
              <p className="text-xl font-mono font-bold text-ink">
                {queue.length}
              </p>
            </div>
          </div>
          <div className="bg-card px-4 py-3 rounded-lg border border-line flex items-center gap-3">
            <span className="bg-success text-white p-2 rounded">
              <Clock size={16} />
            </span>
            <div>
              <p className="font-mono text-[10px] text-ink-muted uppercase tracking-[0.16em]">
                Est. wait
              </p>
              <p className="text-xl font-mono font-bold text-ink">
                {estimateWaitMinutes(queue.length)}m
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Now serving panel */}
        <div className="lg:col-span-1">
          <div className="bg-ink text-canvas p-7 rounded-xl border-2 border-ink shadow-[6px_6px_0_0_var(--line)] h-full">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-highlight mb-5">
              Now serving
            </h3>
            {currentCustomer ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    {currentCustomer.customer_name}
                  </h2>
                  <p className="text-canvas/60 font-mono text-sm mt-1">
                    Started at{" "}
                    {new Date(currentCustomer.created_at).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                </div>
                <button
                  onClick={handleFinishSession}
                  disabled={busy}
                  className="w-full bg-success text-white py-3.5 rounded-lg font-mono text-xs uppercase tracking-[0.16em] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={16} /> Finish session
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-canvas/60">
                  <span className="w-10 h-10 rounded-lg bg-canvas/10 flex items-center justify-center">
                    <Play size={18} />
                  </span>
                  <p className="font-medium italic text-sm">
                    No one is being served
                  </p>
                </div>
                <Button
                  onClick={handleNextCustomer}
                  disabled={queue.length === 0 || busy}
                  className="w-full"
                >
                  Call next customer
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-line rounded-xl overflow-hidden">
            <div className="p-5 border-b border-line flex justify-between items-center">
              <h3 className="font-extrabold text-lg tracking-tight">
                Upcoming waitlist
              </h3>
              <Badge variant="success">Live</Badge>
            </div>
            <div className="divide-y divide-line">
              {queue.length > 0 ? (
                queue.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="p-5 flex items-center justify-between hover:bg-surface/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 border border-line bg-surface rounded flex items-center justify-center font-mono font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-ink">
                          {customer.customer_name}
                        </p>
                        <p className="font-mono text-xs text-ink-muted">
                          Joined at{" "}
                          {new Date(customer.created_at).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-ink-muted font-medium">
                    Waitlist is empty.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAdminDashboard;
