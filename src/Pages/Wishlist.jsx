import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!authApi.isLoggedIn()) {
        setError('Please login to view your wishlist');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await productApi.getWishlist();
        if (result.success) {
          setWishlistItems(result.items);
        } else {
          setError('Failed to load wishlist');
        }
      } catch (err) {
        setError('Failed to load wishlist: ' + err.message);
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleRemoveItem = async (id) => {
    try {
      await productApi.removeFromWishlist(id);
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success('Removed from wishlist!');
    } catch (err) {
      toast.error('Failed to remove item: ' + err.message);
    }
  };

  // 🔥 Updated Add to Cart Handler
  const handleMoveToCart = async (item) => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first to add to cart!');
      navigate('/login');
      return;
    }

    try {
      await productApi.addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      });
      await productApi.removeFromWishlist(item.id);
      setWishlistItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
      toast.success(`${item.name} moved to cart!`);
    } catch (err) {
      toast.error('Failed to move to cart: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B2D2D] mx-auto"></div>
          <p className="mt-4 text-[#2E2E2E]">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
        <div className="container mx-auto px-4 text-center">
          <svg
            className="w-16 h-16 text-[#2E2E2E] mx-auto mb-4"
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
          <h2 className="text-xl font-medium text-[#2E2E2E] mb-4">{error}</h2>
          <Link
            to={authApi.isLoggedIn() ? "/products" : "/login"}
            className="inline-block bg-[#8B5F65] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4A2E59] transition-all duration-300"
          >
            {authApi.isLoggedIn() ? "Shop Now" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E2E2E] text-center mb-12">
          Your Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-[#2E2E2E] mx-auto mb-4"
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
            <h2 className="text-xl font-medium text-[#2E2E2E] mb-4">Your wishlist is empty</h2>
            <p className="text-[#2E2E2E] mb-6">
              Discover our exquisite collections and add your favorite sarees to your wishlist.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#8B5F65] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4A2E59] transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b border-[#E8B4B8] py-6 last:border-b-0"
              >
                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-6 transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${item.id}`}>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2 hover:text-[#4A2E59] transition-colors duration-300">
                      {item.name}
                    </h3>
                  </Link>
                  <span className="text-[#8B5F65] font-bold text-lg">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="bg-[#800020] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#8B5F65] hover:text-white transition-all duration-300"
                    aria-label={`Move ${item.name} to cart`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-[#2E2E2E] hover:text-[#4A2E59] transition-colors duration-300"
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
                to="/products"
                className="text-[#8B5F65] font-medium hover:text-[#4A2E59] transition-colors duration-300"
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