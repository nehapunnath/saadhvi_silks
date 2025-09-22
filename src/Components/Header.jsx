import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import saadhvi from '../assets/saadhvi_silks.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Search query: ${searchQuery}`);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-[#F9F3F3] to-[#F7F0E8] bg-opacity-90 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo - Increased Size */}
        <div className="flex items-center">
          <Link to="/" aria-label="Saadhvi Silks Home">
            <img
              src={saadhvi}
              alt="Saadhvi Silks Logo"
              className="h-20 md:h-24 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Navigation - Increased Font Size */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className="text-[#2E2E2E] px-5 py-3 text-lg font-semibold relative group transition-all duration-300 ease-in-out hover:text-[#3A1A1A]"
            aria-current={window.location.pathname === '/' ? 'page' : undefined}
          >
            Home
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-[#6B2D2D] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
          </Link>
          <Link
            to="/about"
            className="text-[#2E2E2E] px-5 py-3 text-lg font-semibold relative group transition-all duration-300 ease-in-out hover:text-[#3A1A1A]"
            aria-current={window.location.pathname === '/about' ? 'page' : undefined}
          >
            About Us
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-[#6B2D2D] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
          </Link>
          <Link
            to="/products"
            className="text-[#2E2E2E] px-5 py-3 text-lg font-semibold relative group transition-all duration-300 ease-in-out hover:text-[#3A1A1A]"
            aria-current={window.location.pathname === '/products' ? 'page' : undefined}
          >
            Collections
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-[#6B2D2D] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
          </Link>
          <Link
            to="/contact"
            className="text-[#2E2E2E] px-5 py-3 text-lg font-semibold relative group transition-all duration-300 ease-in-out hover:text-[#3A1A1A]"
            aria-current={window.location.pathname === '/contact' ? 'page' : undefined}
          >
            Contact Us
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-[#6B2D2D] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
          </Link>
        </nav>

        {/* Right side icons - Increased Size */}
        <div className="hidden md:flex items-center space-x-5 ml-6">
          {/* Search Icon */}
          <button
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 p-2"
            onClick={toggleSearch}
            aria-label="Toggle search bar"
            aria-expanded={isSearchOpen}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="p-2">
            <button
              className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 relative"
              aria-label="View Wishlist"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#6B2D2D] text-white text-sm rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </button>
          </Link>
          {/* Cart Icon */}
          <Link to="/cart" className="p-2">
            <button
              className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 relative"
              aria-label="View Cart"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#6B2D2D] text-white text-sm rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button - Increased Size */}
        <button
          className="md:hidden focus:outline-none relative z-50 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg className="w-8 h-8 text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Full-Width Search Bar */}
      <div
        className={`container mx-auto px-4 transition-all duration-300 ease-in-out transform ${
          isSearchOpen ? 'max-h-16 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
        } overflow-hidden`}
      >
        <form onSubmit={handleSearch} className="relative py-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sarees, dress materials, and more..."
            className="w-full bg-white border border-[#D9A7A7] text-[#2E2E2E] text-base rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B2D2D] transition-all duration-300"
            aria-label="Search products"
          />
          <button
            type="submit"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B2D2D] hover:text-[#3A1A1A] transition-colors duration-300"
            aria-label="Submit search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>
          <button
            onClick={toggleSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6B2D2D] hover:text-[#3A1A1A] transition-colors duration-300"
            aria-label="Close search bar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      </div>

      {/* Mobile Navigation - Increased Font Size */}
      <div
        className={`md:hidden bg-gradient-to-b from-[#FFF8E1] to-[#F5E6D3] shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
        }`}
      >
        <div className="flex flex-col space-y-0 px-4 py-4">
          <Link
            to="/"
            className="text-[#2E2E2E] text-lg font-semibold py-4 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-4 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-[#2E2E2E] text-lg font-semibold py-4 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-4 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/about' ? 'page' : undefined}
          >
            About Us
          </Link>
          <Link
            to="/products"
            className="text-[#2E2E2E] text-lg font-semibold py-4 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-4 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/products' ? 'page' : undefined}
          >
            Collections
          </Link>
          <Link
            to="/contact"
            className="text-[#2E2E2E] text-lg font-semibold py-4 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-4 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/contact' ? 'page' : undefined}
          >
            Contact Us
          </Link>
          {/* Mobile Search */}
          <button
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 text-left py-4 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => { toggleSearch(); setIsMenuOpen(false); }}
            aria-label="Toggle search bar"
            aria-expanded={isSearchOpen}
          >
            <span className="flex items-center text-lg font-semibold">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Search
            </span>
          </button>
          {/* Mobile Wishlist */}
          <Link
            to="/wishlist"
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 text-left py-4 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center text-lg font-semibold">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
              <span className="ml-3 bg-[#6B2D2D] text-white text-sm rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </span>
          </Link>
          {/* Mobile Cart */}
          <Link
            to="/cart"
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 text-left py-4 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center text-lg font-semibold">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              <span className="ml-3 bg-[#6B2D2D] text-white text-sm rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;