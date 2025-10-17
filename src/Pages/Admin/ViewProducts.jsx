// src/pages/admin/ViewProducts.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/ProductApi';
import authApi from '../../Services/authApi';

const ViewProducts = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 🔥 CAROUSEL STATE

  // 🔥 FETCH PRODUCT FROM API
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    // if (!authApi.isLoggedIn()) {
    //   toast.error('Please login first!');
    //   return;
    // }

    // setLoading(true);
    try {
      const result = await productApi.getProduct(id);
      setProduct(result.product);
      console.log('🔍 VIEW IMAGES:', result.product.images?.length || 0, 'images'); // 🔥 SINGLE PRODUCT
      toast.success('Product loaded successfully!');
    } catch (error) {
      toast.error('Failed to load product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const getStatusColor = (stock) => {
    return stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B2D2D]"></div>
              <p className="mt-4 text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
              <Link to="/admin/products" className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg">
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
      <Sidebar />
      
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
                    to="/admin/products"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Products</span>
                  </Link>
                  <Link
                    to={`/admin/editproduct/${product.key}`}
                    className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Product</span>
                  </Link>
                </div>
              </div>

              {/* Product Overview */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Images - CLICKABLE CAROUSEL */}
                  <div className="space-y-4">
                    {/* MAIN IMAGE */}
                    <div className="relative">
                      <img
                        src={product.images?.[currentImageIndex] || 'https://via.placeholder.com/400x500?text=No+Image'}
                        alt={product.name}
                        className="w-full h-96 object-cover rounded-2xl shadow-lg cursor-pointer"
                        onClick={() => setCurrentImageIndex(0)}
                      />
                      {product.badge && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#6B2D2D] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {product.badge}
                          </span>
                        </div>
                      )}
                      {calculateDiscount() > 0 && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {calculateDiscount()}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* CLICKABLE THUMBNAILS */}
                    {product.images && product.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {product.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                              currentImageIndex === index 
                                ? 'border-[#6B2D2D] ring-2 ring-[#6B2D2D]' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Product Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.stock)}`}>
                        {product.stock > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                      <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-[#6B2D2D]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xl text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.extraCharges && (
                        <p className="text-sm text-gray-600">+ {formatPrice(product.extraCharges)} Extra Charges</p>
                      )}
                      {calculateDiscount() > 0 && (
                        <p className="text-green-600 font-semibold">
                          You save {formatPrice(product.originalPrice - product.price)} ({calculateDiscount()}% off)
                        </p>
                      )}
                    </div>

                    {/* Occasions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Suitable For</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.occasion?.map((occasion, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {occasion}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Specifications */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Material</h4>
                        <p className="text-gray-800 font-medium">{product.material}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Weight</h4>
                        <p className="text-gray-800 font-medium">{product.weight}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Origin</h4>
                        <p className="text-gray-800 font-medium">{product.origin}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Length</h4>
                        <p className="text-gray-800 font-medium">{product.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Details */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Product Details</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Material</label>
                        <p className="text-gray-800 font-medium">{product.material}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Weave Type</label>
                        <p className="text-gray-800 font-medium">{product.weave}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Border Design</label>
                        <p className="text-gray-800 font-medium">{product.border}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Care Instructions</label>
                        <p className="text-gray-800 font-medium">{product.care}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Weight</label>
                        <p className="text-gray-800 font-medium">{product.weight}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Place of Origin</label>
                        <p className="text-gray-800 font-medium">{product.origin}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size & Fit Guide */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Size & Fit Guide</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 leading-relaxed">{product.sizeGuide}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Standard Saree Measurements:</h4>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Total Length: {product.length}</li>
                        <li>• Saree Length: 5.5 meters</li>
                        <li>• Blouse Piece: 1 meter</li>
                        <li>• Width: 47-48 inches</li>
                        <li>• Suitable for heights 5'0" to 5'8"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory & Meta Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Inventory & Meta</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Current Stock</h4>
                    <p className={`text-2xl font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? 'Available' : 'Out of Stock'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">units available</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Product Status</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.stock)}`}>
                      {product.stock > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Product ID</h4>
                    <p className="text-lg font-mono font-bold text-gray-800">#{product.key}</p>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Created On</span>
                      <span className="font-medium text-gray-800">
                        {new Date(product.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium text-gray-800">
                        {new Date(product.updatedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link
                  to="/admin/products"
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Back to List
                </Link>
                <Link
                  to={`/admin/editproduct/${product.key}`}
                  className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Product</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;