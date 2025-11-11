// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselSlides = [
    {
      id: 1,
      title: "Exclusive Silk Collection",
      subtitle: "Premium handcrafted sarees for every occasion",
      image: "https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dwe6547122/Ace_Your_Saree_Banner_D.jpg",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Bridal Special",
      subtitle: "Make your special day even more memorable",
      image: "https://kavyastyleplus.com/cdn/shop/files/Royal_20Satin_20Saroski_20Saroj_20Sarees_20_283_29_90970273-bbc2-4d06-938d-90af6cf314b2.jpg?v=1744633888&width=1946",
      cta: "Bridal Collection"
    },
    {
      id: 3,
      title: "Festival Sale",
      subtitle: "Upto 40% off on traditional wear",
      image: "https://mysilklove.com/cdn/shop/articles/1800_26.png?v=1701089364&width=2048",
      cta: "View Offers"
    }
  ];

  // ---------- Carousel auto-scroll ----------
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // ---------- Fetch products ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getPublicProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ---------- Helpers ----------
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ---------- Add to Wishlist (optional) ----------
  const handleAddToWishlist = async (product) => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login first to add to wishlist!');
      navigate('/login');
      return;
    }

    try {
      await productApi.addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder-image.jpg',
      });
      toast.success(`${product.name} added to wishlist!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] overflow-hidden">

      <section className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {carouselSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="text-white max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              {carouselSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              {carouselSlides[currentSlide].subtitle}
            </p>
            <Link to="/products">
              <button className="bg-[#800020] hover:bg-[#A0002A] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300 shadow-lg">
                {carouselSlides[currentSlide].cta}
              </button>
            </Link>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
          {carouselSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-[#800020] scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-[#800020]/50 hover:bg-[#A0002A]/50 rounded-full p-2 transition"
          onClick={() => setCurrentSlide((currentSlide - 1 + carouselSlides.length) % carouselSlides.length)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-[#800020]/50 hover:bg-[#A0002A]/50 rounded-full p-2 transition"
          onClick={() => setCurrentSlide((currentSlide + 1) % carouselSlides.length)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

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
            <img
              src="https://www.koskii.com/cdn/shop/products/koskii-mehendi-zariwork-pure-silk-designer-saree-saus0018591_mehendi_1.jpg?v=1633866706&width=1080"
              alt="Elegant Silk Saree"
              className="rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-700 hover:scale-105"
            />
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

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Traditional Silk Sarees", 
                image: "https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg",
                description: "Timeless elegance with authentic craftsmanship",
                items: "120+ Products"
              },
              { 
                name: "Bridal Sarees", 
                image: "https://cdn.shopify.com/s/files/1/0755/3495/8865/files/bridal_1.png?v=1694446298",
                description: "For your special day",
                items: "85+ Designs"
              },
              { 
                name: "Designer Sarees", 
                image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/c/7c90315SHMTPRM104_4.jpg?rnd=20200526195200&tr=w-512",
                description: "Contemporary designs by expert designers",
                items: "200+ Collections"
              },
              { 
                name: "Daily Wear", 
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjnA0wdFE62w9oKr5n3PsoRsbbbOX2HLii8w&s",
                description: "Comfortable elegance for everyday",
                items: "150+ Options"
              },
              { 
                name: "Festival Collection", 
                image: "https://i.pinimg.com/736x/c5/b1/65/c5b1659e705b1b937fed0564f808ade0.jpg",
                description: "Celebratory styles for special occasions",
                items: "90+ Designs"
              },
              { 
                name: "Premium Collection", 
                image: "https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577",
                description: "Exclusive luxury pieces with zari work",
                items: "Limited Edition"
              }
            ].map((category, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl"
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="overflow-hidden h-80 relative">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/80 via-[#800020]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#800020] to-[#A0002A] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {category.items}
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:translate-y-0 transform">{category.name}</h3>
                  <p className="text-[#1A4D3E] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{category.description}</p>
                  <Link to="/products">
                    <button className="self-start bg-gradient-to-r from-[#800020] to-[#A0002A] text-white px-5 py-2 rounded-lg font-medium hover:from-[#A0002A] hover:to-[#800020] transition-all duration-300 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center shadow-md">
                      <span>Explore</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <section className="py-20 bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              Trending Now
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">
              Our most loved sarees, cherished by women nationwide
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6B2D2D] border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-600 font-medium">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-[#555]">No products available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => {
                const inStock = product.stock > 0;
                return (
                  <div
                    key={product._id}
                    className="bg-[#F8EDE3] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group border border-[#FDF6E3]"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <span
                        className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md ${
                          inStock
                            ? 'bg-gradient-to-r from-[#800020] to-[#A0002A]'
                            : 'bg-gray-600'
                        }`}
                      >
                        {inStock ? 'In Stock' : 'Sold Out'}
                      </span>

                      <div className="h-80 overflow-hidden">
                        <img
                          src={product.images?.[0] || '/placeholder-image.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#1C2526] mb-2 group-hover:text-[#800020] transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center mt-2 mb-4">
                        <span className="text-[#800020] font-bold text-lg">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[#1C2526] text-sm line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <Link to={`/viewdetails/${product.id}`}>
                        <button
                          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                            inStock
                              ? 'bg-gradient-to-r from-[#800020] to-[#A0002A] text-white hover:from-[#A0002A] hover:to-[#800020] shadow-sm'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                          disabled={!inStock}
                        >
                          {inStock ? 'View' : 'Out of Stock'}
                        </button>
                      </Link>

                      {/* Optional Wishlist button (remove if not needed) */}
                      {/* <button
                        onClick={() => handleAddToWishlist(product)}
                        className="w-full mt-2 py-2 border border-[#800020] text-[#800020] rounded-lg hover:bg-[#800020] hover:text-white transition"
                      >
                        Add to Wishlist
                      </button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All */}
          <div className="text-center mt-16">
            <Link to="/products">
              <button className="relative overflow-hidden group border-2 border-[#800020] text-[#800020] px-8 py-3 rounded-lg text-lg font-medium hover:text-white transition-all duration-300 shadow-md">
                <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
                <span className="relative z-10 flex items-center justify-center">
                  View All Sarees
                  <svg
                    className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== SPECIAL OFFERS ==================== */}
      <section className="py-12 bg-gradient-to-r from-[#800020] to-[#A0002A] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white text-center mb-8">
            Special Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Festival Special", discount: "20% OFF", code: "FEST20", expiry: "Valid until Oct 30, 2025" },
              { title: "First Purchase", discount: "15% OFF", code: "WELCOME15", expiry: "No expiry" },
              { title: "Free Shipping", discount: "FREE", code: "SHIPFREE", expiry: "On orders above ₹9999" },
              { title: "Bridal Package", discount: "25% OFF", code: "BRIDE25", expiry: "Valid until Dec 31, 2025" }
            ].map((offer, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div className="text-white text-center">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <div className="text-2xl font-serif font-bold text-white mb-3">{offer.discount}</div>
                  <div className="bg-white/20 rounded-lg p-2 mb-2">
                    <span className="text-white font-mono">Use code: </span>
                    <span className="font-bold text-[#F8EDE3]">{offer.code}</span>
                  </div>
                  <p className="text-xs text-[#F8EDE3]">{offer.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
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
                name: "Priya Sharma", location: "Chennai", rating: 5,
                review: "The Kanjivaram saree I bought was absolutely stunning! The quality and craftsmanship are unmatched.",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              },
              {
                name: "Anita Rao", location: "Hyderabad", rating: 5,
                review: "I wore their bridal saree for my wedding, and it made me feel like a queen. Highly recommend!",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              },
              {
                name: "Meena Kapoor", location: "Mumbai", rating: 4,
                review: "The designer sarees are so unique. I get compliments every time I wear one!",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              }
            ].map((t, i) => (
              <div key={i} className="bg-[#F8EDE3] rounded-2xl p-6 shadow-lg border border-[#FDF6E3] group">
                <div className="flex items-center mb-4">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#1A4D3E] group-hover:border-[#800020] transition" />
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