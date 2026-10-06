import { Link, NavLink, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboard, Ticket } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { buttonClasses } from "./ui";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "font-mono text-xs uppercase tracking-[0.14em] font-bold pb-1 border-b-2 transition-colors",
    isActive ? "border-accent text-ink" : "border-transparent text-ink-muted hover:text-ink",
  ].join(" ");

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-4 md:px-6 h-16 bg-canvas/90 backdrop-blur border-b-2 border-ink sticky top-0 z-50">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-ink"
      >
        <span className="bg-accent text-on-accent p-1 rounded">
          <Ticket size={18} strokeWidth={2.5} />
        </span>
        Q-LINE
      </Link>

      <div className="flex items-center gap-5 md:gap-6">
        <NavLink to="/explore" className={linkClasses}>
          Explore
        </NavLink>

        <SignedIn>
          <NavLink to="/my-queue" className={linkClasses}>
            My Spots
          </NavLink>
        </SignedIn>

        <ThemeToggle />

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard: {
                  width: "240px",
                  maxWidth: "240px",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--line)",
                  backgroundColor: "var(--card)",
                },
                userButtonMenuItem__manageAccount: {
                  display: "none",
                },
                userButtonPopoverFooter: {
                  display: "none",
                },
                userButtonAvatarBox: {
                  border: "2px solid var(--accent)",
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label="Business Hub"
                labelIcon={<LayoutDashboard size={16} />}
                onClick={() => navigate("/admin")}
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>

        <SignedOut>
          <NavLink to="/login" className={buttonClasses("primary", "sm")}>
            Login
          </NavLink>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
