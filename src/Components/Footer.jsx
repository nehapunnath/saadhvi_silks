import React from 'react';
import { FaFacebookF, FaInstagram, FaPinterestP } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-rose-100 to-pink-200 pt-12 pb-6 border-t border-rose-200">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-[#891c3c] mb-4">Saadhvi Silks</h3>
            <p className="text-gray-700 mb-5 leading-relaxed text-sm">
              Bringing you the finest collection of traditional and contemporary silk sarees, 
              crafted with love and generations of expertise.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-white p-2.5 rounded-full text-[#891c3c] hover:bg-[#891c3c] hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="bg-white p-2.5 rounded-full text-[#891c3c] hover:bg-[#891c3c] hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="bg-white p-2.5 rounded-full text-[#891c3c] hover:bg-[#891c3c] hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Pinterest"
              >
                <FaPinterestP className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-[#891c3c]">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {['Home', 'Products', 'About Us', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a 
                    href="/" 
                    className="text-gray-700 hover:text-[#891c3c] transition-colors duration-300 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-rose-300 rounded-full mr-2 group-hover:bg-[#891c3c] transition-colors duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-[#891c3c]">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-[#891c3c] mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700 text-sm">#69/2, AGR Tower, Carmelaram Post, Kaikondrahalli, Sarjapur Main Road, Bengaluru-560035</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-[#891c3c] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700 text-sm">8861315710, 080-41706009</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-[#891c3c] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 text-sm">saadhvisilksblr@gmail.com</span>
              </li>
            </ul>
          </div>
          
          {/* Business Hours */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-[#891c3c]">
              Business Hours
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex justify-between">
                <span>Mon - Sat:</span>
                <span>10:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>11:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        {/* <div className="pt-6 border-t border-rose-200 text-center">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Saadhvi Silks. All rights reserved.
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;