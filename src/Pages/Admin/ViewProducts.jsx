// src/pages/admin/ViewProducts.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/proApi';

const ViewProducts = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const result = await productApi.getProduct(id);
      setProduct(result.product);
      toast.success('Product loaded successfully!');
    } catch (error) {
      toast.error('Failed to load product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';
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

  // Check if offer is active
  const hasActiveOffer = product?.hasOffer === true && product?.offerPrice > 0;

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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product not found</h3>
              <Link to="/admin/products" className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A]">
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
                <Link
                  to="/admin/products"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Products</span>
                </Link>
              </div>

              {/* Product Overview */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Images Section */}
                    <div className="space-y-4">
                      {/* Main Image */}
                      <div className="relative">
                        <img
                          src={product.images?.[currentImageIndex] || 'https://via.placeholder.com/600x700?text=No+Image'}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-96 object-cover rounded-2xl shadow-lg"
                        />

                        {/* Badges on Image */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.badge && (
                            <span className="bg-[#6B2D2D] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow">
                              {product.badge}
                            </span>
                          )}
                          {hasActiveOffer && (
                            <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow">
                              OFFER ACTIVE
                            </span>
                          )}
                          {calculateDiscount() > 0 && !hasActiveOffer && (
                            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow">
                              {calculateDiscount()}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Thumbnails */}
                      {product.images && product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {product.images.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              loading="lazy"
                              decoding="async"
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-3 transition-all ${
                                currentImageIndex === index
                                  ? 'border-[#6B2D2D] shadow-lg'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Stock & Category Tags */}
                      <div className="flex flex-wrap gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(product.stock)}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                     
                      </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-7">

                      {/* Name & Description */}
                      <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                      </div>

                      {/* Offer Display - Simple & Clean */}
                      {hasActiveOffer ? (
                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                          <p className="text-green-800 font-bold text-lg mb-2">
                            Special Offer: {product.offerName || 'Limited Time Deal'}
                          </p>
                          <div className="flex items-end gap-4">
                            <span className="text-2xl text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-5xl font-bold text-green-600">
                              {formatPrice(product.offerPrice)}
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mt-2 font-medium">
                            Offer applied successfully
                          </p>
                        </div>
                      ) : (
                        /* Normal Price Display */
                        <div className="space-y-3">
                          <div className="flex items-end gap-5">
                            <span className="text-5xl font-bold text-[#6B2D2D]">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-2xl text-gray-500 line-through pb-1">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {calculateDiscount() > 0 && (
                            <p className="text-green-600 font-semibold text-lg">
                              You save {formatPrice(product.originalPrice - product.price)} ({calculateDiscount()}% off)
                            </p>
                          )}
                        </div>
                      )}

                      {/* Extra Charges */}
                      {product.extraCharges > 0 && (
                        <p className="text-gray-600">
                          + {formatPrice(product.extraCharges)} Extra Charges
                        </p>
                      )}

                      {/* Occasions */}
                      {product.occasion?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Perfect For</h3>
                          <div className="flex flex-wrap gap-2">
                            {product.occasion.map((occ, i) => (
                              <span key={i} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                                {occ}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Specs */}
                      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        {product.material && (
                          <div>
                            <p className="text-sm text-gray-500">Material</p>
                            <p className="font-semibold text-gray-900">{product.material}</p>
                          </div>
                        )}
                        {product.weight && (
                          <div>
                            <p className="text-sm text-gray-500">Weight</p>
                            <p className="font-semibold text-gray-900">{product.weight}</p>
                          </div>
                        )}
                        {product.origin && (
                          <div>
                            <p className="text-sm text-gray-500">Origin</p>
                            <p className="font-semibold text-gray-900">{product.origin}</p>
                          </div>
                        )}
                        {product.length && (
                          <div>
                            <p className="text-sm text-gray-500">Length</p>
                            <p className="font-semibold text-gray-900">{product.length}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details & Size Guide */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Specifications</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {['material', 'weave', 'border', 'care', 'weight', 'origin'].map(field => product[field] && (
                      <div key={field} className="mb-5">
                        <p className="text-sm text-gray-500 capitalize">{field.replace('weave', 'Weave Type').replace('border', 'Border Design')}</p>
                        <p className="font-medium text-gray-900">{product[field]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Size & Fit Guide</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.sizeGuide || 'No size guide provided.'}
                  </p>
                </div>
              </div>

              {/* Inventory Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Inventory Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-sm text-gray-500">Stock Status</p>
                    <p className={`text-2xl font-bold mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? 'Available' : 'Out of Stock'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-sm text-gray-500">Product ID</p>
                    <p className="text-xl font-mono font-bold text-gray-800 mt-2">#{product.key}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-lg font-medium text-gray-800 mt-2">
                      {new Date(product.updatedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Link
                  to="/admin/products"
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Back to List
                </Link>
                <Link
                  to={`/admin/editproducts/${product.key}`}
                  className="px-8 py-3 bg-[#6B2D2D] text-white rounded-lg hover:bg-[#8B3A3A] transition flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Product
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