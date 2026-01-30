import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Clock, MapPin, Users, ArrowLeft, Loader2 } from "lucide-react";
import type { Shop } from "../types/queue";
import { useUser } from "@clerk/clerk-react";

const ShopDetails = () => {
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false); // New: track button loading state

  useEffect(() => {
    // Define it inside to satisfy the dependency rule
    const fetchShopData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const { data: shopData, error: shopError } = await supabase
          .from("shops")
          .select("*")
          .eq("id", id)
          .single();

        if (shopError) throw shopError;

        const { count, error: countError } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("shop_id", id)
          .eq("status", "waiting");

        if (countError) throw countError;

        if (shopData) {
          setShop({
            id: shopData.id,
            name: shopData.name,
            category: shopData.category,
            location: shopData.location,
            description: shopData.description,
            image_url: shopData.image_url,
            owner_id: shopData.owner_id,
            avgWaitMinutes: 15,
            currentQueue: count || 0,
          });
        }
      } catch (error) {
        const err = error as Error;
        console.error("Fetch error:", err.message);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [id]); // No warning now, because fetchShopData is created inside the effect

  const handleJoinQueue = async () => {
    if (!user) {
      alert("Please sign in to join the queue!");
      return;
    }

    setIsJoining(true);

    try {
      // 3. Prevent double joining
      const { data: existing } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", user.id)
        .eq("shop_id", id)
        .in("status", ["waiting", "serving"])
        .maybeSingle();

      if (existing) {
        alert("You are already in line for this shop!");
        navigate("/my-queue");
        return;
      }

      // 4. Insert into Database
      const { error } = await supabase.from("bookings").insert([
        {
          shop_id: id,
          user_id: user.id,
          customer_name: user.fullName || user.username || "Guest",
          status: "waiting",
        },
      ]);

      if (error) throw error;

      navigate("/my-queue");
    } catch (error) {
      const err = error as Error; // Fixed the 'any' error here
      console.error("Join error:", err.message);
      alert("Could not join queue: " + err.message);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-bold animate-pulse">LOADING SHOP...</p>
      </div>
    );

  if (!shop)
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-black text-red-500 uppercase">
          Shop Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The shop you are looking for doesn't exist or was removed.
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold"
        >
          Return to Explore
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="relative h-64 md:h-96 w-full">
        <img
          src={shop.image_url}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-xl p-3 rounded-2xl text-white hover:bg-white/40 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                {shop.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 uppercase tracking-tighter leading-none">
                {shop.name}
              </h1>
              <p className="text-gray-500 font-bold mt-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" /> {shop.location}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium">
            {shop.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
              <Users className="text-blue-600 mb-2" size={28} />
              <p className="text-xs font-black text-blue-600/50 uppercase tracking-widest">
                In Line
              </p>
              <p className="text-3xl font-black text-gray-900">
                {shop.currentQueue}
              </p>
            </div>
            <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100">
              <Clock className="text-green-600 mb-2" size={28} />
              <p className="text-xs font-black text-green-600/50 uppercase tracking-widest">
                Est. Wait
              </p>
              <p className="text-3xl font-black text-gray-900">
                {shop.currentQueue * 15}m
              </p>
            </div>
          </div>

          <button
            onClick={handleJoinQueue}
            disabled={isJoining}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {isJoining ? (
              <Loader2 className="animate-spin" />
            ) : (
              "JOIN THE QUEUE"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
