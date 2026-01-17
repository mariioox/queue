import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
    window.location.reload(); // Force refresh to clear the role state in the UI
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black tracking-tighter">
        Q-LINE
      </Link>

      <div className="flex items-center space-x-6 font-medium text-sm">
        {role === "business" ? (
          // Business View
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-600"
            }
          >
            Business Dashboard
          </NavLink>
        ) : (
          // Customer View
          <>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-600"
              }
            >
              Explore
            </NavLink>
            <NavLink
              to="/my-queue"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-600"
              }
            >
              My Spots
            </NavLink>
          </>
        )}

        {/* Auth Toggle */}
        {role ? (
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-600"
            }
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
