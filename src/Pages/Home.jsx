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
  const [selectedBudget, setSelectedBudget] = useState('under2000')
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
      offerName = product.offerName; // Show the admin offer name
    } else if (hasNormalDiscount) {
      // Normal discount from originalPrice
      displayPrice = product.price;
      originalPrice = product.originalPrice;
      discountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
      offerName = null; // No special name for normal discount
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
      // Get products for this offer
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

  // Replace the useEffect that loads homepage products
  useEffect(() => {
    const loadHomepageProducts = async () => {
      try {
        // Get settings from backend
        const settingsResult = await productApi.getHomepageSettings();
        if (settingsResult.success && settingsResult.settings) {
          const selectedIds = settingsResult.settings.selectedProductIds || [];
          const count = settingsResult.settings.count || 3;

          // Get selected products in order
          const selected = products
            .filter(p => selectedIds.includes(String(p.id || p._id)) && p.isVisible !== false)
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

  // Replace the useEffect that loads budget products
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

          // Get products by IDs
          let filtered = products
            .filter(product => selectedProductIds.includes(String(product.id || product._id)) && product.isVisible !== false);

          // Sort products by price (ascending)
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

          // Get products by IDs
          let filtered = products
            .filter(product => selectedProductIds.includes(String(product.id || product._id)) && product.isVisible !== false);

          // Sort products by price (ascending)
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
                {/* Multi-layered gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
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

        {/* Content Container */}
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl z-20 w-full">
            {carouselSlides.length > 0 && carouselSlides[currentSlide] ? (
              <div className="space-y-6 md:space-y-8">
                {/* Title with #FFD700 Gold Color */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold px-4 transition-all duration-700"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 2px 15px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)',
                    letterSpacing: '-0.02em'
                  }}>
                  {carouselSlides[currentSlide].title}
                </h1>

                {/* Subtitle with semi-transparent background */}
                <div className="px-6 py-0.5 inline-block mx-auto">
                  <p className="text-lg md:text-2xl lg:text-3xl font-light max-w-2xl mx-auto transition-all duration-700"
                    style={{
                      color: '#FFFFFF',
                      textShadow: '0 1px 8px rgba(0,0,0,0.25)',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(4px)',
                      padding: '0.75rem 2rem',
                      borderRadius: '2rem',
                      display: 'inline-block',
                      letterSpacing: '0.01em'
                    }}>
                    {carouselSlides[currentSlide].subtitle}
                  </p>
                </div>

                {/* Button */}
                <div className="pt-4">
                  <Link to="/products">
                    <button className="group relative overflow-hidden px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                        color: '#800020',
                        border: 'none'
                      }}>
                      <span className="relative z-10 flex items-center gap-2">
                        {carouselSlides[currentSlide].cta || "Shop Now"}
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
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
                <button className="bg-white text-[#800020] px-10 py-5 rounded-xl text-xl font-medium hover:bg-gray-100 transition-all shadow-2xl transform hover:-translate-y-1">
                  Explore Collection
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Dots Navigation */}
        {carouselSlides.length > 0 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${i === currentSlide
                    ? "w-10 h-2.5 bg-white shadow-lg"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80 hover:scale-110"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {carouselSlides.length > 1 && (
          <>
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 z-20 hover:scale-110"
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
                )
              }
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 z-20 hover:scale-110"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
              }
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

    {/* Horizontal Scrollable Container with Arrows */}
    <div className="relative group">
      {/* Left Navigation Arrow */}
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
      
      {/* Right Navigation Arrow */}
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
      
      {/* Gradient Fade Effects */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#F9F3F3] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#F9F3F3] to-transparent z-10 pointer-events-none"></div>
      
      {/* Scrollable Row */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-visible pb-6 scroll-smooth"
        // style={{ scrollbarWidth: 'thin', scrollbarColor: '#800020 #f1f1f1' }}
      >
        <div className="flex gap-8 md:gap-12 lg:gap-16 min-w-max px-4">
          {collections.length > 0 ? (
            collections.map((collection, index) => (
              <div
                key={collection.id || collection._id || index}
                className="group relative flex flex-col items-center cursor-pointer w-[280px] md:w-[320px] lg:w-[360px]"
                onClick={() => handleCollectionExplore(collection)}
              >
                {/* Animated ring effect on hover */}
                <div className="relative mb-6 pt-4">
                  {/* Outer ring - decorative */}
                  {/* <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 blur-md"></div> */}
                  
                  {/* Main Circular Container */}
                  <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                    {/* Rotating border on hover */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#800020] via-[#A0002A] to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                         style={{ padding: '3px' }}>
                      <div className="w-full h-full rounded-full bg-white"></div>
                    </div>
                    
                    {/* Image Circle */}
                    <div className="w-full h-full rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 "
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                      />
                    </div>
                    
                    {/* Overlay with shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Items Count Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#800020] to-[#A0002A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      {collection.items || 'Collection'}
                    </div>
                  </div>
                </div>
                
                {/* Collection Name */}
                <h3 className="text-xl md:text-2xl font-cinzel font-bold text-[#1C2526] mb-2 text-center group-hover:text-[#800020] transition-colors duration-300">
                  {collection.name}
                </h3>
                
                {/* Description - appears on hover */}
                <p className="text-[#1C2526]/70 text-center max-w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 text-sm md:text-base">
                  {collection.description || 'Beautifully crafted sarees'}
                </p>
                
                {/* Explore Link */}
                {/* <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-[#800020] text-sm font-medium flex items-center gap-1">
                    Explore Collection
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div> */}
              </div>
            ))
          ) : (
            // Loading skeletons
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
    
    {/* View All Collections Button */}
    {/* {collections.length > 0 && (
      <div className="text-center mt-12">
        <Link to="/products">
          <button className="relative overflow-hidden group bg-transparent border-2 border-[#800020] text-[#800020] px-10 py-4 rounded-xl text-lg font-cinzel font-semibold hover:text-white transition-all duration-300 shadow-md hover:shadow-xl">
            <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
            <span className="relative z-10 flex items-center justify-center gap-2">
              View All Collections
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </Link>
      </div>
    )} */}
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
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">Find the perfect saree that fits your budget</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { label: "Under ₹2,000", value: "under2000" },
              { label: "₹2,000 - ₹5,000", value: "mid2000to5000" },
              { label: "₹5,000 - ₹10,000", value: "mid5000to10000" },
              { label: "Premium Collection", value: "premium" }
            ].map((budget) => (
              <button key={budget.value} onClick={() => setSelectedBudget(budget.value)} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${selectedBudget === budget.value ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white shadow-lg' : 'bg-white text-[#800020] border-2 border-[#800020] hover:bg-[#800020]/10'}`}>
                <span>{budget.label}</span>
              </button>
            ))}
          </div>

          {budgetLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill().map((_, i) => <div key={i} className="bg-white rounded-2xl h-[450px] animate-pulse shadow-xl" />)}
            </div>
          ) : budgetProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600">No products available in this budget range</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {budgetProducts.map((product) => {
                const { inStock, hasOffer, hasAdminOffer, hasNormalDiscount, displayPrice, originalPrice, discountPercentage, offerName } = getProductOfferInfo(product);

                return (
                  <div key={product.id || product._id} className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${hasAdminOffer ? 'shadow-[0_0_15px_rgba(128,0,32,0.3)]' : ''}`}>

                    {/* Admin Offer - Elegant Maroon Glow */}
                    {hasAdminOffer && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/5 via-[#A0002A]/5 to-[#800020]/5 rounded-2xl"></div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-[#800020] via-[#A0002A] to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10"></div>
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#F8EDE3] to-[#F5E6D3]">

                      {/* Admin Offer Badge - Elegant Gold/Maroon */}
                      {hasAdminOffer && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg blur-sm opacity-60"></div>
                            <div className="relative bg-gradient-to-r from-[#800020] to-[#A0002A] text-[#FFD700] px-4 py-2 rounded-lg text-sm font-bold tracking-wider shadow-lg flex items-center gap-2 border border-[#FFD700]/30">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                              </svg>
                              {offerName}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Normal Discount Badge - Standard Gold */}
                      {hasNormalDiscount && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg blur-sm opacity-50"></div>
                            <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                              
                              {`${discountPercentage}% OFF`}
                            </div>
                          </div>
                        </div>
                      )}

                      <button onClick={() => handleAddToWishlist(product)} className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-[#800020] hover:text-white transition-all duration-300 transform hover:scale-110" title="Add to Wishlist">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <div className="h-80 overflow-hidden relative">
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" decoding="async" loading="lazy" onError={handleImageError} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    <div className="p-6 relative bg-white">
                      <h3 className="text-xl font-cinzel font-bold text-gray-800 mb-3 group-hover:text-[#800020] transition-colors duration-300 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light leading-relaxed">{product.description || 'Exquisitely crafted saree blending tradition with contemporary elegance'}</p>

                      <div className="flex items-baseline gap-3 mb-5">
                        <span className={`text-2xl font-bold ${hasAdminOffer ? 'text-[#800020]' : 'text-[#800020]'}`}>
                          {formatPrice(displayPrice)}
                        </span>
                        {hasOffer && originalPrice && originalPrice > displayPrice && (
                          <span className="text-gray-400 text-sm line-through">{formatPrice(originalPrice)}</span>
                        )}
                      </div>
                      <Link to={`/viewdetails/${product.id || product._id}`}>
                        <button className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 transform ${inStock ? (hasAdminOffer ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:shadow-lg hover:scale-105 active:scale-95 border border-[#FFD700]/30' : 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:shadow-lg hover:scale-105 active:scale-95') : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} disabled={!inStock}>
                          {inStock ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {hasAdminOffer ? 'View Offer →' : 'Quick View'}
                            </span>
                          ) : 'Out of Stock'}
                        </button>
                      </Link>
                    </div>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#800020]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <button onClick={() => navigate(`/products-by-budget?budget=${selectedBudget}`)} className="group relative overflow-hidden bg-gradient-to-r from-[#800020] to-[#A0002A] text-white px-8 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore {selectedBudget === 'under2000' && 'Under ₹2,000'}
                {selectedBudget === 'mid2000to5000' && '₹2,000 - ₹5,000'}
                {selectedBudget === 'mid5000to10000' && '₹5,000 - ₹10,000'}
                {selectedBudget === 'premium' && 'Premium'} Collection
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
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
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg font-light">Discover our newest arrivals, crafted with passion and precision</p>
          </div>

          {homepageProducts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill().map((_, i) => <div key={i} className="bg-white rounded-2xl h-[500px] animate-pulse shadow-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homepageProducts.map((product) => {
                const { inStock, hasOffer, hasAdminOffer, hasNormalDiscount, displayPrice, originalPrice, discountPercentage, offerName } = getProductOfferInfo(product);

                return (
                  <div key={product._id || product.id} className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${hasAdminOffer ? 'shadow-[0_0_15px_rgba(128,0,32,0.3)]' : ''}`}>

                    {/* Admin Offer - Elegant Maroon Glow */}
                    {hasAdminOffer && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/5 via-[#A0002A]/5 to-[#800020]/5 rounded-2xl"></div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-[#800020] via-[#A0002A] to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10"></div>
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#F8EDE3] to-[#F5E6D3]">

                      {/* Admin Offer Badge - Elegant Gold/Maroon */}
                      {hasAdminOffer && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg blur-sm opacity-60"></div>
                            <div className="relative bg-gradient-to-r from-[#800020] to-[#A0002A] text-[#FFD700] px-4 py-2 rounded-lg text-sm font-bold tracking-wider shadow-lg flex items-center gap-2 border border-[#FFD700]/30">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                              </svg>
                              {offerName}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Normal Discount Badge - Standard Gold */}
                      {hasNormalDiscount && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg blur-sm opacity-50"></div>
                            <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                              {`${discountPercentage}% OFF`}
                            </div>
                          </div>
                        </div>
                      )}

                      <button onClick={() => handleAddToWishlist(product)} className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-[#800020] hover:text-white transition-all duration-300 transform hover:scale-110" title="Add to Wishlist">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <div className="h-96 overflow-hidden relative">
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" decoding="async" loading="lazy" onError={handleImageError} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    <div className="p-6 relative bg-white">
                      <h3 className="text-xl font-cinzel font-bold text-gray-800 mb-3 group-hover:text-[#800020] transition-colors duration-300 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light leading-relaxed">{product.description || 'Exquisitely crafted saree blending tradition with contemporary elegance'}</p>

                      <div className="flex items-baseline gap-3 mb-5">
                        <span className={`text-2xl font-bold ${hasAdminOffer ? 'text-[#800020]' : 'text-[#800020]'}`}>
                          {formatPrice(displayPrice)}
                        </span>
                        {hasOffer && originalPrice && originalPrice > displayPrice && (
                          <span className="text-gray-400 text-sm line-through">{formatPrice(originalPrice)}</span>
                        )}
                      </div>
                      <Link to={`/viewdetails/${product.id || product._id}`}>
                        <button className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 transform ${inStock ? (hasAdminOffer ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:shadow-lg hover:scale-105 active:scale-95 border border-[#FFD700]/30' : 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:shadow-lg hover:scale-105 active:scale-95') : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} disabled={!inStock}>
                          {inStock ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {hasAdminOffer ? 'View Offer →' : 'Quick View'}
                            </span>
                          ) : 'Out of Stock'}
                        </button>
                      </Link>
                    </div>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#800020]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
      </section>      {/* Special Offers Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#800020] via-[#6B001A] to-[#4A0012]">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Decorative Corner Elements */}
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
                  {/* Decorative Border on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10"></div>

                  {/* Offer Badge Ribbon */}
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

                  {/* Offer Header */}
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

                  {/* Offer Content */}
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

          {/* View All Offers Button */}
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
                              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${inStock
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