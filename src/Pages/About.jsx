import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-50 to-pink-100 py-20 md:py-28">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              About <span className="text-[#891c3c]">Saadhvi Silks</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Celebrating the timeless art of saree weaving with passion, tradition, and craftsmanship.
            </p>
            <a
              href="/products"
              className="bg-[#891c3c] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#6a1530] transition-colors duration-300 shadow-lg"
            >
              Explore Our Collection
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Elegant Saree Display"
              className="rounded-lg shadow-xl w-full max-w-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Founded with a deep love for India's rich textile heritage, Saadhvi Silks began as a vision to preserve and promote the art of traditional saree weaving. For over two decades, we have worked with skilled artisans across India to bring you sarees that embody elegance, culture, and craftsmanship.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Traditional Weaving"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-gray-600 text-lg mb-6">
                Each saree tells a story of dedication, woven with threads of tradition and innovation. From the looms of Kanchipuram to the intricate designs of Banaras, our collections are a tribute to the artisans who keep this art form alive.
              </p>
              <p className="text-gray-600 text-lg">
                We strive to blend timeless techniques with contemporary aesthetics to create sarees that resonate with every generation. Our journey began in 1998 when our founder, Mrs. Anjali Mehta, discovered the fading art of handloom weaving during her travels through rural India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Saadhvi Silks, we are committed to delivering unparalleled quality while preserving the cultural legacy of Indian sarees. Our mission is to empower artisans, promote sustainable practices, and bring the beauty of handwoven sarees to the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Craftsmanship",
                description: "Every saree is crafted with precision, using the finest silks and zari to ensure lasting beauty.",
                icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              },
              {
                title: "Artisan Empowerment",
                description: "We work directly with weavers, providing fair wages and support to sustain their craft.",
                icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              },
              {
                title: "Sustainable Practices",
                description: "We prioritize eco-friendly materials and processes to honor both tradition and the environment.",
                icon: "M12 2C6.48 2 2 6.48 2 12s4.48 12 10 12 10-4.48 10-12S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center transition-transform duration-300 hover:-translate-y-2">
                <svg className="w-12 h-12 text-[#891c3c] mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={item.icon} />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Saadhvi Silks, from design to delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Heritage Preservation", description: "Honoring traditional techniques" },
              { title: "Excellence", description: "Uncompromising quality in every thread" },
              { title: "Innovation", description: "Blending tradition with contemporary designs" },
              { title: "Community", description: "Supporting weaving communities across India" }
            ].map((value, index) => (
              <div key={index} className="bg-rose-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-[#891c3c] mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Spotlight */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Artisans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The talented hands behind our beautiful creations, preserving centuries-old traditions.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                // altSkilled Artisan at Work"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Preserving Tradition, One Thread at a Time</h3>
              <p className="text-gray-600 mb-4">
                Our artisans come from generations of weavers who have perfected their craft over centuries. Each saree represents hours of meticulous work, with some pieces taking weeks or even months to complete.
              </p>
              <p className="text-gray-600">
                We partner with over 200 artisans across India, ensuring they receive fair compensation and work in safe conditions. By supporting Saadhvi Silks, you're helping to keep these ancient traditions alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The experiences of those who have adorned our creations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                comment: "The Kanchipuram silk saree I purchased for my wedding was absolutely breathtaking. The craftsmanship was exceptional, and I received countless compliments.",
                location: "New Delhi"
              },
              {
                name: "Meena Patel",
                comment: "As a collector of traditional sarees, I can confidently say that Saadhvi Silks offers some of the finest pieces I've seen. Their attention to detail is remarkable.",
                location: "Mumbai"
              },
              {
                name: "Anjali Reddy",
                comment: "I appreciate that Saadhvi Silks supports traditional weavers. Every purchase feels meaningful, knowing it helps preserve our cultural heritage.",
                location: "Chennai"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#891c3c] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-600">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-16 bg-gradient-to-r from-rose-50 to-pink-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Experience the Artistry</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our collection of exquisite handcrafted sarees and become part of our story.
          </p>
          <a
            href="/products"
            className="bg-[#891c3c] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#6a1530] transition-colors duration-300 shadow-lg inline-block"
          >
            Browse Collection
          </a>
        </div>
      </section> */}
    </div>
  );
};

export default About;