import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, ArrowUpRight, Ticket } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-canvas pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <span className="bg-accent text-on-accent p-1 rounded">
                <Ticket size={18} strokeWidth={2.5} />
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Q-LINE
              </span>
            </Link>
            <p className="text-canvas/70 font-medium leading-relaxed mb-5 text-sm">
              Skip the physical line. Join the queue from anywhere, show up
              exactly when it's your turn.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 border border-canvas/20 rounded-lg hover:bg-accent hover:border-accent hover:text-on-accent transition-colors text-canvas/70"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-highlight mb-5">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Explore Shops", to: "/explore" },
                { label: "My Active Tickets", to: "/my-queue" },
                { label: "Pricing", to: "#" },
                { label: "Business API", to: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-canvas/70 hover:text-highlight font-semibold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-highlight mb-5">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              {["Help Center", "Terms of Service", "Privacy Policy", "Cookie Policy"].map(
                (label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-canvas/70 hover:text-highlight font-semibold transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-highlight mb-5">
              Partner with us
            </h4>
            <p className="text-canvas/70 text-sm font-medium mb-4">
              Own a business? Start managing your queue today.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-accent text-on-accent px-5 py-3 rounded-lg font-mono text-xs uppercase tracking-[0.14em] font-bold shadow-[3px_3px_0_0_var(--canvas)] hover:bg-accent-hover transition-all group"
            >
              Register Shop
              <ArrowUpRight
                size={15}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-canvas/15 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
            © {currentYear} Q-LINE — All rights reserved
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
