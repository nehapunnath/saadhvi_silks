import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import saadhvi from '../assets/saadhvi_silks.png';
import authApi from '../Services/authApi';
import productApi from '../Services/proApi';
import categoryApi from '../Services/CategoryApi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const isLoggedIn = authApi.isLoggedIn();
  const username = localStorage.getItem('username') || 'User';
  const userType = authApi.getUserType();

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

  // Get category name by ID
  const getCategoryName = (categoryValue) => {
    if (!categoryValue) return 'N/A';
    
    // Try to find category by ID in the database categories
    const category = categories.find(cat => cat.id === categoryValue);
    
    if (category) {
      return category.name;
    }
    
    return 'N/A';
  };

  // Real-time search
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const { results } = await productApi.searchProducts(searchQuery);
        console.log('🔍 Search results:', results);
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

  const handleLogout = () => {
    authApi.logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <header className="bg-gradient-to-r from-[#F9F3F3] to-[#F7F0E8] bg-opacity-95 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={saadhvi}
            alt="Saadhvi Silks"
            className="h-20 md:h-24 w-auto transition-transform hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-[#2E2E2E] text-lg font-semibold hover:text-[#800020] transition">Home</Link>
          <Link to="/about" className="text-[#2E2E2E] text-lg font-semibold hover:text-[#800020] transition">About Us</Link>
          <Link to="/products" className="text-[#2E2E2E] text-lg font-semibold hover:text-[#800020] transition">Collections</Link>
          <Link to="/contact" className="text-[#2E2E2E] text-lg font-semibold hover:text-[#800020] transition">Contact</Link>
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

            {/* Loading Spinner */}
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#800020] border-t-transparent"></div>
              </div>
            )}

            {/* Clear search button */}
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

          {/* Search Results Dropdown - FIXED SCROLLING */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
              <div className="max-h-80 overflow-y-auto"> {/* Scrollable container */}
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
                          className="w-12 h-12 rounded-lg object-cover mr-4 border flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                          <p className="text-sm text-gray-500 truncate">
                            {getCategoryName(product.category)}
                          </p>
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
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="text-[#2E2E2E] hover:text-[#800020] transition relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="text-[#2E2E2E] hover:text-[#800020] transition relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>

            {/* User Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-[#2E2E2E] font-semibold">
                  {userType === 'admin' ? 'Admin' : username}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="text-[#800020] font-semibold hover:underline transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#800020] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#A0002A] transition"
              >
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)} 
              className="block text-lg font-medium hover:text-[#800020] transition py-2"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)} 
              className="block text-lg font-medium hover:text-[#800020] transition py-2"
            >
              About
            </Link>
            <Link 
              to="/products" 
              onClick={() => setIsMenuOpen(false)} 
              className="block text-lg font-medium hover:text-[#800020] transition py-2"
            >
              Collections
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMenuOpen(false)} 
              className="block text-lg font-medium hover:text-[#800020] transition py-2"
            >
              Contact
            </Link>
            <Link 
              to="/wishlist" 
              onClick={() => setIsMenuOpen(false)} 
              className="block text-lg font-medium hover:text-[#800020] transition py-2"
            >
              Wishlist
            </Link>
            <Link 
              to="/cart" 
              onClick={() => setIsMenuOpen(false)} 
              className="block text-lg font-medium hover:text-[#800020] transition py-2"
            >
              Cart
            </Link>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="block w-full text-left text-lg font-medium text-red-600 hover:text-red-700 transition py-2"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="block text-lg font-medium text-[#800020] hover:text-[#A0002A] transition py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;