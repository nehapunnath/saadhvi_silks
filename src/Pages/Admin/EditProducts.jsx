// src/pages/admin/EditProducts.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SideBar';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample product data - in real app, this would come from API
  const sampleProduct = {
    id: 1,
    name: "Kanjivaram Silk Saree",
    price: 12499,
    originalPrice: 15999,
    category: "Traditional",
    occasion: ["Wedding", "Festival"],
    description: "This authentic Kanjivaram silk saree is a masterpiece of South Indian craftsmanship, featuring intricate traditional motifs woven with pure gold zari. Perfect for weddings and grand celebrations, its rich texture, vibrant colors, and elegant drape exude timeless elegance, making it a cherished addition to any wardrobe.",
    badge: "Bestseller",
    material: "Pure Kanjivaram Silk",
    length: "6.5 meters (with blouse piece)",
    weave: "Handwoven with pure zari",
    care: "Dry Clean Only",
    weight: "650 grams",
    border: "Contrast Zari Border",
    origin: "Kanchipuram, Tamil Nadu",
    sizeGuide: "Standard saree length: 5.5m (saree) + 1m (blouse piece). Suitable for all body types.",
    image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124"
  };

  const [product, setProduct] = useState(sampleProduct);
  const [selectedOccasions, setSelectedOccasions] = useState(sampleProduct.occasion);
  const [imagePreview, setImagePreview] = useState(sampleProduct.image);

  const occasions = ['Wedding', 'Festival', 'Party', 'Casual', 'Office', 'Traditional'];

  useEffect(() => {
    // In real app, fetch product data by ID
    // For now, using sample data
    setProduct(sampleProduct);
    setSelectedOccasions(sampleProduct.occasion);
    setImagePreview(sampleProduct.image);
  }, [id]);

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
    console.log('Updated Product Data:', product);
    alert('Product updated successfully!');
    navigate('/admin/products');
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
                  <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
                  <p className="text-gray-600 mt-1">Update product information</p>
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
                      {/* Current Image */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Current Image</label>
                        <img
                          src={imagePreview}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg border border-[#D9A7A7]"
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Update Image</label>
                        <div className="border-2 border-dashed border-[#D9A7A7] rounded-2xl p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-block bg-[#6B2D2D] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#8B3A3A] transition-colors duration-200"
                          >
                            Change Image
                          </label>
                        </div>
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Or Update Image URL</label>
                        <input
                          type="url"
                          name="image"
                          value={product.image}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
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
                      required
                    />
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Product Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Material', name: 'material', value: product.material },
                      { label: 'Length', name: 'length', value: product.length },
                      { label: 'Weave', name: 'weave', value: product.weave },
                      { label: 'Care Instructions', name: 'care', value: product.care },
                      { label: 'Weight', name: 'weight', value: product.weight },
                      { label: 'Border', name: 'border', value: product.border },
                      { label: 'Origin', name: 'origin', value: product.origin },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">{field.label}</label>
                        <input
                          type="text"
                          name={field.name}
                          value={field.value}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                          required
                        />
                      </div>
                    ))}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Size Guide</label>
                      <textarea
                        name="sizeGuide"
                        value={product.sizeGuide}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
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
                    Update Product
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