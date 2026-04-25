// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  const [selectedBudget, setSelectedBudget] = useState('under2000');
  const [budgetProducts, setBudgetProducts] = useState([]);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [selectedOfferForModal, setSelectedOfferForModal] = useState(null);
  const [offerProductsModal, setOfferProductsModal] = useState(false);
  const [offerProducts, setOfferProducts] = useState([]);
  const [offerProductsLoading, setOfferProductsLoading] = useState(false);

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };
  
  // Brand constants
  const brandName = "Saadhvi Silks";
  const brandTagline = "Timeless Elegance in Every Thread";

  const getProductOfferInfo = (product) => {
    const inStock = product?.stock > 0;
    const hasAdminOffer = product?.hasOffer === true && product?.offerName && product?.offerPrice && product?.offerPrice < product?.price;
    const hasNormalDiscount = !hasAdminOffer && product?.originalPrice && product?.originalPrice > product?.price;
    const hasOffer = hasAdminOffer || hasNormalDiscount;

    let displayPrice;
    let originalPrice;
    let discountPercentage;
    let offerName;

    if (hasAdminOffer) {
      displayPrice = product.offerPrice;
      originalPrice = product.price;
      discountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
      offerName = product.offerName;
    } else if (hasNormalDiscount) {
      displayPrice = product.price;
      originalPrice = product.originalPrice;
      discountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
      offerName = null;
    } else {
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

  // Load special offers from backend
  useEffect(() => {
    const loadSpecialOffers = async () => {
      try {
        setOffersLoading(true);
        const result = await productApi.getActiveOffersWithProducts();
        if (result.success) {
          setSpecialOffers(result.offers || []);
        }
      } catch (error) {
        console.error('Error loading special offers:', error);
      } finally {
        setOffersLoading(false);
      }
    };

    loadSpecialOffers();
  }, []);

  // Load products for a specific offer
  const handleViewOfferProducts = async (offer) => {
    setSelectedOfferForModal(offer);
    setOfferProductsModal(true);
    setOfferProductsLoading(true);

    try {
      const result = await productApi.getProductsByOffer(offer.id);
      if (result.success) {
        setOfferProducts(result.products || []);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading offer products:', error);
      toast.error('Failed to load products');
    } finally {
      setOfferProductsLoading(false);
    }
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        console.time('Home page load');

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

        const [slidesResult, mainImageResult, collectionsResult, productsResult] = await Promise.allSettled([
          GalleryApi.getPublicSlides(),
          GalleryApi.getPublicMainGalleryImage(),
          GalleryApi.getPublicCollections(),
          productApi.getPublicProducts()
        ]);

        if (slidesResult.status === 'fulfilled') {
          setCarouselSlides(slidesResult.value?.slides || []);
        } else {
          console.error('Slides fetch error:', slidesResult.reason);
          toast.error('Failed to load carousel');
        }

        if (mainImageResult.status === 'fulfilled') {
          setMainGalleryImage(mainImageResult.value?.image || null);
        } else {
          console.error('Main image fetch error:', mainImageResult.reason);
          setMainImageError(mainImageResult.reason?.message);
        }

        if (collectionsResult.status === 'fulfilled') {
          setCollections(collectionsResult.value?.collections || []);
        } else {
          console.error('Collections fetch error:', collectionsResult.reason);
        }

        if (productsResult.status === 'fulfilled') {
          setProducts(productsResult.value?.products || []);
        } else {
          console.error('Products fetch error:', productsResult.reason);
          setError('Failed to load products');
        }

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

    return () => {};
  }, []);

  useEffect(() => {
    const loadHomepageProducts = async () => {
      try {
        const settingsResult = await productApi.getHomepageSettings();
        if (settingsResult.success && settingsResult.settings) {
          const selectedIds = settingsResult.settings.selectedProductIds || [];
          const count = settingsResult.settings.count || 3;

          const selected = products
            .filter(p => selectedIds.includes(String(p.id || p._id)) && p.isVisible !== false)
            .slice(0, count);

          setHomepageProducts(selected);
        } else {
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

  useEffect(() => {
    const loadBudgetProducts = async () => {
      setBudgetLoading(true);

      try {
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

          let filtered = products
            .filter(product => selectedProductIds.includes(String(product.id || product._id)) && product.isVisible !== false);

          filtered.sort((a, b) => {
            const getPrice = (product) => {
              return product.hasOffer && product.offerPrice ? product.offerPrice : product.price;
            };
            return getPrice(a) - getPrice(b);
          });

          setBudgetProducts(filtered.slice(0, 6));
        } else {
          setBudgetProducts([]);
        }
      } catch (error) {
        console.error('Error loading budget products:', error);
        setBudgetProducts([]);
      } finally {
        setBudgetLoading(false);
      }
    };

    if (products.length > 0) {
      loadBudgetProducts();
    }
  }, [selectedBudget, products]);

  // Auto slide carousel
  useEffect(() => {
    if (carouselSlides.length === 0 || isLoading) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselSlides.length, isLoading]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://featurable.com/assets/v2/slider_default.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCollectionExplore = (collection) => {
    console.log('Exploring collection:', collection.name, 'Category ID:', collection.categoryId);

    if (collection.categoryId && collection.categoryId !== 'undefined' && collection.categoryName) {
      navigate(`/category/${encodeURIComponent(collection.categoryName)}`);
    } else {
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
    e.target.src = logo;
  };

  const handleRetry = () => {
    homeCache.clear();
    window.location.reload();
  };

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
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={slide.image}
            alt={slide.title || brandName}
            className="w-full h-full object-cover"
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
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

  {/* Content positioned at bottom center */}
  <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-20 lg:pb-28 z-20">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-end text-center max-w-4xl mx-auto">
        {carouselSlides.length > 0 && carouselSlides[currentSlide] ? (
          <div className="space-y-4 md:space-y-6 w-full">
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold px-4 transition-all duration-700"
              style={{
                color: '#FFD700',
                textShadow: '0 2px 15px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em'
              }}
            >
              {carouselSlides[currentSlide].title}
            </h1>

            <div className="px-6">
              <p 
                className="text-base md:text-xl lg:text-2xl font-light max-w-2xl mx-auto transition-all duration-700"
                style={{
                  color: '#FFFFFF',
                  textShadow: '0 1px 8px rgba(0,0,0,0.3)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '2rem',
                  display: 'inline-block',
                  letterSpacing: '0.01em'
                }}
              >
                {carouselSlides[currentSlide].subtitle}
              </p>
            </div>

            <div className="pt-2 md:pt-4">
              <Link to="/products">
                <button 
                  className="group relative overflow-hidden px-8 py-3 md:px-10 md:py-3.5 rounded-lg text-base md:text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                    color: '#800020',
                    border: 'none',
                    minWidth: '180px'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {carouselSlides[currentSlide].cta || "Shop Now"}
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <Link to="/products">
            <button className="bg-white text-[#800020] px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-all shadow-2xl transform hover:-translate-y-1">
              Explore Collection
            </button>
          </Link>
        )}
      </div>
    </div>
  </div>

  {/* Carousel indicators */}
  {carouselSlides.length > 0 && (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 z-20">
      {carouselSlides.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentSlide(i)}
          className={`transition-all duration-300 rounded-full ${
            i === currentSlide
              ? "w-10 h-2.5 bg-white shadow-lg"
              : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80 hover:scale-110"
          }`}
        />
      ))}
    </div>
  )}

  {/* Navigation arrows */}
  {carouselSlides.length > 1 && (
    <>
      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 z-20 hover:scale-110"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 z-20 hover:scale-110"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
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
                  <img src={logo} alt={brandName} className="w-32 md:w-48 opacity-70" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Our Saree Collections Section */}
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

          <div className="relative group">
            {collections.length > 3 && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#800020] text-[#800020] hover:text-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0"
                style={{ transform: 'translateY(-50%)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {collections.length > 3 && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#800020] text-[#800020] hover:text-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
                style={{ transform: 'translateY(-50%)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#F9F3F3] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#F9F3F3] to-transparent z-10 pointer-events-none"></div>
            
            <div ref={scrollContainerRef} className="overflow-x-auto overflow-y-visible pb-6 scroll-smooth">
              <div className="flex gap-8 md:gap-12 lg:gap-16 min-w-max px-4">
                {collections.length > 0 ? (
                  collections.map((collection, index) => (
                    <div
                      key={collection.id || collection._id || index}
                      className="group relative flex flex-col items-center cursor-pointer w-[280px] md:w-[320px] lg:w-[360px]"
                      onClick={() => handleCollectionExplore(collection)}
                    >
                      <div className="relative mb-6 pt-4">
                        <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                          <div 
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#800020] via-[#A0002A] to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ padding: '3px' }}
                          >
                            <div className="w-full h-full rounded-full bg-white"></div>
                          </div>
                          
                          <div className="w-full h-full rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className="w-full h-full object-cover transition-transform duration-700"
                              loading="lazy"
                              decoding="async"
                              onError={handleImageError}
                            />
                          </div>
                          
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#800020] to-[#A0002A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            {collection.items || 'Collection'}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-cinzel font-bold text-[#1C2526] mb-2 text-center group-hover:text-[#800020] transition-colors duration-300">
                        {collection.name}
                      </h3>
                      
                      
                    </div>
                  ))
                ) : (
                  Array(6).fill().map((_, i) => (
                    <div key={i} className="flex flex-col items-center w-[280px] md:w-[320px] lg:w-[360px]">
                      <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-gray-200 animate-pulse shadow-lg mb-4" />
                      <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Free Shipping & EMI Premium Banner - Ultra Attractive */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#800020] to-[#2a0a0a]">
          {/* Animated particle dots */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,215,0,0.4) 1.5px, transparent 1.5px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          {/* Animated gradient orbs */}
          <div className="absolute top-0 -left-40 w-80 h-80 bg-[#FFD700]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-40 w-80 h-80 bg-[#FFA500]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#800020]/50 rounded-full blur-3xl"></div>
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Main Heading with Animation */}
          <div className="text-center mb-12 animate-[fadeInUp_0.8s_ease-out]">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-white/90 text-sm font-medium tracking-wide"> EXCLUSIVE CUSTOMER BENEFITS </span>
            </div>
            
            {/* Main Paragraph */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Shop with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500]"> Complete Peace of Mind</span>
              </h2>
              <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto backdrop-blur-sm bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                Experience the joy of shopping with <span className="font-bold text-[#FFD700]">FREE shipping</span> on orders above ₹10,000 
                and flexible <span className="font-bold text-[#FFD700]">EMI options</span>. 
                Every sarees comes with our promise of quality, authenticity, and 100% secure delivery.
              </p>
            </div>
          </div>

          {/* Premium Benefits Cards - 3D Flip Effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            
            {/* Card 1: Free Shipping */}
            <div className="group perspective-1000">
              <div className="relative preserve-3d transition-all duration-500 group-hover:rotate-y-180 cursor-pointer">
                {/* Front of card */}
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl backface-hidden transform transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#FFA500]/20 to-transparent rounded-full blur-2xl"></div>
                  
                  {/* Animated Icon */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <svg className="w-10 h-10 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h6" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white text-center mb-3">Free Shipping</h3>
                  <div className="text-center mb-4">
                    {/* <span className="text-4xl font-bold text-[#FFD700]">₹10,000+</span> */}
                  </div>
                  <p className="text-white/70 text-center text-sm">Eligible orders</p>
                  
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-1 text-white/50 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      <span>Pan India Delivery</span>
                    </div>
                  </div>
                </div>
                
                {/* Back of card (on hover) */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-3xl p-8 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center">
                  <svg className="w-12 h-12 text-[#800020] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-[#800020] font-semibold">No hidden charges</p>
                  {/* <p className="text-[#800020]/80 text-sm mt-2">Free returns within 7 days</p> */}
                </div>
              </div>
            </div>

            {/* Card 2: EMI Option */}
            <div className="group perspective-1000">
              <div className="relative preserve-3d transition-all duration-500 group-hover:rotate-y-180 cursor-pointer">
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl backface-hidden transform transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <svg className="w-10 h-10 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white text-center mb-3">Easy EMI</h3>
                  <div className="text-center mb-4">
                    {/* <span className="text-4xl font-bold text-[#FFD700]">₹500<span className="text-xl">/month</span></span> */}
                  </div>
                  <p className="text-white/70 text-center text-sm">Starting at</p>
                  
                  <div className="mt-6 flex justify-center gap-2">
                    <div className="flex items-center gap-1 text-white/50 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      <span>Zero Down Payment</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-3xl p-8 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center">
                  <svg className="w-12 h-12 text-[#800020] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#800020] font-semibold">Available on all major cards</p>
                  {/* <p className="text-[#800020]/80 text-sm mt-2">3, 6, 9, 12 months tenure</p> */}
                </div>
              </div>
            </div>

            {/* Card 3: Secure Checkout */}
            <div className="group perspective-1000">
              <div className="relative preserve-3d transition-all duration-500 group-hover:rotate-y-180 cursor-pointer">
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl backface-hidden transform transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <svg className="w-10 h-10 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white text-center mb-3">Secure Checkout</h3>
                  <div className="text-center mb-4">
                    {/* <span className="text-4xl font-bold text-[#FFD700]">100%</span> */}
                  </div>
                  <p className="text-white/70 text-center text-sm">Protected</p>
                  
                  <div className="mt-6 flex justify-center gap-2">
                    <div className="flex items-center gap-1 text-white/50 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-3xl p-8 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center">
                  <svg className="w-12 h-12 text-[#800020] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-[#800020] font-semibold">Multiple payment options</p>
                  <p className="text-[#800020]/80 text-sm mt-2">Cards, UPI, NetBanking, COD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10 animate-[fadeInUp_1s_ease-out]">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span className="text-white/80 text-sm">Trusted by 10,000+ customers</span>
            </div>
            {/* <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
              </svg>
              <span className="text-white/80 text-sm">30 Days Return Policy</span>
            </div> */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span className="text-white/80 text-sm">24/7 Customer Support</span>
            </div>
          </div>

          {/* Call to Action */}
          {/* <div className="text-center mt-10">
            <button className="group relative overflow-hidden bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-xl transform transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Start Shopping Now
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFD700] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div> */}

          {/* T&C Note */}
          <div className="text-center mt-6">
            <p className="text-white/40 text-xs">*Terms and conditions apply.</p>
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

    {/* Budget Filter Buttons - Styled like View All button but smaller */}
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {[
        { label: "Under ₹2,000", value: "under2000" },
        { label: "₹2,000 - ₹5,000", value: "mid2000to5000" },
        { label: "₹5,000 - ₹10,000", value: "mid5000to10000" },
        { label: "Premium Collection", value: "premium" },
      ].map((budget) => (
        <button
          key={budget.value}
          onClick={() => setSelectedBudget(budget.value)}
          className={`group relative px-6 py-2.5 font-semibold transition-all duration-300 rounded-lg overflow-hidden ${
            selectedBudget === budget.value
              ? "text-white"
              : "text-[#800020] border-2 border-[#800020] hover:bg-[#800020]/5"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {budget.label}
          </span>
          {selectedBudget === budget.value && (
            <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A]"></span>
          )}
          {selectedBudget !== budget.value && (
            <span className="absolute inset-0 border-2 border-[#800020] rounded-lg"></span>
          )}
        </button>
      ))}
    </div>

    {budgetLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {Array(3)
          .fill()
          .map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-[500px] animate-pulse shadow-xl" />
          ))}
      </div>
    ) : budgetProducts.length === 0 ? (
      <div className="text-center py-16 bg-white/50 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-600">No products available in this budget range</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {budgetProducts.map((product) => {
          const {
            inStock,
            hasOffer,
            hasAdminOffer,
            hasNormalDiscount,
            displayPrice,
            originalPrice,
            discountPercentage,
            offerName,
          } = getProductOfferInfo(product);

          return (
            <div key={product._id || product.id} className="group">
              {/* Minimalist Card - matching Latest Collection style */}
              <div className="relative">
                {/* Image Section */}
                <div className="relative overflow-hidden bg-[#F5F0EB] rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  {/* Discount Indicator */}
                  {(hasAdminOffer || hasNormalDiscount) && (
                    <div className="absolute top-0 left-0 z-20">
                      <div
                        className={`px-4 py-1.5 text-xs font-semibold tracking-wider ${
                          hasAdminOffer
                            ? "bg-gradient-to-r from-[#800020] to-[#A0002A] text-white"
                            : "bg-black/90 text-white"
                        }`}
                      >
                        {hasAdminOffer ? ` ${offerName}` : ` ${discountPercentage}% OFF`}
                      </div>
                    </div>
                  )}

                  {/* Wishlist Icon */}
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#800020] group/wishlist transition-all duration-300 shadow-md hover:shadow-lg"
                    title="Add to Wishlist"
                  >
                    <svg
                      className="w-4.5 h-4.5 text-gray-700 group-hover/wishlist:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>

                  {/* Product Image */}
                  <Link to={`/viewdetails/${product.id || product._id}`}>
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        decoding="async"
                        loading="lazy"
                        onError={handleImageError}
                      />
                    </div>
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="bg-white/95 text-[#800020] px-5 py-2 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Quick View
                      </span>
                    </div>
                  </Link>
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
                  <Link to={`/viewdetails/${product.id || product._id}`}>
                    <h3 className="text-xl md:text-2xl font-serif font-semibold text-gray-800 mb-2 hover:text-[#800020] transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price Section */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl md:text-3xl font-bold text-[#800020]">
                        {formatPrice(displayPrice)}
                      </span>
                      {hasOffer && originalPrice && originalPrice > displayPrice && (
                        <span className="text-gray-400 text-base line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                      {hasNormalDiscount && discountPercentage > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Save {discountPercentage}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* View All Button for Selected Budget */}
    <div className="text-center mt-16">
      <button
        onClick={() => navigate(`/products-by-budget?budget=${selectedBudget}`)}
        className="group relative px-10 py-3.5 text-[#800020] border-2 border-[#800020] hover:bg-[#800020] hover:text-white transition-all duration-300 font-semibold uppercase tracking-wider rounded-lg overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          Explore Complete Collection
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </button>
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
      <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">Discover our newest arrivals, crafted with passion and precision</p>
    </div>

    {homepageProducts.length === 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(3).fill().map((_, i) => <div key={i} className="bg-white rounded-2xl h-[500px] animate-pulse shadow-xl" />)}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {homepageProducts.map((product) => {
          const { inStock, hasOffer, hasAdminOffer, hasNormalDiscount, displayPrice, originalPrice, discountPercentage, offerName } = getProductOfferInfo(product);

          return (
            <div key={product._id || product.id} className="group">
              {/* Minimalist Card */}
              <div className="relative">
                {/* Image Section */}
                <div className="relative overflow-hidden bg-[#F5F0EB] rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  {/* Discount Indicator - Improved */}
                  {(hasAdminOffer || hasNormalDiscount) && (
                    <div className="absolute top-0 left-0 z-20">
                      <div className={`px-4 py-1.5 text-xs font-semibold tracking-wider ${
                        hasAdminOffer 
                          ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white' 
                          : 'bg-black/90 text-white'
                      }`}>
                        {hasAdminOffer ? ` ${offerName}` : ` ${discountPercentage}% OFF`}
                      </div>
                    </div>
                  )}

                  {/* Wishlist Icon - Improved */}
                  <button 
                    onClick={() => handleAddToWishlist(product)} 
                    className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#800020] group/wishlist transition-all duration-300 shadow-md hover:shadow-lg"
                    title="Add to Wishlist"
                  >
                    <svg className="w-4.5 h-4.5 text-gray-700 group-hover/wishlist:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Product Image */}
                  <Link to={`/viewdetails/${product.id || product._id}`}>
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.images?.[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        decoding="async" 
                        loading="lazy" 
                        onError={handleImageError} 
                      />
                    </div>
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="bg-white/95 text-[#800020] px-5 py-2 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Quick View
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Product Info - Enhanced Typography */}
                <div className="mt-6 text-left">
                  {/* Stock Status & Badges */}
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

                  {/* Product Name - Larger & Bolder */}
                  <Link to={`/viewdetails/${product.id || product._id}`}>
                    <h3 className="text-xl md:text-2xl font-serif font-semibold text-gray-800 mb-2 hover:text-[#800020] transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Product Description - Improved */}
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description || 'Exquisitely crafted pure silk saree featuring intricate zari work, perfect for weddings and festive occasions.'}
                  </p>

                  {/* Price Section - Enhanced */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl md:text-3xl font-bold text-[#800020]">
                        {formatPrice(displayPrice)}
                      </span>
                      {hasOffer && originalPrice && originalPrice > displayPrice && (
                        <span className="text-gray-400 text-base line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                      {hasNormalDiscount && discountPercentage > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Save {discountPercentage}%
                        </span>
                      )}
                    </div>
                    
                  </div>
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
    
    {/* View All Button - Enhanced */}
    <div className="text-center mt-16">
      <Link to="/products">
        <button className="group relative px-10 py-3.5 text-[#800020] border-2 border-[#800020] hover:bg-[#800020] hover:text-white transition-all duration-300 font-semibold uppercase tracking-wider rounded-lg overflow-hidden">
          <span className="relative z-10 flex items-center gap-2">
            Explore Complete Collection
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
      </Link>
    </div>
  </div>
</section>

      {/* Special Offers Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#800020] via-[#6B001A] to-[#4A0012]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 relative inline-block">
              Special Offers
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded-full"></span>
            </h2>
            <p className="text-[#F5E6D3]/80 max-w-2xl mx-auto mt-6 text-lg">
              Discover exclusive discounts on our collection
            </p>
          </div>

          {offersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl h-80 animate-pulse shadow-xl" />
              ))}
            </div>
          ) : specialOffers.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl max-w-2xl mx-auto border border-white/10">
              <div className="relative px-12 py-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#FFD700]/10 blur-2xl"></div>
                <div className="relative">
                  <p className="text-2xl md:text-3xl font-serif font-semibold text-white tracking-wide">
                    Exciting deals are on the way
                  </p>
                  <p className="text-[#F5E6D3]/70 text-base mt-3">
                    Stay tuned for amazing offers on our collection
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialOffers.slice(0, 3).map((offer, index) => (
                <div
                  key={offer.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
                  onClick={() => handleViewOfferProducts(offer)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10"></div>

                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FFD700] blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] px-4 py-1.5 rounded-bl-2xl text-xs font-bold uppercase tracking-wider shadow-lg">
                        {offer.discountType === 'percentage'
                          ? `${offer.discountValue}% OFF`
                          : `₹${offer.discountValue} OFF`}
                      </div>
                    </div>
                  </div>

                  <div className="relative bg-gradient-to-br from-[#800020] to-[#6B001A] p-8 text-center">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-serif">{offer.name}</h3>
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
                        <svg className="w-4 h-4 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white text-sm font-medium">Limited Period</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {offer.description || 'Exclusive discount on selected premium sarees. Perfect for weddings and special occasions.'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">
                          {offer.productIds?.length || 0} Products
                        </span>
                      </div>
                      <button
                        className="px-6 py-2.5 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white rounded-lg font-medium hover:from-[#6B001A] hover:to-[#4A0012] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOfferProducts(offer);
                        }}
                      >
                        <span>View </span>
                        <svg className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {specialOffers.length > 3 && (
            <div className="text-center mt-16">
              <Link to="/special-offers">
                <button className="group relative overflow-hidden bg-transparent border-2 border-[#FFD700] text-[#FFD700] px-10 py-4 rounded-xl font-semibold hover:text-[#800020] transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <span className="absolute inset-0 bg-[#FFD700] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore All Offers
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Offer Products Modal */}
      {offerProductsModal && selectedOfferForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-gradient-to-r from-[#800020] to-[#6B001A] p-6 flex justify-between items-center">
              <div className="text-white">
                <h2 className="text-2xl font-bold font-serif">{selectedOfferForModal.name}</h2>
                <p className="text-[#F5E6D3]/80 text-sm mt-1">{selectedOfferForModal.description}</p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mt-3">
                  <svg className="w-4 h-4 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span>
                    {selectedOfferForModal.discountType === 'percentage'
                      ? `${selectedOfferForModal.discountValue}% OFF`
                      : `₹${selectedOfferForModal.discountValue} OFF`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setOfferProductsModal(false);
                  setSelectedOfferForModal(null);
                  setOfferProducts([]);
                }}
                className="text-white/70 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-8">
              {offerProductsLoading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020]"></div>
                  <p className="mt-5 text-gray-600">Loading products...</p>
                </div>
              ) : offerProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products available</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offerProducts.map((product) => {
                    const inStock = product.stock > 0;
                    const hasOffer = product.hasOffer === true && product.offerPrice;
                    const displayPrice = hasOffer ? product.offerPrice : product.price;

                    return (
                      <div key={product.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#F8EDE3] to-[#F5E6D3]">
                          <img
                            src={product.images?.[0] || logo}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={handleImageError}
                          />
                          {hasOffer && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                              {selectedOfferForModal.discountType === 'percentage'
                                ? `${selectedOfferForModal.discountValue}% OFF`
                                : `₹${selectedOfferForModal.discountValue} OFF`}
                            </div>
                          )}
                          {!inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#800020] transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {product.description?.substring(0, 80) || 'Exquisite saree crafted with traditional artistry'}
                          </p>

                          <div className="flex items-baseline gap-2 mb-5">
                            <span className="text-2xl font-bold text-[#800020]">
                              {formatPrice(displayPrice)}
                            </span>
                            {hasOffer && product.price > displayPrice && (
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>

                          <Link to={`/viewdetails/${product.id}`}>
                            <button
                              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                                inStock
                                  ? 'bg-gradient-to-r from-[#800020] to-[#6B001A] text-white hover:shadow-md hover:scale-105'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              What Our Customers Say
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
          </div>

          <div className="w-5xl">
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