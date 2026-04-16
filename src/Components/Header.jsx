import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import saadhvi from '../assets/saadhvi_silks.png';
import authApi from '../Services/authApi';
import productApi from '../Services/proApi';
import categoryApi from '../Services/CategoryApi';
import toast from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Services/firebase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const categoriesScrollRef = useRef(null);

  const username = currentUser?.displayName || 'User';
  const isLoggedIn = !!currentUser;
  const userType = currentUser?.isAdmin ? 'admin' : 'user';

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryApi.getPublicCategories();
        if (result.success) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userInfo = await authApi.getCurrentUser();
          setCurrentUser(userInfo);
        } catch (err) {
          console.error("Failed to load user info:", err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check scroll position to show/hide arrows
  useEffect(() => {
    const checkScrollPosition = () => {
      if (categoriesScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoriesScrollRef.current;
        setShowLeftArrow(scrollLeft > 20);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
      }
    };

    const scrollContainer = categoriesScrollRef.current;
    if (scrollContainer) {
      checkScrollPosition();
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [categories]);

  // Real-time search
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const { results } = await productApi.searchProducts(searchQuery);
        setSearchResults(results || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (id) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/viewdetails/${id}`);
  };

  const handleSearchInputFocus = () => {
    if (searchResults.length > 0 && searchQuery.length >= 2) {
      setShowResults(true);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    setCurrentUser(null);
    toast.success("Thanks for visiting! You've been safely logged out.");
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const scrollCategories = (direction) => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 250;
      const newScrollLeft = categoriesScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      categoriesScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Logo, Navigation, Search, Icons */}
      <div className="bg-gradient-to-r from-[#F9F3F3] to-[#F7F0E8] bg-opacity-95 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={saadhvi}
              alt="Saadhvi Silks"
              loading="lazy"
              decoding="async"
              className="h-14 md:h-20 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-[#2E2E2E] text-lg font-serif hover:text-[#800020] transition relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-[#2E2E2E] text-lg font-serif hover:text-[#800020] transition relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-[#2E2E2E] text-lg font-serif hover:text-[#800020] transition relative group">
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-[#2E2E2E] text-lg font-serif hover:text-[#800020] transition relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar + Icons */}
          <div ref={searchRef} className="flex items-center space-x-4 flex-1 max-w-2xl mx-8 relative">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchInputFocus}
                placeholder="Search sarees...."
                className="w-full px-5 py-3 pl-12 rounded-full border border-gray-300 focus:border-[#800020] focus:outline-none text-gray-800 text-lg shadow-sm transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {searchQuery && !loading && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowResults(false);
                    setSearchResults([]);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <p className="text-sm text-gray-600 font-medium">
                          Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                        </p>
                      </div>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleResultClick(product.id)}
                          className="flex items-center px-5 py-3 hover:bg-[#FDF6E3] cursor-pointer transition-all border-b border-gray-100 last:border-0"
                        >
                          <img
                            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-12 h-12 rounded-lg object-cover mr-4 border flex-shrink-0"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                          </div>
                          <span className="font-bold text-[#800020] text-lg whitespace-nowrap ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : searchQuery.length >= 2 && !loading ? (
                    <div className="p-6 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p>No products found for</p>
                      <p className="font-semibold">"{searchQuery}"</p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-5">
              <Link to="/wishlist" className="text-[#2E2E2E] hover:text-[#800020] transition relative group">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#800020] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>

              <Link to="/cart" className="text-[#2E2E2E] hover:text-[#800020] transition relative group">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#800020] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#800020] to-[#A0002A] flex items-center justify-center text-white font-semibold text-sm">
                      {userType === 'admin' ? 'A' : (username?.charAt(0).toUpperCase() || 'U')}
                    </div>
                    <span className="text-[#2E2E2E] font-semibold">
                      {userType === 'admin' ? 'Admin' : (username || 'User')}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-[#800020] text-white px-6 py-2 rounded-full font-semibold font-serif hover:bg-[#A0002A] transition shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-[#800020] text-white px-6 py-2 rounded-full font-semibold font-serif hover:bg-[#A0002A] transition shadow-md hover:shadow-lg">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-[#2E2E2E] p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar - Categories with Arrow Buttons - Maroon Background */}
      {categories.length > 0 && (
        <div className="bg-gradient-to-r from-[#800020] to-[#6B001A] shadow-lg relative">
          <div className="relative flex items-center w-full">
            {/* Left Arrow Button */}
            {showLeftArrow && (
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-2 z-20 bg-[#800020] hover:bg-[#6B001A] rounded-full shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 border border-[#FFD700]/30 hover:border-[#FFD700] group"
                style={{ 
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <svg className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Categories Scroll Container - Full Width */}
            <div 
              ref={categoriesScrollRef}
              className="overflow-x-auto scrollbar-hide w-full"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex items-center space-x-2 md:space-x-3 min-w-max px-12 py-3">
                

                {/* Category Buttons */}
                {categories
                  .filter(cat => cat.isActive !== false)
                  .map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.name)}
                      className={`px-5 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                        activeCategory === category.name
                          ? 'bg-[#FFD700] text-[#800020] shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Right Arrow Button */}
            {showRightArrow && (
              <button
                onClick={() => scrollCategories('right')}
                className="absolute right-2 z-20 bg-[#800020] hover:bg-[#6B001A] rounded-full shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 border border-[#FFD700]/30 hover:border-[#FFD700] group"
                style={{ 
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <svg className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg animate-slideDown">
          <div className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              About
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Collections
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Contact
            </Link>
            
            {/* Categories in Mobile Menu */}
            {categories.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  Shop by Category
                </p>
                <div className="space-y-1">
                  
                  {categories
                    .filter(cat => cat.isActive !== false)
                    .map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${encodeURIComponent(category.name)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-base text-gray-600 hover:text-[#800020] hover:bg-[#F9F3F3] rounded-lg transition"
                      >
                        {category.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Wishlist
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Cart
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-lg font-medium font-serif text-red-600 hover:text-red-700 transition py-2"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium font-serif text-[#800020] hover:text-[#A0002A] transition py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
};

export default Header;