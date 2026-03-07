import { useState, useEffect } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function ProductDetails() {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${slug}/`);
      setProduct(res.data);
      // set primary image as selected by default
      const primary =
        res.data.images?.find((img) => img.is_primary) || res.data.images?.[0];
      setSelectedImage(primary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    try {
      await api.post("/cart/", {
        product_id: product.id,
        quantity: quantity,
      });
      setMessage("Added to cart successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Images */}
            <div>
              <div className="h-80 bg-gray-100 rounded-xl overflow-hidden mb-4">
                {selectedImage ? (
                  <img
                    src={`http://127.0.0.1:8000${selectedImage.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              {/* Thumbnail images */}
              <div className="flex gap-2">
                {product.images?.map((img) => (
                  <img
                    key={img.id}
                    src={`http://127.0.0.1:8000${img.image}`}
                    alt="thumbnail"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage?.id === img.id
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <p className="text-blue-600 text-sm font-medium mb-2">
                {product.category_name}
              </p>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-500 text-sm mb-4">
                by {product.vendor_name}
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                ₹{product.price}
              </p>

              {/* Stock */}
              <p
                className={`text-sm font-medium mb-6 ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>

              {/* Quantity */}
              {product.stock > 0 && user?.role === "customer" && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Message */}
              {message && (
                <div
                  className={`p-3 rounded-lg mb-4 text-sm ${
                    message.includes("success")
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Add to cart button */}
              {user?.role === "customer" && product.stock > 0 && (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              )}

              {/* Not logged in */}
              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Login to Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetails;
