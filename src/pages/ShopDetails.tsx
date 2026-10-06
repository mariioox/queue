import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Clock, MapPin, Users, ArrowLeft, Ticket } from "lucide-react";
import type { Shop } from "../types/queue";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Badge, Button, EmptyState, QueueLoader } from "../components/ui";
import { DEFAULT_WAIT_MINUTES, estimateWaitMinutes } from "../lib/wait";
import { useSessionReady } from "../lib/session-context";

const ShopDetails = () => {
  const { user } = useUser();
  const ready = useSessionReady();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // To get shop data data
        const { data: shopData, error: shopError } = await supabase
          .from("shops")
          .select("*")
          .eq("id", id)
          .single();

        if (shopError) throw shopError;

        // To get count of people in queue
        const { data: waiting, error: countError } = await supabase.rpc(
          "queue_counts",
          { p_shop_id: id },
        );

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
            avgWaitMinutes: DEFAULT_WAIT_MINUTES,
            currentQueue: Number(waiting ?? 0),
          });
        }
      } catch (error) {
        const err = error as Error;
        toast.error("Couldn't load the shop", { description: err.message });
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [id]);

  // Live queue count: refetch whenever this shop's bookings change
  useEffect(() => {
    if (!id) return;

    const fetchQueueCount = async () => {
      const { data, error } = await supabase.rpc("queue_counts", {
        p_shop_id: id,
      });
      if (error || data === null) return;
      setShop((prev) =>
        prev ? { ...prev, currentQueue: Number(data) } : prev,
      );
    };

    const channel = supabase
      .channel(`shop-count-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `shop_id=eq.${id}`,
        },
        () => fetchQueueCount(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleJoinQueue = async () => {
    if (!user) {
      toast.info("Sign in to join the queue");
      navigate("/login");
      return;
    }
    if (!ready) {
      toast.info("Just a moment — finishing sign-in…");
      return;
    }

    setIsJoining(true);

    try {
      // To prevent double joining
      const { data: existing } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", user.id)
        .eq("shop_id", id)
        .in("status", ["waiting", "serving"])
        .maybeSingle();

      if (existing) {
        toast.warning("You're already in line for this shop");
        navigate("/my-queue");
        return;
      }

      // Insert via security-definer RPC (enforces one active booking per user+shop)
      const { error } = await supabase.rpc("join_queue", {
        p_shop_id: id,
        p_customer_name: user.fullName || user.username,
      });

      if (error) throw error;

      toast.success("You're in line!", {
        description: "Track your spot under My Spots.",
      });
      navigate("/my-queue");
    } catch (error) {
      const err = error as Error;
      toast.error("Could not join the queue", { description: err.message });
    } finally {
      setIsJoining(false);
    }
  };

  // Just a loading screen
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <QueueLoader label="Loading shop…" />
      </div>
    );

  if (!shop)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <EmptyState
          icon={<Ticket size={34} />}
          title="Shop not found"
          description="The shop you're looking for doesn't exist or was removed."
          action={
            <Button variant="outline" onClick={() => navigate("/explore")}>
              Return to Explore
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-canvas pb-20">
      {/* Hero section */}
      <div className="relative h-64 md:h-96 w-full">
        <img
          src={shop.image_url}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute top-6 left-6 bg-canvas/90 backdrop-blur border-2 border-ink p-2.5 rounded-lg text-ink hover:bg-ink hover:text-canvas transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-card rounded-xl border-2 border-ink shadow-[8px_8px_0_0_var(--ink)] p-7 md:p-10">
          {/* Shop Info. */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <Badge variant="accent">{shop.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold text-ink mt-4 tracking-tight leading-none">
                {shop.name}
              </h1>
              <p className="text-ink-muted font-medium mt-3 flex items-center gap-2 text-sm">
                <MapPin size={15} className="text-accent" /> {shop.location}
              </p>
            </div>
          </div>

          {/* Shop Desc. */}
          <p className="text-ink-muted text-lg leading-relaxed mb-8 font-medium">
            {shop.description}
          </p>

          {/* Shop's customer info- Ppl in line & Est. time */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface p-5 rounded-lg border border-dashed border-line">
              <Users className="text-accent mb-2" size={24} />
              <p className="font-mono text-[10px] text-ink-muted uppercase tracking-[0.2em]">
                In line
              </p>
              <p className="text-3xl font-extrabold text-ink font-mono">
                {shop.currentQueue}
              </p>
            </div>
            <div className="bg-surface p-5 rounded-lg border border-dashed border-line">
              <Clock className="text-success mb-2" size={24} />
              <p className="font-mono text-[10px] text-ink-muted uppercase tracking-[0.2em]">
                Est. wait
              </p>
              <p className="text-3xl font-extrabold text-ink font-mono">
                {estimateWaitMinutes(shop.currentQueue, shop.avgWaitMinutes)}m
              </p>
            </div>
          </div>

          <Button
            onClick={handleJoinQueue}
            disabled={isJoining}
            size="lg"
            className="w-full"
          >
            {isJoining ? "Joining…" : "Join the queue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
