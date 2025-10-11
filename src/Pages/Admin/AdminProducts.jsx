// src/pages/admin/Products.js
import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Kanjivaram Silk Saree",
      price: 12499,
      category: "Traditional",
      stock: 15,
      status: "Active",
      image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
      description: "Authentic Kanjivaram silk saree with pure gold zari work.",
      originalPrice: 15999,
      occasion: ["Wedding", "Festival"],
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
    {
      id: 2,
      name: "Banarasi Silk Saree",
      price: 9999,
      category: "Traditional",
      stock: 8,
      status: "Active",
      image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
      description: "Pure Banarasi silk saree with intricate brocade work.",
      originalPrice: 12999,
      occasion: ["Wedding", "Party"],
      badge: "Popular",
      details: {
        material: "Pure Banarasi Silk",
        length: "6.0 meters (with blouse piece)",
        weave: "Handwoven brocade",
        care: "Dry Clean Only",
        weight: "700 grams",
        border: "Golden Zari Border",
        origin: "Varanasi, Uttar Pradesh"
      },
      sizeGuide: "Standard saree length with intricate border design."
    },
    {
      id: 3,
      name: "Designer Art Silk Saree",
      price: 7499,
      category: "Contemporary",
      stock: 0,
      status: "Out of Stock",
      image: "https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577",
      description: "Designer art silk saree with modern patterns and prints.",
      originalPrice: 8999,
      occasion: ["Party", "Casual"],
      badge: "New",
      details: {
        material: "Art Silk",
        length: "5.5 meters (with blouse piece)",
        weave: "Machine woven",
        care: "Gentle Hand Wash",
        weight: "450 grams",
        border: "Designer Print Border",
        origin: "Surat, Gujarat"
      },
      sizeGuide: "Lightweight saree suitable for casual wear."
    },
    {
      id: 4,
      name: "Tussar Silk Saree",
      price: 6299,
      category: "Traditional",
      stock: 12,
      status: "Active",
      image: "https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg",
      description: "Pure Tussar silk saree with natural golden texture.",
      originalPrice: 7999,
      occasion: ["Festival", "Office"],
      details: {
        material: "Pure Tussar Silk",
        length: "6.0 meters (with blouse piece)",
        weave: "Handwoven",
        care: "Dry Clean Only",
        weight: "550 grams",
        border: "Simple Zari Border",
        origin: "Bhagalpur, Bihar"
      },
      sizeGuide: "Natural golden texture with comfortable drape."
    }
  ]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    image: ''
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: newProduct.stock > 0 ? 'Active' : 'Out of Stock'
    };
    setProducts([...products, product]);
    setShowAddProduct(false);
    setNewProduct({ name: '', price: '', category: '', stock: '', description: '', image: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.image
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? {
            ...product,
            ...newProduct,
            price: parseInt(newProduct.price),
            stock: parseInt(newProduct.stock),
            status: newProduct.stock > 0 ? 'Active' : 'Out of Stock'
          }
        : product
    );
    setProducts(updatedProducts);
    setShowAddProduct(false);
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', category: '', stock: '', description: '', image: '' });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const resetForm = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', category: '', stock: '', description: '', image: '' });
  };

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

              {/* Products Count */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
                    <p className="text-3xl font-bold text-[#6B2D2D] mt-1">{products.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Active Products</p>
                    <p className="text-xl font-semibold text-green-600">
                      {products.filter(p => p.status === 'Active').length}
                    </p>
                  </div>
                </div>
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
                        {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th> */}
                        {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock}
                          </td> */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status}
                            </span>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              {/* View Button */}
                              <Link
                                to={`/admin/viewproducts`}
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
                                to={`/admin/editproducts`}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </Link>
                              
                              {/* Delete Button */}
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
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
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first product.</p>
                  <Link
                    to="/admin/add-product"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;