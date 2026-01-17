import React, { useState } from "react";
import { useQueue } from "../hooks/useQueue";
import {
  Users,
  Clock,
  Play,
  CheckCircle,
  Settings,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export const AdminDash: React.FC = () => {
  const { activeTicket, leaveQueue } = useQueue();

  // Simulated Business State
  const [standardTime, setStandardTime] = useState(15); // Ts in PRE 571
  const [queue, setQueue] = useState([
    { id: "101", name: "John Doe", joined: "10:15 AM" },
    { id: "102", name: "Seyi Balogun", joined: "10:22 AM" },
    { id: "103", name: "Amaka Okafor", joined: "10:30 AM" },
  ]);
  const [servedToday, setServedToday] = useState(14);

  const handleCallNext = () => {
    if (queue.length === 0) return;

    // Logic: Remove the first person and increment served count
    setQueue((prev) => prev.slice(1));
    setServedToday((prev) => prev + 1);

    // If the demo user is at the top of the queue, clear their ticket
    // This creates the "Your turn!" effect on the other screen
    if (activeTicket && activeTicket.position === 1) {
      leaveQueue();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Business Portal
            </h1>
            <p className="text-gray-500 font-medium">
              Lagos Central Branch • Sola Sharp Cuts
            </p>
          </div>
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live System Active
          </div>
        </div>

        {/* METRICS GRID - PRE 571 Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <Users size={24} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">
                Waiting
              </span>
            </div>
            <h3 className="text-4xl font-black">{queue.length}</h3>
            <p className="text-sm text-gray-500 mt-1">Customers in line</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
                <Clock size={24} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">
                Standard Time
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black">{standardTime}</h3>
              <span className="font-bold text-gray-500 text-sm">mins</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Current $T_s$ setting</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">
                Throughput
              </span>
            </div>
            <h3 className="text-4xl font-black">{servedToday}</h3>
            <p className="text-sm text-gray-500 mt-1">Served today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QUEUE MANAGEMENT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2">Next in Line</h2>
                {queue.length > 0 ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-4xl font-black mb-1">
                        {queue[0].name}
                      </p>
                      <p className="text-gray-400">
                        Joined at {queue[0].joined}
                      </p>
                    </div>
                    <button
                      onClick={handleCallNext}
                      className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-green-500 hover:text-white transition-all transform hover:scale-105"
                    >
                      <Play size={20} fill="currentColor" />
                      CALL NEXT
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    Queue is currently empty.
                  </p>
                )}
              </div>
              {/* Background Glow */}
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* UPCOMING LIST */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Queue Sequence</h3>
                <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                  FIFO ACTIVE
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {queue.slice(1).map((item, index) => (
                  <div
                    key={item.id}
                    className="p-6 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">
                        {index + 2}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          Wait: {(index + 1) * standardTime} mins
                        </p>
                      </div>
                    </div>
                    <CheckCircle size={20} className="text-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SETTINGS / ALERTS */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Settings size={18} />
                Admin Controls
              </h3>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Adjust Standard Time ($T_s$)
                </label>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={standardTime}
                  onChange={(e) => setStandardTime(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>FAST (5m)</span>
                  <span>SLOW (45m)</span>
                </div>
              </div>
            </div>

            {/* LIVE ALERTS - This triggers when the user clicks "Join" on the other screen */}
            {activeTicket && (
              <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-lg animate-bounce">
                <div className="flex items-start gap-3">
                  <AlertCircle size={24} />
                  <div>
                    <h4 className="font-bold">New Ticket Joined!</h4>
                    <p className="text-sm text-blue-100">
                      User just joined the queue at position #
                      {activeTicket.position}.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
