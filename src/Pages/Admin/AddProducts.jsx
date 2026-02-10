// src/pages/admin/AddProducts.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SideBar';
import { Link } from 'react-router-dom';
import authApi from '../../Services/authApi';
import { toast } from 'react-hot-toast';
import productApi from '../../Services/proApi';
import categoryApi from '../../Services/CategoryApi';

const AddProducts = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    extraCharges: '',
    category: '',
    occasion: [],
    description: '',
    material: '',
    length: '',
    weave: '',
    care: '',
    weight: '',
    border: '',
    origin: '',
    sizeGuide: '',
    images: [],
    badge: '',
    stock: '',
  });

  const [categories, setCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Category Management States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const occasions = ['Wedding', 'Festival', 'Party', 'Casual', 'Office', 'Traditional'];
  const maxImages = 5;

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await categoryApi.getCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOccasionChange = (occasion) => {
    setSelectedOccasions(prev => {
      const newOccasions = prev.includes(occasion)
        ? prev.filter(item => item !== occasion)
        : [...prev, occasion];

      setProduct(prevProduct => ({
        ...prevProduct,
        occasion: newOccasions
      }));

      return newOccasions;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imagePreviews.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed!`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
        setProduct(prev => ({
          ...prev,
          images: [...prev.images, file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await productApi.addProduct(product);
      toast.success('Product added successfully!');
      window.location.href = '/admin/products';
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Category Management Functions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setCategoryLoading(true);
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, { name: categoryName });
        toast.success('Category updated successfully!');
      } else {
        await categoryApi.addCategory({ name: categoryName });
        toast.success('Category added successfully!');
      }
      
      setShowCategoryModal(false);
      setCategoryName('');
      setEditingCategory(null);
      await loadCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      const result = await categoryApi.deleteCategory(category.id);
      if (result.success) {
        toast.success('Category deleted successfully!');
        await loadCategories();
        
        // If the deleted category was selected in the product form, clear it
        if (product.category === category.id) {
          setProduct(prev => ({ ...prev, category: '' }));
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setShowCategoryModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

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
                  <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
                  <p className="text-gray-600 mt-1">Add a new product to your collection</p>
                </div>
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

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Product Information</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Product Name</label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      {/* Price Information */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#2E2E2E]">Pricing Details (₹)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Current Price</label>
                            <input
                              type="number"
                              name="price"
                              value={product.price}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                              placeholder="12499"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Original Price</label>
                            <input
                              type="number"
                              name="originalPrice"
                              value={product.originalPrice}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                              placeholder="15999"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Shipping Charges</label>
                            <input
                              type="number"
                              name="extraCharges"
                              value={product.extraCharges}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Stock</label>
                            <input
                              type="number"
                              name="stock"
                              value={product.stock}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                              placeholder="50"
                              required
                            />
                          </div>
                        </div>
                        {product.price && (
                          <p className="text-sm text-gray-600">
                            Current: {formatPrice(product.price)}
                            {product.originalPrice && ` | Original: ${formatPrice(product.originalPrice)}`}
                            {product.extraCharges && ` | Extra: ${formatPrice(product.extraCharges)}`}
                            {product.stock && ` | Stock: ${product.stock} pcs`}
                          </p>
                        )}
                      </div>

                      {/* Enhanced Category Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-[#2E2E2E]">Category</label>
                          <button
                            type="button"
                            onClick={openAddCategoryModal}
                            className="text-sm bg-[#6B2D2D] text-white px-3 py-1 rounded hover:bg-[#8B3A3A] transition-colors"
                          >
                            + Manage Categories
                          </button>
                        </div>
                        
                        <select
                          name="category"
                          value={product.category}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories
                            .filter(cat => cat.isActive !== false)
                            .map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))
                          }
                        </select>

                        {/* Categories List with Edit/Delete */}
                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                          <div className="grid grid-cols-1 gap-1">
                            {categories
                              .filter(cat => cat.isActive !== false)
                              .map(category => (
                                <div key={category.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                  <span className="text-sm">{category.name}</span>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditCategory(category)}
                                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCategory(category)}
                                      className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-600 rounded"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))
                            }
                            {categories.length === 0 && (
                              <p className="text-sm text-gray-500 text-center p-2">No categories found. Add your first category!</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Badge */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Badge</label>
                        <select
                          name="badge"
                          value={product.badge}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        >
                          <option value="">No Badge</option>
                          <option value="Bestseller">Bestseller</option>
                          <option value="Popular">Popular</option>
                          <option value="New">New</option>
                          <option value="Sale">Sale</option>
                        </select>
                      </div>

                      {/* Occasions */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Suitable For</label>
                        <div className="grid grid-cols-2 gap-2">
                          {occasions.map((occasion) => (
                            <label key={occasion} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedOccasions.includes(occasion)}
                                onChange={() => handleOccasionChange(occasion)}
                                className="rounded border-[#D9A7A7] text-[#6B2D2D] focus:ring-[#6B2D2D]"
                              />
                              <span className="text-sm text-[#2E2E2E]">{occasion}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Image Upload */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Product Images (up to 5)</label>
                        <div className="border-2 border-dashed border-[#D9A7A7] rounded-2xl p-6 text-center">
                          <div className="space-y-4">
                            <svg className="w-12 h-12 text-[#D9A7A7] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-sm text-[#2E2E2E]">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-block bg-[#6B2D2D] text-white px-4 py-2 rounded-lg mt-4 cursor-pointer hover:bg-[#8B3A3A] transition-colors duration-200"
                          >
                            Choose Images
                          </label>
                          {/* Previews */}
                          <div className="grid grid-cols-5 gap-2 mt-4">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${index}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Product Description</label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                      placeholder="Describe the product in detail..."
                      required
                    />
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Product Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Material</label>
                      <input
                        type="text"
                        name="material"
                        value={product.material}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="Pure Kanjivaram Silk"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Length</label>
                      <input
                        type="text"
                        name="length"
                        value={product.length}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="6.5 meters (with blouse piece)"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Weave</label>
                      <input
                        type="text"
                        name="weave"
                        value={product.weave}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="Handwoven with pure zari"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Care Instructions</label>
                      <input
                        type="text"
                        name="care"
                        value={product.care}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="Dry Clean Only"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Weight</label>
                      <input
                        type="text"
                        name="weight"
                        value={product.weight}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="650 grams"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Border</label>
                      <input
                        type="text"
                        name="border"
                        value={product.border}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="Contrast Zari Border"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Origin</label>
                      <input
                        type="text"
                        name="origin"
                        value={product.origin}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="Kanchipuram, Tamil Nadu"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Size Guide</label>
                      <textarea
                        name="sizeGuide"
                        value={product.sizeGuide}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                        placeholder="Standard saree length: 5.5m (saree) + 1m (blouse piece). Suitable for all body types."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <Link
                    to="/admin/products"
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 disabled:bg-gray-400"
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={handleAddCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                    placeholder="Enter category name"
                    required
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categoryLoading}
                  className="bg-[#6B2D2D] text-white px-4 py-2 rounded-lg hover:bg-[#8B3A3A] disabled:bg-gray-400"
                >
                  {categoryLoading ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;