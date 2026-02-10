// src/Components/SideBar.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authApi from '../Services/authApi';
import { signOut } from 'firebase/auth';
import { auth } from '../Services/firebase'; 
import toast from 'react-hot-toast';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'products',
      label: 'Products',
      path: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 'orders',
      label: 'Orders',
      path: '/admin/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
     {
      id: 'gallery',
      label: 'Gallery',
      path: '/admin/gallery',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
  ];

  const handleLogout = async () => {
    try {
      // 1. Clear local storage
      authApi.logout();

      // 2. Sign out from Firebase Auth
      await signOut(auth);

      // 3. Redirect to login
      navigate('/login', { replace: true });
      toast.error("Admin logged out successfully.")
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if Firebase fails
      authApi.logout();
      navigate('/login', { replace: true });
      toast.error("Admin logged out successfully.")

    }
  };

  return (
    <div className={`bg-[#6B2D2D] text-white h-screen fixed left-0 top-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-[#8B3A3A]">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#6B2D2D] text-sm font-bold">SS</span>
            </div>
            <span className="text-lg font-bold">Saadhvi Silks</span>
          </div>
        )}
        {!isOpen && (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto">
            <span className="text-[#6B2D2D] text-sm font-bold">SS</span>
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center rounded-lg px-3 py-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-[#6B2D2D] shadow-md' 
                  : 'text-white hover:bg-[#8B3A3A] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              {isOpen && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-[#8B3A3A]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center rounded-lg px-3 py-3 text-white hover:bg-[#8B3A3A] transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && (
            <span className="ml-3 font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;