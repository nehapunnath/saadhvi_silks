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
    <header className="bg-gradient-to-r from-[#FFF8E1] to-[#F5E6D3] bg-opacity-90 shadow-xl sticky top-0 z-50 rounded-b-2xl">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" aria-label="Saadhvi Silks Home">
            <img
              src={saadhvi}
              alt="Saadhvi Silks Logo"
              className="h-16 md:h-20 w-auto transition-transform duration-500 hover:scale-110 hover:rotate-3 drop-shadow-md"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-[#2E2E2E] text-lg font-semibold relative group transition-all duration-400 ease-in-out hover:text-[#3A1A1A] hover:scale-105"
            aria-current={window.location.pathname === '/' ? 'page' : undefined}
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6B2D2D] transition-all duration-400 group-hover:w-full rounded-full"></span>
          </Link>
          <Link
            to="/about"
            className="text-[#2E2E2E] text-lg font-semibold relative group transition-all duration-400 ease-in-out hover:text-[#3A1A1A] hover:scale-105"
            aria-current={window.location.pathname === '/about' ? 'page' : undefined}
          >
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6B2D2D] transition-all duration-400 group-hover:w-full rounded-full"></span>
          </Link>
          <Link
            to="/products"
            className="text-[#2E2E2E] text-lg font-semibold relative group transition-all duration-400 ease-in-out hover:text-[#3A1A1A] hover:scale-105"
            aria-current={window.location.pathname === '/products' ? 'page' : undefined}
          >
            Collections
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6B2D2D] transition-all duration-400 group-hover:w-full rounded-full"></span>
          </Link>
          <Link
            to="/contact"
            className="text-[#2E2E2E] text-lg font-semibold relative group transition-all duration-400 ease-in-out hover:text-[#3A1A1A] hover:scale-105"
            aria-current={window.location.pathname === '/contact' ? 'page' : undefined}
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6B2D2D] transition-all duration-400 group-hover:w-full rounded-full"></span>
          </Link>
          {/* Search Icon */}
          <button
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300"
            onClick={toggleSearch}
            aria-label="Toggle search bar"
            aria-expanded={isSearchOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>
          {/* Cart Icon */}
          <Link to="/cart">
            <button
              className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 relative"
              aria-label="View Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#6B2D2D] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
          </Link>
          {/* Wishlist Icon */}
          <Link to="/wishlist">
            <button
              className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 relative"
              aria-label="View Wishlist"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#6B2D2D] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none relative z-50"
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
        className={`container mx-auto px-6 transition-all duration-500 ease-in-out transform ${
          isSearchOpen ? 'max-h-20 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
        } overflow-hidden`}
      >
        <form onSubmit={handleSearch} className="relative py-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sarees..."
            className="w-full bg-white border border-[#D9A7A7] text-[#2E2E2E] text-sm rounded-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B2D2D] transition-all duration-300"
            aria-label="Search sarees"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B2D2D] hover:text-[#3A1A1A] transition-colors duration-300"
            aria-label="Submit search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>
          <button
            onClick={toggleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B2D2D] hover:text-[#3A1A1A] transition-colors duration-300"
            aria-label="Close search bar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden bg-gradient-to-b from-[#FFF8E1] to-[#F5E6D3] shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
        }`}
      >
        <div className="flex flex-col space-y-4 px-8 py-6">
          <Link
            to="/"
            className="text-[#2E2E2E] text-lg font-semibold py-2 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-3 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-[#2E2E2E] text-lg font-semibold py-2 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-3 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/about' ? 'page' : undefined}
          >
            About Us
          </Link>
          <Link
            to="/products"
            className="text-[#2E2E2E] text-lg font-semibold py-2 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-3 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/products' ? 'page' : undefined}
          >
            Collections
          </Link>
          <Link
            to="/contact"
            className="text-[#2E2E2E] text-lg font-semibold py-2 transition-all duration-300 hover:text-[#3A1A1A] hover:pl-3 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
            aria-current={window.location.pathname === '/contact' ? 'page' : undefined}
          >
            Contact Us
          </Link>
          {/* Mobile Search Icon */}
          <button
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 text-left py-2 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={toggleSearch}
            aria-label="Toggle search bar"
            aria-expanded={isSearchOpen}
          >
            <span className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Search
            </span>
          </button>
          {/* Mobile Cart */}
          <Link
            to="/cart"
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 text-left py-2 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              <span className="ml-2 bg-[#6B2D2D] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </span>
          </Link>
          {/* Mobile Wishlist */}
          <Link
            to="/wishlist"
            className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 text-left py-2 border-l-4 border-transparent hover:border-[#6B2D2D] rounded-l-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
              <span className="ml-2 bg-[#6B2D2D] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;