import { useState } from "react";
import {
  Users,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  time: string;
  status: string;
}
interface Shop {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  image_url: string;
  owner_id: string;
}

const RealAdminDashboard = ({ shop }: { shop: Shop }) => {
  // Mock data for the queue - before backend completion
  const [queue, setQueue] = useState<Customer[]>([
    { id: 1, name: "Jordan Smith", time: "10:15 AM", status: "waiting" },
    { id: 2, name: "Sarah Connor", time: "10:30 AM", status: "waiting" },
    { id: 3, name: "Mike Ross", time: "10:45 AM", status: "waiting" },
  ]);

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const handleNextCustomer = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setCurrentCustomer(next);
      setQueue(queue.slice(1));
    } else {
      setCurrentCustomer(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header & Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Show the real Shop Image */}
          <img
            src={shop.image_url}
            className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white shadow-md"
            alt={shop.name}
          />
          <div>
            {/* Show the real Shop Name */}
            <h1 className="text-3xl font-black tracking-tight uppercase">
              {shop.name}
            </h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs uppercase">
                {shop.category}
              </span>
              • {shop.location}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Waiting
              </p>
              <p className="text-xl font-black">{queue.length}</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
                Est. Wait
              </p>
              <p className="text-xl font-black">{queue.length * 15}m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Action */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">
                Now Serving
              </h3>
              {currentCustomer ? (
                <div className="space-y-4">
                  <h2 className="text-4xl font-black">
                    {currentCustomer.name}
                  </h2>
                  <p className="text-blue-400 font-medium">
                    Joined at {currentCustomer.time}
                  </p>
                  <button
                    onClick={() => setCurrentCustomer(null)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} /> Finish Session
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center py-6">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="text-white translate-x-0.5" />
                  </div>
                  <p className="text-gray-400 font-medium italic">
                    No one is currently being served
                  </p>
                  <button
                    onClick={handleNextCustomer}
                    disabled={queue.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold transition-all"
                  >
                    Call Next Customer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Waitlist */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-black text-xl">Upcoming Waitlist</h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Live
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {queue.length > 0 ? (
                queue.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                          Checked in at {customer.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                        <XCircle size={20} />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                        <AlertCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400 font-medium">
                    Waitlist is currently empty.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealAdminDashboard;
