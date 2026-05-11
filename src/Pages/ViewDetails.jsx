import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import categoryApi from '../Services/CategoryApi';
import badgeApi from '../Services/BadgeApi';
import QuickLoginModal from '../Pages/QuickLogin';

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  // Add state for Quick Login Modal
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  const imageRef = useRef(null);
  const zoomRef = useRef(null);

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
    const category = categories.find(cat => String(cat.id) === cleanId);
    
    if (category) {
      return category.name;
    }
    
    return cleanId.substring(0, 8);
  };

  // Get category names array for multiple categories
  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return [];
    }
    
    const names = [];
    for (const id of categoryIds) {
      const name = getCategoryName(id);
      if (name !== 'N/A') {
        names.push(name);
      }
    }
    return names;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories + badges + product in parallel
        const [categoriesResult, badgesResult, productResult] = await Promise.all([
          categoryApi.getPublicCategories(),
          badgeApi.getPublicBadges ? badgeApi.getPublicBadges() : badgeApi.getBadges(),
          productApi.getPublicProduct(id),
        ]);

        if (categoriesResult.success) {
          setCategories(categoriesResult.categories || []);
        }

        setBadges(badgesResult.badges || []);

        if (productResult.success) {
          let p = productResult.product;
          
          // Normalize categories for the product (SAME AS ADMIN)
          let normalizedCategories = [];
          if (p.categories) {
            normalizedCategories = normalizeCategories(p.categories);
          } else if (p.category) {
            normalizedCategories = normalizeCategories(p.category);
          }
          
          // Special handling: If normalizedCategories has one item that still contains commas
          if (normalizedCategories.length === 1 && typeof normalizedCategories[0] === 'string' && normalizedCategories[0].includes(',')) {
            normalizedCategories = normalizedCategories[0].split(',').map(id => id.trim());
          }
          
          // Remove any empty strings
          normalizedCategories = normalizedCategories.filter(id => id && id.trim());
          
          p.categories = normalizedCategories;
          
          setProduct(p);
          setQuantity(1);

          // Wishlist check
          if (authApi.isLoggedIn()) {
            try {
              const wl = await productApi.getWishlist();
              if (wl.success) {
                setIsInWishlist(wl.items.some(i => i.id === p.id));
              }
            } catch (e) {
              console.error('Wishlist check failed', e);
            }
          }

          // Related products
          await fetchRelatedProducts(p.categories, p.id);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Helper: Get badge name from ID
  const getBadgeName = (badgeId) => {
    if (!badgeId) return null;
    const badge = badges.find(b => b.id === badgeId);
    return badge ? badge.name : 'N/A';
  };

  const fetchRelatedProducts = async (productCategories, currentId) => {
    try {
      const res = await productApi.getPublicProducts();
      if (res.success) {
        // Normalize related products categories
        const normalizedRelated = res.products.map(p => {
          let normalizedCategories = [];
          if (p.categories) {
            normalizedCategories = normalizeCategories(p.categories);
          } else if (p.category) {
            normalizedCategories = normalizeCategories(p.category);
          }
          
          if (normalizedCategories.length === 1 && typeof normalizedCategories[0] === 'string' && normalizedCategories[0].includes(',')) {
            normalizedCategories = normalizedCategories[0].split(',').map(id => id.trim());
          }
          normalizedCategories = normalizedCategories.filter(id => id && id.trim());
          
          return { ...p, categories: normalizedCategories };
        });
        
        // Find related products based on shared categories
        const related = normalizedRelated
          .filter(p => {
            if (p.id === currentId) return false;
            // Check if product shares at least one category
            return p.categories?.some(catId => productCategories?.includes(catId));
          })
          .slice(0, 4);
        
        setRelatedProducts(related);
      }
    } catch (e) {
      console.error('Related products error', e);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  HELPERS                                                          */
  /* ------------------------------------------------------------------ */
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const getSelectedImage = () => {
    if (!product?.images?.length) return '/placeholder-image.jpg';
    return product.images[selectedImageIndex] || product.images[0];
  };

  const isOutOfStock = product?.stock === 0;
  const maxQuantity = product?.stock || 0;

  // Offer related helpers
  const hasOffer = product?.hasOffer === true && product?.offerPrice && product.offerPrice > 0;
  const displayPrice = hasOffer ? product.offerPrice : product?.price;
  const originalPrice = hasOffer ? product.price : product?.originalPrice;
  const showOriginalPrice = originalPrice && originalPrice > displayPrice;

  /* ------------------------------------------------------------------ */
  /*  IMAGE CAROUSEL NAVIGATION                                        */
  /* ------------------------------------------------------------------ */
  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => {
      const newIndex = prev === 0 ? product.images.length - 1 : prev - 1;
      setZoomActive(false);
      return newIndex;
    });
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => {
      const newIndex = prev === product.images.length - 1 ? 0 : prev + 1;
      setZoomActive(false);
      return newIndex;
    });
  };

  /* ------------------------------------------------------------------ */
  /*  QUANTITY HANDLERS (STOCK-CAPPED)                                 */
  /* ------------------------------------------------------------------ */
  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxQuantity) {
        toast.error(`Only ${maxQuantity} left in stock!`);
        return prev;
      }
      return next;
    });
  };

  /* ------------------------------------------------------------------ */
  /*  WISHLIST TOGGLE WITH QUICK LOGIN                                 */
  /* ------------------------------------------------------------------ */
  const handleWishlistToggle = async () => {
    if (!authApi.isLoggedIn()) {
      // Store the action to perform after login
      setPendingAction(() => async () => {
        await performWishlistToggle();
      });
      setShowQuickLogin(true);
      return;
    }

    await performWishlistToggle();
  };

  const performWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await productApi.removeFromWishlist(product.id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        const priceToUse = hasOffer ? product.offerPrice : product.price;
        await productApi.addToWishlist({
          id: product.id,
          name: product.name,
          price: priceToUse,
          image: product.images?.[0] || '/placeholder-image.jpg',
        });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error('Something Went Wrong !!!');
    }
  };

  /* ------------------------------------------------------------------ */
  /*  ADD TO CART WITH QUICK LOGIN                                     */
  /* ------------------------------------------------------------------ */
  const handleAddToCart = async () => {
    if (!authApi.isLoggedIn()) {
      // Store the action to perform after login
      setPendingAction(() => async () => {
        await performAddToCart();
      });
      setShowQuickLogin(true);
      return;
    }

    await performAddToCart();
  };

  const performAddToCart = async () => {
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} available`);
      return;
    }

    try {
      const priceToUse = hasOffer ? product.offerPrice : product.price;
      await productApi.addToCart({
        id: product.id,
        name: product.name,
        price: priceToUse,
        image: product.images?.[0] || '/placeholder-image.jpg',
        quantity,
      });
      toast.success(`${quantity} × ${product.name} added to cart!`);
    } catch (err) {
      toast.error('Something Went Wrong !!!');
    }
  };

  /* ------------------------------------------------------------------ */
  /*  QUICK LOGIN SUCCESS HANDLER                                      */
  /* ------------------------------------------------------------------ */
  const handleQuickLoginSuccess = async () => {
    // After successful login, refresh wishlist status
    if (product && authApi.isLoggedIn()) {
      try {
        const wl = await productApi.getWishlist();
        if (wl.success) {
          setIsInWishlist(wl.items.some(i => i.id === product.id));
        }
      } catch (e) {
        console.error('Wishlist check failed', e);
      }
    }
    
    // Execute the pending action if any
    if (pendingAction) {
      await pendingAction();
      setPendingAction(null);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  ENHANCED IMAGE ZOOM FUNCTIONALITY                                */
  /* ------------------------------------------------------------------ */
  const handleImageClick = () => {
    setZoomActive(!zoomActive);
  };

  const handleMouseMove = (e) => {
    if (!zoomActive || !imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    const clampedX = Math.min(100, Math.max(0, x));
    const clampedY = Math.min(100, Math.max(0, y));
    
    setZoomPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    if (zoomActive) {
      setZoomActive(false);
    }
  };

  const handleThumbnailClick = (idx) => {
    setSelectedImageIndex(idx);
    setZoomActive(false);
  };

  /* ------------------------------------------------------------------ */
  /*  LOADING / ERROR / NOT FOUND                                      */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B2D2D] mx-auto" />
          <p className="mt-4 text-[#2E2E2E]">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">Error</h3>
          <p className="text-[#2E2E2E] mb-4">{error}</p>
          <Link to="/products" className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">Product not found</h3>
          <Link to="/products" className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  PRODUCT DETAILS IN SPECIFIED ORDER                               */
  /*  1. Material, 2. Work, 3. Body Color, 4. Blouse Color,           */
  /*  5. Type, 6. Length, 7. Care Instructions, Border                */
  /* ------------------------------------------------------------------ */
  const productDetails = {
    material: product.material || 'Not specified',
    work: product.work || 'Not specified',
    bodyColor: product.bodyColor || 'Not specified',
    blouseColor: product.blouseColor || 'Not specified',
    type: product.type || 'Not specified',
    length: product.length || 'Not specified',
    care: product.care || 'Not specified',
  };

  const hasMultipleImages = product?.images?.length > 1;
  const categoryNames = getCategoryNames(product.categories || []);

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                           */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#FDF8F5] to-[#F7F0E8] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb Navigation */}
        {/* <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 md:mb-8">
          <Link to="/" className="hover:text-[#800020] transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/products" className="hover:text-[#800020] transition-colors">Products</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#800020] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav> */}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* ========== IMAGE SECTION ========== */}
          <div className="lg:w-1/2">
            <div className="sticky top-24">
              {/* Main Image Container */}
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Badges Container */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  {product.badge && getBadgeName(product.badge) && (
                    <span className="bg-gradient-to-r from-[#800020] to-[#A0002A] text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 rounded-full shadow-lg">
                      {getBadgeName(product.badge)}
                    </span>
                  )}
                  {hasOffer && (
                    <span className="bg-gradient-to-r from-green-600 to-green-500 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 rounded-full shadow-lg">
                      {product.offerName || 'SPECIAL OFFER'}
                    </span>
                  )}
                </div>

                {/* Navigation Buttons */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-[#800020] p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-[#800020] p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-black/70 text-white text-xs md:text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-4 right-4 z-20 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 ${
                    isInWishlist 
                      ? 'bg-[#800020] text-white' 
                      : 'bg-white/90 text-[#800020] hover:bg-[#800020] hover:text-white'
                  }`}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-6 md:w-6"
                    fill={isInWishlist ? 'currentColor' : 'none'}
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

                {/* Main Image with Zoom */}
                <div 
                  className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-zoom-in bg-[#F5F0EB]"
                  ref={imageRef}
                  onClick={handleImageClick}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {!zoomActive ? (
                    <img
                      src={getSelectedImage()}
                      alt={product.name}
                      loading="lazy" 
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={e => (e.target.src = '/placeholder-image.jpg')}
                    />
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${getSelectedImage()})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '200%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="mt-4">
                  <div className="grid grid-cols-6 gap-2 md:gap-3">
                    {product.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                          selectedImageIndex === idx
                            ? 'border-[#800020] shadow-md'
                            : 'border-gray-200 hover:border-[#D9A7A7]'
                        }`}
                        onClick={() => handleThumbnailClick(idx)}
                      >
                        <img
                          src={img}
                          loading="lazy"
                          decoding="async"
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          className="w-full aspect-square object-cover"
                          onError={e => (e.target.src = '/placeholder-image.jpg')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== INFO SECTION ========== */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              
              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#1C2526] mb-3 leading-tight">
                {product.name}
              </h1>

               <div className="flex flex-wrap gap-2 mb-4">
                  {categoryNames.length > 0 ? (
                    categoryNames.map((catName, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-200"
                      >
                        {catName}
                      </span>
                    ))
                  ) : (
                    <span className="inline-block bg-gray-100 text-gray-500 text-sm font-medium px-3 py-1.5 rounded-full">
                      No Category
                    </span>
                  )}
                </div>

              {/* Stock Status */}
              <div className="mb-4">
                {!isOutOfStock ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      In Stock
                    </span>
                    {product.stock <= 5 && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        Only {product.stock} left!
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Offer Banner */}
              {hasOffer && (
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      SPECIAL OFFER
                    </span>
                    <span className="text-green-800 font-medium text-sm">
                      {product.offerName}
                    </span>
                  </div>
                  <p className="text-green-700 text-sm">
                    🎉 Limited time offer - Don't miss out!
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl md:text-4xl font-bold text-[#800020]">
                    {formatPrice(displayPrice)}
                  </span>
                  {showOriginalPrice && (
                    <>
                      <span className="text-gray-400 text-lg line-through">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="bg-[#D9A7A7] text-[#800020] text-sm font-semibold px-3 py-1 rounded-full">
                        {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-[#2E2E2E] mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity === 1}
                      className="w-10 h-10 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="text-xl font-semibold text-[#2E2E2E] min-w-[40px] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity}
                      className="w-10 h-10 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : `Add to Cart (${quantity})`}
                </button>
                <Link
                  to="/products"
                  className="flex-1 bg-white text-[#800020] px-6 py-3 rounded-xl font-semibold hover:bg-[#800020] hover:text-white text-center transition-all duration-300 border-2 border-[#800020]"
                >
                  Browse More Products
                </Link>
              </div>

              {/* Product Details Accordion Style */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2E2E2E] flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#800020]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Product Specifications
                </h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  {Object.entries(productDetails).map(([key, value], idx) => {
                    let label = key;
                    if (key === 'bodyColor') label = 'Body Color';
                    if (key === 'blouseColor') label = 'Blouse Color';
                    if (key === 'care') label = 'Care Instructions';
                    label = label.charAt(0).toUpperCase() + label.slice(1);
                    
                    return (
                      <div 
                        key={key} 
                        className={`flex flex-col sm:flex-row sm:items-center py-3 px-4 ${
                          idx !== Object.entries(productDetails).length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <span className="font-semibold text-gray-700 sm:w-2/5 mb-1 sm:mb-0">{label}:</span>
                        <span className="text-gray-600 sm:w-3/5">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Occasion Tags */}
              <div className="mt-6">
                <h3 className="text-base font-semibold text-[#2E2E2E] mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#800020]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Perfect For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion?.length ? (
                    product.occasion.map((occ, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-[#800020]/10 to-[#A0002A]/10 text-[#800020] text-sm font-medium px-3 py-1.5 rounded-full border border-[#800020]/20"
                      >
                        {occ}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">All occasions</span>
                  )}
                </div>
              </div>

              {/* Categories */}
              {/* <div className="mt-6">
                <h3 className="text-base font-semibold text-[#2E2E2E] mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#800020]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                  </svg>
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryNames.length > 0 ? (
                    categoryNames.map((catName, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-200"
                      >
                        {catName}
                      </span>
                    ))
                  ) : (
                    <span className="inline-block bg-gray-100 text-gray-500 text-sm font-medium px-3 py-1.5 rounded-full">
                      No Category
                    </span>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* ========== RELATED PRODUCTS ========== */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#1C2526] mb-3">
                You May Also Like
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {relatedProducts.map(rp => {
                const relatedHasOffer = rp.hasOffer === true && rp.offerPrice && rp.offerPrice > 0;
                const relatedDisplayPrice = relatedHasOffer ? rp.offerPrice : rp.price;
                const relatedOriginalPrice = relatedHasOffer ? rp.price : rp.originalPrice;
                const relatedCategoryNames = getCategoryNames(rp.categories || []);
                const relatedBadgeName = getBadgeName(rp.badge);
                
                return (
                  <Link
                    to={`/viewdetails/${rp.id}`}
                    key={rp.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-[#D9A7A7]/30 hover:border-[#D9A7A7]"
                  >
                    <div className="relative overflow-hidden">
                      {/* Badges */}
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {relatedBadgeName && (
                          <span className="bg-gradient-to-r from-[#800020] to-[#A0002A] text-white text-[10px] md:text-xs font-semibold px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                            {relatedBadgeName}
                          </span>
                        )}
                        {relatedHasOffer && (
                          <span className="bg-green-600 text-white text-[10px] md:text-xs font-semibold px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                            OFFER
                          </span>
                        )}
                      </div>
                      
                      <img
                        src={rp.images?.[0] || '/placeholder-image.jpg'}
                        alt={rp.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={e => (e.target.src = '/placeholder-image.jpg')}
                      />
                    </div>
                    
                    <div className="p-3 md:p-4">
                      <h3 className="text-sm md:text-base font-semibold text-[#2E2E2E] mb-1 group-hover:text-[#800020] transition-colors line-clamp-2">
                        {rp.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[#800020] font-bold text-sm md:text-base">
                          {formatPrice(relatedDisplayPrice)}
                        </span>
                        {relatedHasOffer && relatedOriginalPrice > relatedDisplayPrice && (
                          <span className="text-gray-400 text-xs line-through">
                            {formatPrice(relatedOriginalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {/* Category tags */}
                      {relatedCategoryNames.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {relatedCategoryNames.slice(0, 2).map((catName, idx) => (
                            <span key={idx} className="inline-block bg-gray-100 text-gray-600 text-[9px] md:text-xs font-medium px-1.5 py-0.5 rounded">
                              {catName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Login Modal */}
      <QuickLoginModal
        isOpen={showQuickLogin}
        onClose={() => {
          setShowQuickLogin(false);
          setPendingAction(null);
        }}
        onSuccess={handleQuickLoginSuccess}
      />
    </div>
  );
};

export default ViewDetails;