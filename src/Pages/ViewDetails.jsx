import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import categoryApi from '../Services/CategoryApi';

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first
        const categoriesResult = await categoryApi.getPublicCategories();
        if (categoriesResult.success) {
          setCategories(categoriesResult.categories);
        }

        // Fetch product data
        const result = await productApi.getPublicProduct(id);
        if (result.success) {
          const p = result.product;
          setProduct(p);
          setQuantity(1); // Reset quantity on product change

          /* ---- Wishlist check ---- */
          if (authApi.isLoggedIn()) {
            try {
              const wl = await productApi.getWishlist();
              if (wl.success) {
                const inWishlist = wl.items.some(i => i.id === p.id);
                setIsInWishlist(inWishlist);
              }
            } catch (e) {
              console.error('Wishlist check failed', e);
            }
          }

          /* ---- Related products ---- */
          await fetchRelatedProducts(p.category, p.id);
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

  const fetchRelatedProducts = async (category, currentId) => {
    try {
      const res = await productApi.getPublicProducts();
      if (res.success) {
        const related = res.products
          .filter(p => p.category === category && p.id !== currentId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (e) {
      console.error('Related products error', e);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  CATEGORY NAME HELPER                                             */
  /* ------------------------------------------------------------------ */
  const getCategoryName = (categoryValue) => {
    if (!categoryValue) return 'N/A';
    
    // Try to find category by ID in the database categories
    const category = categories.find(cat => cat.id === categoryValue);
    
    if (category) {
      return category.name;
    }
    
    return 'N/A';
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
  /*  WISHLIST TOGGLE                                                  */
  /* ------------------------------------------------------------------ */
  const handleWishlistToggle = async () => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }

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
      toast.error(err.message || 'Wishlist error');
    }
  };

  /* ------------------------------------------------------------------ */
  /*  ADD TO CART (STOCK-SAFE)                                         */
  /* ------------------------------------------------------------------ */
  const handleAddToCart = async () => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }

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
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  /* ------------------------------------------------------------------ */
  /*  IMAGE ZOOM & THUMBNAILS                                          */
  /* ------------------------------------------------------------------ */
  const handleImageZoom = () => setZoomActive(!zoomActive);
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
          <p className="mt-4 text-[#2E2E2E]">Loading product...</p>
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
  /*  PRODUCT DETAILS                                                  */
  /* ------------------------------------------------------------------ */
  const productDetails = {
    material: product.material || 'Not specified',
    length: product.length || 'Standard 6.5 meters',
    weave: product.weave || 'Not specified',
    care: product.care || 'Dry Clean Only',
    weight: product.weight || 'Not specified',
    border: product.border || 'Not specified',
    origin: product.origin || 'Not specified',
  };

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                           */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ---------- IMAGE SECTION ---------- */}
          <div className="lg:w-1/2">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Badges Container */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {/* Product Badge */}
                {product.badge && (
                  <span className="bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                
                {/* Offer Badge */}
                {hasOffer && (
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.offerName || 'SPECIAL OFFER'}
                  </span>
                )}
              </div>

              <div className="relative h-[600px] overflow-hidden">
                <img
                  src={getSelectedImage()}
                  alt={product.name}
                  loading="lazy" 
                  decoding="async"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    zoomActive ? 'scale-150 cursor-zoom-out' : 'hover:scale-105 cursor-zoom-in'
                  }`}
                  onClick={handleImageZoom}
                  onError={e => (e.target.src = '/placeholder-image.jpg')}
                />
              </div>

              {/* Wishlist Heart */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all duration-300 ${
                  isInWishlist ? 'bg-[#6B2D2D] text-white' : 'bg-white text-[#6B2D2D] hover:bg-[#D9A7A7]'
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-4 mt-4 justify-center">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    loading="lazy"
                    decoding="async"
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedImageIndex === idx
                        ? 'border-[#6B2D2D] scale-110'
                        : 'border-[#D9A7A7] hover:border-[#6B2D2D]'
                    }`}
                    onClick={() => handleThumbnailClick(idx)}
                    onError={e => (e.target.src = '/placeholder-image.jpg')}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ---------- INFO SECTION ---------- */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-semibold text-[#2E2E2E] mb-4">{product.name}</h2>

              {/* STOCK DISPLAY */}
              {product.stock !== undefined && (
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {product.stock > 0 ? `${product.stock} left in stock` : 'Out of Stock'}
                  </span>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Low Stock!
                    </span>
                  )}
                </div>
              )}

              {/* OFFER BANNER */}
              {hasOffer && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      SPECIAL OFFER
                    </span>
                    <span className="text-green-800 font-medium text-sm">
                      {product.offerName}
                    </span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Limited time offer - Don't miss out!
                  </p>
                </div>
              )}

              {/* PRICE */}
              <div className="flex items-center mb-6">
                <span className="text-[#6B2D2D] font-bold text-2xl">
                  {formatPrice(displayPrice)}
                </span>
                
                {/* Show original price as strikethrough */}
                {showOriginalPrice && (
                  <>
                    <span className="text-[#2E2E2E] text-lg line-through ml-4">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="ml-4 bg-[#D9A7A7] text-[#800020] text-xs font-semibold px-3 py-1 rounded-full">
                      {Math.round(
                        ((originalPrice - displayPrice) / originalPrice) * 100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>

              {/* QUANTITY SELECTOR (ONLY IF IN STOCK) */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity === 1}
                      className="w-10 h-10 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="text-lg font-semibold text-[#2E2E2E]">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity}
                      className="w-10 h-10 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* TABS */}
              <div className="mb-6">
                <div className="flex border-b border-[#D9A7A7]">
                  {['description', 'details'].map(tab => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-colors duration-300 ${
                        activeTab === tab
                          ? 'text-[#6B2D2D] border-b-2 border-[#6B2D2D]'
                          : 'text-[#2E2E2E] hover:text-[#3A1A1A]'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-[#2E2E2E]">
                  {activeTab === 'description' && <p>{product.description}</p>}
                  {activeTab === 'details' && (
                    <ul className="space-y-2">
                      {Object.entries(productDetails).map(([k, v]) => (
                        <li key={k} className="flex">
                          <span className="font-medium capitalize w-1/3">{k}:</span>
                          <span>{v}</span>
                        </li>
                      ))}
                      {product.sizeGuide && (
                        <li className="flex">
                          <span className="font-medium capitalize w-1/3">Size Guide:</span>
                          <span>{product.sizeGuide}</span>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* OCCASION + CATEGORY */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Suitable For</h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion?.length ? (
                    product.occasion.map((occ, i) => (
                      <span
                        key={i}
                        className="bg-[#800020] text-white text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {occ}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#2E2E2E]">All occasions</span>
                  )}
                </div>
                <p className="text-[#2E2E2E] mt-2">
                  <span className="font-medium">Category:</span> {getCategoryName(product.category)}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isOutOfStock
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#800020] text-white hover:bg-[#3A1A1A]'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : `Add to Cart (${quantity})`}
                </button>
                <Link
                  to="/products"
                  className="flex-1 bg-white text-[#6B2D2D] px-6 py-3 rounded-lg font-medium hover:bg-[#800020] hover:text-white text-center transition-all duration-300 border-2 border-[#800020]"
                >
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- RELATED PRODUCTS ---------- */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-[#2E2E2E] mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(rp => {
                const relatedHasOffer = rp.hasOffer === true && rp.offerPrice && rp.offerPrice > 0;
                const relatedDisplayPrice = relatedHasOffer ? rp.offerPrice : rp.price;
                
                return (
                  <Link
                    to={`/viewdetails/${rp.id}`}
                    key={rp.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border border-[#D9A7A7] group"
                  >
                    <div className="relative">
                      {/* Badges Container */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {/* Product Badge */}
                        {rp.badge && (
                          <span className="bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {rp.badge}
                          </span>
                        )}
                        
                        {/* Offer Badge */}
                        {relatedHasOffer && (
                          <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {rp.offerName || 'OFFER'}
                          </span>
                        )}
                      </div>
                      
                      <img
                        src={rp.images?.[0] || '/placeholder-image.jpg'}
                        alt={rp.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={e => (e.target.src = '/placeholder-image.jpg')}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#3A1A1A] transition-colors duration-300">
                        {rp.name}
                      </h3>
                      
                      {/* Price Display for Related Products */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#6B2D2D] font-bold">
                          {formatPrice(relatedDisplayPrice)}
                        </span>
                        {relatedHasOffer && rp.price > relatedDisplayPrice && (
                          <span className="text-[#2E2E2E] text-sm line-through">
                            {formatPrice(rp.price)}
                          </span>
                        )}
                      </div>
                      
                      {rp.stock !== undefined && (
                        <p className={`text-xs mt-1 ${rp.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {rp.stock > 0 ? 'Available' : 'Out of Stock'}
                        </p>
                      )}
                      
                      {/* Display Category for Related Products */}
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          {getCategoryName(rp.category)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;