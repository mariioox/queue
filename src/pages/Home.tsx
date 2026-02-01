import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Smartphone, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-blue-700 text-xs font-black uppercase tracking-widest">
              Find a shop live
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Stop Waiting. <br />
            <span className="text-blue-600">Start Living.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium mb-12 leading-relaxed">
            The digital queue system for busy people. Join lines from your
            phone, track your spot in real-time, and show up exactly when it's
            your turn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/explore")}
              className="group w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-gray-200"
            >
              FIND A SHOP{" "}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-white border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all"
            >
              FOR BUSINESS
            </button>
          </div>
        </div>

        {/* Abstract Background Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[120px] opacity-50"></div>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                <Smartphone className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">
                One-Tap Join
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                No physical tickets. Find a shop in-app to secure your spot
                instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-200">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">
                Real-Time Sync
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Watch your position update live. Get notified exactly when
                you're next in line.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200">
                <Clock className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">
                Save Hours
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Our users save an average of 45 minutes per visit. Spend your
                time where it matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF / STATS --- */}
      <section className="py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-md">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">
              Trusted by the best vendors.
            </h2>
            <p className="text-gray-500 font-medium">
              From premium barbershops to busy bank branches, we power the flow
              of commerce.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
            <div>
              <p className="text-5xl font-black text-blue-600">10k+</p>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">
                Tickets Issued
              </p>
            </div>
            <div>
              <p className="text-5xl font-black text-gray-900">500+</p>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">
                Active Shops
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto bg-blue-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
              Ready to skip the line?
            </h2>
            <button
              onClick={() => navigate("/explore")}
              className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl"
            >
              GET STARTED NOW
            </button>
          </div>
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
