// src/pages/CategoryProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import categoryApi from '../Services/CategoryApi';
import badgeApi from '../Services/BadgeApi';


const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [badges, setBadges] = useState([]);


  // Filter states
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    occasion: [],
    offers: [],
  });

  const productsPerPage = 20;

  // Filter options
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

  const getBadgeName = (badgeValue) => {
    if (!badgeValue) return null;

    // Try to find by ID first
    let badge = badges.find(b => b.id === badgeValue);

    // If not found by ID, try to find by name (case-insensitive)
    if (!badge && typeof badgeValue === 'string') {
      badge = badges.find(b =>
        b.name.toLowerCase() === badgeValue.toLowerCase()
      );
    }

    return badge ? badge.name : null;
  };

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

  // Helper function to normalize categories
  const normalizeCategories = (categoriesInput) => {
    if (!categoriesInput) return [];
    if (Array.isArray(categoriesInput)) return categoriesInput;
    if (typeof categoriesInput === 'string') {
      if (categoriesInput.includes(',')) {
        return categoriesInput.split(',').map(id => id.trim());
      }
      return [categoriesInput.trim()];
    }
    return [];
  };

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let badgesData = [];
        try {
          const badgesRes = await badgeApi.getPublicBadges();
          console.log('Available badges:', badges);
          if (badgesRes?.badges) {
            badgesData = badgesRes.badges;
            setBadges(badgesData);
          }
        } catch (badgeErr) {
          console.warn("Could not load badges:", badgeErr);
        }

        // Decode the category name from URL
        const decodedCategoryName = decodeURIComponent(categoryName);

        // Fetch all categories
        const categoriesRes = await categoryApi.getPublicCategories();
        let categoryData = null;

        if (categoriesRes?.success) {
          // Find the category by name (case-insensitive)
          categoryData = categoriesRes.categories.find(
            cat => cat.name.toLowerCase() === decodedCategoryName.toLowerCase() && cat.isActive !== false
          );
        }

        if (!categoryData) {
          setError(`Category "${decodedCategoryName}" not found`);
          setLoading(false);
          return;
        }

        setCategory(categoryData);

        // Fetch all products
        const productsRes = await productApi.getPublicProducts();

        if (productsRes?.success) {
          const allProducts = productsRes.products || [];

          // Filter products by category
          const categoryProducts = allProducts
            .filter(product => product.isVisible !== false)
            .filter(product => {
              const productCategories = normalizeCategories(product.categories);
              return productCategories.includes(categoryData.id);
            })
            .sort((a, b) => {
              if (a.displayOrder !== undefined && a.displayOrder !== null &&
                b.displayOrder !== undefined && b.displayOrder !== null) {
                return a.displayOrder - b.displayOrder;
              }
              return 0;
            });

          setProducts(categoryProducts);
          setFilteredProducts(categoryProducts);

          if (categoryProducts.length === 0) {
            toast.warn(`No products found in ${categoryData.name} category`);
          }
        }

        // Fetch wishlist if logged in
        if (authApi.isLoggedIn()) {
          try {
            const wishlistResult = await productApi.getWishlist();
            if (wishlistResult?.success) {
              setWishlistItems(wishlistResult.items.map((item) => item.id));
            }
          } catch (err) {
            console.error('Wishlist fetch failed:', err);
          }
        }

      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryAndProducts();
    }
  }, [categoryName]);

  // Apply filters whenever filters change
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Price filter
    if (selectedFilters.price.length > 0) {
      result = result.filter((product) => {
        const price = product.price;
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
  }, [selectedFilters, products]);

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
      price: [],
      occasion: [],
      offers: [],
    });
  };

  const toggleFilter = () => setFilterOpen(!filterOpen);

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
      toast.error('Something went wrong!');
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

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const productsWithOffers = products.filter((p) => {
    const hasAdminOffer = p?.hasOffer === true && p?.offerPrice && p?.offerPrice < p?.price;
    const hasNormalDiscount = p?.originalPrice && p?.originalPrice > p?.price;
    return hasAdminOffer || hasNormalDiscount;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-64 mb-4 mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-96 mb-8 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md h-96">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-3/5" />
                    <div className="h-6 bg-gray-200 rounded w-2/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center">
        <div className="text-center">
          <svg className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">{error}</h3>
          <button onClick={() => navigate('/products')} className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg mt-4">
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
      <div className="container mx-auto px-4 py-12">
        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4">
            {category?.name || 'Category Products'}
          </h1>
          <p className="text-[#1C2526] max-w-2xl mx-auto">
            {category?.description || `Explore our beautiful collection of ${category?.name || 'sarees'}`}
          </p>
        </div>

        {/* Main Content with Filters */}
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
              {(selectedFilters.price.length > 0 || selectedFilters.occasion.length > 0 || selectedFilters.offers.length > 0) && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
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

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Price Range</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {prices.map((price, i) => (
                    <label key={i} className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.price.includes(price.value)}
                        onChange={() => handleFilterChange('price', price.value)}
                      />
                      <span className="ml-3 text-[#2E2E2E] text-sm">{price.label}</span>
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
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.occasion.includes(occ)}
                        onChange={() => handleFilterChange('occasion', occ)}
                      />
                      <span className="ml-3 text-[#2E2E2E] text-sm">{occ}</span>
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
                        <input
                          type="checkbox"
                          className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                          checked={selectedFilters.offers.includes(offer.value)}
                          onChange={() => handleFilterChange('offers', offer.value)}
                        />
                        <span className="ml-3 text-[#2E2E2E] text-sm">{offer.label}</span>
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
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Filter Toggle Button and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <button
                onClick={toggleFilter}
                className="md:hidden flex items-center bg-white px-4 py-2 rounded-lg shadow-sm text-[#6B2D2D] font-medium"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(selectedFilters.price.length > 0 || selectedFilters.occasion.length > 0 || selectedFilters.offers.length > 0) && (
                  <span className="ml-2 bg-[#6B2D2D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedFilters.price.length + selectedFilters.occasion.length + selectedFilters.offers.length}
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

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <svg className="h-20 w-20 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-[#2E2E2E] mb-3">No products found</h3>
                <p className="text-[#6B6B6B] mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentProducts.map((product) => {
                    const { inStock, hasOffer, hasAdminOffer, hasNormalDiscount, displayPrice, originalPrice, discountPercentage, offerName } = getProductOfferInfo(product);

                    return (
                      <Link
                        key={product.id}
                        to={`/viewdetails/${product.id}`}
                        className={`block bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group border ${hasAdminOffer ? 'border-[#FFD700]/50 shadow-[0_0_10px_rgba(128,0,32,0.2)]' : 'border-[#D9A7A7]'} cursor-pointer`}
                      >
                        <div className="relative overflow-hidden">
                          {/* Admin Offer Badge - Top Left Corner */}
                          {hasAdminOffer && (
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg blur-sm opacity-60"></div>
                                <div className="relative bg-gradient-to-r from-[#800020] to-[#A0002A] text-[#FFD700] px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold tracking-wider shadow-lg flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                  </svg>
                                  {offerName?.substring(0, 15)}{offerName?.length > 15 ? '...' : ''}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Normal Discount Badge */}
                          {hasNormalDiscount && (
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
                              <div className="relative">
                                <div className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                  {discountPercentage}% OFF
                                </div>
                              </div>
                            </div>
                          )}


                          <div className="h-48 sm:h-64 overflow-hidden">

                            <img
                              src={product.images?.[0] || '/placeholder-image.jpg'}
                              alt={product.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                            />
                          </div>

                          <button
                            onClick={(e) => handleWishlistToggle(e, product)}
                            className={`absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-300 z-20 ${wishlistItems.includes(product.id)
                                ? 'bg-[#800020] text-white'
                                : 'bg-white text-[#800020] hover:bg-[#D9A7A7]'
                              }`}
                            aria-label={wishlistItems.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <svg className="h-3.5 w-3.5 sm:h-5 sm:w-5" fill={wishlistItems.includes(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          {product.badge && (
                            <div className="absolute bottom-2 sm:bottom-4 left-0 z-20">
                            <div className="relative">
                              <div className="bg-gradient-to-r from-[#800020] to-[#D4AF37] text-white px-3 sm:px-5 py-0.5 sm:py-1.5 text-[10px] sm:text-xs font-bold shadow-md"
                                style={{
                                  clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)'
                                }}>
                                {getBadgeName(product.badge)}
                              </div>
                            </div>
                            </div>
                          )}
                        </div>

                        <div className="p-3 sm:p-5">

                          <h3 className="text-sm sm:text-lg font-semibold text-[#2E2E2E] mb-1 sm:mb-2 group-hover:text-[#800020] transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-[#2E2E2E] text-[11px] sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                            {product.description || '—'}
                          </p>

                          {/* Admin Offer Label */}
                          {hasAdminOffer && offerName && (
                            <div className="mb-2">
                              <span className="inline-block bg-gradient-to-r from-[#800020]/10 to-[#A0002A]/10 text-[#800020] px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#800020]/20">
                                ✨ Special Offer
                              </span>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 sm:mt-2 mb-2 sm:mb-3">
                            <span className={`font-bold text-sm sm:text-lg ${hasAdminOffer ? 'text-[#800020]' : 'text-[#6B2D2D]'}`}>
                              {formatPrice(displayPrice)}
                            </span>
                            {hasOffer && originalPrice && originalPrice > displayPrice && (
                              <>
                                <span className="text-[#2E2E2E] text-[10px] sm:text-sm line-through">
                                  {formatPrice(originalPrice)}
                                </span>

                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 sm:mt-4">
                            <div className="flex">
                              {inStock ? (
                                <span className="text-green-600 text-[10px] sm:text-sm">In Stock</span>
                              ) : (
                                <span className="text-red-600 text-[10px] sm:text-sm">Out of Stock</span>
                              )}
                            </div>
                            <div onClick={(e) => e.preventDefault()} className="relative z-10">
                              <button
                                className={`${hasAdminOffer ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white border border-[#FFD700]/30' : 'bg-[#800020] text-white'} px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium hover:bg-[#6B2D2D] transition-all duration-300`}
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

                {/* Pagination */}
                {filteredProducts.length > productsPerPage && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center space-x-2 flex-wrap gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-[#2E2E2E] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
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
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`px-4 py-2 rounded-lg border ${currentPage === pageNum
                                  ? 'bg-[#6B2D2D] text-white border-[#6B2D2D]'
                                  : 'border-gray-300 text-[#2E2E2E] hover:bg-gray-100'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-[#2E2E2E] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;