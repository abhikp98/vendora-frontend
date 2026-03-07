import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <p className="text-gray-500 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-800">Order #{order.id}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-600"
                            : order.status === "delivered"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product_name} x {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{order.total_amount}
                  </span>
                </div>

                {/* Pay now if still pending */}
                {order.status === "pending" && (
                  <button
                    onClick={() => navigate(`/payment/${order.id}`)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
