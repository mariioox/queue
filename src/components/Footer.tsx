import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, ArrowUpRight, Zap } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Zap size={20} fill="white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Q-LINE
              </span>
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed mb-6">
              Revolutionizing the way we wait. Join the queue from anywhere,
              live your life everywhere.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 transition-all text-gray-400 hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 transition-all text-gray-400 hover:text-white"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 transition-all text-gray-400 hover:text-white"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/explore"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Explore Shops
                </Link>
              </li>
              <li>
                <Link
                  to="/my-queue"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  My Active Tickets
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Business API
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6">
              Partner with us
            </h4>
            <p className="text-gray-400 text-sm font-medium mb-4">
              Own a business? Start managing your queue today.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-300 hover:text-white transition-all group"
            >
              REGISTER SHOP{" "}
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            © {currentYear} WaitLess Technologies Inc.
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
