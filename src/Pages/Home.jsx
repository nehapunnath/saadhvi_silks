import React, { useState, useEffect } from 'react';

const Home = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Sample offers data
  const offers = [
    { 
      id: 1, 
      title: "Festival Special", 
      discount: "20% OFF", 
      description: "On all traditional silk sarees", 
      code: "FEST20",
      expiry: "Valid until Oct 30, 2023"
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
      expiry: "Valid until Dec 31, 2023"
    }
  ];

  // Auto-scroll offers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [offers.length]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Luxurious Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-20 md:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#891c3c] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#891c3c] opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gold-500 opacity-10 rounded-full transform -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="mb-6">
              <span className="text-xs tracking-widest text-[#891c3c] font-semibold bg-rose-100 px-3 py-1 rounded-full shadow-sm">PREMIUM SILK SAREES</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Elegance Woven <span className="text-[#891c3c] block mt-2">With Tradition</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md leading-relaxed">
              Discover our exquisite collection of silk sarees, crafted with precision and love for the traditional art of weaving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="relative overflow-hidden group bg-gradient-to-r from-[#891c3c] to-[#ad2c55] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                <span className="relative z-10">Explore Collection</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-[#6a1530] to-[#891c3c] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-200 to-amber-100 rounded-2xl transform rotate-2 blur-lg opacity-70"></div>
              <img 
                src="https://5.imimg.com/data5/ECOM/Default/2023/6/314732479/TB/BA/QB/142115856/7009-x4-500x500.jpg" 
                alt="Elegant Silk Saree" 
                className="relative rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-700 hover:scale-105 z-10"
              />
              {/* Floating elements */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section with Scrolling Effect */}
      <section className="py-12 bg-gradient-to-r from-[#891c3c] to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/silk.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white text-center mb-8">
            Special Offers
          </h2>
          
          <div className="relative overflow-hidden">
            {/* Scrolling offers container */}
            <div className="flex animate-scroll-offers space-x-6">
              {offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className="flex-shrink-0 w-72 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg"
                >
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <div className="text-2xl font-serif font-bold text-amber-300 mb-3">
                      {offer.discount}
                    </div>
                    <p className="text-amber-100 mb-4">{offer.description}</p>
                    <div className="bg-white/20 rounded-lg p-2 mb-2">
                      <span className="text-white font-mono">Use code: </span>
                      <span className="font-bold text-amber-300">{offer.code}</span>
                    </div>
                    <p className="text-xs text-amber-200">{offer.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gradient fades on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#891c3c] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#891c3c] to-transparent z-10"></div>
          </div>
          
          <style jsx>{`
            @keyframes scroll-offers {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-288px * 4 - 1.5rem * 3));
              }
            }
            
            .animate-scroll-offers {
              animation: scroll-offers 30s linear infinite;
              width: calc(288px * 8 + 1.5rem * 7);
            }
            
            .animate-scroll-offers:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>

      {/* Enhanced Saree Collections */}
      <section className="py-20 bg-white relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[3%] bg-[url('https://www.transparenttextures.com/patterns/silk.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 relative inline-block">
              Our Saree Collections
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#891c3c] to-amber-500 rounded-full"></span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mt-6 text-lg">Discover the perfect blend of tradition and contemporary design in our carefully curated saree collections</p>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#891c3c] to-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {category.items}
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:translate-y-0 transform">{category.name}</h3>
                  <p className="text-rose-100 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{category.description}</p>
                  <button className="self-start bg-gradient-to-r from-[#891c3c] to-amber-600 text-white px-5 py-2 rounded-lg font-medium hover:from-[#6a1530] hover:to-amber-700 transition-all duration-300 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center shadow-md">
                    <span>Explore</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Sarees */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#891c3c] opacity-5 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#891c3c] opacity-5 rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 relative inline-block">
              Bestselling Sarees
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#891c3c] to-amber-500 rounded-full"></span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mt-6 text-lg">Our most loved sarees, cherished by women nationwide for their exquisite craftsmanship</p>
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
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group border border-gray-100">
                <div className="relative overflow-hidden">
                  {product.badge && (
                    <span className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md ${
                      product.badge === "Bestseller" ? "bg-gradient-to-r from-amber-500 to-amber-600" :
                      product.badge === "Popular" ? "bg-gradient-to-r from-pink-500 to-pink-600" :
                      "bg-gradient-to-r from-green-500 to-green-600"
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
                      <button className="bg-white/90 text-[#891c3c] p-2 rounded-full mx-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="bg-white/90 text-[#891c3c] p-2 rounded-full mx-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="bg-white/90 text-[#891c3c] p-2 rounded-full mx-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#891c3c] transition-colors duration-300">{product.name}</h3>
                  
                  <div className="flex items-center mt-2 mb-4">
                    <span className="text-[#891c3c] font-bold text-lg">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 text-sm line-through ml-2">{product.originalPrice}</span>
                    )}
                  </div>
                  
                  <button className="w-full mt-4 bg-gradient-to-r from-rose-50 to-amber-50 text-[#891c3c] py-3 rounded-lg font-medium hover:from-[#891c3c] hover:to-[#6a1530] hover:text-white transition-all duration-300 border border-rose-200 shadow-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button className="relative overflow-hidden group border-2 border-[#891c3c] text-[#891c3c] px-8 py-3 rounded-lg text-lg font-medium hover:text-white transition-all duration-300 shadow-md">
              <span className="absolute inset-0 bg-gradient-to-r from-[#891c3c] to-amber-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
              <span className="relative z-10 flex items-center justify-center">
                View All Sarees
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Customer Testimonials */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-rose-50 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 relative inline-block">
              What Our Customers Say
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#891c3c] to-amber-500 rounded-full"></span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mt-6 text-lg">Hear from our happy customers who love our sarees and craftsmanship</p>
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
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-rose-50 relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-200 to-[#891c3c] group-hover:from-amber-400 group-hover:to-amber-600 transition-all duration-300"></div>
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-rose-100 shadow-md group-hover:border-amber-200 transition-colors duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#891c3c] to-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                      {testimonial.rating}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic relative pl-6 before:content-['“'] before:absolute before:left-0 before:text-4xl before:text-rose-200 before:top-0 before:font-serif group-hover:before:text-amber-200 transition-colors duration-300">
                  {testimonial.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Our Craftsmanship */}
      <section className="py-20 bg-gradient-to-r from-rose-50 to-amber-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#891c3c] opacity-5 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#891c3c] opacity-5 rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 relative inline-block">
              Our Craftsmanship
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#891c3c] to-amber-500 rounded-full"></span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mt-6 text-lg">Experience the artistry and dedication behind every saree we create</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group border border-gray-100">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://assets.aboutamazon.com/dims4/default/da02c6b/2147483647/strip/true/crop/624x351+0+32/resize/1240x698!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2F62%2F3f%2F3ac4f07940999e678f6ad0fbb617%2Fimage1.png" 
                  alt="Weaving Process" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white text-sm font-medium">Traditional Weaving Process</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Traditional Weaving</h3>
                <p className="text-gray-700 mb-4">Our artisans use time-honored techniques to weave each saree, ensuring authenticity and quality that has been perfected over generations.</p>
                <button className="text-[#891c3c] font-medium hover:text-amber-600 transition-colors duration-300 flex items-center">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group border border-gray-100">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://searchforfabric.com/cdn/shop/articles/Quality_Fabric_900x.png?v=1676634155" 
                  alt="Quality Materials" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white text-sm font-medium">Premium Silk Materials</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Materials</h3>
                <p className="text-gray-700 mb-4">We source the finest silks and zari from across India to create sarees that are both luxurious and durable, ensuring you cherish them for years.</p>
                <button className="text-[#891c3c] font-medium hover:text-amber-600 transition-colors duration-300 flex items-center">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;