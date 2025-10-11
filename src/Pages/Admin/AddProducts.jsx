// src/pages/admin/AddProducts.js
import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar';
import { Link } from 'react-router-dom';

const AddProducts = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
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
    image: '',
    badge: ''
  });

  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  const occasions = ['Wedding', 'Festival', 'Party', 'Casual', 'Office', 'Traditional'];

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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProduct(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Product Data:', product);
    alert('Product added successfully!');
    // Reset form or redirect
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Current Price (₹)</label>
                          <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="12499"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Original Price (₹)</label>
                          <input
                            type="number"
                            name="originalPrice"
                            value={product.originalPrice}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="15999"
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Category</label>
                        <select
                          name="category"
                          value={product.category}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Traditional">Traditional</option>
                          <option value="Contemporary">Contemporary</option>
                          <option value="Designer">Designer</option>
                          <option value="Bridal">Bridal</option>
                          <option value="Casual">Casual</option>
                        </select>
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
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Product Image</label>
                        <div className="border-2 border-dashed border-[#D9A7A7] rounded-2xl p-6 text-center">
                          {imagePreview ? (
                            <div className="space-y-4">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg mx-auto"
                              />
                              <button
                                type="button"
                                onClick={() => setImagePreview('')}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove Image
                              </button>
                            </div>
                          ) : (
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
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-block bg-[#6B2D2D] text-white px-4 py-2 rounded-lg mt-4 cursor-pointer hover:bg-[#8B3A3A] transition-colors duration-200"
                          >
                            Choose Image
                          </label>
                        </div>
                      </div>

                      {/* Image URL Fallback */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Or Enter Image URL</label>
                        <input
                          type="url"
                          name="image"
                          value={product.image}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
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
                    className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200"
                  >
                    Add Product
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

export default AddProducts;