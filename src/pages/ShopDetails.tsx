import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import type { Shop } from "../types/queue";
import { useNavigate } from "react-router-dom";
import { useQueue } from "../hooks/useQueue";

const MOCK_SHOPS: Shop[] = [
  {
    id: "1",
    name: "Sola Sharp Cuts",
    category: "Barber",
    description:
      "Best fades in town. Professional services including hot towel shaves.",
    currentQueue: 5,
    avgWaitMinutes: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
  },
  {
    id: "2",
    name: "Mama J's Noodles",
    category: "Food",
    description: "Spicy instant noodles and local delicacies.",
    currentQueue: 12,
    avgWaitMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800",
  },
  {
    id: "3",
    name: "Lagos Central Maternal Clinic",
    category: "Other", // You could add 'Clinic' to your Category type in queue.ts
    description: "Specialized postnatal check-ups and newborn immunizations.",
    currentQueue: 8,
    avgWaitMinutes: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  },
];

const ShopDetail: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();

  // Find the specific shop using the ID from the URL
  const shop = MOCK_SHOPS.find((s) => s.id === shopId);

  const { joinQueue } = useQueue();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (shop) {
      joinQueue(shop.id, shop.name, shop.avgWaitMinutes);
      navigate("/my-queue"); // Redirect to see the ticket
    }
  };

  if (!shop) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Shop not found</h2>
        <Link to="/explore" className="text-blue-600 underline">
          Go back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-xl overflow-hidden bg-gray-100 mb-6">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold">{shop.name}</h1>
          <p className="text-gray-600 text-lg">
            {shop.category} • Professional Service
          </p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
          Open
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <div className="flex justify-around text-center mb-6">
          <div>
            <p className="text-gray-500 text-sm">People Waiting</p>
            <p className="text-2xl font-bold">{shop.currentQueue}</p>
          </div>
          <div className="border-l border-r px-8">
            <p className="text-gray-500 text-sm">Est. Wait Time</p>
            <p className="text-2xl font-bold text-blue-600">
              {shop.currentQueue * shop.avgWaitMinutes} Mins
            </p>
          </div>
        </div>

        <button
          onClick={handleJoin}
          className="w-full bg-black text-white text-lg font-bold py-4 rounded-xl hover:bg-gray-800 transition"
        >
          Join the Queue
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">About</h2>
      <p className="text-gray-700 leading-relaxed">{shop.description}</p>
    </div>
  );
};

export default ShopDetail;
