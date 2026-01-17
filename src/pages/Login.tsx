import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedRole = localStorage.getItem("userRole") || "customer";
    localStorage.setItem("isLoggedIn", "true");
    navigate(savedRole === "business" ? "/admin" : "/explore");
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black mb-2 text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mb-8 font-medium">
          Login to your Q-LINE account.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="080..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none"
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {/* Show/Hide Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
          >
            Login <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          New to Q-LINE?{" "}
          <Link to="/signup" className="text-blue-600 font-bold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
