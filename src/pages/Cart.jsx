import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const placeOrder = async () => {
    if (!address) {
      setMessage("Please enter shipping address");
      return;
    }
    setOrdering(true);
    try {
      const res = await api.post("/orders/", { shipping_address: address });
      // redirect to payment page with order id
      navigate(`/payment/${res.data.id}`);
    } catch (err) {
      setMessage("Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        {cart?.items?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart?.items?.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product_detail?.images?.[0] ? (
                      <img
                        src={`http://127.0.0.1:8000${item.product_detail.images[0].image}`}
                        alt={item.product_detail.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.product_detail?.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      ₹{item.product_detail?.price} x {item.quantity}
                    </p>
                    <p className="text-blue-600 font-semibold mt-1">
                      ₹{item.subtotal}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition self-start"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">₹{cart?.total}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between mb-6">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-xl text-gray-900">
                  ₹{cart?.total}
                </span>
              </div>

              {/* Shipping Address */}
              <textarea
                placeholder="Enter shipping address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-sm"
              />

              {message && (
                <p className="text-red-500 text-sm mb-3">{message}</p>
              )}

              <button
                onClick={placeOrder}
                disabled={ordering}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {ordering ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
