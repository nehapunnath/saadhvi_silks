// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import GalleryApi from '../Services/GalleryApi';
import logo from '../assets/saadhvi_silks.png';

// Simple cache utility
const homeCache = {
  data: null,
  timestamp: null,
  expiry: 5 * 60 * 1000, // 5 minutes

  get() {
    if (this.timestamp && Date.now() - this.timestamp < this.expiry) {
      return this.data;
    }
    return null;
  },

  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },

  clear() {
    this.data = null;
    this.timestamp = null;
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [products, setProducts] = useState([]);
  const [mainGalleryImage, setMainGalleryImage] = useState(null);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const [mainImageError, setMainImageError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Brand constants
  const brandName = "Saadhvi Silks";
  const brandTagline = "Timeless Elegance in Every Thread";

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        console.time('Home page load');

        // Check cache first
        const cachedData = homeCache.get();
        if (cachedData) {
          setCarouselSlides(cachedData.carouselSlides);
          setMainGalleryImage(cachedData.mainGalleryImage);
          setCollections(cachedData.collections);
          setProducts(cachedData.products);
          setIsLoading(false);
          console.log('Loaded from cache');
          console.timeEnd('Home page load');
          return;
        }

        // Load all data in parallel with error handling for each
        const [slidesResult, mainImageResult, collectionsResult, productsResult] = await Promise.allSettled([
          GalleryApi.getPublicSlides(),
          GalleryApi.getPublicMainGalleryImage(),
          GalleryApi.getPublicCollections(),
          productApi.getPublicProducts()
        ]);

        // Process slides
        if (slidesResult.status === 'fulfilled') {
          setCarouselSlides(slidesResult.value?.slides || []);
        } else {
          console.error('Slides fetch error:', slidesResult.reason);
          toast.error('Failed to load carousel');
        }

        // Process main image
        if (mainImageResult.status === 'fulfilled') {
          setMainGalleryImage(mainImageResult.value?.image || null);
        } else {
          console.error('Main image fetch error:', mainImageResult.reason);
          setMainImageError(mainImageResult.reason?.message);
        }

        // Process collections
        if (collectionsResult.status === 'fulfilled') {
          setCollections(collectionsResult.value?.collections || []);
        } else {
          console.error('Collections fetch error:', collectionsResult.reason);
        }

        // Process products
        if (productsResult.status === 'fulfilled') {
          setProducts(productsResult.value?.products || []);
        } else {
          console.error('Products fetch error:', productsResult.reason);
          setError('Failed to load products');
        }

        // Save to cache
        homeCache.set({
          carouselSlides: slidesResult.status === 'fulfilled' ? slidesResult.value?.slides || [] : [],
          mainGalleryImage: mainImageResult.status === 'fulfilled' ? mainImageResult.value?.image || null : null,
          collections: collectionsResult.status === 'fulfilled' ? collectionsResult.value?.collections || [] : [],
          products: productsResult.status === 'fulfilled' ? productsResult.value?.products || [] : []
        });

        console.timeEnd('Home page load');

      } catch (err) {
        console.error('Critical error loading home data:', err);
        toast.error('Unable to load content. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();

    // Cleanup function
    return () => {
      // Clear any pending timeouts if needed
    };
  }, []);

  // Auto slide carousel
  useEffect(() => {
    if (carouselSlides.length === 0 || isLoading) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselSlides.length, isLoading]);

  const getUniqueOfferNames = () => {
    const offers = new Set();
    products.forEach((product) => {
      if (product.hasOffer && product.offerName) {
        offers.add(product.offerName);
      }
    });
    return Array.from(offers).slice(0, 8);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);

  const handleAddToWishlist = async (product) => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }

    try {
      await productApi.addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || logo,
      });
      toast.success(`${product.name} added to wishlist!`);
    } catch (err) {
      toast.error('Something Went Wrong !!!');
    }
  };

  const handleImageError = (e) => {
    e.target.src = logo; // fallback to brand logo
  };

  const handleRetry = () => {
    homeCache.clear();
    window.location.reload();
  };

  // Show error state if critical data failed to load
  if (error && carouselSlides.length === 0 && collections.length === 0 && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
        <div className="text-center p-8 max-w-md">
          <img src={logo} alt={brandName} className="w-32 mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-serif font-bold text-[#800020] mb-4">Unable to Load Content</h2>
          <p className="text-gray-600 mb-6">Please check your internet connection and try again.</p>
          <button
            onClick={handleRetry}
            className="bg-[#800020] text-white px-6 py-3 rounded-lg hover:bg-[#A0002A] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] overflow-hidden">

      {/* Hero Carousel Section */}
      {/* Hero Carousel Section */}
      <section className="relative h-[85vh] md:h-screen overflow-hidden">
        <div className="absolute inset-0">

          {carouselSlides.length > 0 ? (
            carouselSlides.map((slide, idx) => (
              <div
                key={slide.id || slide._id || idx}
                className={`absolute inset-0 transition-all duration-1000 ${idx === currentSlide
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 z-0"
                  }`}
              >
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">

                  {/* Blurred Background with Cinematic Zoom */}
                  <img
                    src={slide.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-105 animate-[zoom_8s_linear_infinite]"
                  />

                  {/*  Gradient Overlay (better than plain black) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/*  Main Image (FULL visible) */}
                  <img
                    src={slide.image}
                    alt={slide.title || brandName}
                    className="relative max-w-full max-h-full object-contain z-10"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    onError={handleImageError}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#800020]/90 to-[#A0002A]/80 flex items-center justify-center animate-pulse">
              <div className="text-center text-white px-6">
                <img
                  src={logo}
                  alt={brandName}
                  className="w-48 md:w-64 mx-auto mb-6 opacity-90"
                />
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">
                  {brandName}
                </h1>
                <p className="text-xl md:text-2xl opacity-90">
                  {brandTagline}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 🔹 Content */}
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="text-white max-w-4xl z-20">
            {carouselSlides.length > 0 && carouselSlides[currentSlide] ? (
              <>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg transition-all duration-700">
                  {carouselSlides[currentSlide].title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md transition-all duration-700">
                  {carouselSlides[currentSlide].subtitle}
                </p>
                <Link to="/products">
                  <button className="bg-[#800020] hover:bg-[#A0002A] text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                    {carouselSlides[currentSlide].cta || "Shop Now"}
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/products">
                <button className="bg-white text-[#800020] px-10 py-5 rounded-xl text-xl font-medium hover:bg-gray-100 transition-all shadow-2xl transform hover:-translate-y-1">
                  Explore Collection
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* 🔹 Dots Navigation */}
        {carouselSlides.length > 0 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>
        )}

        {/* 🔹 Arrows */}
        {carouselSlides.length > 1 && (
          <>
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition z-20"
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
                )
              }
            >
              ‹
            </button>

            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition z-20"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
              }
            >
              ›
            </button>
          </>
        )}
      </section>

      {/* Elegance Woven with Tradition Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#800020] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#800020] opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <span className="text-xs tracking-widest text-[#800020] font-semibold bg-[#F8EDE3] px-3 py-1 rounded-full shadow-sm">
              PREMIUM SILK SAREES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1C2526] mb-6 leading-tight">
              Elegance Woven <span className="text-[#800020] block mt-2">With Tradition</span>
            </h1>
            <p className="text-lg md:text-xl text-[#1C2526] mb-8 max-w-md leading-relaxed">
              Discover our exquisite collection of silk sarees, crafted with precision and love for the traditional art of weaving.
            </p>
            <Link to="/products">
              <button className="relative overflow-hidden group bg-gradient-to-r from-[#800020] to-[#A0002A] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center">
                  Explore Collection
                  <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#A0002A] to-[#800020] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </Link>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative group w-full max-w-md">
              {mainGalleryImage ? (
                <img
                  src={mainGalleryImage}
                  alt="Elegance Woven with Tradition"
                  className="rounded-2xl shadow-2xl w-full transform transition-all duration-700 group-hover:scale-105 object-cover h-96"
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
                  <img
                    src={logo}
                    alt={brandName}
                    className="w-32 md:w-48 opacity-70"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Saree Collections Section */}
      <section className="py-20 bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              Our Saree Collections
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">
              Discover the perfect blend of tradition and contemporary design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.length > 0 ? (
              collections.map((collection, index) => (
                <div
                  key={collection.id || collection._id || index}
                  className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl"
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="overflow-hidden h-80 relative">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/80 via-[#800020]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#800020] to-[#A0002A] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {collection.items || 'Collection'}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-[#F8EDE3] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {collection.description || 'Beautifully crafted sarees'}
                    </p>
                    <Link to="/products">
                      <button className="self-start bg-gradient-to-r from-[#800020] to-[#A0002A] text-white px-5 py-2 rounded-lg font-medium hover:from-[#A0002A] hover:to-[#800020] transition-all duration-300 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center shadow-md">
                        <span>Explore</span>
                        <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              Array(6).fill().map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl shadow-lg bg-white animate-pulse h-96"
                >
                  <div className="h-80 bg-gray-200" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="h-7 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="h-5 bg-gray-300 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-gray-300 rounded w-1/3" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Collection Section */}
      <section className="py-20 bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              Latest Collection
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">
              Our most loved sarees, cherished by women nationwide
            </p>
          </div>

          {error && products.length === 0 ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array(3).fill().map((_, i) => (
                <div key={i} className="bg-[#F8EDE3] rounded-2xl h-[480px] animate-pulse shadow-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => {
                const inStock = product.stock > 0;
                const hasOffer = product.hasOffer === true && product.offerPrice && product.offerPrice > 0;
                const displayPrice = hasOffer ? product.offerPrice : product.price;

                return (
                  <div
                    key={product._id || product.id}
                    className="bg-[#F8EDE3] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group border border-[#FDF6E3]"
                  >
                    <div className="relative overflow-hidden">
                      <span
                        className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md ${inStock ? 'bg-gradient-to-r from-[#800020] to-[#A0002A]' : 'bg-gray-600'
                          }`}
                      >
                        {inStock ? 'In Stock' : 'Sold Out'}
                      </span>

                      {hasOffer && (
                        <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md">
                          {product.offerName || 'OFFER'}
                        </span>
                      )}

                      <div className="h-80 overflow-hidden">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          decoding="async"
                          loading="lazy"
                          onError={handleImageError}
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#1C2526] mb-2 group-hover:text-[#800020] transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center mt-2 mb-4">
                        <span className="text-[#800020] font-bold text-lg">{formatPrice(displayPrice)}</span>
                        {hasOffer && product.price > displayPrice && (
                          <span className="text-[#1C2526] text-sm line-through ml-2">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Link to={`/viewdetails/${product.id || product._id}`} className="flex-1">
                          <button
                            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${inStock
                              ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:from-[#A0002A] hover:to-[#800020]'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              }`}
                            disabled={!inStock}
                          >
                            {inStock ? 'View Details' : 'Out of Stock'}
                          </button>
                        </Link>

                        {inStock && (
                          <button
                            onClick={() => handleAddToWishlist(product)}
                            className="p-3 bg-white border border-[#800020] rounded-lg hover:bg-[#800020] hover:text-white transition-colors"
                            title="Add to Wishlist"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/products">
              <button className="relative overflow-hidden group border-2 border-[#800020] text-[#800020] px-8 py-3 rounded-lg text-lg font-medium hover:text-white transition-all duration-300 shadow-md">
                <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
                <span className="relative z-10 flex items-center justify-center">
                  View All Sarees
                  <svg className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-12 bg-gradient-to-r from-[#800020] to-[#A0002A] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white text-center mb-8">
            Special Offers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getUniqueOfferNames().length > 0 ? (
              getUniqueOfferNames().map((offerName, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold">{offerName}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 flex flex-col items-center justify-center">

                <div className="relative px-10 py-6 rounded-2xl shadow-2xl 
                  bg-gradient-to-r from-[#800020] via-[#A0002A] to-[#C21833] 
                  border border-white/20 overflow-hidden">

                  <div className="absolute inset-0 bg-white/10 blur-xl opacity-30 animate-pulse"></div>
                  <p className="relative text-lg md:text-xl font-semibold text-white tracking-wide">
                    Exciting deals are on the way. Stay tuned!
                  </p>

                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              What Our Customers Say
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                location: 'Chennai',
                rating: 5,
                review:
                  'The Kanjivaram saree I bought was absolutely stunning! The quality and craftsmanship are unmatched.',
                image:
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
              },
              {
                name: 'Anita Rao',
                location: 'Hyderabad',
                rating: 5,
                review:
                  'I wore their bridal saree for my wedding, and it made me feel like a queen. Highly recommend!',
                image:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
              },
              {
                name: 'Meena Kapoor',
                location: 'Mumbai',
                rating: 4,
                review:
                  'The designer sarees are so unique. I get compliments every time I wear one!',
                image:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-[#F8EDE3] rounded-2xl p-6 shadow-lg border border-[#FDF6E3] group"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#1A4D3E] group-hover:border-[#800020] transition"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1C2526]">{t.name}</h3>
                    <p className="text-sm text-[#1C2526]">{t.location}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, j) => (
                        <svg
                          key={j}
                          className={`w-4 h-4 ${j < t.rating ? 'text-[#800020]' : 'text-[#1A4D3E]'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#1C2526] italic relative pl-6 before:content-['“'] before:absolute before:left-0 before:text-4xl before:text-[#1A4D3E] before:top-0 before:font-serif">
                  {t.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};



export default Home;