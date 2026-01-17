import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  Lock,
  User,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

const Signup: React.FC = () => {
  const [isBusiness, setIsBusiness] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = isBusiness ? "business" : "customer";
    localStorage.setItem("userRole", role);
    localStorage.setItem("isLoggedIn", "true");

    navigate(isBusiness ? "/admin" : "/explore");
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black mb-2">Create Account</h1>
        <p className="text-gray-500 mb-8 font-medium">Join Q-LINE today.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Always show Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Conditional Business Name Input */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-2">
            <input
              type="checkbox"
              id="business-mode"
              checked={isBusiness}
              onChange={(e) => setIsBusiness(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="business-mode"
              className="text-sm font-bold text-blue-700 cursor-pointer"
            >
              I am registering a business
            </label>
          </div>

          {isBusiness && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Business Name
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="e.g. Sola Sharp Cuts"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="Create password"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            Sign Up <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
