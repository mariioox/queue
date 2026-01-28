import React, { useState } from "react";
import ShopCard from "../components/ShopCard";
import type { Shop } from "../types/queue";

// Temporary mock data for UI testing
const MOCK_SHOPS: Shop[] = [
  {
    id: "1",
    name: "Sola Sharp Cuts",
    category: "Barber",
    description: "Best fades in town",
    currentQueue: 5,
    avgWaitMinutes: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
  },
  {
    id: "2",
    name: "Mama J's Noodles",
    category: "Food",
    description: "Spicy instant noodles",
    currentQueue: 12,
    avgWaitMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800",
  },
  {
    id: "3",
    name: "Lagos Central Maternal Clinic",
    category: "Clinic", // You could add 'Clinic' to your Category type in queue.ts
    description: "Specialized postnatal check-ups and newborn immunizations.",
    currentQueue: 8,
    avgWaitMinutes: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  },
];

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Barber", "Food", "Laundry", "Clinic", "Other"];

  const filteredShops = MOCK_SHOPS.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || shop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        {/* Search Bar */}
        <h1 className="text-3xl font-bold mb-4">Find a Service</h1>
        <input
          type="text"
          placeholder="Search for barbers, clinics, etc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
        />

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap border ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Handling filtered search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">
            No services found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Explore;
