import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sample related products data (in a real app, this would come from a shared context or API)
const relatedProducts = [
  {
    id: 2,
    name: "Banarasi Silk Saree",
    price: 9999,
    image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
    badge: "Popular"
  },
  {
    id: 3,
    name: "Designer Art Silk Saree",
    price: 7499,
    image: "https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577",
    badge: "New"
  },
  {
    id: 4,
    name: "Tussar Silk Saree",
    price: 6299,
    image: "https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg"
  }
];

const ViewDetails = () => {
  // Sample product data (in a real app, this would come from props or context)
  const product = {
    id: 1,
    name: "Kanjivaram Silk Saree",
    price: 12499,
    originalPrice: 15999,
    image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
    category: "Traditional",
    occasion: ["Wedding", "Festival"],
    colors: ["#891c3c", "#d4af37", "#1e3a8a"],
    description: "This authentic Kanjivaram silk saree is a masterpiece of South Indian craftsmanship, featuring intricate traditional motifs woven with pure gold zari. Perfect for weddings and grand celebrations, its rich texture, vibrant colors, and elegant drape exude timeless elegance, making it a cherished addition to any wardrobe.",
    badge: "Bestseller",
    details: {
      material: "Pure Kanjivaram Silk",
      length: "6.5 meters (with blouse piece)",
      weave: "Handwoven with pure zari",
      care: "Dry Clean Only",
      weight: "650 grams",
      border: "Contrast Zari Border",
      origin: "Kanchipuram, Tamil Nadu"
    },
    sizeGuide: "Standard saree length: 5.5m (saree) + 1m (blouse piece). Suitable for all body types."
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleImageZoom = () => {
    setZoomActive(!zoomActive);
  };

  return (
    <div className="min-h-screen bg-rose-50 py-12">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#891c3c] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  {product.badge}
                </span>
              )}
              <div className="relative h-[600px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    zoomActive ? 'scale-150 cursor-zoom-out' : 'hover:scale-105 cursor-zoom-in'
                  }`}
                  onClick={handleImageZoom}
                />
              </div>
              <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#891c3c]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
            {/* Thumbnail Images */}
            <div className="flex gap-4 mt-4 justify-center">
              {[product.image, product.image, product.image].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:border-[#891c3c] cursor-pointer transition-all duration-300 hover:scale-105"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">{product.name}</h2>

              {/* Price */}
              <div className="flex items-center mb-6">
                <span className="text-[#891c3c] font-bold text-2xl">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-lg line-through ml-4">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="ml-4 bg-rose-100 text-[#891c3c] text-xs font-semibold px-3 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Available Colors</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color
                          ? 'border-gray-800 ring-2 ring-offset-2 ring-[#891c3c] scale-110'
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 flex items-center justify-center bg-rose-50 text-[#891c3c] rounded-full hover:bg-[#891c3c] hover:text-white transition-all duration-300"
                    aria-label="Decrease quantity"
                    disabled={quantity === 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 flex items-center justify-center bg-rose-50 text-[#891c3c] rounded-full hover:bg-[#891c3c] hover:text-white transition-all duration-300"
                    aria-label="Increase quantity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tabs for Description and Details */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  {['description', 'details'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-colors duration-300 ${
                        activeTab === tab
                          ? 'text-[#891c3c] border-b-2 border-[#891c3c]'
                          : 'text-gray-600 hover:text-[#891c3c]'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-gray-600">
                  {activeTab === 'description' && <p>{product.description}</p>}
                  {activeTab === 'details' && (
                    <ul className="space-y-2">
                      {Object.entries(product.details).map(([key, value]) => (
                        <li key={key} className="flex">
                          <span className="font-medium capitalize w-1/3">{key}:</span>
                          <span>{value}</span>
                        </li>
                      ))}
                      <li className="flex">
                        <span className="font-medium capitalize w-1/3">Size Guide:</span>
                        <span>{product.sizeGuide}</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Occasion and Category */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Suitable For</h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion.map((occasion, index) => (
                    <span
                      key={index}
                      className="bg-rose-100 text-[#891c3c] text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Category:</span> {product.category}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-[#891c3c] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6a1530] transition-all duration-300">
                  Add to Cart
                </button>
                <Link
                  to="/products"
                  className="flex-1 bg-rose-50 text-[#891c3c] px-6 py-3 rounded-lg font-medium hover:bg-[#891c3c] hover:text-white text-center transition-all duration-300"
                >
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Link
                to="/viewdetails"
                key={relatedProduct.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border border-gray-100 group"
              >
                <div className="relative">
                  {relatedProduct.badge && (
                    <span className="absolute top-4 left-4 bg-[#891c3c] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                      {relatedProduct.badge}
                    </span>
                  )}
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#891c3c] transition-colors duration-300">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-[#891c3c] font-bold">{formatPrice(relatedProduct.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;