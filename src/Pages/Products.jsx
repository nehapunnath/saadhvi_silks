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
    { label: "Premium Collection", value: "15000-100000" },
  ];

  const offerTypes = [
    { label: "Special Offers", value: "hasOffer" },
  ];

  // Updated getProductOfferInfo function to handle both admin offers and normal discounts
  const getProductOfferInfo = (product) => {
    const inStock = product?.stock > 0;

    // Check for Admin Offer (has offerName and offerPrice from offer system)
    const hasAdminOffer = product?.hasOffer === true && product?.offerName && product?.offerPrice && product?.offerPrice < product?.price;

    // Check for Normal Discount (originalPrice vs price - regular markdown)
    const hasNormalDiscount = !hasAdminOffer && product?.originalPrice && product?.originalPrice > product?.price;

    // Determine which offer to show
    const hasOffer = hasAdminOffer || hasNormalDiscount;

    // Display price (lowest price available)
    let displayPrice;
    let originalPrice;
    let discountPercentage;
    let offerName;

    if (hasAdminOffer) {
      // Admin Offer takes precedence
      displayPrice = product.offerPrice;
      originalPrice = product.price;
      discountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
      offerName = product.offerName;
    } else if (hasNormalDiscount) {
      // Normal discount from originalPrice
      displayPrice = product.price;
      originalPrice = product.originalPrice;
      discountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
      offerName = null;
    } else {
      // No offer
      displayPrice = product?.price || 0;
      originalPrice = null;
      discountPercentage = 0;
      offerName = null;
    }

    return {
      inStock,
      hasOffer,
      hasAdminOffer,
      hasNormalDiscount,
      displayPrice,
      originalPrice,
      discountPercentage,
      offerName
    };
  };

  // Helper function to normalize categories (convert string to array)
  const normalizeCategories = (categoriesInput) => {
    if (!categoriesInput) return [];
    if (Array.isArray(categoriesInput)) return categoriesInput;
    if (typeof categoriesInput === 'string') {
      if (categoriesInput.includes(',')) {
        return categoriesInput.split(',').map(id => id.trim());
      } else {
        return [categoriesInput.trim()];
      }
    }
    return [];
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';
    let cleanId = String(categoryId).trim();
    if (cleanId.includes(',')) {
      cleanId = cleanId.split(',')[0].trim();
    }
    const category = categories.find(c => String(c.id) === cleanId);
    return category ? category.name : cleanId.substring(0, 8);
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
          const allProductsData = productsRes.products || [];

          // Normalize each product's categories
          const normalizedProducts = allProductsData
            .filter(product => product.isVisible !== false)
            .map(product => {
              const normalizedProduct = { ...product };
              let normalizedCategories = [];

              if (product.categories) {
                normalizedCategories = normalizeCategories(product.categories);
              } else if (product.category) {
                normalizedCategories = normalizeCategories(product.category);
              }

              if (normalizedCategories.length === 1 && typeof normalizedCategories[0] === 'string' && normalizedCategories[0].includes(',')) {
                normalizedCategories = normalizedCategories[0].split(',').map(id => id.trim());
              }

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

    // Category filter
    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes("All")) {
      result = result.filter((product) => {
        if (!product.categories || product.categories.length === 0) return false;
        return product.categories.some(catId => selectedFilters.category.includes(catId));
      });
    }

    // Price filter
    if (selectedFilters.price.length > 0) {
      result = result.filter((product) => {
        const { displayPrice } = getProductOfferInfo(product);
        return selectedFilters.price.some((range) => {
          const [min, max] = range.split('-').map(Number);
          return displayPrice >= min && displayPrice <= max;
        });
      });
    }

    // Occasion filter
    if (selectedFilters.occasion.length > 0) {
      result = result.filter((product) =>
        product.occasion?.some((occ) => selectedFilters.occasion.includes(occ))
      );
    }

    // Offers only filter - includes both admin offers and normal discounts
    if (selectedFilters.offers.length > 0) {
      result = result.filter((product) => {
        const hasAdminOffer = product?.hasOffer === true && product?.offerPrice && product?.offerPrice < product?.price;
        const hasNormalDiscount = product?.originalPrice && product?.originalPrice > product?.price;
        return hasAdminOffer || hasNormalDiscount;
      });
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
      const { displayPrice } = getProductOfferInfo(product);

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

  const productsWithOffers = allProducts.filter((p) => {
    const hasAdminOffer = p?.hasOffer === true && p?.offerPrice && p?.offerPrice < p?.price;
    const hasNormalDiscount = p?.originalPrice && p?.originalPrice > p?.price;
    return hasAdminOffer || hasNormalDiscount;
  }).length;

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

              {/* Active Filters Summary */}
              {(selectedFilters.category.length > 0 || selectedFilters.price.length > 0 || selectedFilters.occasion.length > 0 || selectedFilters.offers.length > 0) && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFilters.category.filter(cat => cat !== "All").map(catId => {
                      const categoryName = getCategoryName(catId);
                      return (
                        <span key={catId} className="inline-flex items-center bg-[#6B2D2D]/10 text-[#6B2D2D] text-xs px-2 py-1 rounded-full">
                          {categoryName}
                          <button onClick={() => handleFilterChange('category', catId)} className="ml-1 hover:text-red-600">×</button>
                        </span>
                      );
                    })}
                    {selectedFilters.price.map(price => {
                      const priceLabel = prices.find(p => p.value === price)?.label;
                      return priceLabel && (
                        <span key={price} className="inline-flex items-center bg-[#6B2D2D]/10 text-[#6B2D2D] text-xs px-2 py-1 rounded-full">
                          {priceLabel}
                          <button onClick={() => handleFilterChange('price', price)} className="ml-1 hover:text-red-600">×</button>
                        </span>
                      );
                    })}
                    {selectedFilters.occasion.map(occ => (
                      <span key={occ} className="inline-flex items-center bg-[#6B2D2D]/10 text-[#6B2D2D] text-xs px-2 py-1 rounded-full">
                        {occ}
                        <button onClick={() => handleFilterChange('occasion', occ)} className="ml-1 hover:text-red-600">×</button>
                      </span>
                    ))}
                    {selectedFilters.offers.map(offer => (
                      <span key={offer} className="inline-flex items-center bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Special Offers
                        <button onClick={() => handleFilterChange('offers', offer)} className="ml-1 hover:text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Category</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <label className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
                    <input type="checkbox" className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                      checked={selectedFilters.category.includes("All")}
                      onChange={() => handleFilterChange('category', "All")}
                    />
                    <span className="ml-3 text-[#2E2E2E]">All Categories</span>
                  </label>
                  {categories.filter((cat) => cat.isActive !== false).map((category) => (
                    <label key={category.id} className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
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
                    <label key={i} className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
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
                    <label key={i} className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
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
                    <label key={i} className="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
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

              {/* Results Count */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-center text-gray-600">
                  Showing {filteredProducts.length} of {allProducts.length} products
                </p>
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
                {(selectedFilters.category.length > 0 || selectedFilters.price.length > 0 || selectedFilters.occasion.length > 0 || selectedFilters.offers.length > 0) && (
                  <span className="ml-2 bg-[#6B2D2D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedFilters.category.length + selectedFilters.price.length + selectedFilters.occasion.length + selectedFilters.offers.length}
                  </span>
                )}
              </button>
              <div className="text-[#2E2E2E] text-sm sm:text-base">
                Showing {currentProducts.length} of {filteredProducts.length} products
                {selectedFilters.offers.length > 0 && (
                  <span className="text-green-600 font-semibold ml-2">• Special Offers</span>
                )}
              </div>
            </div>

            {/* Product Grid - Updated Minimalist Design with Zoom */}
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
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:gap-x-8 md:gap-y-12">
                {currentProducts.map((product) => {
                  const { inStock, hasOffer, hasAdminOffer, hasNormalDiscount, displayPrice, originalPrice, discountPercentage, offerName } = getProductOfferInfo(product);
                  const badgeName = getBadgeName(product.badge);
                  const isZoomed = activeZoom === product.id;

                  return (
                    <div key={product.id} className="group">
                      {/* Minimalist Card */}
                      <div className="relative">
                        {/* Image Section */}
                        <div className="relative overflow-hidden bg-[#F5F0EB] rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                          {/* Admin Offer Badge - Top Left */}
                          {hasAdminOffer && (
                            <div className="absolute top-0 left-0 z-20">
                              <div className="bg-gradient-to-r from-[#800020] to-[#A0002A] text-white px-4 py-1.5 text-xs font-semibold tracking-wider">
                                {offerName?.substring(0, 20)}{offerName?.length > 20 ? '...' : ''}
                              </div>
                            </div>
                          )}

                          {/* Normal Discount Badge */}
                          {hasNormalDiscount && !hasAdminOffer && (
                            <div className="absolute top-0 left-0 z-20">
                              <div className="bg-black/90 text-white px-4 py-1.5 text-xs font-semibold tracking-wider">
                                {discountPercentage}% OFF
                              </div>
                            </div>
                          )}

                          {/* Regular Badge (from badge system) - Bottom Left */}
                          {product.badge && badgeName && (
                            <div className="absolute bottom-0 left-0 z-20">
                              <div className="bg-gradient-to-r from-[#800020] to-[#D4AF37] text-white px-5 py-1.5 text-xs font-bold shadow-md"
                                style={{
                                  clipPath: 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)'
                                }}>
                                {badgeName}
                              </div>
                            </div>
                          )}

                          {/* Wishlist Icon */}
                          <button
                            onClick={(e) => handleWishlistToggle(e, product)}
                            className={`absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#800020] group/wishlist transition-all duration-300 shadow-md hover:shadow-lg`}
                            title="Add to Wishlist"
                          >
                            <svg className={`w-4.5 h-4.5 ${wishlistItems.includes(product.id) ? 'text-[#800020] fill-[#800020]' : 'text-gray-700 group-hover/wishlist:text-white'}`} fill={wishlistItems.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>

                          {/* Product Image with Zoom */}
                          <div
                            className="aspect-[3/4] overflow-hidden cursor-zoom-in"
                            ref={el => imageRefs.current[product.id] = el}
                            onMouseEnter={() => handleImageMouseEnter(product.id)}
                            onMouseLeave={handleImageMouseLeave}
                            onMouseMove={(e) => handleImageMouseMove(e, product.id)}
                          >
                            {!isZoomed ? (
                              <img
                                src={product.images?.[0] || '/placeholder-image.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                decoding="async"
                                loading="lazy"
                                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                              />
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{
                                  backgroundImage: `url(${product.images?.[0] || '/placeholder-image.jpg'})`,
                                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                  backgroundSize: '200%',
                                  backgroundRepeat: 'no-repeat',
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="mt-6 text-left">
                          {/* Stock Status */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              {inStock ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                  </span>
                                  In Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Product Name */}
                          <Link to={`/viewdetails/${product.id}`}>
                            <h3 className="text-xl md:text-2xl font-serif font-semibold text-gray-800 mb-2 hover:text-[#800020] transition-colors line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Admin Offer Label */}
                          {hasAdminOffer && offerName && (
                            <div className="mb-3">
                              <span className="inline-block bg-gradient-to-r from-[#800020]/10 to-[#A0002A]/10 text-[#800020] px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[#800020]/20">
                                 Special Offer
                              </span>
                            </div>
                          )}

                          {/* Categories Section - Highlighted */}
                          <div className="mb-4 flex flex-wrap gap-1.5">
                            {product.categories && product.categories.length > 0 ? (
                              product.categories.slice(0, 2).map((categoryId, idx) => {
                                const categoryName = getCategoryName(categoryId);
                                return (
                                  <span
                                    key={idx}
                                    className="inline-block bg-[#800020]/10 text-[#800020] text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#800020]/20"
                                  >
                                    {categoryName}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                N/A
                              </span>
                            )}
                          </div>

                          {/* Price Section */}
                          <div className="mb-5">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={`text-2xl md:text-3xl font-bold ${hasAdminOffer ? 'text-[#800020]' : 'text-[#800020]'}`}>
                                {formatPrice(displayPrice)}
                              </span>
                              {hasOffer && originalPrice && originalPrice > displayPrice && (
                                <span className="text-gray-400 text-base line-through">
                                  {formatPrice(originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* View Details Button */}
                          <Link to={`/viewdetails/${product.id}`}>
                            <button
                              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                                inStock
                                  ? hasAdminOffer
                                    ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white shadow-md hover:shadow-lg'
                                    : 'bg-[#800020] text-white hover:bg-[#6B2D2D]'
                                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              }`}
                              disabled={!inStock}
                            >
                              {inStock ? 'View Details' : 'Out of Stock'}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
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
                <nav className="flex items-center space-x-2 flex-wrap gap-2">
                  <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-[#2E2E2E] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }

                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button key={pageNum} onClick={() => paginate(pageNum)}
                          className={`px-4 py-2 rounded-lg border ${currentPage === pageNum
                              ? 'bg-[#6B2D2D] text-white border-[#6B2D2D]'
                              : 'border-gray-300 text-[#2E2E2E] hover:bg-gray-100'
                            }`}>
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-[#2E2E2E] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
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