import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Loader2, MapPin, Clock, LogOut } from "lucide-react";
import type { Booking } from "../types/queue";

const MyQueue: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Get current position from supabase
  const fetchPosition = async (shopId: string, createdAt: string) => {
    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId)
      .eq("status", "waiting")
      .lt("created_at", createdAt);
    setPosition((count || 0) + 1);
  };

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Initial Fetch
    const getInitialData = async () => {
      const { data } = await supabase
        .from("bookings")
        .select(`*, shops (name, location)`)
        .eq("user_id", user.id)
        .in("status", ["waiting", "serving"])
        .maybeSingle();

      if (data) {
        setBooking(data as Booking);
        fetchPosition(data.shop_id, data.created_at);
      }
      setLoading(false);
    };

    getInitialData();

    // Listen for ANY changes to the bookings table in real time
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          // Whenever ANY booking changes (someone leaves, admin finishes a session)
          // we re-run our data check to update the position/status
          getInitialData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isLoaded]);

  const leaveQueue = async () => {
    if (!booking) return;
    const confirm = window.confirm("Are you sure you want to leave the line?");
    if (!confirm) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", booking.id);

    if (!error) setBooking(null);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-bold animate-pulse">Loading...</p>
      </div>
    );

  // Displays if User hasn't joined any queues yet
  if (!booking) {
    return (
      <div className="p-10 text-center mt-20 max-w-sm mx-auto">
        <div className="bg-gray-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-12">
          <Clock className="text-gray-400" size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Empty Handed?
        </h2>
        <p className="text-gray-500 mb-8 font-medium">
          You haven't joined any queues yet. Let's find you a spot.
        </p>
        <Link
          to="/explore"
          className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition-all"
        >
          Explore Shops
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <h1 className="text-4xl font-black mb-8 tracking-tighter italic uppercase">
        Your Spot
      </h1>

      {/* THE TICKET */}
      <div className="bg-white border border-gray-100 rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden">
        {/* Top Section: Shop Info */}
        <div className="p-8 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase leading-none mb-2">
                {booking.shops?.name}
              </h2>
              <p className="text-gray-400 font-bold flex items-center gap-1 text-sm">
                <MapPin size={14} /> {booking.shops?.location}
              </p>
            </div>
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Live Ticket
            </span>
          </div>
        </div>

        {/* Middle Section: THE NUMBER */}
        <div className="p-8 text-center">
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs mb-2">
            Current Position
          </p>
          <div className="relative inline-block">
            <h3 className="text-[8rem] font-black leading-none text-gray-900 tracking-tighter">
              #{position}
            </h3>
            {booking.status === "serving" && (
              <div className="absolute top-0 -right-4 bg-green-500 text-white text-[10px] px-2 py-1 rounded-md font-black animate-bounce">
                YOU'RE UP!
              </div>
            )}
          </div>
        </div>

        {/* Dotted Divider */}
        <div className="flex items-center px-4">
          <div className="w-8 h-8 rounded-full bg-gray-50 -ml-8 border-r border-gray-100"></div>
          <div className="flex-1 border-t-4 border-dotted border-gray-300 mx-2"></div>
          <div className="w-8 h-8 rounded-full bg-gray-50 -mr-8 border-l border-gray-100"></div>
        </div>

        {/* Bottom Section: Details */}
        <div className="p-8 pt-6 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="font-bold text-blue-600 uppercase italic">
                {booking.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Joined At
              </p>
              <p className="font-bold text-gray-900">
                {new Date(booking.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={leaveQueue}
            className="w-full flex items-center justify-center gap-2 text-red-500 font-black bg-red-100 uppercase text-xs tracking-widest hover:bg-red-300 py-4 rounded-2xl transition-all"
          >
            <LogOut size={16} /> Leave Queue
          </button>
        </div>
      </div>

      <p className="text-center mt-8 text-gray-400 text-xs font-medium px-10 leading-relaxed">
        Please arrive at the shop 5 minutes before your turn. Your position
        updates in real-time.
      </p>
    </div>
  );
};

export default MyQueue;
