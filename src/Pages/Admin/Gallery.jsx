// src/pages/admin/CarouselGallery.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../Components/SideBar';
import GalleryApi from '../../Services/GalleryApi';

const Gallery = () => {
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [mainGalleryImage, setMainGalleryImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMainImageModal, setShowMainImageModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMainImageFile, setSelectedMainImageFile] = useState(null);

  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    cta: 'Shop Now',
    order: ''
  });

  // Fetch slides and main image on mount
  useEffect(() => {
    fetchSlides();
    fetchMainGalleryImage();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await GalleryApi.getSlides();
      setCarouselSlides(data.slides || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMainGalleryImage = async () => {
    try {
      // You'll need to create this API method in GalleryApi
      const data = await GalleryApi.getMainGalleryImage();
      setMainGalleryImage(data.image || null);
    } catch (err) {
      console.error('Error fetching main gallery image:', err);
    }
  };

  // Handle file selection for carousel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle file selection for main image
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Add new slide
  const handleAddSlide = async () => {
    if (!selectedFile || !newSlide.title || !newSlide.subtitle) {
      toast.error('Please fill all required fields and upload an image');
      return;
    }

    setUploading(true);
    try {
      await GalleryApi.addSlide(newSlide, selectedFile);
      toast.success('Slide added successfully!');
      fetchSlides();
      resetUploadForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Upload main gallery image
  const handleUploadMainImage = async () => {
    if (!selectedMainImageFile) {
      toast.error('Please select an image to upload');
      return;
    }

    setUploadingMainImage(true);
    try {
      await GalleryApi.uploadMainGalleryImage(selectedMainImageFile);
      toast.success('Main gallery image uploaded successfully!');
      fetchMainGalleryImage();
      setShowMainImageModal(false);
      setSelectedMainImageFile(null);
      setMainImagePreview('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingMainImage(false);
    }
  };

  // Delete main gallery image
  const handleDeleteMainImage = async () => {
    if (!window.confirm('Are you sure you want to delete the main gallery image?')) return;

    try {
      await GalleryApi.deleteMainGalleryImage();
      toast.success('Main gallery image deleted');
      setMainGalleryImage(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Edit slide
  const handleEditSlide = (slide) => {
    setSelectedSlide(slide);
    setNewSlide({
      title: slide.title,
      subtitle: slide.subtitle,
      cta: slide.cta,
      order: slide.order
    });
    setImagePreview(slide.image);
    setSelectedFile(null);
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!newSlide.title || !newSlide.subtitle) {
      toast.error('Title and subtitle are required');
      return;
    }

    try {
      await GalleryApi.updateSlide(selectedSlide.id, newSlide, selectedFile);
      toast.success('Slide updated!');
      fetchSlides();
      setShowEditModal(false);
      setSelectedSlide(null);
      setSelectedFile(null);
      setImagePreview('');
      setNewSlide({ title: '', subtitle: '', cta: 'Shop Now', order: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete slide
  const handleDeleteSlide = async (id) => {
    if (!window.confirm('Delete this slide?')) return;

    try {
      await GalleryApi.deleteSlide(id);
      toast.success('Slide deleted');
      fetchSlides();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reorder
  const moveSlide = async (id, direction) => {
    const slides = [...carouselSlides];
    const idx = slides.findIndex(s => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;

    if (swapIdx < 0 || swapIdx >= slides.length) return;

    const orderMap = {};
    const temp = slides[idx].order;
    slides[idx].order = slides[swapIdx].order;
    slides[swapIdx].order = temp;

    slides.forEach(s => {
      orderMap[s.id] = s.order;
    });

    try {
      await GalleryApi.reorderSlides(orderMap);
      setCarouselSlides(slides);
    } catch (err) {
      toast.error('Failed to reorder');
    }
  };

  const resetUploadForm = () => {
    setNewSlide({ title: '', subtitle: '', cta: 'Shop Now', order: '' });
    setImagePreview('');
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const removeImagePreview = () => {
    setImagePreview('');
    setSelectedFile(null);
  };

  const removeMainImagePreview = () => {
    setMainImagePreview('');
    setSelectedMainImageFile(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 rounded w-64 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
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
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
                  <p className="text-gray-600 mt-1">Manage homepage carousel slides and main gallery image</p>
                </div>
               
              </div>

              {/* Main Image Gallery Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Main Gallery Image</h2>
                    <p className="text-gray-600 text-sm mt-1">This image will be displayed prominently on the homepage<span className="text-blue">(At "Elegance Woven with Tradition ")</span></p>
                  </div>
                  <button
                    onClick={() => setShowMainImageModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{mainGalleryImage ? 'Change Image' : 'Upload Image'}</span>
                  </button>
                </div>

                {mainGalleryImage ? (
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={mainGalleryImage}
                        alt="Main Gallery"
                        className="w-64 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-green-800 mb-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">Main gallery image is set</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          This image is currently being displayed on the homepage. You can replace it with a new image or delete it.
                        </p>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => setShowMainImageModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                        >
                          Replace Image
                        </button>
                        <button
                          onClick={handleDeleteMainImage}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                        >
                          Delete Image
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No main gallery image set</h3>
                    <p className="text-gray-500 mb-6">Upload a main image to showcase on the homepage.</p>
                    <button
                      onClick={() => setShowMainImageModal(true)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Upload Main Image
                    </button>
                  </div>
                )}
              </div>

              {/* Carousel Slides Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Carousel Slides ({carouselSlides.length})
                </h2>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2 mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add New Slide</span>
                </button>

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
                            className={`p-2 rounded-lg ${index === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            title="Move Up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>

                          <button
                            onClick={() => moveSlide(slide.id, 'down')}
                            disabled={index === carouselSlides.length - 1}
                            className={`p-2 rounded-lg ${index === carouselSlides.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
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

              {/* Upload Modal for Carousel */}
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
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Text</label>
                          <input
                            type="text"
                            value={newSlide.cta}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, cta: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="e.g., Shop Now"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                          <input
                            type="number"
                            value={newSlide.order}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, order: parseInt(e.target.value) || '' }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="Leave empty to add to end"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
                          {imagePreview ? (
                            <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center bg-green-50">
                              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4 mx-auto" />
                              <div className="flex justify-center space-x-4">
                                <button onClick={removeImagePreview} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                                  Remove
                                </button>
                                <label className="bg-[#6B2D2D] text-white px-4 py-2 rounded-lg hover:bg-[#8B3A3A] cursor-pointer text-sm">
                                  Change
                                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-600 mb-2">Click to upload</p>
                              <label className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] cursor-pointer inline-block">
                                Choose Image
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button onClick={resetUploadForm} className="px-6 py-2 text-gray-600 hover:text-gray-800">
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSlide}
                        disabled={uploading || !imagePreview || !newSlide.title || !newSlide.subtitle}
                        className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#8B3A3A] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
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

              {/* Edit Modal for Carousel */}
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
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle *</label>
                          <textarea
                            value={newSlide.subtitle}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, subtitle: e.target.value }))}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action</label>
                          <input
                            type="text"
                            value={newSlide.cta}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, cta: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
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
                          <img src={imagePreview} alt="Current" className="w-full h-48 object-cover rounded-lg border mb-4" />
                          <label className="bg-[#6B2D2D] text-white px-4 py-2 rounded-lg hover:bg-[#8B3A3A] cursor-pointer inline-block text-sm">
                            Change Image
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={() => {
                          setShowEditModal(false);
                          setSelectedSlide(null);
                          setSelectedFile(null);
                          setImagePreview('');
                          setNewSlide({ title: '', subtitle: '', cta: 'Shop Now', order: '' });
                        }}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#8B3A3A]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Image Upload Modal */}
              {showMainImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      {mainGalleryImage ? 'Change Main Gallery Image' : 'Upload Main Gallery Image'}
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
                        {mainImagePreview ? (
                          <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center bg-green-50">
                            <img src={mainImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4 mx-auto" />
                            <div className="flex justify-center space-x-4">
                              <button onClick={removeMainImagePreview} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                                Remove
                              </button>
                              <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer text-sm">
                                Change
                                <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 mb-2">Click to upload</p>
                            <label className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 cursor-pointer inline-block">
                              Choose Image
                              <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button 
                        onClick={() => {
                          setShowMainImageModal(false);
                          setSelectedMainImageFile(null);
                          setMainImagePreview('');
                        }} 
                        className="px-6 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUploadMainImage}
                        disabled={uploadingMainImage || !mainImagePreview}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {uploadingMainImage ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <span>{mainGalleryImage ? 'Change Image' : 'Upload Image'}</span>
                        )}
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