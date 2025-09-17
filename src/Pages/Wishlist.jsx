import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  // Sample wishlist data (in a real app, this would come from a state management system or context)
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Kanjivaram Silk Saree",
      price: 12499,
      image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
      color: "#891c3c"
    },
    {
      id: 3,
      name: "Designer Art Silk Saree",
      price: 7499,
      image: "https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577",
      color: "#1e40af"
    }
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleRemoveItem = (id) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleMoveToCart = (item) => {
    // In a real app, this would add the item to the cart (e.g., via context or API)
    setWishlistItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    // Placeholder for adding to cart
    console.log(`Moved ${item.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-rose-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 text-center mb-12">
          Your Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">
              Discover our exquisite collections and add your favorite sarees to your wishlist.
            </p>
            <Link
              to="/collections"
              className="inline-block bg-[#891c3c] text-white px-6 py-3 rounded-full font-medium hover:bg-[#6a1530] transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b border-gray-100 py-6 last:border-b-0"
              >
                <Link to="/viewdetails">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-6 transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="flex-1">
                  <Link to="/viewdetails">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-[#891c3c] transition-colors duration-300">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-600 mr-2">Color:</span>
                    <div
                      className="w-5 h-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  </div>
                  <span className="text-[#891c3c] font-bold text-lg">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="bg-rose-50 text-[#891c3c] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#891c3c] hover:text-white transition-all duration-300"
                    aria-label={`Move ${item.name} to cart`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-500 hover:text-[#891c3c] transition-colors duration-300"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-end">
              <Link
                to="/collections"
                className="text-[#891c3c] font-medium hover:text-[#6a1530] transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;