import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, MapPin } from "lucide-react";
import type { Shop } from "../types/queue";
import { estimateWaitMinutes } from "../lib/wait";

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <Link to={`/shop/${shop.id}`} className="group block">
      <div className="bg-card rounded-xl border border-line overflow-hidden hover:border-ink hover:shadow-[6px_6px_0_0_var(--ink)] transition-all duration-200 h-full">
        {/* Image Container */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={shop.image_url}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-card/95 backdrop-blur px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-accent border border-line">
              {shop.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-extrabold text-ink tracking-tight truncate">
            {shop.name}
          </h3>
          <p className="text-ink-muted text-sm font-medium flex items-center gap-1 mt-1 mb-4">
            <MapPin size={13} /> {shop.location}
          </p>

          <div className="flex justify-between items-center pt-4 border-t border-dashed border-line">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-accent" />
              <span className="font-mono text-xs font-bold text-ink">
                {shop.currentQueue || 0} in line
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-muted">
              <Clock size={14} />
              <span className="font-mono text-xs font-bold">
                ~{estimateWaitMinutes(shop.currentQueue, shop.avgWaitMinutes)}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
