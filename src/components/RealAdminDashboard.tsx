import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Shop, Booking } from "../types/queue"; // Use Booking here
import { Users, Clock, Play, CheckCircle } from "lucide-react";

const RealAdminDashboard = ({ shop }: { shop: Shop }) => {
  // Use the real Booking type instead of the old Customer interface
  const [queue, setQueue] = useState<Booking[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("shop_id", shop.id)
        .in("status", ["waiting", "serving"])
        .order("created_at", { ascending: true });

      if (data) {
        const serving = data.find((b) => b.status === "serving");
        const waiting = data.filter((b) => b.status === "waiting");

        setCurrentCustomer(serving || null);
        setQueue(waiting);
      }
      setLoading(false);
    };

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
  }, [shop.id]);

  const handleNextCustomer = async () => {
    if (queue.length === 0) return;
    const nextPerson = queue[0];

    // If someone is currently being served, complete them first
    if (currentCustomer) {
      await supabase
        .from("bookings")
        .update({ status: "completed" })
        .eq("id", currentCustomer.id);
    }

    // Move next person to serving
    await supabase
      .from("bookings")
      .update({ status: "serving" })
      .eq("id", nextPerson.id);
  };

  const handleFinishSession = async () => {
    if (!currentCustomer) return;
    await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", currentCustomer.id);
  };

  if (loading)
    return <div className="p-10 text-center font-bold">Loading Queue...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header section remains the same - it was good! */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={shop.image_url}
            className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white shadow-md"
            alt={shop.name}
          />
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">
              {shop.name}
            </h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs uppercase">
                {shop.category}
              </span>
              • {shop.location}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Waiting
              </p>
              <p className="text-xl font-black">{queue.length}</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
                Est. Wait
              </p>
              <p className="text-xl font-black">{queue.length * 15}m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">
                Now Serving
              </h3>
              {currentCustomer ? (
                <div className="space-y-4">
                  {/* CHANGED: customer_name instead of name */}
                  <h2 className="text-4xl font-black">
                    {currentCustomer.customer_name}
                  </h2>
                  <p className="text-blue-400 font-medium">
                    Started at{" "}
                    {new Date(currentCustomer.created_at).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                  <button
                    onClick={handleFinishSession}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} /> Finish Session
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center py-6">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="text-white translate-x-0.5" />
                  </div>
                  <p className="text-gray-400 font-medium italic">
                    No one is being served
                  </p>
                  <button
                    onClick={handleNextCustomer}
                    disabled={queue.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold transition-all"
                  >
                    Call Next Customer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-black text-xl">Upcoming Waitlist</h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Live
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {queue.length > 0 ? (
                queue.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">
                        {index + 1}
                      </div>
                      <div>
                        {/* CHANGED: customer_name instead of name */}
                        <p className="font-bold text-gray-900">
                          {customer.customer_name}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                          Joined at{" "}
                          {new Date(customer.created_at).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>
                    {/* ... (buttons remain the same) */}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400 font-medium">
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

export default RealAdminDashboard;
