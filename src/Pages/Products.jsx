// src/pages/Products.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import categoryApi from '../Services/CategoryApi';
import badgeApi from '../Services/BadgeApi';

const Products = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    price: [],
    occasion: [],
    offers: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [activeZoom, setActiveZoom] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const imageRefs = useRef({});
  const productsPerPage = 20;

  const occasions = ["Wedding", "Bridal", "Festival", "Party", "Formal", "Casual"];

  const prices = [
    { label: "₹0 – ₹1,000", value: "0-1000" },
    { label: "₹1,000 – ₹3,000", value: "1000-3000" },
    { label: "₹3,000 – ₹5,000", value: "3000-5000" },
    { label: "₹5,000 – ₹10,000", value: "5000-10000" },
    { label: "₹10,000 – ₹15,000", value: "10000-15000" },
    { label: "Premium C0llection", value: "15000-100000" },

  ];

  const offerTypes = [
    { label: "Special Offers", value: "hasOffer" },
  ];

  // Helper function to normalize categories (convert string to array) - SAME AS ADMIN
  const normalizeCategories = (categoriesInput) => {
    if (!categoriesInput) return [];

    // If it's already an array, return it
    if (Array.isArray(categoriesInput)) {
      return categoriesInput;
    }

    // If it's a string
    if (typeof categoriesInput === 'string') {
      // If it contains commas, split it
      if (categoriesInput.includes(',')) {
        return categoriesInput.split(',').map(id => id.trim());
      } else {
        // Single category
        return [categoriesInput.trim()];
      }
    }

    return [];
  };

  // Get category name by ID - SAME AS ADMIN
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';

    // Clean the ID - remove any whitespace
    let cleanId = String(categoryId).trim();

    // If the ID still contains commas, it means it wasn't split properly
    if (cleanId.includes(',')) {
      cleanId = cleanId.split(',')[0].trim();
    }

    // Find the category
    const category = categories.find(c => String(c.id) === cleanId);

    if (category) {
      return category.name;
    }

    return cleanId.substring(0, 8);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch badges
        let badgesData = [];
        try {
          const badgesRes = await badgeApi.getPublicBadges();
          if (badgesRes?.badges) {
            badgesData = badgesRes.badges;
            setBadges(badgesData);
          }
        } catch (badgeErr) {
          console.warn("Could not load badges:", badgeErr);
        }

        // Fetch categories
        const categoriesRes = await categoryApi.getPublicCategories();
        let categoriesList = [];
        if (categoriesRes?.success) {
          categoriesList = categoriesRes.categories || [];
          setCategories(categoriesList);
          console.log("Categories loaded:", categoriesList);
        }

        // Fetch products
        const productsRes = await productApi.getPublicProducts();
        if (productsRes?.success) {
          // Process products - NORMALIZE CATEGORIES (SAME AS ADMIN)
          const allProductsData = productsRes.products || [];

          // Normalize each product's categories (SAME AS ADMIN)
          const normalizedProducts = allProductsData
            .filter(product => product.isVisible !== false)
            .map(product => {
              const normalizedProduct = { ...product };

              // Normalize categories from any source
              let normalizedCategories = [];

              if (product.categories) {
                normalizedCategories = normalizeCategories(product.categories);
              } else if (product.category) {
                normalizedCategories = normalizeCategories(product.category);
              }

              // Special handling: If normalizedCategories has one item that still contains commas
              if (normalizedCategories.length === 1 && typeof normalizedCategories[0] === 'string' && normalizedCategories[0].includes(',')) {
                normalizedCategories = normalizedCategories[0].split(',').map(id => id.trim());
              }

              // Remove any empty strings
              normalizedCategories = normalizedCategories.filter(id => id && id.trim());

              normalizedProduct.categories = normalizedCategories;
              return normalizedProduct;
            });

          // Sort by displayOrder
          const sortedProducts = normalizedProducts.sort((a, b) => {
            if (a.displayOrder !== undefined && a.displayOrder !== null &&
              b.displayOrder !== undefined && b.displayOrder !== null) {
              return a.displayOrder - b.displayOrder;
            }
            if (a.displayOrder !== undefined && a.displayOrder !== null) return -1;
            if (b.displayOrder !== undefined && b.displayOrder !== null) return 1;
            return 0;
          });

          console.log("Products loaded:", sortedProducts.length);

          setAllProducts(sortedProducts);
          setFilteredProducts(sortedProducts);
        }

        if (authApi.isLoggedIn()) {
          try {
            const wishlistResult = await productApi.getWishlist();
            if (wishlistResult?.success) {
              setWishlistItems(wishlistResult.items.map((item) => item.id));
            }
          } catch (wishlistError) {
            console.error('Wishlist fetch failed:', wishlistError);
          }
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
        console.error('Data fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const getBadgeName = (badgeId) => {
    if (!badgeId) return null;
    const badge = badges.find(b => b.id === badgeId);
    return badge ? badge.name : 'N/A';
  };

  // Filter products whenever filters change
  useEffect(() => {
    if (allProducts.length === 0) return;

    let result = [...allProducts];

    // Category filter - Check if product has ANY of the selected categories
    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes("All")) {
      result = result.filter((product) => {
        if (!product.categories || product.categories.length === 0) return false;
        return product.categories.some(catId => selectedFilters.category.includes(catId));
      });
    }

    // Price filter
    if (selectedFilters.price.length > 0) {
      result = result.filter((product) => {
        const price = product.hasOffer && product.offerPrice ? product.offerPrice : product.price;
        return selectedFilters.price.some((range) => {
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
      });
    }

    // Occasion filter
    if (selectedFilters.occasion.length > 0) {
      result = result.filter((product) =>
        product.occasion?.some((occ) => selectedFilters.occasion.includes(occ))
      );
    }

    // Offers only filter
    if (selectedFilters.offers.length > 0) {
      result = result.filter((product) => product.hasOffer === true);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedFilters, allProducts]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleFilter = () => setFilterOpen(!filterOpen);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter((item) => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: [],
      price: [],
      occasion: [],
      offers: [],
    });
  };

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authApi.isLoggedIn()) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }

    try {
      const isInWishlist = wishlistItems.includes(product.id);
      const displayPrice = product.hasOffer ? product.offerPrice : product.price;

      if (isInWishlist) {
        await productApi.removeFromWishlist(product.id);
        setWishlistItems((prev) => prev.filter((id) => id !== product.id));
        toast.success(`${product.name} removed from wishlist`);
      } else {
        await productApi.addToWishlist({
          id: product.id,
          name: product.name,
          price: displayPrice,
          image: product.images?.[0] || '/placeholder-image.jpg',
        });
        setWishlistItems((prev) => [...prev, product.id]);
        toast.success(`${product.name} added to wishlist`);
      }
    } catch (err) {
      toast.error('Something Went Wrong !!!');
    }
  };

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleImageMouseMove = (e, productId) => {
    if (activeZoom !== productId || !imageRefs.current[productId]) return;
    const { left, top, width, height } = imageRefs.current[productId].getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const clampedX = Math.min(100, Math.max(0, x));
    const clampedY = Math.min(100, Math.max(0, y));
    setZoomPosition({ x: clampedX, y: clampedY });
  };

  const handleImageMouseEnter = (productId) => {
    setActiveZoom(productId);
  };

  const handleImageMouseLeave = () => {
    setActiveZoom(null);
  };

  const productsWithOffers = allProducts.filter((p) => p.hasOffer === true).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center">
        <div className="text-center">
          <svg className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">Error loading products</h3>
          <p className="text-[#2E2E2E] mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-1/4 ${filterOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} md:block`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#2E2E2E]">Filters</h2>
                <div className="flex items-center">
                  <button onClick={clearFilters} className="text-sm text-[#6B2D2D] hover:text-[#3A1A1A] mr-4">
                    Clear All
                  </button>
                  {filterOpen && (
                    <button onClick={toggleFilter} className="md:hidden text-[#2E2E2E]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Category</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <label className="flex items-center py-1">
                    <input type="checkbox" className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                      checked={selectedFilters.category.includes("All")}
                      onChange={() => handleFilterChange('category', "All")}
                    />
                    <span className="ml-3 text-[#2E2E2E]">All Categories</span>
                  </label>
                  {categories.filter((cat) => cat.isActive !== false).map((category) => (
                    <label key={category.id} className="flex items-center py-1">
                      <input type="checkbox" className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.category.includes(category.id)}
                        onChange={() => handleFilterChange('category', category.id)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Price Range</h3>
                <div className="space-y-2">
                  {prices.map((price, i) => (
                    <label key={i} className="flex items-center py-1">
                      <input type="checkbox" className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.price.includes(price.value)}
                        onChange={() => handleFilterChange('price', price.value)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{price.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Occasion</h3>
                <div className="space-y-2">
                  {occasions.map((occ, i) => (
                    <label key={i} className="flex items-center py-1">
                      <input type="checkbox" className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.occasion.includes(occ)}
                        onChange={() => handleFilterChange('occasion', occ)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{occ}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Offers Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Special Offers</h3>
                <div className="space-y-2">
                  {offerTypes.map((offer, i) => (
                    <label key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <input type="checkbox" className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                          checked={selectedFilters.offers.includes(offer.value)}
                          onChange={() => handleFilterChange('offers', offer.value)}
                        />
                        <span className="ml-3 text-[#2E2E2E]">{offer.label}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {productsWithOffers}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <button onClick={toggleFilter} className="md:hidden flex items-center bg-white px-4 py-2 rounded-lg shadow-sm text-[#6B2D2D] font-medium">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              <div className="text-[#2E2E2E] text-sm sm:text-base">
                Showing {currentProducts.length} of {filteredProducts.length} products
                {selectedFilters.offers.length > 0 && (
                  <span className="text-green-600 font-semibold ml-2">• Special Offers</span>
                )}
              </div>
            </div>

            {/* Product Grid - UPDATED FOR MOBILE: 2 columns, Tablet: 2 columns, Desktop: 3 columns */}
            {allProducts.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md h-[380px] sm:h-[420px] md:h-[460px] animate-pulse">
                    <div className="h-48 sm:h-64 md:h-80 bg-gray-200" />
                    <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                      <div className="h-5 sm:h-6 bg-gray-200 rounded w-4/5" />
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/5" />
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-2/5" />
                      <div className="h-8 sm:h-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {currentProducts.map((product) => {

                  const hasOffer = product.hasOffer === true ||
                    (product.originalPrice && product.originalPrice > product.price) ||
                    (product.offerPrice && product.offerPrice < product.price);

                  // Determine display price and original price
                  let displayPrice = product.price;
                  let originalPrice = null;
                  let offerName = product.offerName;

                  if (product.hasOffer === true && product.offerPrice) {
                    // Case 1: Using hasOffer flag
                    displayPrice = product.offerPrice;
                    originalPrice = product.price;
                    offerName = product.offerName || 'SPECIAL OFFER';
                  } else if (product.originalPrice && product.originalPrice > product.price) {
                    // Case 2: Using originalPrice field (your current data structure)
                    displayPrice = product.price;
                    originalPrice = product.originalPrice;
                    // offerName = 'SALE';
                  } else if (product.offerPrice && product.offerPrice < product.price) {
                    // Case 3: Using offerPrice field
                    displayPrice = product.offerPrice;
                    originalPrice = product.price;
                    offerName = product.offerName || 'SPECIAL OFFER';
                  }

                  // Calculate discount percentage
                  let discountPercentage = 0;
                  if (originalPrice && originalPrice > displayPrice) {
                    discountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
                  }

                  const badgeName = getBadgeName(product.badge);
                  const isZoomed = activeZoom === product.id;

                  // Debug log
                  if (hasOffer) {
                    console.log('Product with offer:', product.name, {
                      price: product.price,
                      originalPrice: product.originalPrice,
                      offerPrice: product.offerPrice,
                      hasOffer: product.hasOffer,
                      displayPrice,
                      originalPriceFinal: originalPrice,
                      discountPercentage,
                      offerName
                    });
                  }

                  return (
                    <Link
                      key={product.id}
                      to={`/viewdetails/${product.id}`}
                      className="block bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group border border-[#D9A7A7] cursor-pointer"
                    >
                      <div className="relative overflow-hidden">
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2 z-10">
                          {badgeName && (
                            <span className="bg-[#800020] text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                              {badgeName}
                            </span>
                          )}
                          {/* {hasOffer && offerName && (
            <span className="bg-green-600 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              {offerName}
            </span>
          )} */}
                          {discountPercentage > 0 && (
                            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                              {discountPercentage}% OFF
                            </span>
                          )}
                        </div>

                        <div className="h-48 sm:h-64 md:h-80 overflow-hidden cursor-zoom-in relative"
                          ref={el => imageRefs.current[product.id] = el}
                          onMouseEnter={() => handleImageMouseEnter(product.id)}
                          onMouseLeave={handleImageMouseLeave}
                          onMouseMove={(e) => handleImageMouseMove(e, product.id)}
                        >
                          {!isZoomed ? (
                            <img src={product.images?.[0] || '/placeholder-image.jpg'} alt={product.name}
                              loading="lazy" decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                            />
                          ) : (
                            <div className="w-full h-full" style={{
                              backgroundImage: `url(${product.images?.[0] || '/placeholder-image.jpg'})`,
                              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              backgroundSize: '200%',
                              backgroundRepeat: 'no-repeat',
                            }} />
                          )}

                          {isZoomed && (
                            <div className="absolute pointer-events-none shadow-lg"
                              style={{
                                left: `${zoomPosition.x}%`,
                                top: `${zoomPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
                              }}
                            />
                          )}
                        </div>

                        <button
                          onClick={(e) => handleWishlistToggle(e, product)}
                          className={`absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-300 ${wishlistItems.includes(product.id)
                              ? 'bg-[#6B2D2D] text-white'
                              : 'bg-white text-[#6B2D2D] hover:bg-[#D9A7A7]'
                            }`}
                          aria-label={wishlistItems.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <svg className="h-3.5 w-3.5 sm:h-5 sm:w-5" fill={wishlistItems.includes(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-3 sm:p-5">
                        <h3 className="text-sm sm:text-lg font-semibold text-[#2E2E2E] mb-1 sm:mb-2 group-hover:text-[#3A1A1A] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-[#2E2E2E] text-[11px] sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description || '—'}</p>

                        {/* Categories Section */}
                        <div className="mb-2 sm:mb-3 flex flex-wrap gap-1">
                          {product.categories && product.categories.length > 0 ? (
                            product.categories.map((categoryId, idx) => {
                              const categoryName = getCategoryName(categoryId);
                              return (
                                <span
                                  key={idx}
                                  className="inline-block bg-blue-100 text-blue-800 text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
                                >
                                  {categoryName}
                                </span>
                              );
                            })
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-500 text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                              N/A
                            </span>
                          )}
                        </div>

                        {/* Price Section - Show both original and discounted price */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 sm:mt-2 mb-2 sm:mb-3">
                          <span className="text-[#6B2D2D] font-bold text-sm sm:text-lg">
                            {formatPrice(displayPrice)}
                          </span>
                          {originalPrice && originalPrice > displayPrice && (
                            <span className="text-[#2E2E2E] text-[10px] sm:text-sm line-through">
                              {formatPrice(originalPrice)}
                            </span>
                          )}

                        </div>

                        <div className="flex items-center justify-between mt-2 sm:mt-4">
                          <div className="flex">
                            {product.stock > 0 ? (
                              <span className="text-green-600 text-[10px] sm:text-sm">In Stock</span>
                            ) : (
                              <span className="text-red-600 text-[10px] sm:text-sm">Out of Stock</span>
                            )}
                          </div>
                          <div onClick={(e) => e.preventDefault()} className="relative z-10">
                            <button
                              className="bg-[#800020] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium hover:bg-[#6B2D2D] transition-all duration-300"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/viewdetails/${product.id}`);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="h-20 w-20 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-[#2E2E2E] mb-3">No products found</h3>
                <p className="text-[#6B6B6B] mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg hover:bg-[#3A1A1A] transition-colors">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="flex justify-center mt-16">
                <nav className="flex items-center space-x-2">
                  <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-[#2E2E2E] hover:bg-gray-100 disabled:opacity-50">
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => paginate(page)}
                      className={`px-4 py-2 rounded-lg border ${currentPage === page
                          ? 'bg-[#6B2D2D] text-white border-[#6B2D2D]'
                          : 'border-gray-300 text-[#2E2E2E] hover:bg-gray-100'
                        }`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-[#2E2E2E] hover:bg-gray-100 disabled:opacity-50">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;