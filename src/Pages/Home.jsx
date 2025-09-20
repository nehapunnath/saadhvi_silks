import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides
  const carouselSlides = [
    {
      id: 1,
      title: "Exclusive Silk Collection",
      subtitle: "Premium handcrafted sarees for every occasion",
      image: "https://www.wholesaletextile.in/product-img/Rajpath-The-Winter-Lover-Digit2-1702537044.jpeg",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Bridal Special",
      subtitle: "Make your special day even more memorable",
      image: "https://images.sagarimpex.net/664342_IMG-20241203-WA0561.jpg",
      cta: "Bridal Collection"
    },
    {
      id: 3,
      title: "Festival Sale",
      subtitle: "Upto 40% off on traditional wear",
      image: "https://hutsandlooms.com/cdn/shop/files/AAG_2434.jpg?crop=center&height=1200&v=1742374928&width=1200",
      cta: "View Offers"
    }
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Sample offers data
  const offers = [
    { 
      id: 1, 
      title: "Festival Special", 
      discount: "20% OFF", 
      description: "On all traditional silk sarees", 
      code: "FEST20",
      expiry: "Valid until Oct 30, 2025"
    },
    { 
      id: 2, 
      title: "First Purchase", 
      discount: "15% OFF", 
      description: "For new customers", 
      code: "WELCOME15",
      expiry: "No expiry"
    },
    { 
      id: 3, 
      title: "Free Shipping", 
      discount: "FREE", 
      description: "On orders above ₹9999", 
      code: "SHIPFREE",
      expiry: "Limited time offer"
    },
    { 
      id: 4, 
      title: "Bridal Package", 
      discount: "25% OFF", 
      description: "On bridal collection", 
      code: "BRIDE25",
      expiry: "Valid until Dec 31, 2025"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] overflow-hidden">
      {/* Carousel Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {carouselSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center">
          <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-1000 ${
            currentSlide === 0 ? 'translate-x-0' : 
            currentSlide === 1 ? '-translate-x-full' : 
            '-translate-x-full-2'
          }`}>
            <div className="text-white px-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                {carouselSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                {carouselSlides[currentSlide].subtitle}
              </p>
              <Link to="/products">
                <button className="bg-[#800020] hover:bg-[#A0002A] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300">
                  {carouselSlides[currentSlide].cta}
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Carousel indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-[#800020] scale-125' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-[#800020]/50 hover:bg-[#A0002A]/50 rounded-full p-2 transition-colors duration-300"
          onClick={() => setCurrentSlide((currentSlide - 1 + carouselSlides.length) % carouselSlides.length)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-[#800020]/50 hover:bg-[#A0002A]/50 rounded-full p-2 transition-colors duration-300"
          onClick={() => setCurrentSlide((currentSlide + 1) % carouselSlides.length)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Luxurious Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FDF6E3] via-[#F8EDE3] to-[#FDF6E3] py-20 md:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#800020] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#800020] opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#1A4D3E] opacity-10 rounded-full transform -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="mb-6">
              <span className="text-xs tracking-widest text-[#800020] font-semibold bg-[#F8EDE3] px-3 py-1 rounded-full shadow-sm">PREMIUM SILK SAREES</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1C2526] mb-6 leading-tight">
              Elegance Woven <span className="text-[#800020] block mt-2">With Tradition</span>
            </h1>
            <p className="text-lg md:text-xl text-[#1C2526] mb-8 max-w-md leading-relaxed">
              Discover our exquisite collection of silk sarees, crafted with precision and love for the traditional art of weaving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <button className="relative overflow-hidden group bg-gradient-to-r from-[#800020] to-[#A0002A] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                  <span className="relative z-10">Explore Collection</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#A0002A] to-[#800020] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#1A4D3E] to-[#F8EDE3] rounded-2xl transform rotate-2 blur-lg opacity-70"></div>
              <img 
                src="https://www.koskii.com/cdn/shop/products/koskii-mehendi-zariwork-pure-silk-designer-saree-saus0018591_mehendi_1.jpg?v=1633866706&width=1080" 
                alt="Elegant Silk Saree" 
                className="relative rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-700 hover:scale-105 z-10"
              />
              {/* Floating elements */}
              {/* <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#F8EDE3] rounded-full shadow-lg flex items-center justify-center z-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#800020]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Saree Collections */}
      <section className="py-20 bg-[#FDF6E3] relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[3%] bg-[url('https://www.transparenttextures.com/patterns/silk.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              Our Saree Collections
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">Discover the perfect blend of tradition and contemporary design in our carefully curated saree collections</p>
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

      {/* Enhanced Featured Sarees - Trending Now */}
      <section className="py-20 bg-gradient-to-b from-[#FDF6E3] to-[#F8EDE3] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#800020] opacity-5 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#800020] opacity-5 rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              Trending Now
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">Our most loved sarees, cherished by women nationwide for their exquisite craftsmanship</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "Kanjivaram Silk Saree", 
                image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
                badge: "Bestseller",
                price: "₹12,499",
                originalPrice: "₹15,999",
              },
              { 
                name: "Banarasi Silk Saree", 
                image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
                badge: "Popular",
                price: "₹9,999",
                originalPrice: "₹12,499",
              },
              { 
                name: "Designer Art Silk Saree", 
                image: "https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577",
                badge: "New",
                price: "₹7,499",
                originalPrice: "₹9,999",
              }
            ].map((product, index) => (
              <div key={index} className="bg-[#F8EDE3] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group border border-[#FDF6E3]">
                <div className="relative overflow-hidden">
                  {product.badge && (
                    <span className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md ${
                      product.badge === "Bestseller" ? "bg-gradient-to-r from-[#A0002A] to-[#800020]" :
                      product.badge === "Popular" ? "bg-gradient-to-r from-[#1A4D3E] to-[#800020]" :
                      "bg-gradient-to-r from-[#800020] to-[#A0002A]"
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  <div className="h-80 overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link to={`/viewdetails/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <button className="bg-[#F8EDE3] text-[#800020] p-2 rounded-full mx-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </Link>
                      <button className="bg-[#F8EDE3] text-[#800020] p-2 rounded-full mx-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <Link to="/cart">
                        <button className="bg-[#F8EDE3] text-[#800020] p-2 rounded-full mx-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#1C2526] mb-2 group-hover:text-[#800020] transition-colors duration-300">{product.name}</h3>
                  <div className="flex items-center mt-2 mb-4">
                    <span className="text-[#800020] font-bold text-lg">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-[#1C2526] text-sm line-through ml-2">{product.originalPrice}</span>
                    )}
                  </div>
                  <Link to="/cart">
                    <button className="w-full mt-4 bg-gradient-to-r from-[#F8EDE3] to-[#FDF6E3] text-[#800020] py-3 rounded-lg font-medium hover:from-[#800020] hover:to-[#A0002A] hover:text-white transition-all duration-300 border border-[#1A4D3E] shadow-sm">
                      Add to Cart
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/products">
              <button className="relative overflow-hidden group border-2 border-[#800020] text-[#800020] px-8 py-3 rounded-lg text-lg font-medium hover:text-white transition-all duration-300 shadow-md">
                <span className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#A0002A] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
                <span className="relative z-10 flex items-center justify-center">
                  View All Sarees
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/silk.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white text-center mb-8">
            Special Offers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div className="text-white text-center">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <div className="text-2xl font-serif font-bold text-white mb-3">
                    {offer.discount}
                  </div>
                  <p className="text-[#1A4D3E] mb-4">{offer.description}</p>
                  <div className="bg-white/20 rounded-lg p-2 mb-2">
                    <span className="text-white font-mono">Use code: </span>
                    <span className="font-bold text-[#F8EDE3]">{offer.code}</span>
                  </div>
                  <p className="text-xs text-[#1A4D3E]">{offer.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Customer Testimonials */}
      <section className="py-20 bg-[#FDF6E3] relative">
        <div className="absolute inset-0 bg-[#F8EDE3] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C2526] mb-4 relative inline-block">
              What Our Customers Say
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#800020] to-[#A0002A] rounded-full"></span>
            </h2>
            <p className="text-[#1C2526] max-w-2xl mx-auto mt-6 text-lg">Hear from our happy customers who love our sarees and craftsmanship</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Chennai",
                review: "The Kanjivaram saree I bought was absolutely stunning! The quality and craftsmanship are unmatched. I received countless compliments at my sister's wedding.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              },
              {
                name: "Anita Rao",
                location: "Hyderabad",
                review: "I wore their bridal saree for my wedding, and it made me feel like a queen. The intricate zari work was exquisite. Highly recommend!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              },
              {
                name: "Meena Kapoor",
                location: "Mumbai",
                review: "The designer sarees are so unique. I get compliments every time I wear one! The fabric quality is exceptional and the colors are vibrant.",
                rating: 4,
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#F8EDE3] rounded-2xl overflow-hidden shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-[#FDF6E3] relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A4D3E] to-[#800020] group-hover:from-[#800020] group-hover:to-[#A0002A] transition-all duration-300"></div>
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#1A4D3E] shadow-md group-hover:border-[#800020] transition-colors duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#800020] to-[#A0002A] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                      {testimonial.rating}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1C2526]">{testimonial.name}</h3>
                    <p className="text-sm text-[#1C2526]">{testimonial.location}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-[#800020]' : 'text-[#1A4D3E]'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#1C2526] italic relative pl-6 before:content-['“'] before:absolute before:left-0 before:text-4xl before:text-[#1A4D3E] before:top-0 before:font-serif group-hover:before:text-[#800020] transition-colors duration-300">
                  {testimonial.review}
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