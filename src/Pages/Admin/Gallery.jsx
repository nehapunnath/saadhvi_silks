// src/pages/admin/CarouselGallery.js
import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar';

const Gallery = () => {
  const [carouselSlides, setCarouselSlides] = useState([
    {
      id: 1,
      title: "Exclusive Silk Collection",
      subtitle: "Premium handcrafted sarees for every occasion",
      image: "https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dwe6547122/Ace_Your_Saree_Banner_D.jpg",
      cta: "Shop Now",
      order: 1
    },
    {
      id: 2,
      title: "Bridal Special",
      subtitle: "Make your special day even more memorable",
      image: "https://kavyastyleplus.com/cdn/shop/files/Royal_20Satin_20Saroski_20Saroj_20Sarees_20_283_29_90970273-bbc2-4d06-938d-90af6cf314b2.jpg?v=1744633888&width=1946",
      cta: "Bridal Collection",
      order: 2
    },
    {
      id: 3,
      title: "Festival Sale",
      subtitle: "Upto 40% off on traditional wear",
      image: "https://mysilklove.com/cdn/shop/articles/1800_26.png?v=1701089364&width=2048",
      cta: "View Offers",
      order: 3
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    cta: 'Shop Now',
    order: ''
  });

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle add new slide
  const handleAddSlide = () => {
    if (!imagePreview) {
      alert('Please upload an image first');
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const nextOrder = carouselSlides.length > 0 
        ? Math.max(...carouselSlides.map(slide => slide.order)) + 1 
        : 1;
      
      const newSlideObj = {
        id: carouselSlides.length + 1,
        ...newSlide,
        image: imagePreview,
        order: newSlide.order || nextOrder
      };
      
      setCarouselSlides(prev => [...prev, newSlideObj].sort((a, b) => a.order - b.order));
      setUploading(false);
      setShowUploadModal(false);
      setNewSlide({
        title: '',
        subtitle: '',
        cta: 'Shop Now',
        order: ''
      });
      setImagePreview('');
    }, 1000);
  };

  // Handle edit slide
  const handleEditSlide = (slide) => {
    setSelectedSlide(slide);
    setNewSlide({
      title: slide.title,
      subtitle: slide.subtitle,
      cta: slide.cta,
      order: slide.order
    });
    setImagePreview(slide.image);
    setShowEditModal(true);
  };

  // Save edited slide
  const handleSaveEdit = () => {
    if (selectedSlide && imagePreview) {
      setCarouselSlides(prev => 
        prev.map(slide => 
          slide.id === selectedSlide.id 
            ? { 
                ...slide, 
                ...newSlide, 
                image: imagePreview 
              }
            : slide
        ).sort((a, b) => a.order - b.order)
      );
      setShowEditModal(false);
      setSelectedSlide(null);
      setNewSlide({
        title: '',
        subtitle: '',
        cta: 'Shop Now',
        order: ''
      });
      setImagePreview('');
    }
  };

  // Handle delete slide
  const handleDeleteSlide = (id) => {
    if (window.confirm('Are you sure you want to delete this carousel slide?')) {
      setCarouselSlides(prev => prev.filter(slide => slide.id !== id));
    }
  };

  // Reorder slides
  const moveSlide = (id, direction) => {
    const slides = [...carouselSlides];
    const currentIndex = slides.findIndex(slide => slide.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < slides.length) {
      // Swap orders
      const tempOrder = slides[currentIndex].order;
      slides[currentIndex].order = slides[newIndex].order;
      slides[newIndex].order = tempOrder;

      setCarouselSlides(slides.sort((a, b) => a.order - b.order));
    }
  };

  // Reset upload form
  const resetUploadForm = () => {
    setNewSlide({
      title: '',
      subtitle: '',
      cta: 'Shop Now',
      order: ''
    });
    setImagePreview('');
    setShowUploadModal(false);
  };

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreview('');
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
                  <h1 className="text-3xl font-bold text-gray-800">Carousel Gallery</h1>
                  <p className="text-gray-600 mt-1">Manage homepage carousel slides</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add New Slide</span>
                </button>
              </div>

              {/* Slides List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Carousel Slides ({carouselSlides.length})</h2>
                
                {carouselSlides.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No carousel slides yet</h3>
                    <p className="text-gray-500 mb-6">Create your first carousel slide to showcase on the homepage.</p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200"
                    >
                      Add First Slide
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {carouselSlides.map((slide, index) => (
                      <div key={slide.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex-shrink-0">
                          <span className="bg-[#6B2D2D] text-white text-sm font-medium px-3 py-1 rounded-full">
                            {slide.order}
                          </span>
                        </div>
                        
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-24 h-16 object-cover rounded-lg border"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{slide.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{slide.subtitle}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              CTA: {slide.cta}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => moveSlide(slide.id, 'up')}
                            disabled={index === 0}
                            className={`p-2 rounded-lg ${
                              index === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title="Move Up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => moveSlide(slide.id, 'down')}
                            disabled={index === carouselSlides.length - 1}
                            className={`p-2 rounded-lg ${
                              index === carouselSlides.length - 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title="Move Down"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleEditSlide(slide)}
                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Modal */}
              {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Carousel Slide</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Slide Title *</label>
                          <input
                            type="text"
                            value={newSlide.title}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="Enter slide title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle *</label>
                          <textarea
                            value={newSlide.subtitle}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, subtitle: e.target.value }))}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="Enter slide subtitle"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Text *</label>
                          <input
                            type="text"
                            value={newSlide.cta}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, cta: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="e.g., Shop Now, Learn More"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                          <input
                            type="number"
                            value={newSlide.order}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, order: parseInt(e.target.value) || '' }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="Enter display order"
                            min="1"
                          />
                          <p className="text-xs text-gray-500 mt-1">Leave empty to add to the end</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
                          
                          {imagePreview ? (
                            <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center bg-green-50">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg mb-4 mx-auto"
                              />
                              <div className="flex justify-center space-x-4">
                                <button
                                  onClick={removeImagePreview}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                                >
                                  Remove Image
                                </button>
                                <label className="bg-[#6B2D2D] text-white px-4 py-2 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 cursor-pointer text-sm">
                                  Change Image
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                              <p className="text-sm text-gray-500 mb-4">PNG, JPG, JPEG up to 5MB</p>
                              <label className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 cursor-pointer inline-block">
                                Choose Image File
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  required
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={resetUploadForm}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSlide}
                        disabled={!imagePreview || !newSlide.title || !newSlide.subtitle || !newSlide.cta || uploading}
                        className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {uploading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <span>Add Slide</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Modal */}
              {showEditModal && selectedSlide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Carousel Slide</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Slide Title *</label>
                          <input
                            type="text"
                            value={newSlide.title}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle *</label>
                          <textarea
                            value={newSlide.subtitle}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, subtitle: e.target.value }))}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Text *</label>
                          <input
                            type="text"
                            value={newSlide.cta}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, cta: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                          <input
                            type="number"
                            value={newSlide.order}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, order: parseInt(e.target.value) || '' }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                          <img
                            src={imagePreview}
                            alt="Current"
                            className="w-full h-48 object-cover rounded-lg border mb-4"
                          />
                          
                          <label className="bg-[#6B2D2D] text-white px-4 py-2 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 cursor-pointer inline-block text-sm">
                            Change Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-2">Upload a new image to replace the current one</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={() => {
                          setShowEditModal(false);
                          setSelectedSlide(null);
                          setNewSlide({
                            title: '',
                            subtitle: '',
                            cta: 'Shop Now',
                            order: ''
                          });
                          setImagePreview('');
                        }}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={!imagePreview || !newSlide.title || !newSlide.subtitle || !newSlide.cta}
                        className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;