import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Vendora
        </Link>

        {/* Middle links */}
        <div className="flex items-center gap-6">
          {user?.role === "vendor" && (
            <Link
              to="/vendor/dashboard/"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "customer" && (
                <>
                  <Link
                    to="/products/"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Products
                  </Link>
                  <Link
                    to="/cart/"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    🛒 Cart
                  </Link>
                  <Link
                    to="/orders"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Orders
                  </Link>
                </>
              )}
              <span className="text-gray-700 font-medium">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login/"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
