import { Link, NavLink, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboard, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black tracking-tighter">
        Q-LINE
      </Link>

      <div className="flex items-center space-x-6 font-medium text-sm">
        {/* ALWAYS SHOW EXPLORE */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "text-gray-600"
          }
        >
          Explore
        </NavLink>

        {/* SHOW ONLY WHEN LOGGED IN */}
        <SignedIn>
          <NavLink
            to="/my-queue"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-600"
            }
          >
            My Spots
          </NavLink>

          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard: {
                  width: "240px",
                  maxWidth: "240px",
                  borderRadius: "0.5rem",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                },
                userButtonMenuItem__manageAccount: {
                  display: "none",
                },
                userButtonPopoverFooter: {
                  display: "none",
                },
                userButtonAvatarBox: {
                  border: "2px solid #3b82f6",
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Profile"
                labelIcon={<User size={16} />}
                onClick={() => navigate("/profile")}
              />
              <UserButton.Action
                label="Business Hub"
                labelIcon={<LayoutDashboard size={16} />}
                onClick={() => navigate("/admin")}
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>

        {/* SHOW ONLY WHEN LOGGED OUT */}
        <SignedOut>
          <NavLink
            to="/login"
            className="bg-blue-500 !text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </NavLink>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
