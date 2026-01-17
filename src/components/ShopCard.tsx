import React from "react";
import type { Shop } from "../types/queue";
import { Link } from "react-router-dom";

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <div className="card shadow-md border rounded-lg overflow-hidden">
      <img
        src={shop.imageUrl}
        alt={shop.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{shop.name}</h3>
        <p className="text-gray-500">{shop.category}</p>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-semibold text-blue-600">
              {shop.currentQueue} in line
            </span>
            <p className="text-gray-400">~{shop.avgWaitMinutes} mins wait</p>
          </div>
          <Link
            to={`/shop/${shop.id}`}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
