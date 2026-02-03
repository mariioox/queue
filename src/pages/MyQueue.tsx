import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Loader2, MapPin, Clock, LogOut, Ticket } from "lucide-react";
import type { Booking } from "../types/queue";

const MyQueue: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Memoized to prevent re-triggering the main useEffect
  const fetchPosition = useCallback(
    async (shopId: string, createdAt: string, bookingId: string) => {
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", shopId)
        .eq("status", "waiting")
        .lt("created_at", createdAt);

      setPositions((prev) => ({ ...prev, [bookingId]: (count || 0) + 1 }));
    },
    [],
  );

  useEffect(() => {
    // Exit if user isn't loaded yet
    if (!isLoaded || !user) return;

    // Define the sync logic inside the effect to keep it clean and current
    const syncUserTickets = async () => {
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

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      if (data) {
        const typedData = data as unknown as Booking[];
        setBookings(typedData);
        // Update positions for all active tickets
        typedData.forEach((b) => fetchPosition(b.shop_id, b.created_at, b.id));
      }
      setLoading(false);
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
      supabase.removeChannel(channel);
    };
  }, [user, isLoaded, fetchPosition]);

  // Leave Queue function
  const leaveQueue = async (bookingId: string) => {
    const confirm = window.confirm("Are you sure you want to leave this line?");
    if (!confirm) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (!error) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
          Updating Your Tickets...
        </p>
      </div>
    );

  // If the user hasn't joined any queue
  if (bookings.length === 0) {
    return (
      <div className="p-10 text-center mt-20 max-w-sm mx-auto">
        <div className="bg-gray-100 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 rotate-12">
          <Clock className="text-gray-400" size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Empty Handed?
        </h2>
        <p className="text-gray-500 mb-8 font-medium italic">
          You haven't joined any queues yet.
        </p>
        <Link
          to="/explore"
          className="block w-full bg-blue-300 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all uppercase text-sm tracking-widest"
        >
          Find a Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen pb-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">
            Live Status
          </p>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">
            Your Spots
          </h1>
        </div>
        <div className="bg-gray-100 text-gray-900 w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg border-b-4 border-gray-300">
          {bookings.length}
        </div>
      </div>

      <div className="space-y-12">
        {bookings.map((ticket) => (
          <div
            key={ticket.id}
            className="relative group animate-in fade-in slide-in-from-bottom-6 duration-700"
          >
            {/* Ticket Shadow Effect */}
            <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-[3rem] -z-10 transition-opacity group-hover:opacity-100 opacity-50"></div>

            <div className="bg-white border border-gray-100 rounded-[3rem] shadow-xl overflow-hidden">
              {/* Header */}
              <div className="p-8 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase leading-tight">
                    {ticket.shops?.name}
                  </h2>
                  <p className="text-gray-400 font-bold flex items-center gap-1 text-xs mt-1">
                    <MapPin size={12} className="text-blue-500" />{" "}
                    {ticket.shops?.location}
                  </p>
                </div>
                <Ticket
                  className="text-gray-200 group-hover:text-blue-600 transition-colors"
                  size={28}
                />
              </div>

              {/* Position Section */}
              <div className="py-6 text-center">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                  Queue Position
                </span>
                <div className="relative inline-block">
                  <h3 className="text-[8rem] font-black leading-none text-gray-900 tracking-tighter">
                    #{positions[ticket.id] || "..."}
                  </h3>
                  {ticket.status === "serving" && (
                    <div className="absolute -top-2 -right-10 bg-green-500 text-white text-[9px] px-3 py-1 rounded-full font-black animate-bounce uppercase shadow-lg">
                      Go Now
                    </div>
                  )}
                </div>
              </div>

              {/* Dotted Line Divider */}
              <div className="flex items-center px-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 -ml-10 border border-gray-100"></div>
                <div className="flex-1 border-t-2 border-dashed border-gray-100 mx-2"></div>
                <div className="w-10 h-10 rounded-full bg-gray-50 -mr-10 border border-gray-100"></div>
              </div>

              {/* Footer / Actions */}
              <div className="p-8 pt-6 bg-gray-50/30">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </p>
                    <p
                      className={`font-black uppercase text-sm ${ticket.status === "serving" ? "text-green-600" : "text-blue-600"}`}
                    >
                      {ticket.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Entry Time
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {new Date(ticket.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => leaveQueue(ticket.id)}
                  className="w-full flex items-center justify-center gap-2 text-gray-400 font-black hover:text-red-500 hover:bg-red-50 py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-transparent hover:border-red-100"
                >
                  <LogOut size={14} /> Cancel Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQueue;
