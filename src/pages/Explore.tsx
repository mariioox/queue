import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import ShopCard from "../components/ShopCard";
import type { Shop } from "../types/queue";
import { Search, AlertTriangle } from "lucide-react";
import { Button, EmptyState, Input, QueueLoader } from "../components/ui";
import { SHOP_CATEGORIES } from "../lib/constants";
import { filterShops } from "../lib/shops";
import { DEFAULT_WAIT_MINUTES } from "../lib/wait";

const Explore: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...SHOP_CATEGORIES];

  // FETCH DATA FROM SUPABASE
  useEffect(() => {
    let cancelled = false;

    const fetchShops = async () => {
      try {
        const { data: shopsData, error: shopsError } = await supabase
          .from("shops")
          .select("*");
        if (shopsError) throw shopsError;

        // Waiting-count per shop (public RPC — anon can't read bookings)
        const { data: countRows, error: countError } = await supabase.rpc(
          "shop_waiting_counts",
        );
        if (countError) throw countError;
        if (cancelled || !shopsData) return;

        const counts = new Map<string, number>();
        (countRows ?? []).forEach(
          (row: { shop_id: string; waiting_count: number }) =>
            counts.set(row.shop_id, Number(row.waiting_count)),
        );

        const formattedShops: Shop[] = shopsData.map((shop: Partial<Shop>) => ({
          id: shop.id!,
          name: shop.name!,
          category: shop.category!,
          location: shop.location!,
          description: shop.description!,
          image_url: shop.image_url!,
          owner_id: shop.owner_id!,
          avgWaitMinutes: DEFAULT_WAIT_MINUTES,
          currentQueue: counts.get(shop.id!) || 0,
        }));

        setShops(formattedShops);
        setLoadError(null);
      } catch (err) {
        if (!cancelled)
          setLoadError(
            err instanceof Error ? err.message : "Could not load shops.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchShops();

    // Live-refresh queue counts
    const channel = supabase
      .channel("explore-queue-counts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => fetchShops(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [reloadKey]);

  // Filter based on the shop name and category
  const filteredShops = filterShops(shops, searchQuery, activeCategory);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <QueueLoader label="Finding services…" />
      </div>
    );

  if (loadError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <EmptyState
          icon={<AlertTriangle size={36} />}
          title="Couldn't load shops"
          description={loadError}
          action={
            <Button
              onClick={() => {
                setLoading(true);
                setReloadKey((k) => k + 1);
              }}
            >
              Try again
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent font-bold mb-2">
          Directory
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
          Find a service
        </h1>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <Input
            type="text"
            placeholder="Search for barbers, clinics, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap border font-mono text-[11px] uppercase tracking-[0.14em] font-bold transition-all ${
                activeCategory === category
                  ? "bg-ink text-canvas border-ink"
                  : "bg-card text-ink-muted border-line hover:border-ink hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-ink-muted font-medium text-lg">
              No services found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
