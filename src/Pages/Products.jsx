
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';

const Products = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    price: [],
    occasion: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistItems, setWishlistItems] = useState([]); 
  const productsPerPage = 20;

  const categories = [
    "All",
    "Bridal",
    "Kanjivaram",
    "Silk",
    "Soft Silk",
    "Ikkat Silk",
    "Silk Dhoti",
    "Banaras",
    "Tussar",
    "Designer",
    "Fancy",
    "Cotton",
    "Daily Wear",
    "Lehenga",
    "Dress Material",
    "Readymade",
    "Sale",
  ];

  const occasions = ["Wedding", "Bridal", "Festival", "Party", "Formal", "Casual"];

  const prices = [
    { label: "Under ₹5,000", value: "0-5000" },
    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
    { label: "₹10,000 - ₹15,000", value: "10000-15000" },
    { label: "Over ₹15,000", value: "15000-100000" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productResult = await productApi.getPublicProducts();
        if (productResult.success) {
          setProducts(productResult.products);
          setFilteredProducts(productResult.products);
        } else {
          setError('Failed to fetch products');
        }

        if (authApi.isLoggedIn()) {
          try {
            const wishlistResult = await productApi.getWishlist();
            if (wishlistResult.success) {
              setWishlistItems(wishlistResult.items.map(item => item.id));
            }
          } catch (wishlistError) {
            console.error('Wishlist fetch failed:', wishlistError);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    let result = products;

    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes("All")) {
      result = result.filter(product => selectedFilters.category.includes(product.category));
    }

    if (selectedFilters.price.length > 0) {
      result = result.filter(product => {
        return selectedFilters.price.some(priceRange => {
          const [min, max] = priceRange.split('-').map(Number);
          return product.price >= min && product.price <= max;
        });
      });
    }

    if (selectedFilters.occasion.length > 0) {
      result = result.filter(product =>
        product.occasion && product.occasion.some(occ => selectedFilters.occasion.includes(occ))
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1); 
  }, [selectedFilters, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
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
    });
  };

  const handleWishlistToggle = async (product) => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first to add to wishlist!');
      navigate('/login');
      return;
    }

    try {
      const isInWishlist = wishlistItems.includes(product.id);
      if (isInWishlist) {
        await productApi.removeFromWishlist(product.id);
        setWishlistItems(prev => prev.filter(id => id !== product.id));
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        await productApi.addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images && product.images[0] ? product.images[0] : '/placeholder-image.jpg'
        });
        setWishlistItems(prev => [...prev, product.id]);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (err) {
      toast.error('Failed to update wishlist: ' + err.message);
    }
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const paginate = pageNumber => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B2D2D] mx-auto"></div>
          <p className="mt-4 text-[#2E2E2E]">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">Error loading products</h3>
          <p className="text-[#2E2E2E] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`md:w-1/4 ${
              filterOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'
            } md:block`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#2E2E2E]">Filters</h2>
                <div className="flex items-center">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#6B2D2D] hover:text-[#3A1A1A] mr-4"
                  >
                    Clear All
                  </button>
                  {filterOpen && (
                    <button
                      onClick={toggleFilter}
                      className="md:hidden text-[#2E2E2E] hover:text-[#3A1A1A]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Category</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.category.includes(category)}
                        onChange={() => handleFilterChange('category', category)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Price Range</h3>
                <div className="space-y-2">
                  {prices.map((price, index) => (
                    <label key={index} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
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
                  {occasions.map((occasion, index) => (
                    <label key={index} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                        checked={selectedFilters.occasion.includes(occasion)}
                        onChange={() => handleFilterChange('occasion', occasion)}
                      />
                      <span className="ml-3 text-[#2E2E2E]">{occasion}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Mobile Filter Toggle and Results Count */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={toggleFilter}
                className="md:hidden flex items-center bg-white px-4 py-2 rounded-lg shadow-sm text-[#6B2D2D] font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>
              <div className="text-[#2E2E2E]">
                Showing {currentProducts.length} of {filteredProducts.length} products
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group border border-[#D9A7A7]"
                  >
                    <div className="relative overflow-hidden">
                      {product.badge && (
                        <span className="absolute top-4 left-4 bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                          {product.badge}
                        </span>
                      )}
                      <div className="h-80 overflow-hidden">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all duration-300 ${
                          wishlistItems.includes(product.id)
                            ? 'bg-[#6B2D2D] text-white'
                            : 'bg-white text-[#6B2D2D] hover:bg-[#D9A7A7]'
                        }`}
                        aria-label={wishlistItems.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill={wishlistItems.includes(product.id) ? 'currentColor' : 'none'}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#3A1A1A] transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-[#2E2E2E] text-sm mb-3 line-clamp-2">{product.description}</p>

                      <div className="flex items-center mt-2 mb-3">
                        <span className="text-[#6B2D2D] font-bold text-lg">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[#2E2E2E] text-sm line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex">
                          {/* Stock indicator */}
                          {product.stock > 0 ? (
                            <span className="text-green-600 text-sm">In Stock</span>
                          ) : (
                            <span className="text-red-600 text-sm">Out of Stock</span>
                          )}
                        </div>
                        <Link to={`/viewdetails/${product.id}`}>
                          <button className="bg-[#800020] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6B2D2D] hover:text-white transition-all duration-300">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-[#2E2E2E] mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">No products found</h3>
                <p className="text-[#2E2E2E]">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="flex justify-center mt-16">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === page
                          ? 'bg-[#6B2D2D] text-white'
                          : 'text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
