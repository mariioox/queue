import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, MapPin } from "lucide-react";
import type { Shop } from "../types/queue";

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <Link to={`/shop/${shop.id}`} className="group">
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={shop.image_url}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase text-blue-600">
              {shop.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-black text-gray-900 mb-1 truncate">
            {shop.name}
          </h3>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-1 mb-4">
            <MapPin size={14} /> {shop.location}
          </p>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-sm font-bold">
                {shop.currentQueue || 0} in line
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={16} />
              <span className="text-sm font-bold">{shop.avgWaitMinutes}m</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
