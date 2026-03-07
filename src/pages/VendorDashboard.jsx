import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
export default function Vendordashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        api.get("/products/vendor/products/"),
        api.get("/vendor/orders/"),
        api.get("/products/categories/"),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      images.forEach((img) => data.append("uploaded_images", img));

      await api.post("/products/vendor/products/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Product added successfully!");
      setShowAddProduct(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
      setImages([]);
      fetchAll();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to add product");
    }
  };

  const handleDeleteProduct = async (slug) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/vendor/products/${slug}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
          <button
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showAddProduct ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length },
            { label: "Total Orders", value: orders.length },
            {
              label: "Pending Orders",
              value: orders.filter((o) => o.order_status === "pending").length,
            },
            {
              label: "Confirmed Orders",
              value: orders.filter((o) => o.order_status === "confirmed")
                .length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm p-6 text-center"
            >
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg mb-6 text-sm ${
              message.includes("success")
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        {/* Add Product Form */}
        {showAddProduct && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Add New Product
            </h2>
            <form
              onSubmit={handleAddProduct}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {["products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Product", "Price", "Stock", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteProduct(product.slug)}
                        className="text-red-400 hover:text-red-600 text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center text-gray-500 py-10">No products yet</p>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Order ID",
                    "Product",
                    "Customer",
                    "Qty",
                    "Amount",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      #{item.order_id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.product}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-gray-600">
                      ₹{item.subtotal}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.order_status === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : item.order_status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-10">No orders yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
