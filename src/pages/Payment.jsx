import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrderAndLoadRazorpay();
  }, [orderId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // dynamically load razorpay checkout script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchOrderAndLoadRazorpay = async () => {
    try {
      const res = await api.get(`/orders/`);
      // find this specific order from orders list
      const currentOrder = res.data.find((o) => o.id === parseInt(orderId));
      setOrder(currentOrder);
      await loadRazorpayScript();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      // step 1 - create razorpay order on backend
      const res = await api.post(`/payments/create/${orderId}/`);
      const { razorpay_order_id, amount, currency, key } = res.data;

      // step 2 - open razorpay popup
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        order_id: razorpay_order_id,
        name: "Vendora",
        description: `Order #${orderId}`,
        handler: async (response) => {
          // step 3 - verify payment on backend after success
          try {
            await api.post(`/payments/verify/${orderId}/`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate("/orders");
          } catch (err) {
            setMessage("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setMessage("Failed to initiate payment");
    } finally {
      setPaying(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Complete Payment
        </h1>
        <p className="text-gray-500 text-center mb-8">Order #{orderId}</p>

        {/* Order Summary */}
        {order && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold">#{order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-bold text-xl text-gray-900">
                ₹{order.total_amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-yellow-600 font-medium capitalize">
                {order.status}
              </span>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {paying ? "Processing..." : `Pay ₹${order?.total_amount}`}
        </button>

        <p className="text-center text-gray-400 text-xs mt-4">
          Secured by Razorpay
        </p>
      </div>
    </div>
  );
}

export default Payment;
