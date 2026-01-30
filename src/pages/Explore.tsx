import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // Make sure this path is correct
import ShopCard from "../components/ShopCard";
import type { Shop } from "../types/queue";

const Explore: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]); // Real data state
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Barber", "Food", "Laundry", "Clinic", "Other"];

  // --- FETCH DATA FROM SUPABASE ---
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data, error } = await supabase
          .from("shops")
          .select(`*, bookings(count)`)
          .eq("bookings.status", "waiting"); // Only count people currently waiting

        if (error) throw error;

        if (data) {
          const formattedShops: Shop[] = data.map((shop) => ({
            id: shop.id, // Make sure this matches 'id' or 'iid' in your queue.ts
            name: shop.name,
            category: shop.category,
            location: shop.location,
            description: shop.description,
            image_url: shop.image_url,
            owner_id: shop.owner_id,
            // Since these aren't in the DB yet, we provide defaults to satisfy the Interface
            avgWaitMinutes: 15,
            currentQueue: shop.bookings?.[0]?.count || 0, // Extract the count from the joined array
          }));
          setShops(formattedShops);
        }
      } catch (err) {
        console.error("Error fetching shops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Filter based on the 'shops' state instead of MOCK_SHOPS
  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || shop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading)
    return <div className="p-10 text-center">Finding services...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Find a Service
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for barbers, clinics, etc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
        />

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap border transition-all ${
                activeCategory === category
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
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
            <p className="text-gray-400 text-lg">
              No services found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
