// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import GalleryApi from '../Services/GalleryApi';

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

  // ──────────────────────────────────────────────
  // Fetch data – no blocking, no loading states for UI
  // ──────────────────────────────────────────────
  useEffect(() => {
    // Main gallery image
    (async () => {
      try {
        const data = await GalleryApi.getPublicMainGalleryImage();
        setMainGalleryImage(data?.image || null);
      } catch (err) {
        console.error('Main gallery image fetch error:', err);
        setMainImageError(err.message);
      }
    })();

    // Carousel slides
    (async () => {
      try {
        const data = await GalleryApi.getPublicSlides();
        setCarouselSlides(data?.slides || []);
      } catch (err) {
        console.error('Carousel fetch error:', err);
        toast.error('Failed to load carousel');
      }
    })();

    // Collections
    (async () => {
      try {
        const data = await GalleryApi.getPublicCollections();
        setCollections(data?.collections || []);
      } catch (err) {
        console.error('Collections fetch error:', err);
      }
    })();

    // Products
    (async () => {
      try {
        const data = await productApi.getPublicProducts();
        setProducts(data?.products || []);
      } catch (err) {
        setError('Failed to load products.');
        console.error('Product fetch error:', err);
      }
    })();
  }, []);

  // Auto slide carousel
  useEffect(() => {
    if (carouselSlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Get unique offer names
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
        image: product.images?.[0] || '/placeholder.jpg',
      });
      toast.success(`${product.name} added to wishlist!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    }
  };

  const handleImageError = (e) => {
    // You can leave it empty or set a static fallback if you want
    // e.target.src = '/placeholder.jpg';
  };

  // ──────────────────────────────────────────────
  // RENDER – no loading checks, no fallbacks
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] overflow-hidden">

      {/* Hero Carousel Section */}
      <section className="relative h-[85vh] md:h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {carouselSlides.map((slide, idx) => (
            <div
              key={slide.id || slide._id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-fill bg-white"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black/15"></div>
            </div>
          ))}
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="text-white max-w-4xl z-10">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">
              {carouselSlides[currentSlide]?.title || ''}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
              {carouselSlides[currentSlide]?.subtitle || ''}
            </p>
            <Link to="/products">
              <button className="bg-[#800020] hover:bg-[#A0002A] text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                {carouselSlides[currentSlide]?.cta || 'Shop Now'}
              </button>
            </Link>
          </div>
        </div>

        {/* Dots */}
        {carouselSlides.length > 0 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-10">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {carouselSlides.length > 1 && (
          <>
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition z-10"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition z-10"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="relative group">
              <img
                src={mainGalleryImage}
                alt="Elegance Woven with Tradition"
                className="rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-700 group-hover:scale-105 object-cover h-96"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
              {mainImageError && (
                <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Image not available
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
            {collections.map((collection, index) => (
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
            ))}
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

          {error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No products available yet.</div>
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
                        className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md ${
                          inStock ? 'bg-gradient-to-r from-[#800020] to-[#A0002A]' : 'bg-gray-600'
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
                            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                              inStock
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
              <div className="col-span-4 text-center text-white/80 py-8">
                <p>No special offers available at the moment</p>
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