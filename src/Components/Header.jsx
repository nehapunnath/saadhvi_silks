// Header.js - Updated to use collections from bottom bar
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import saadhvi from '../assets/saadhvi_silks.png';
import authApi from '../Services/authApi';
import productApi from '../Services/proApi';
import categoryApi from '../Services/CategoryApi';
import bottomBarApi from '../Services/BottomBarApi'; // Add this import
import toast from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Services/firebase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]); // Add collections state
  const [allProducts, setAllProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null); // Change to activeCollection
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const categoriesScrollRef = useRef(null);
  const searchInputRef = useRef(null);

  const username = currentUser?.displayName || 'User';
  const isLoggedIn = !!currentUser;
  const userType = currentUser?.isAdmin ? 'admin' : 'user';

  // Load categories, collections, and all products on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories for search dropdown
        const categoriesResult = await categoryApi.getPublicCategories();
        if (categoriesResult.success) {
          setCategories(categoriesResult.categories);
        }
        
        // Load collections for bottom bar navigation
        const collectionsResult = await bottomBarApi.getActiveFeaturedCategories();
        if (collectionsResult.success) {
          setCollections(collectionsResult.categories || []);
        }
        
        // Load all products for searching
        const productsResult = await productApi.getPublicProducts();
        if (productsResult.success) {
          setAllProducts(productsResult.products);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
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
        setIsSearchExpanded(false);
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
  }, [collections]);

  // Search products based on query and selected category
  useEffect(() => {
    const searchProducts = () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      
      try {
        let results = [];
        const searchTermLower = searchQuery.trim().toLowerCase();
        
        // Search in all products
        results = allProducts.filter(product => {
          // Check if product name matches search term
          const nameMatch = product.name?.toLowerCase().includes(searchTermLower);
          const descriptionMatch = product.description?.toLowerCase().includes(searchTermLower);
          
          // If no category selected or "all" categories, return name/description match
          if (selectedCategory === 'all') {
            return nameMatch || descriptionMatch;
          }
          
          // Category filtering logic
          let belongsToCategory = false;
          
          // Check if product has categories array
          if (product.categories && Array.isArray(product.categories)) {
            // Find the selected category object to get its ID
            const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory);
            
            if (selectedCategoryObj) {
              // Check if product's categories include the selected category ID
              belongsToCategory = product.categories.includes(selectedCategoryObj.id);
            }
          }
          
          // Also check if product has a category field (old format)
          if (!belongsToCategory && product.category) {
            belongsToCategory = product.category === selectedCategory;
          }
          
          // Return true only if name/description matches AND product belongs to selected category
          return (nameMatch || descriptionMatch) && belongsToCategory;
        });
        
        // Limit to 10 results
        results = results.slice(0, 10);
        
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, allProducts, categories]);

  const handleResultClick = (id) => {
    setSearchQuery('');
    setShowResults(false);
    setIsSearchExpanded(false);
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

  // Handle collection click - navigate to collection page with category IDs
  const handleCollectionClick = (collection) => {
    setActiveCollection(collection.id);
    // Navigate to collection page with collection ID or category IDs
    // Option 1: Pass collection ID to fetch products on collection page
    navigate(`/collection/${collection.id}`);
    
    // Option 2: Pass category IDs as query params
    // navigate(`/collection?categories=${collection.categoryIds.join(',')}&title=${encodeURIComponent(collection.collectionTitle)}`);
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

  // Get category names from categories array
  const getProductCategories = (productCategories) => {
    if (!productCategories || !Array.isArray(productCategories)) return [];
    const names = [];
    for (const catId of productCategories) {
      const category = categories.find(cat => cat.id === catId);
      if (category) {
        names.push(category.name);
      }
    }
    return names;
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setShowResults(false);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Logo, Navigation, Search, Icons */}
      <div className="bg-gradient-to-r from-[#F9F3F3] to-[#F7F0E8] bg-opacity-95 shadow-lg">
        <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center gap-2 md:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={saadhvi}
              alt="Saadhvi Silks"
              loading="lazy"
              decoding="async"
              className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="text-[#2E2E2E] text-base xl:text-lg font-serif hover:text-[#800020] transition relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-[#2E2E2E] text-base xl:text-lg font-serif hover:text-[#800020] transition relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-[#2E2E2E] text-base xl:text-lg font-serif hover:text-[#800020] transition relative group">
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-[#2E2E2E] text-base xl:text-lg font-serif hover:text-[#800020] transition relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar + Icons - Responsive */}
          <div ref={searchRef} className="flex items-center space-x-2 md:space-x-4 flex-1 max-w-2xl relative">
            {/* Mobile Search Toggle Button */}
            <button
              onClick={toggleSearch}
              className="lg:hidden text-[#2E2E2E] hover:text-[#800020] transition p-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Search Input Container - Responsive */}
            <div className={`
              ${isSearchExpanded ? 'fixed inset-x-0 top-0 z-50 bg-white p-4 shadow-xl' : 'hidden lg:block flex-1'}
              lg:relative lg:inset-auto lg:p-0 lg:bg-transparent lg:shadow-none lg:flex-1
            `}>
              {isSearchExpanded && (
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h3 className="text-lg font-semibold text-[#800020]">Search Products</h3>
                  <button onClick={toggleSearch} className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="relative flex-1">
                <div className={`flex ${isSearchExpanded ? '' : 'lg:flex'}`}>
                  {/* Category Dropdown - Responsive */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="h-full px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center rounded-l-full border border-r-0 border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium cursor-pointer hover:bg-gray-50 focus:outline-none focus:border-[#800020] transition-all"
                    >
                      <option value="all">All Categories</option>
                      {categories
                        .filter(cat => cat.isActive !== false)
                        .map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  {/* Search Input */}
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchInputFocus}
                    placeholder={selectedCategory === 'all' ? "Search sarees..." : `Search in ${selectedCategory}...`}
                    className="flex-1 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-r-full border border-gray-300 focus:border-[#800020] focus:outline-none text-gray-800 text-sm sm:text-base shadow-sm transition-all"
                  />
                </div>
                
                {/* Search Icon */}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                {searchQuery && !loading && !isSearchExpanded && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowResults(false);
                      setSearchResults([]);
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hidden lg:block"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className={`
                  ${isSearchExpanded ? 'mt-2' : 'absolute top-full left-0 right-0 mt-2'}
                  bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50
                `}>
                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020] mx-auto"></div>
                        <p className="mt-2 text-gray-500">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">
                            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                            {selectedCategory !== 'all' && (
                              <span className="text-[#800020]"> in {selectedCategory}</span>
                            )}
                          </p>
                        </div>
                        {searchResults.map((product) => {
                          const productCategoryNames = getProductCategories(product.categories);
                          return (
                            <div
                              key={product.id}
                              onClick={() => handleResultClick(product.id)}
                              className="flex items-center px-3 sm:px-5 py-2 sm:py-3 hover:bg-[#FDF6E3] cursor-pointer transition-all border-b border-gray-100 last:border-0"
                            >
                              <img
                                src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover mr-3 sm:mr-4 border flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = '/placeholder.jpg';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{product.name}</h4>
                                {productCategoryNames.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {productCategoryNames.slice(0, 2).join(', ')}
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-[#800020] text-sm sm:text-lg whitespace-nowrap ml-2">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          );
                        })}
                      </>
                    ) : searchQuery.length >= 2 && !loading ? (
                      <div className="p-6 text-center text-gray-500">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-sm">No products found for</p>
                        <p className="font-semibold text-sm">"{searchQuery}"</p>
                        {selectedCategory !== 'all' && (
                          <p className="text-xs mt-2">in category <span className="font-semibold">{selectedCategory}</span></p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Icons - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-5">
              <Link to="/wishlist" className="text-[#2E2E2E] hover:text-[#800020] transition relative group hidden xs:block">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#800020] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>

              <Link to="/cart" className="text-[#2E2E2E] hover:text-[#800020] transition relative group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#800020] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>

              {/* Desktop Login/User Section */}
              <div className="hidden lg:block">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#800020] to-[#A0002A] flex items-center justify-center text-white font-semibold text-sm">
                        {userType === 'admin' ? 'A' : (username?.charAt(0).toUpperCase() || 'U')}
                      </div>
                      <span className="text-[#2E2E2E] font-semibold text-sm">
                        {userType === 'admin' ? 'Admin' : (username || 'User')}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-[#800020] text-white px-4 py-2 rounded-full font-semibold font-serif hover:bg-[#A0002A] transition shadow-md hover:shadow-lg text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="bg-[#800020] text-white px-5 py-2 rounded-full font-semibold font-serif hover:bg-[#A0002A] transition shadow-md hover:shadow-lg text-sm">
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile User Icon */}
              <div className="lg:hidden">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="text-[#2E2E2E] hover:text-[#800020] transition"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                ) : (
                  <Link to="/login" className="text-[#2E2E2E] hover:text-[#800020] transition">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-[#2E2E2E] p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar - Collections with Arrow Buttons */}
{collections.length > 0 && (
  <div className="bg-[#800020] shadow-lg relative">
    <div className="relative flex items-center justify-center">
      {showLeftArrow && (
        <button
          onClick={() => scrollCategories('left')}
          className="absolute left-0 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 rounded-full"
          style={{ 
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white/70 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div 
        ref={categoriesScrollRef}
        className="overflow-x-auto scrollbar-hide w-full"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div 
          className={`flex gap-1 md:gap-2 min-w-max px-12 md:px-16 py-2 ${
            !showLeftArrow && !showRightArrow ? 'justify-center' : ''
          }`}
        >
          {collections
            .filter(collection => collection.isActive !== false)
            .map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleCollectionClick(collection)}
                className={`
                  relative px-4 md:px-5 py-1.5 md:py-2
                  text-xs md:text-sm font-medium uppercase tracking-wider
                  transition-all duration-300
                  ${activeCollection === collection.id
                    ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                    : 'text-white/80 hover:text-white border-b-2 border-transparent hover:border-white/30'
                  }
                `}
              >
                {collection.collectionTitle || collection.displayTitle}
              </button>
            ))}
        </div>
      </div>

      {showRightArrow && (
        <button
          onClick={() => scrollCategories('right')}
          className="absolute right-0 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 rounded-full"
          style={{ 
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white/70 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  </div>
)}      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg animate-slideDown">
          <div className="px-4 sm:px-6 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base sm:text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base sm:text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              About
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base sm:text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Collections
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base sm:text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Contact
            </Link>
            
            {/* Wishlist in Mobile */}
            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base sm:text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Wishlist
            </Link>
            
            {/* Collections in Mobile Menu */}
            {collections.length > 0 && (
              <div className="pt-2">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  Shop by Collection
                </p>
                <div className="space-y-1">
                  {collections
                    .filter(collection => collection.isActive !== false)
                    .map((collection) => (
                      <Link
                        key={collection.id}
                        to={`/collection/${collection.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm sm:text-base text-gray-600 hover:text-[#800020] hover:bg-[#F9F3F3] rounded-lg transition"
                      >
                        {collection.collectionTitle || collection.displayTitle}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base sm:text-lg font-medium font-serif hover:text-[#800020] transition py-2"
            >
              Cart
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-base sm:text-lg font-medium font-serif text-red-600 hover:text-red-700 transition py-2"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base sm:text-lg font-medium font-serif text-[#800020] hover:text-[#A0002A] transition py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Overlay for mobile search */}
      {isSearchExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSearch}
        />
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

  /* Extra small devices breakpoint */
  @media (min-width: 480px) {
    .xs\\:block {
      display: block;
    }
  }
  
  /* Smooth scrolling for the categories container */
  .smooth-scroll {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Pulse animation for active indicator */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`}</style>
    </header>
  );
};

export default Header;