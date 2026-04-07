import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8]">
      {/* Hero Section - Only Heading and Button */}
      <section className="relative bg-gradient-to-r from-[#F9F3F3] to-[#F7F0E8] bg-opacity-90 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5D4037] mb-8">
              About  <span className="text-[#800020]">Saadhvi Silks</span>
            </h1>
            <a
              href="/products"
              className="bg-[#800020] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#5D4037] transition-colors duration-300 shadow-lg inline-block"
            >
              Explore Our Collection
            </a>
          </div>
        </div>
      </section>

      {/* Opening Paragraph */}
<section className="py-16 md:py-20 bg-[#800020]">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto text-center">
      {/* Heading with decorative elements */}
      <div className="mb-10">
        <span className="text-[#F9F3F3]/50 text-sm uppercase tracking-[0.3em] font-light">Welcome to</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F9F3F3] mt-2">
          The Soul of the <span className="text-[#F7F0E8]  decoration-[#B8860B]/50 decoration-2">Six Yards</span>
        </h2>
      </div>
      
      {/* Paragraph */}
      <p className="text-xl md:text-2xl text-[#F9F3F3] leading-relaxed">
        Born in the vibrant heart of Bengaluru, 
        <span className="block mt-2 md:inline md:mt-0"></span>
        <span className="font-semibold text-[#F7F0E8]">Saadhvi Silks</span> began its journey as a simple tribute-
        <span className="block mt-2 md:inline md:mt-0"></span>
        a deep admiration for the fine craftsmanship and soulful designs of our 
        <span className="font-semibold text-[#F7F0E8]"> traditional weavers</span>.
      </p>
    </div>
  </div>
</section>

      {/* Professional Founder Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#800020]/10">
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-[#800020] via-[#B8860B] to-[#800020]"></div>
              
              <div className="p-8 md:p-12">
                {/* Professional Header */}
                <div className="text-center mb-12">
                  <div className="inline-block px-4 py-1 rounded-full bg-[#800020]/5 border border-[#800020]/10 mb-6">
                    <span className="text-xs font-medium text-[#800020] tracking-wider uppercase">Founder's Note</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-2">
                    Sumitha Reddy
                  </h2>
                  <p className="text-[#800020] font-medium text-lg">Founder, Saadhvi Silks</p>
                  
                  {/* Divider */}
                  <div className="flex justify-center gap-2 mt-6">
                    <span className="w-12 h-px bg-[#800020]/30"></span>
                    <span className="w-2 h-2 rounded-full bg-[#800020]"></span>
                    <span className="w-12 h-px bg-[#800020]/30"></span>
                  </div>
                </div>

                {/* Quote - Elegantly Styled */}
                <div className="mb-12">
                  <div className="relative">
                    <svg className="absolute -top-6 -left-4 w-10 h-10 text-[#800020]/15" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-[#5D4037] text-xl md:text-2xl leading-relaxed text-center italic font-medium px-6">
                      "To me, a saree is far more than just six yards of fabric; 
                      it is a living art form that gently connects us back to our roots."
                      "I personally handpick every piece—from the soft comfort of daily-wear cottons 
                        to the exquisite grace of bridal silks—ensuring only the finest quality for you."
                    </p>
                    <svg className="absolute -bottom-6 -right-4 w-10 h-10 text-[#800020]/15 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>

                

                {/* Call to Action */}
                <div className="text-center pt-8 border-t border-[#800020]/15">
  <div className="inline-block w-full md:w-auto">
    {/* Animated background highlight */}
    <div className="relative overflow-hidden rounded-full group">
      {/* Pulsing background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#800020] via-[#B8860B] to-[#800020] animate-pulse"></div>
      
      {/* Hover zoom effect layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#800020] to-[#3a1a0e] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      {/* Main button */}
      <div className="relative bg-gradient-to-r from-[#800020] to-[#5D4037] text-white px-10 py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer border-2 border-[#B8860B]/30">
        <div className="flex items-center gap-3">
          <span className="text-base md:text-xl font-bold tracking-wide">
            We warmly invite you to find your own story within our collection
          </span>
        </div>
      </div>
    </div>
    
    {/* Supporting tagline */}
    <div className="mt-4 flex items-center justify-center gap-2">
      <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#800020]/40"></span>
      <span className="text-[#800020] text-sm font-medium uppercase tracking-wider">Begin your journey today</span>
      <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#800020]/40"></span>
    </div>
  </div>
</div>
              </div>
              
              {/* Bottom accent bar */}
              <div className="h-0.5 bg-gradient-to-r from-[#800020]/20 via-[#B8860B]/40 to-[#800020]/20"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;