import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, TrendingUp, Clock, Tag, X } from 'lucide-react';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movingItemId, setMovingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

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
        setError(err.message);
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
      setRemovingItemId(id);
      await productApi.removeFromWishlist(id);
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleMoveToCart = async (item) => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first to add to cart!');
      navigate('/login');
      return;
    }

    try {
      setMovingItemId(item.id);
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
      toast.error('Failed to move to cart');
    } finally {
      setMovingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#800020] mx-auto"></div>
            <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#800020] w-6 h-6" />
          </div>
          <p className="mt-6 text-[#2E2E2E] font-medium">Loading your cherished collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-10">
              <div className="w-20 h-20 bg-[#800020]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-[#800020] opacity-50" />
              </div>
              <h2 className="text-2xl font-serif text-[#2E2E2E] mb-3">{error}</h2>
              <p className="text-[#666] mb-8">Sign in to access your wishlist and save your favorite sarees</p>
              <Link
                to={authApi.isLoggedIn() ? "/products" : "/login"}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
              >
                {authApi.isLoggedIn() ? "Explore Collection" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-sm border border-[#D9A7A7]/30">
            <Heart className="w-4 h-4 text-[#800020] fill-[#800020]" />
            <span className="text-sm text-[#2E2E2E] font-medium">Your Treasure Box</span>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#800020] mb-3">
            Wishlist
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#800020] to-[#D9A7A7] mx-auto"></div>
          <p className="text-[#666] mt-4">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-[#800020]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-[#800020] opacity-50" />
              </div>
              <h2 className="text-2xl font-serif text-[#2E2E2E] mb-3">Your wishlist is waiting</h2>
              <p className="text-[#666] mb-8 max-w-sm mx-auto">
                Discover our exquisite collection of handcrafted sarees and save your favorites here
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Collection
                </Link>
                <Link
                  to="/collections"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#800020] text-[#800020] px-8 py-3 rounded-full font-medium hover:bg-[#800020] hover:text-white transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4" />
                  View Collections
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-[#D9A7A7]/30">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#800020]" />
                    <span className="text-sm text-[#2E2E2E]">{wishlistItems.length} Saved Items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#800020]" />
                    <span className="text-sm text-[#2E2E2E]">
                      Total Value: {formatPrice(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
                    </span>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="text-sm text-[#800020] hover:text-[#6B001A] font-medium flex items-center gap-1 transition-colors"
                >
                  Continue Shopping
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#D9A7A7]/30 hover:border-[#800020]/30"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    <Link 
                      to={`/products/${item.id}`}
                      className="relative sm:w-48 h-64 sm:h-auto overflow-hidden bg-gradient-to-br from-[#F9F3F3] to-[#F7F0E8]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Quick View Badge */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center shadow-lg">
                          <span className="text-xs text-[#800020] font-semibold">Quick View</span>
                        </div>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col">
                      <Link to={`/products/${item.id}`} className="flex-1">
                        <h3 className="text-lg font-serif font-semibold text-[#2E2E2E] mb-2 hover:text-[#800020] transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-[#800020]">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <>
                              <span className="text-sm text-[#999] line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Save {formatPrice(item.originalPrice - item.price)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={movingItemId === item.id}
                          className="flex-1 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                        >
                          {movingItemId === item.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>Moving...</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                              <span>Move to Cart</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItemId === item.id}
                          className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {removingItemId === item.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      {/* Added Date */}
                      {item.addedAt && (
                        <div className="flex items-center gap-1.5 mt-3">
                          <Clock className="w-3 h-3 text-[#999]" />
                          <p className="text-xs text-[#999]">
                            Added on {new Date(item.addedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-[#800020]/5 via-transparent to-[#800020]/5 rounded-2xl p-8 border border-[#D9A7A7]/30">
                <p className="text-[#2E2E2E] mb-4 font-medium">Love your saved items? Checkout now!</p>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Go to Cart
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;