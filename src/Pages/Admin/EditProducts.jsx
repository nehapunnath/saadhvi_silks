import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/proApi';

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const occasions = [
    'Wedding',
    'Festival',
    'Party',
    'Casual',
    'Office',
    'Traditional',
  ];

  const categories = [
    'Bridal collection',
    'Kanjivaram',
    'Silk',
    'Soft silk',
    'Ikkat silk',
    'Silk dhoti',
    'Banaras',
    'Tussar',
    'Designer',
    'Fancy',
    'Cotton',
    'Daily wear',
    'Lehenga',
    'Dress material',
    'Readymade',
    'Sale',
    'Traditional',
    'Contemporary',
  ];

  /* ------------------------------------------------------------------ */
  /*  FETCH PRODUCT                                                    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProduct(id);
        const p = res.product;

        setProduct(p);
        setSelectedOccasions(p.occasion || []);
        setImagePreviews(p.images || []);
      } catch (e) {
        toast.error('Failed to load product: ' + e.message);
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  /* ------------------------------------------------------------------ */
  /*  INPUT HANDLERS                                                   */
  /* ------------------------------------------------------------------ */
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
      toast.error(`Maximum 5 images allowed! You have ${imagePreviews.length}`);
      return;
    }
    const previews = files.map(f => URL.createObjectURL(f));
    setNewImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = idx => {
    const originalCount = product.images?.length || 0;

    if (idx < originalCount) {
      // keep old image on server, just hide preview
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
      toast.error('Update failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = p =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */
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
                {/* ---------- BASIC INFO ---------- */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Product Information</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT */}
                    <div className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Product Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
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
                              value={product.price}
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
                            <label className="block text-xs text-gray-500 mb-1">Extra Charges</label>
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
                              value={product.stock}
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

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Category *</label>
                        <select
                          name="category"
                          value={product.category}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Badge */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Badge</label>
                        <select
                          name="badge"
                          value={product.badge || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
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

                    {/* RIGHT – Images */}
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
                      value={product.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                      required
                    />
                  </div>
                </div>

                {/* ---------- DETAILS ---------- */}
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

                {/* ---------- ACTIONS ---------- */}
                <div className="flex justify-end space-x-4">
                  <Link
                    to="/admin/products"
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;