import React, { useState } from 'react';
import saadhvi from '../assets/saadhvi_silks.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-rose-50 to-pink-100 shadow-lg sticky top-0 z-50 rounded-b-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#home" aria-label="Saadhvi Silks Home">
            <img 
              src={saadhvi} 
              alt="Saadhvi Silks Logo" 
              className="h-16 md:h-20 w-auto transition-transform duration-300 hover:scale-105"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {[
            { href: "/", label: "Home" },
            { href: "products", label: "Products" },
            { href: "about", label: "About Us" },
            { href: "contact", label: "Contact Us" }
          ].map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="text-gray-800 text-lg font-medium transition-all duration-300 hover:text-[#891c3c] hover:scale-110 relative group"
              aria-current={window.location.hash === link.href ? "page" : undefined}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#891c3c] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg className="w-8 h-8 text-gray-700 hover:text-[#891c3c] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden bg-white shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
        }`}
      >
        <div className="flex flex-col space-y-4 px-6 py-4">
          {[
            { href: "/", label: "Home" },
            { href: "products", label: "Products" },
            { href: "about", label: "About Us" },
            { href: "contact", label: "Contact Us" }
          ].map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="text-gray-800 text-lg font-medium py-2 transition-all duration-300 hover:text-[#891c3c] hover:pl-2 border-l-4 border-transparent hover:border-[#891c3c]"
              onClick={() => setIsMenuOpen(false)}
              aria-current={window.location.hash === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;