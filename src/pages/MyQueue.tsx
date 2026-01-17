import React from "react";
import { useQueue } from "../hooks/useQueue";
import { Link } from "react-router-dom";

const MyQueue: React.FC = () => {
  const { activeTicket, leaveQueue } = useQueue();

  if (!activeTicket) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">You aren't in any queues yet.</p>
        <Link to="/explore" className="text-blue-600 font-bold">
          Find a shop
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Active Spots</h1>

      {/* Example of an active ticket */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <p className="opacity-80">{activeTicket.shopName}</p>
          <h2 className="text-4xl font-black mb-4">#{activeTicket.position}</h2>
          {/* ... other ticket details ... */}
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      </div>

      <button
        onClick={leaveQueue}
        className="w-full mt-4 text-red-500 font-semibold"
      >
        Leave Queue
      </button>
    </div>
  );
};

export default MyQueue;
