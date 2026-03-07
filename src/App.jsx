import { useAuth } from "./context/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import Vendordashboard from "./pages/VendorDashboard";
function App() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login/" element={<Login />} />
        <Route path="/register/" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute role="customer">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/"
          element={
            <ProtectedRoute role="customer">
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:slug/"
          element={
            <ProtectedRoute role="customer">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/cart/" element={<Cart />} />
        <Route
          path="/payment/:orderId/"
          element={
            <ProtectedRoute role="customer">
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/dashboard/"
          element={
            <ProtectedRoute role="vendor">
              <Vendordashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
