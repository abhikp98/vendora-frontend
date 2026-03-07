import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const primaryImage =
    product.images?.find((img) => img.is_primary) || product.images?.[0];

  return (
    <Link to={`/products/${product.slug}/`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <img
              src={`http://127.0.0.1:8000${primaryImage.image}`}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">
            {product.category_name}
          </p>
          <h3 className="font-semibold text-gray-800 mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">by {product.vendor_name}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                product.stock > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
