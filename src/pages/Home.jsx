import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Vendora</h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover amazing products from verified vendors
          </p>
          <Link
            to="/products/"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition text-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Role based section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {user?.role === "vendor" ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, {user.username}!
            </h2>
            <p className="text-gray-500 mb-6">
              Manage your products and orders
            </p>
            <Link
              to="/vendor/dashboard/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Featured Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Electronics", "Fashion", "Home", "Sports"].map((cat) => (
                <Link
                  to="/products/"
                  key={cat}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition text-center"
                >
                  <p className="font-semibold text-gray-700">{cat}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
