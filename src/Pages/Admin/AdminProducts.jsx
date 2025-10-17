// src/pages/admin/Products.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/ProductApi';
import authApi from '../../Services/authApi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔥 18 CATEGORIES FOR FILTER
  const categories = [
    'All', 'Bridal collection', 'Kanjivaram', 'Silk', 'Soft silk',
    'Ikkat silk', 'Silk dhoti', 'Banaras', 'Tussar', 'Designer',
    'Fancy', 'Cotton', 'Daily wear', 'Lehenga', 'Dress material',
    'Readymade', 'Sale'
  ];

  // 🔥 FETCH PRODUCTS FROM API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // if (!authApi.isLoggedIn()) {
    //   toast.error('Please login first!');
    //   setLoading(false);
    //   return;
    // }

    // setLoading(true);
    try {
      const result = await productApi.getProducts();
      setProducts(result.products);
      console.log('🔍 IMAGES:', products.map(p => ({name: p.name, images: p.images?.length})));
      toast.success(`Loaded ${result.products.length} products!`);
    } catch (error) {
      toast.error('Failed to load products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.deleteProduct(id);
      setProducts(products.filter(product => product.key !== id));
      
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Delete failed: ' + error.message);
    }
  };

  // 🔥 UPDATE STOCK STATUS
  const handleStockChange = async (productId, status) => {
    try {
      const newStock = status === 'Available' ? 1 : 0;
      await productApi.updateProduct(productId, { stock: newStock });

      setProducts(products.map(product =>
        product.key === productId
          ? { ...product, stock: newStock }
          : product
      ));

      toast.success(`Stock updated to ${status}!`);
    } catch (error) {
      toast.error('Failed to update stock: ' + error.message);
    }
  };

  // 🔥 FILTER PRODUCTS
  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B2D2D]"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
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
                  <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
                  <p className="text-gray-600 mt-1">Manage your product inventory and listings</p>
                </div>
                <Link
                  to="/admin/addproducts"
                  className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Product</span>
                </Link>
              </div>

              {/* Products Count & Filters */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
                      <p className="text-3xl font-bold text-[#6B2D2D] mt-1">{products.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Active Products</p>
                      <p className="text-xl font-semibold text-green-600">
                        {products.filter(p => p.stock > 0).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div> */}
              {/* </div> */}

              {/* Category Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.images?.[0] || 'https://via.placeholder.com/48?text=No+Image'}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                                {product.badge && (
                                  <span className="inline-block bg-[#6B2D2D] text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                                    {product.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            <div>
                              <div>{formatPrice(product.price)}</div>
                              {product.originalPrice && (
                                <div className="text-xs text-gray-500 line-through">
                                  {formatPrice(product.originalPrice)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={product.stock > 0 ? 'Available' : 'Out of Stock'}
                              onChange={(e) => handleStockChange(product.key, e.target.value)}
                              className="px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-[#6B2D2D] focus:outline-none"
                              style={{
                                backgroundColor: product.stock > 0 ? '#dcfce7' : '#fecaca',
                                color: product.stock > 0 ? '#166534' : '#991b1b'
                              }}
                            >
                              <option value="Available">Available</option>
                              <option value="Out of Stock">Out of Stock</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              {/* View Button */}
                              <Link
                                to={`/admin/viewproducts/${product.key}`}
                                className="text-green-600 hover:text-green-800 transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>View</span>
                              </Link>

                              {/* Edit Button */}
                              <Link
                                to={`/admin/editproduct/${product.key}`}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </Link>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(product.key)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No Results */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || filterCategory !== 'All'
                        ? 'Try adjusting your search or filter.'
                        : 'Get started by adding your first product.'
                      }
                    </p>
                    <Link
                      to="/admin/addproducts"
                      className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 inline-flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Product</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <div className="flex justify-center">
                <button
                  onClick={fetchProducts}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Products</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;