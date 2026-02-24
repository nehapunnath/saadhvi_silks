// src/pages/admin/EditProducts.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/proApi';
import categoryApi from '../../Services/CategoryApi';
import badgeApi from '../../Services/BadgeApi';           // ← NEW IMPORT

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Category states
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Badge states  ← NEW
  const [badges, setBadges] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeName, setBadgeName] = useState('');
  const [editingBadge, setEditingBadge] = useState(null);
  const [badgeLoading, setBadgeLoading] = useState(false);

  const occasions = [
    'Wedding', 'Festival', 'Party', 'Casual', 'Office', 'Traditional',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Load product
        const res = await productApi.getProduct(id);
        const p = res.product;

        setProduct(p);
        setSelectedOccasions(p.occasion || []);
        setImagePreviews(p.images || []);

        // Load categories & badges
        await Promise.all([
          loadCategories(),
          loadBadges()
        ]);
      } catch (e) {
        toast.error('Failed to load product: ' + e.message);
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const loadCategories = async () => {
    try {
      const result = await categoryApi.getCategories();
      if (result.success) setCategories(result.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadBadges = async () => {                    // ← NEW
    try {
      const result = await badgeApi.getBadges();
      if (result.success) setBadges(result.badges || []);
    } catch (error) {
      console.error('Failed to load badges:', error);
      toast.error('Failed to load badges');
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleOccasionChange = occ => {
    setSelectedOccasions(prev => {
      const next = prev.includes(occ)
        ? prev.filter(o => o !== occ)
        : [...prev, occ];
      setProduct(p => ({ ...p, occasion: next }));
      return next;
    });
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    const total = imagePreviews.length + files.length;
    if (total > 5) {
      toast.error(`Maximum 5 images allowed! Current: ${imagePreviews.length}`);
      return;
    }
    const previews = files.map(f => URL.createObjectURL(f));
    setNewImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = idx => {
    const originalCount = product?.images?.length || 0;

    if (idx < originalCount) {
      // Just remove from preview (old images stay on server unless replaced)
      setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    } else {
      const newIdx = idx - originalCount;
      setNewImages(prev => prev.filter((_, i) => i !== newIdx));
      setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      await productApi.updateProduct(id, product, newImages);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Update failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // ── Category Handlers (unchanged) ────────────────────────────────
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
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      const result = await categoryApi.deleteCategory(category.id, id); // pass product id
      if (result.success) {
        toast.success('Category deleted successfully!');
        await loadCategories();
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

  // ── Badge Handlers ───────────────────────────────────────────────
  const handleAddBadge = async (e) => {
    e.preventDefault();
    if (!badgeName.trim()) {
      toast.error('Badge name is required');
      return;
    }

    setBadgeLoading(true);
    try {
      if (editingBadge) {
        await badgeApi.updateBadge(editingBadge.id, { name: badgeName.trim() });
        toast.success('Badge updated successfully!');
      } else {
        await badgeApi.addBadge({ name: badgeName.trim() });
        toast.success('Badge added successfully!');
      }
      
      setShowBadgeModal(false);
      setBadgeName('');
      setEditingBadge(null);
      await loadBadges();
    } catch (error) {
      toast.error(error.message || 'Badge operation failed');
    } finally {
      setBadgeLoading(false);
    }
  };

  const handleEditBadge = (badge) => {
    setEditingBadge(badge);
    setBadgeName(badge.name);
    setShowBadgeModal(true);
  };

  const handleDeleteBadge = async (badge) => {
    if (!window.confirm(`Are you sure you want to delete badge "${badge.name}"?`)) return;

    try {
      const result = await badgeApi.deleteBadge(badge.id, id); // pass product id (optional safety)
      if (result.success) {
        toast.success('Badge deleted successfully!');
        await loadBadges();
        if (product.badge === badge.id) {
          setProduct(prev => ({ ...prev, badge: '' }));
        }
      } else {
        toast.error(result.error || 'Cannot delete badge (in use?)');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete badge');
    }
  };

  const openAddBadgeModal = () => {
    setEditingBadge(null);
    setBadgeName('');
    setShowBadgeModal(true);
  };

  const formatPrice = p =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B2D2D]" />
              <p className="mt-4 text-gray-600">Loading product...</p>
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
          <div className="text-center">Product not found!</div>
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
                  <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
                  <p className="text-gray-600 mt-1">Update {product.name}</p>
                </div>
                <Link
                  to="/admin/products"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Products</span>
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* BASIC INFO */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Product Information</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Product Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={product.name || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                          required
                        />
                      </div>

                      {/* Pricing & Stock */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-[#2E2E2E]">Pricing & Stock</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Current Price</label>
                            <input
                              type="number"
                              name="price"
                              value={product.price || ''}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Original Price</label>
                            <input
                              type="number"
                              name="originalPrice"
                              value={product.originalPrice || ''}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Shipping Charges</label>
                            <input
                              type="number"
                              name="extraCharges"
                              value={product.extraCharges || ''}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Stock * <span className="text-green-600">({product.stock} available)</span>
                            </label>
                            <input
                              type="number"
                              name="stock"
                              value={product.stock || 0}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                              min="0"
                              required
                            />
                          </div>
                        </div>

                        {product.price && (
                          <p className="text-sm text-gray-600">
                            Current: {formatPrice(product.price)}
                            {product.originalPrice && ` | Original: ${formatPrice(product.originalPrice)}`}
                            {product.extraCharges && ` | Extra: ${formatPrice(product.extraCharges)}`}
                            {product.stock != null && ` | Stock: ${product.stock} pcs`}
                          </p>
                        )}
                      </div>

                      {/* Category Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-[#2E2E2E]">Category *</label>
                          <button
                            type="button"
                            onClick={openAddCategoryModal}
                            className="text-sm bg-[#6B2D2D] text-white px-3 py-1 rounded hover:bg-[#8B3A3A]"
                          >
                            + Manage Categories
                          </button>
                        </div>

                        <select
                          name="category"
                          value={product.category || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories
                            .filter(cat => cat.isActive !== false)
                            .map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                        </select>

                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                          {categories
                            .filter(cat => cat.isActive !== false)
                            .map(cat => (
                              <div key={cat.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                <span className="text-sm">{cat.name}</span>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditCategory(cat)}
                                    className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(cat)}
                                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-600 rounded"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          {categories.length === 0 && (
                            <p className="text-sm text-gray-500 text-center p-2">No categories yet</p>
                          )}
                        </div>
                      </div>

                      {/* ── Dynamic Badge Section ── */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-[#2E2E2E]">Badge</label>
                          <button
                            type="button"
                            onClick={openAddBadgeModal}
                            className="text-sm bg-[#6B2D2D] text-white px-3 py-1 rounded hover:bg-[#8B3A3A]"
                          >
                            + Manage Badges
                          </button>
                        </div>

                        <select
                          name="badge"
                          value={product.badge || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                        >
                          <option value="">No Badge</option>
                          {badges
                            .filter(b => b.isActive !== false)
                            .map(badge => (
                              <option key={badge.id} value={badge.id}>
                                {badge.name}
                              </option>
                            ))}
                        </select>

                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                          {badges
                            .filter(b => b.isActive !== false)
                            .map(badge => (
                              <div key={badge.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                <span className="text-sm">{badge.name}</span>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditBadge(badge)}
                                    className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteBadge(badge)}
                                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-600 rounded"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          {badges.length === 0 && (
                            <p className="text-sm text-gray-500 text-center p-2">
                              No badges yet. Add your first badge!
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Occasions */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Suitable For</label>
                        <div className="grid grid-cols-2 gap-2">
                          {occasions.map(o => (
                            <label key={o} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedOccasions.includes(o)}
                                onChange={() => handleOccasionChange(o)}
                                className="rounded border-[#D9A7A7] text-[#6B2D2D] focus:ring-[#6B2D2D]"
                              />
                              <span className="text-sm text-[#2E2E2E]">{o}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                          Product Images ({imagePreviews.length}/5)
                        </label>
                        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                          {imagePreviews.map((src, i) => (
                            <div key={i} className="relative">
                              <img
                                src={src}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Add New Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6B2D2D] file:text-white hover:file:bg-[#8B3A3A]"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 5 total images (JPG, PNG)</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={product.description || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                      required
                    />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Product Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Material', name: 'material' },
                      { label: 'Length', name: 'length' },
                      { label: 'Weave', name: 'weave' },
                      { label: 'Care Instructions', name: 'care' },
                      { label: 'Weight', name: 'weight' },
                      { label: 'Border', name: 'border' },
                      { label: 'Origin', name: 'origin' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">{f.label}</label>
                        <input
                          type="text"
                          name={f.name}
                          value={product[f.name] || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                        />
                      </div>
                    ))}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Size Guide</label>
                      <textarea
                        name="sizeGuide"
                        value={product.sizeGuide || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                      />
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end space-x-4">
                  <Link
                    to="/admin/products"
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg hover:bg-[#8B3A3A] disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Category Modal */}
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
                      onChange={e => setCategoryName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
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

        {/* Badge Modal */}
        {showBadgeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {editingBadge ? 'Edit Badge' : 'Add New Badge'}
              </h3>
              <form onSubmit={handleAddBadge}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge Name *
                    </label>
                    <input
                      type="text"
                      value={badgeName}
                      onChange={e => setBadgeName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                      placeholder="e.g. Bestseller, New Arrival, Limited Stock"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowBadgeModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={badgeLoading}
                    className="bg-[#6B2D2D] text-white px-4 py-2 rounded-lg hover:bg-[#8B3A3A] disabled:bg-gray-400"
                  >
                    {badgeLoading ? 'Saving...' : editingBadge ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProducts;