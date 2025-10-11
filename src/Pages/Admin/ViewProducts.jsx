// src/pages/admin/ViewProduct.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SideBar';
import { Link, useParams } from 'react-router-dom';

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  // Sample product data - in real app, this would come from API
  const sampleProducts = [
    {
      id: 1,
      name: "Kanjivaram Silk Saree",
      price: 12499,
      originalPrice: 15999,
      category: "Traditional",
      stock: 15,
      status: "Active",
      image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
      occasion: ["Wedding", "Festival"],
      description: "This authentic Kanjivaram silk saree is a masterpiece of South Indian craftsmanship, featuring intricate traditional motifs woven with pure gold zari. Perfect for weddings and grand celebrations, its rich texture, vibrant colors, and elegant drape exude timeless elegance, making it a cherished addition to any wardrobe.",
      badge: "Bestseller",
      details: {
        material: "Pure Kanjivaram Silk",
        length: "6.5 meters (with blouse piece)",
        weave: "Handwoven with pure zari",
        care: "Dry Clean Only",
        weight: "650 grams",
        border: "Contrast Zari Border",
        origin: "Kanchipuram, Tamil Nadu"
      },
      sizeGuide: "Standard saree length: 5.5m (saree) + 1m (blouse piece). Suitable for all body types."
    },
    // ... other products
  ];

  useEffect(() => {
    // In real app, fetch product by ID from API
    const foundProduct = sampleProducts.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!product) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
              <Link
                to="/admin/products"
                className="text-[#6B2D2D] hover:text-[#8B3A3A] mt-4 inline-block"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
                  <p className="text-gray-600 mt-1">View complete product information</p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to={`/admin/edit-product`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Product</span>
                  </Link>
                  <Link
                    to="/admin/products"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Products</span>
                  </Link>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div>
                    <div className="relative bg-white rounded-2xl overflow-hidden">
                      {product.badge && (
                        <span className="absolute top-4 left-4 bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Product Information */}
                  <div>
                    <h2 className="text-3xl font-semibold text-[#2E2E2E] mb-4">{product.name}</h2>

                    {/* Price */}
                    <div className="flex items-center mb-6">
                      <span className="text-[#6B2D2D] font-bold text-2xl">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-[#2E2E2E] text-lg line-through ml-4">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="ml-4 bg-[#D9A7A7] text-[#800020] text-xs font-semibold px-3 py-1 rounded-full">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${product.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>

                    {/* Occasions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Suitable For</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.occasion.map((occasion, index) => (
                          <span
                            key={index}
                            className="bg-[#800020] text-white text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {occasion}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tabs for Description and Details */}
                    <div className="mb-6">
                      <div className="flex border-b border-[#D9A7A7]">
                        {['description', 'details'].map((tab) => (
                          <button
                            key={tab}
                            className={`px-4 py-2 text-sm font-medium capitalize transition-colors duration-300 ${
                              activeTab === tab
                                ? 'text-[#6B2D2D] border-b-2 border-[#6B2D2D]'
                                : 'text-[#2E2E2E] hover:text-[#3A1A1A]'
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 text-[#2E2E2E]">
                        {activeTab === 'description' && <p className="leading-relaxed">{product.description}</p>}
                        {activeTab === 'details' && product.details && (
                          <ul className="space-y-2">
                            {Object.entries(product.details).map(([key, value]) => (
                              <li key={key} className="flex">
                                <span className="font-medium capitalize w-1/3">{key}:</span>
                                <span>{value}</span>
                              </li>
                            ))}
                            <li className="flex">
                              <span className="font-medium capitalize w-1/3">Size Guide:</span>
                              <span>{product.sizeGuide}</span>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;