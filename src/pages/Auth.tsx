import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  UserCircle,
} from "lucide-react";

type UserRole = "customer" | "business";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>("customer");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save role to localStorage so the app "remembers" who you are for the session
    localStorage.setItem("userRole", role);
    localStorage.setItem("isLoggedIn", "true");

    if (role === "business") {
      navigate("/admin");
    } else {
      navigate("/explore");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">QueueNaija</h1>
          <p className="text-gray-500 font-medium">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
          {/* ROLE SELECTOR TABS */}
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === "customer"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <UserCircle size={18} />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("business")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === "business"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <Briefcase size={18} />
              Business
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  {role === "business" ? "Business Name" : "Full Name"}
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder={
                      role === "business"
                        ? "e.g. Sola Sharp Cuts"
                        : "e.g. Seyi Balogun"
                    }
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  placeholder="0801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg"
            >
              {isLogin ? "Login" : "Start Queuing"}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition"
            >
              {isLogin
                ? "New to QueueNaija? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
