// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";
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
  const [homepageProducts, setHomepageProducts] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('all');
const [budgetProducts, setBudgetProducts] = useState([]);
const [budgetLoading, setBudgetLoading] = useState(false);


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

  useEffect(() => {
    const loadHomepageProducts = () => {
      try {
        const savedSettings = localStorage.getItem('homepage_products');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          const selectedIds = settings.selectedProductIds || [];
          const count = settings.count || 3;

          // Get selected products in order
          const selected = products
            .filter(p => selectedIds.includes(p.id || p._id) && p.isVisible !== false)
            .slice(0, count);

          setHomepageProducts(selected);
        } else {
          // Fallback: show first 3 visible products
          setHomepageProducts(products.filter(p => p.isVisible !== false).slice(0, 3));
        }
      } catch (error) {
        console.error('Error loading homepage products:', error);
        setHomepageProducts(products.filter(p => p.isVisible !== false).slice(0, 3));
      }
    };

    if (products.length > 0) {
      loadHomepageProducts();
    }
  }, [products]);

  // Auto slide carousel
  useEffect(() => {
    if (carouselSlides.length === 0 || isLoading) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselSlides.length, isLoading]);

  useEffect(() => {
  const filterProductsByBudget = () => {
    setBudgetLoading(true);
    
    // Get budget range
    let min = 0;
    let max = Infinity;
    
    switch(selectedBudget) {
      case 'under2000':
        min = 0;
        max = 2000;
        break;
      case '2000-5000':
        min = 2000;
        max = 5000;
        break;
      case '5000-10000':
        min = 5000;
        max = 10000;
        break;
      case 'premium':
        min = 10000;
        max = Infinity;
        break;
      default:
        min = 0;
        max = Infinity;
    }
    
    // Filter products by price range and visibility
    const filtered = products.filter(product => {
      if (product.isVisible === false) return false;
      
      const price = product.hasOffer && product.offerPrice 
        ? product.offerPrice 
        : product.price;
      
      return price >= min && price <= max;
    });
    
    // Limit to 8 products for display
    setBudgetProducts(filtered.slice(0, 8));
    setBudgetLoading(false);
  };
  
  if (products.length > 0) {
    filterProductsByBudget();
  }
}, [selectedBudget, products]);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://featurable.com/assets/v2/slider_default.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);


  const handleCollectionExplore = (collection) => {
    console.log('Exploring collection:', collection.name, 'Category ID:', collection.categoryId);

    if (collection.categoryId && collection.categoryId !== 'undefined' && collection.categoryName) {
      // Navigate to category products page with category name
      navigate(`/category/${encodeURIComponent(collection.categoryName)}`);
    } else {
      // Navigate to products page without filter
      navigate('/products');
    }
  };


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
        <div className="absolute inset-0 overflow-hidden">
          {carouselSlides.length > 0 ? (
            carouselSlides.map((slide, idx) => (
              <div
                key={slide.id || slide._id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title || brandName}
                  className="w-full h-full object-cover bg-transparent"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black/15"></div>
              </div>
            ))
          )
            : (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {collections.length > 0 ? (
              collections.map((collection, index) => (
                <div
                  key={collection.id || collection._id || index}
                  className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl mx-auto w-full"
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="overflow-hidden relative w-full" style={{ aspectRatio: '3/4' }}>
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                    <h3 className="text-2xl md:text-3xl font-cinzel font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] tracking-[0.1em] uppercase drop-shadow-md">
                      {collection.name}
                    </h3>
                    <p className="text-[#F5E6D3]/90 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 text-sm md:text-base leading-relaxed max-h-0 group-hover:max-h-48  ">
                      {collection.description || 'Beautifully crafted sarees'}
                    </p>

                    <button
                      onClick={() => handleCollectionExplore(collection)}
                      className="self-start bg-gradient-to-r from-[#800020] to-[#A0002A] text-white px-5 py-2 rounded-lg font-medium hover:from-[#A0002A] hover:to-[#800020] transition-all duration-300 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center shadow-md text-sm md:text-base"
                    >
                      <span>Explore</span>
                      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>

              ))
            ) : (
              Array(6).fill().map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl shadow-lg bg-white animate-pulse mx-auto w-full"
                  style={{ aspectRatio: '3/4' }}
                >
                  <div className="w-full h-full bg-gray-200" />
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

      {/* Budget Wise Collection Section */}
<section className="py-20 bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
        Shop by Budget
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
      </h2>
      <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg font-light">
        Find the perfect saree that fits your budget
      </p>
    </div>

    {/* Budget Filters */}
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {[
        { label: "All", value: "all", min: 0, max: Infinity },
        { label: "Under ₹2,000", value: "under2000", min: 0, max: 2000 },
        { label: "₹2,000 - ₹5,000", value: "2000-5000", min: 2000, max: 5000 },
        { label: "₹5,000 - ₹10,000", value: "5000-10000", min: 5000, max: 10000 },
        { label: "Premium (Above ₹10,000)", value: "premium", min: 10000, max: Infinity }
      ].map((budget) => (
        <button
          key={budget.value}
          onClick={() => setSelectedBudget(budget.value)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            selectedBudget === budget.value
              ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white shadow-lg'
              : 'bg-white text-[#800020] border-2 border-[#800020] hover:bg-[#800020]/10'
          }`}
        >
          {budget.label}
        </button>
      ))}
    </div>

    {/* Budget Products Display */}
    {budgetLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill().map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse shadow-xl" />
        ))}
      </div>
    ) : budgetProducts.length === 0 ? (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-600">No products available in this budget range</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {budgetProducts.map((product) => {
          const inStock = product.stock > 0;
          const hasOffer = product.hasOffer === true && product.offerPrice && product.offerPrice > 0;
          const displayPrice = hasOffer ? product.offerPrice : product.price;

          return (
            <div
              key={product.id || product._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#F8EDE3] to-[#F5E6D3]">
                {/* Wishlist Button */}
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#800020] hover:text-white transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                  title="Add to Wishlist"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Budget Badge */}
                {/* <div className="absolute top-3 left-3 z-20">
                  <span className="bg-[#800020] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    {displayPrice <= 2000 && "Budget Friendly"}
                    {displayPrice > 2000 && displayPrice <= 5000 && "Value Pick"}
                    {displayPrice > 5000 && displayPrice <= 10000 && "Premium"}
                    {displayPrice > 10000 && "Luxury"}
                  </span>
                </div> */}

                {/* Product Image */}
                <div className="h-64 overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    decoding="async"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-[#800020] transition-colors line-clamp-2 min-h-[50px]">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-[#800020]">
                    {formatPrice(displayPrice)}
                  </span>
                  {hasOffer && product.price > displayPrice && (
                    <>
                      <span className="text-gray-400 text-xs line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded">
                        {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-3">
                  {inStock ? (
                    <span className="text-green-600 text-xs font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-600 text-xs font-medium">Out of Stock</span>
                  )}
                </div>

                {/* View Button */}
                <Link to={`/viewdetails/${product.id || product._id}`}>
                  <button
                    className={`w-full py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                      inStock
                        ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:shadow-md'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!inStock}
                  >
                    {inStock ? 'View Details' : 'Out of Stock'}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* View More Button */}
    {budgetProducts.length > 0 && (
      <div className="text-center mt-12">
        <Link to="/products">
          <button className="bg-transparent border-2 border-[#800020] text-[#800020] px-8 py-3 rounded-xl font-semibold hover:bg-[#800020] hover:text-white transition-all duration-300">
            View All Products
          </button>
        </Link>
      </div>
    )}
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
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg font-light">
              Discover our newest arrivals, crafted with passion and precision
            </p>
          </div>

          {homepageProducts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill().map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-[500px] animate-pulse shadow-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homepageProducts.map((product, index) => {
                const inStock = product.stock > 0;
                const hasOffer = product.hasOffer === true && product.offerPrice && product.offerPrice > 0;
                const displayPrice = hasOffer ? product.offerPrice : product.price;

                return (
                  <div
                    key={product._id || product.id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {/* Premium Border Gradient on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#800020] via-[#A0002A] to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10"></div>

                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#F8EDE3] to-[#F5E6D3]">
                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleAddToWishlist(product)}
                        className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-[#800020] hover:text-white transition-all duration-300 transform hover:scale-110"
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

                      {/* Product Image with Zoom Effect */}
                      <div className="h-96 overflow-hidden relative">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          decoding="async"
                          loading="lazy"
                          onError={handleImageError}
                        />

                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 relative bg-white">
                      {/* Product Name */}
                      <h3 className="text-xl font-cinzel font-bold text-gray-800 mb-3 group-hover:text-[#800020] transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Product Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
                        {product.description || 'Exquisitely crafted saree blending tradition with contemporary elegance'}
                      </p>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-3 mb-5">
                        <span className="text-2xl font-bold text-[#800020]">
                          {formatPrice(displayPrice)}
                        </span>
                        {hasOffer && product.price > displayPrice && (
                          <>
                            <span className="text-gray-400 text-sm line-through">
                              {formatPrice(product.price)}
                            </span>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                              SAVE {Math.round(((product.price - displayPrice) / product.price) * 100)}%
                            </span>
                          </>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link to={`/viewdetails/${product.id || product._id}`}>
                        <button
                          className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 transform ${inStock
                              ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:shadow-lg hover:scale-105 active:scale-95'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                          disabled={!inStock}
                        >
                          {inStock ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Quick View
                            </span>
                          ) : (
                            'Out of Stock'
                          )}
                        </button>
                      </Link>
                    </div>

                    {/* Hover Effect Border Animation */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#800020]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link to="/products">
              <button className="relative overflow-hidden group bg-transparent border-2 border-[#800020] text-[#800020] px-10 py-4 rounded-xl text-lg font-cinzel font-semibold hover:text-white transition-all duration-300 shadow-md hover:shadow-xl">
                <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Complete Collection
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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


          <div className="w-5xl ">
            <div
              id="featurable-524add98-912b-4007-8796-37b799468010"
              data-featurable-async
            />
          </div>

        </div>
      </section>
    </div>
  );
};



export default Home;