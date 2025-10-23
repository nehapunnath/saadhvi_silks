import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await productApi.getPublicProduct(id);
        if (result.success) {
          setProduct(result.product);
          if (authApi.isLoggedIn()) {
            try {
              const wishlistResult = await productApi.getWishlist();
              if (wishlistResult.success) {
                const isWishlisted = wishlistResult.items.some(item => item.id === result.product.id);
                setIsInWishlist(isWishlisted);
              }
            } catch (wishlistError) {
              console.error('Wishlist check failed:', wishlistError);
            }
          }
          await fetchRelatedProducts(result.product.category, result.product.id);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const result = await productApi.getPublicProducts();
      if (result.success) {
        const related = result.products
          .filter(p => p.category === category && p.id !== currentProductId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleImageZoom = () => {
    setZoomActive(!zoomActive);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    setZoomActive(false);
  };

  const handleWishlistToggle = async () => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first to add to wishlist!');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await productApi.removeFromWishlist(product.id);
        setIsInWishlist(false);
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        await productApi.addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images && product.images[0] ? product.images[0] : '/placeholder-image.jpg'
        });
        setIsInWishlist(true);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (err) {
      toast.error('Failed to update wishlist: ' + err.message);
    }
  };

  // 🔥 Add to Cart Handler
  const handleAddToCart = async () => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first to add to cart!');
      navigate('/login');
      return;
    }

    try {
      await productApi.addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images[0] ? product.images[0] : '/placeholder-image.jpg',
        quantity
      });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error('Failed to add to cart: ' + err.message);
    }
  };

  const getSelectedImage = () => {
    if (!product || !product.images || product.images.length === 0) {
      return '/placeholder-image.jpg';
    }
    return product.images[selectedImageIndex] || product.images[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B2D2D] mx-auto"></div>
          <p className="mt-4 text-[#2E2E2E]">Loading product details...</p>
        </div>
      </div>
    );
  }

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
          <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">Error loading product</h3>
          <p className="text-[#2E2E2E] mb-4">{error}</p>
          <Link
            to="/products"
            className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center">
        <div className="text-center">
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
          <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">Product not found</h3>
          <Link
            to="/products"
            className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const productDetails = {
    material: product.material || 'Not specified',
    length: product.length || 'Standard 6.5 meters',
    weave: product.weave || 'Not specified',
    care: product.care || 'Dry Clean Only',
    weight: product.weight || 'Not specified',
    border: product.border || 'Not specified',
    origin: product.origin || 'Not specified'
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  {product.badge}
                </span>
              )}
              <div className="relative h-[600px] overflow-hidden">
                <img
                  src={getSelectedImage()}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    zoomActive ? 'scale-150 cursor-zoom-out' : 'hover:scale-105 cursor-zoom-in'
                  }`}
                  onClick={handleImageZoom}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
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
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 mt-4 justify-center">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedImageIndex === index 
                        ? 'border-[#6B2D2D] scale-110' 
                        : 'border-[#D9A7A7] hover:border-[#6B2D2D]'
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-semibold text-[#2E2E2E] mb-4">{product.name}</h2>
              {product.stock !== undefined && (
                <div className="mb-4">
                  {!isOutOfStock ? (
                    <span className="text-green-600 font notification-medium">Available</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
              )}
              <div className="flex items-center mb-6">
                <span className="text-[#6B2D2D] font-bold text-2xl">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-[#2E2E2E] text-lg line-through ml-4">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="ml-4 bg-[#D9A7A7] text-[#800020] text-xs font-semibold px-3 py-1 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              {!isOutOfStock && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                      disabled={quantity === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="text-lg font-semibold text-[#2E2E2E]">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
                      aria-label="Increase quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <div className="mb-6">
                <div className="flex border-b border-[#D9A7A7]">
                  {['description', 'details'].map((tab) => (
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
                      {Object.entries(productDetails).map(([key, value]) => (
                        <li key={key} className="flex">
                          <span className="font-medium capitalize w-1/3">{key}:</span>
                          <span>{value}</span>
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
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Suitable For</h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion && product.occasion.length > 0 ? (
                    product.occasion.map((occasion, index) => (
                      <span
                        key={index}
                        className="bg-[#800020] text-white text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {occasion}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#2E2E2E]">All occasions</span>
                  )}
                </div>
                <p className="text-[#2E2E2E] mt-2">
                  <span className="font-medium">Category:</span> {product.category || 'Not specified'}
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isOutOfStock 
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#800020] text-white hover:bg-[#3A1A1A]'
                  }`}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <Link
                  to="/products"
                  className="flex-1 bg-[white] text-[#6B2D2D] px-6 py-3 rounded-lg font-medium hover:bg-[#800020] hover:text-white text-center transition-all duration-300 border border-3 border-[#800020]"
                >
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-[#2E2E2E] mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  to={`/products/${relatedProduct.id}`}
                  key={relatedProduct.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border border-[#D9A7A7] group"
                >
                  <div className="relative">
                    {relatedProduct.badge && (
                      <span className="absolute top-4 left-4 bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                        {relatedProduct.badge}
                      </span>
                    )}
                    <img
                      src={relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : '/placeholder-image.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#3A1A1A] transition-colors duration-300">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-[#6B2D2D] font-bold">{formatPrice(relatedProduct.price)}</p>
                    {relatedProduct.stock !== undefined && (
                      <p className={`text-xs mt-1 ${relatedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {relatedProduct.stock > 0 ? 'Available' : 'Out of Stock'}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;