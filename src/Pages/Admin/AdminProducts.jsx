// src/pages/admin/Products.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/proApi';
import categoryApi from '../../Services/CategoryApi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Offer Modal States
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [offerName, setOfferName] = useState('Buy 1 Get 1 Free');
  const [offerPrice, setOfferPrice] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsResult, categoriesResult] = await Promise.all([
        productApi.getProducts(),
        categoryApi.getCategories()
      ]);

      setProducts(productsResult.products || []);

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories || []);
      } else {
        toast.error('Failed to load categories');
        setCategories([]);
      }

      toast.success(`Loaded ${productsResult.products?.length || 0} products!`);
    } catch (error) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleStockChange = async (productId, status) => {
    try {
      const newStock = status === 'Available' ? 1 : 0;
      await productApi.updateStock(productId, newStock);

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

  // Offer Handlers
  const openOfferModal = (productId, currentOffer = null) => {
    setSelectedProductId(productId);
    setOfferName(currentOffer?.offerName || 'Buy 1 Get 1 Free');
    setOfferPrice(currentOffer?.offerPrice ? currentOffer.offerPrice.toString() : '');
    setOfferModalOpen(true);
  };

  const closeOfferModal = () => {
    setOfferModalOpen(false);
    setSelectedProductId(null);
    setOfferName('Buy 1 Get 1 Free');
    setOfferPrice('');
  };

  const handleSaveOffer = async () => {
    if (!offerPrice || isNaN(offerPrice) || Number(offerPrice) <= 0) {
      toast.error('Please enter a valid offer price');
      return;
    }

    try {
      const offerData = {
        hasOffer: true,
        offerName: offerName.trim() || 'Buy 1 Get 1 Free',
        offerPrice: Number(offerPrice)
      };

      // Update backend (adjust endpoint as needed)
      await productApi.updateProductOffer(selectedProductId, offerData);

      setProducts(products.map(p =>
        p.key === selectedProductId
          ? { ...p, ...offerData }
          : p
      ));

      toast.success('Offer applied successfully!');
      closeOfferModal();
    } catch (error) {
      toast.error('Failed to apply offer: ' + error.message);
    }
  };

  const handleRemoveOffer = async (productId) => {
    if (!window.confirm('Remove offer from this product?')) return;

    try {
      await productApi.updateProductOffer(productId, {
        hasOffer: false,
        offerName: null,
        offerPrice: null
      });

      setProducts(products.map(p =>
        p.key === productId
          ? { ...p, hasOffer: false, offerName: null, offerPrice: null }
          : p
      ));

      toast.success('Offer removed');
    } catch (error) {
      toast.error('Failed to remove offer');
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price) => {
    if (!price) return '₹0';
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

              {/* Search and Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
                      <p className="text-3xl font-bold text-[#6B2D2D] mt-1">{products.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">In Stock</p>
                      <p className="text-xl font-semibold text-green-600">
                        {products.filter(p => p.stock > 0).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                >
                  <option value="All">All Categories</option>
                  {categories
                    .filter(cat => cat.isActive !== false)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
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
                                loading="lazy"
                                decoding="async"
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
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
                              {getCategoryName(product.category)}
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

                          {/* OFFER COLUMN */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => {
                                  if (product.hasOffer) {
                                    handleRemoveOffer(product.key);
                                  } else {
                                    openOfferModal(product.key, {
                                      offerName: product.offerName,
                                      offerPrice: product.offerPrice
                                    });
                                  }
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B2D2D] focus:ring-offset-2 ${
                                  product.hasOffer ? 'bg-[#6B2D2D]' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    product.hasOffer ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>

                              {product.hasOffer && (
                                <div className="text-sm">
                                  <div className="font-bold text-green-600">
                                    {formatPrice(product.offerPrice)}
                                  </div>
                                  <div className="text-xs text-gray-600 truncate max-w-[120px]">
                                    {product.offerName}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={product.stock > 0 ? 'Available' : 'Out of Stock'}
                              onChange={(e) => handleStockChange(product.key, e.target.value)}
                              className="px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-[#6B2D2D]"
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
                            <div className="flex space-x-4">
                              <Link to={`/admin/viewproducts/${product.key}`} className="text-green-600 hover:text-green-800 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                <span>View</span>
                              </Link>
                              <Link to={`/admin/editproducts/${product.key}`} className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                <span>Edit</span>
                              </Link>
                              <button onClick={() => handleDeleteProduct(product.key)} className="text-red-600 hover:text-red-800 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No Products */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterCategory !== 'All'
                        ? 'Try adjusting your search or filter.'
                        : 'Get started by adding your first product.'}
                    </p>
                    <Link to="/admin/addproducts" className="mt-4 inline-flex items-center px-6 py-3 bg-[#6B2D2D] text-white rounded-lg hover:bg-[#8B3A3A]">
                      Add Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OFFER MODAL */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Product Offer</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Name</label>
                <input
                  type="text"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  placeholder="e.g. Buy 1 Get 1 Free"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price (₹)</label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Enter discounted price"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={closeOfferModal}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOffer}
                className="px-6 py-2 bg-[#6B2D2D] text-white rounded-lg hover:bg-[#8B3A3A] transition"
              >
                Apply Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;