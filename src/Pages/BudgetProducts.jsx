// src/pages/BudgetProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import categoryApi from '../Services/CategoryApi';

const BudgetProducts = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const budgetParam = searchParams.get('budget');
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState(budgetParam || 'under2000');
  
  // Filter states
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    occasion: [],
    offers: [],
  });

  const productsPerPage = 20;

  // Budget display names
  const budgetNames = {
    under2000: "Under ₹2,000",
    mid2000to5000: "₹2,000 - ₹5,000",
    mid5000to10000: "₹5,000 - ₹10,000",
    premium: "Premium Collection"
  };

  const budgetDescriptions = {
    under2000: "Beautiful budget-friendly sarees that don't compromise on quality",
    mid2000to5000: "Elegant sarees perfect for daily wear and casual occasions",
    mid5000to10000: "Premium quality sarees for festive occasions and family gatherings",
    premium: "Luxurious handcrafted sarees for weddings and special events"
  };

  // Filter options
  const occasions = ["Wedding", "Bridal", "Festival", "Party", "Formal", "Casual"];
  
  const offerTypes = [
    { label: "Special Offers", value: "hasOffer" },
  ];

  const getProductOfferInfo = (product) => {
  const inStock = product?.stock > 0;
  // Check for offer using originalPrice field (your database pattern)
  const hasOffer = product?.originalPrice && product?.originalPrice > product?.price;
  const displayPrice = product?.price;
  const originalPrice = hasOffer ? product?.originalPrice : null;
  const discountPercentage = hasOffer && originalPrice && originalPrice > displayPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;
  
  return { inStock, hasOffer, displayPrice, originalPrice, discountPercentage };
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

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesRes = await categoryApi.getPublicCategories();
        if (categoriesRes?.success) {
          setCategories(categoriesRes.categories || []);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load budget products
  useEffect(() => {
    const loadBudgetProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await productApi.getBudgetSelections();
        if (result.success && result.selections) {
          let selectedProductIds = [];
          
          switch (selectedBudget) {
            case 'under2000':
              selectedProductIds = result.selections.under2000 || [];
              break;
            case 'mid2000to5000':
              selectedProductIds = result.selections.mid2000to5000 || [];
              break;
            case 'mid5000to10000':
              selectedProductIds = result.selections.mid5000to10000 || [];
              break;
            case 'premium':
              selectedProductIds = result.selections.premium || [];
              break;
            default:
              selectedProductIds = result.selections.under2000 || [];
          }
          
          // Fetch all products and filter by selected IDs
          const allProductsRes = await productApi.getPublicProducts();
          if (allProductsRes.success) {
            let filtered = allProductsRes.products
              .filter(product => 
                selectedProductIds.includes(String(product.id || product._id)) && 
                product.isVisible !== false
              )
              .map(product => {
                // Normalize categories for each product
                const normalizedProduct = { ...product };
                if (product.categories) {
                  normalizedProduct.categories = normalizeCategories(product.categories);
                } else if (product.category) {
                  normalizedProduct.categories = normalizeCategories(product.category);
                } else {
                  normalizedProduct.categories = [];
                }
                return normalizedProduct;
              });
            
            // Sort by price ascending
            filtered.sort((a, b) => a.price - b.price);
            
            setProducts(filtered);
            setFilteredProducts(filtered);
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
        console.error('Error loading budget products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadBudgetProducts();
  }, [selectedBudget]);

  // Apply filters whenever filters change
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Category filter - Check if product has ANY of the selected categories
    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes("All")) {
      result = result.filter((product) => {
        if (!product.categories || product.categories.length === 0) return false;
        return product.categories.some(catId => selectedFilters.category.includes(catId));
      });
    }

    // Occasion filter
    if (selectedFilters.occasion.length > 0) {
      result = result.filter((product) =>
        product.occasion?.some((occ) => selectedFilters.occasion.includes(occ))
      );
    }

    // Offers only filter - using originalPrice pattern
    if (selectedFilters.offers.length > 0) {
      result = result.filter((product) => product.originalPrice && product.originalPrice > product.price);
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
      category: [],
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
      const displayPrice = product.price; // Use current price

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

  const productsWithOffers = products.filter((p) => p.originalPrice && p.originalPrice > p.price).length;

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
        {/* Budget Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4">
            {budgetNames[selectedBudget]}
          </h1>
          <p className="text-[#1C2526] max-w-2xl mx-auto">
            {budgetDescriptions[selectedBudget]}
          </p>
        </div>

        {/* Budget Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(budgetNames).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedBudget(key);
                setCurrentPage(1);
                setSelectedFilters({ category: [], occasion: [], offers: [] });
                navigate(`/products-by-budget?budget=${key}`);
              }}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                selectedBudget === key
                  ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white shadow-lg'
                  : 'bg-white text-[#800020] border-2 border-[#800020] hover:bg-[#800020]/10'
              }`}
            >
              {label}
            </button>
          ))}
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
              {(selectedFilters.category.length > 0 || selectedFilters.occasion.length > 0 || selectedFilters.offers.length > 0) && (
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
                    <input 
                      type="checkbox" 
                      className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                      checked={selectedFilters.category.includes("All")}
                      onChange={() => handleFilterChange('category', "All")}
                    />
                    <span className="ml-3 text-[#2E2E2E] text-sm">All Categories</span>
                  </label>
                  {categories.filter((cat) => cat.isActive !== false).map((category) => (
                    <label key={category.id} className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
                      <input 
                        type="checkbox" 
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.category.includes(category.id)}
                        onChange={() => handleFilterChange('category', category.id)}
                      />
                      <span className="ml-3 text-[#2E2E2E] text-sm">{category.name}</span>
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
                {(selectedFilters.category.length > 0 || selectedFilters.occasion.length > 0 || selectedFilters.offers.length > 0) && (
                  <span className="ml-2 bg-[#6B2D2D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedFilters.category.length + selectedFilters.occasion.length + selectedFilters.offers.length}
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
                    const { inStock, hasOffer, displayPrice, originalPrice, discountPercentage } = getProductOfferInfo(product);

                    return (
                      <Link
                        key={product.id}
                        to={`/viewdetails/${product.id}`}
                        className="block bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group border border-[#D9A7A7] cursor-pointer"
                      >
                        <div className="relative overflow-hidden">
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2 z-10">
                            {hasOffer && (
                              <div className="flex flex-col gap-1">
                            
                                <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                  {discountPercentage}% OFF
                                </span>
                              </div>
                            )}
                          </div>

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
                            className={`absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-300 ${
                              wishlistItems.includes(product.id)
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
                          <p className="text-[#2E2E2E] text-[11px] sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                            {product.description || '—'}
                          </p>

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
                                No Category
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 sm:mt-2 mb-2 sm:mb-3">
                            <span className="text-[#6B2D2D] font-bold text-sm sm:text-lg">
                              {formatPrice(displayPrice)}
                            </span>
                            {hasOffer && originalPrice && originalPrice > displayPrice && (
                              <>
                                <span className="text-[#2E2E2E] text-[10px] sm:text-sm line-through">
                                  {formatPrice(originalPrice)}
                                </span>
                                {/* <span className="bg-[#D9A7A7] text-[#800020] text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                  {discountPercentage}% OFF
                                </span> */}
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
                              className={`px-4 py-2 rounded-lg border ${
                                currentPage === pageNum
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

export default BudgetProducts;