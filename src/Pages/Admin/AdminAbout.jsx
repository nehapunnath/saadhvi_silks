// components/admin/AdminAboutManager.jsx
import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar';

const AdminAbout = () => {
  const [sections, setSections] = useState({
    section1: {
      title: '',
      subtitle: '',
      description: '',
    //   buttonText: '',
      paragraphs: [],
      isSaved: false
    },
    section2: {
      title: '',
      subtitle: '',
      description: '',
    //   buttonText: '',
      paragraphs: [],
      isSaved: false
    },
    section3: {
      title: '',
      subtitle: '',
      description: '',
    //   buttonText: '',
      paragraphs: [],
      isSaved: false
    },
    section4: {
      title: '',
      subtitle: '',
      description: '',
    //   buttonText: '',
      paragraphs: [],
      isSaved: false
    },
    section5: {
      title: '',
      subtitle: '',
      description: '',
    //   buttonText: '',
      paragraphs: [],
      isSaved: false
    }
  });

  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: ''
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [tempSectionData, setTempSectionData] = useState(null);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);

  const openModal = (sectionId) => {
    setCurrentSection(sectionId);
    setTempSectionData({ ...sections[sectionId] });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentSection(null);
    setTempSectionData(null);
  };

  const handleSaveSection = () => {
    if (currentSection && tempSectionData) {
      setSections(prev => ({
        ...prev,
        [currentSection]: { ...tempSectionData, isSaved: true }
      }));
      alert(`Section ${currentSection} saved successfully!`);
      closeModal();
    }
  };

  const handleAddReview = () => {
    if (!reviewForm.name || !reviewForm.comment) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingReview) {
      const updatedReviews = reviews.map(review => 
        review.id === editingReview.id 
          ? { ...reviewForm, id: review.id }
          : review
      );
      setReviews(updatedReviews);
      alert('Review updated successfully!');
    } else {
      const newReview = {
        ...reviewForm,
        id: Date.now()
      };
      setReviews([...reviews, newReview]);
      alert('Review added successfully!');
    }
    
    setReviewForm({ name: '', location: '', rating: 5, comment: '' });
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      name: review.name,
      location: review.location || '',
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== id));
      alert('Review deleted successfully!');
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewForm({ name: '', location: '', rating: 5, comment: '' });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Sidebar />
      <div className="container mx-auto px-4 max-w-7xl py-8 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#5D4037] mb-2">About Page Manager</h1>
          <p className="text-gray-600">Customize all content sections for the about us page</p>
        </div>

        {/* Simple Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <button
            onClick={() => openModal('section1')}
            className="bg-[#800020] text-white px-4 py-3 rounded-lg hover:bg-[#5D4037] transition-colors font-medium"
          >
            Section 1
          </button>
          <button
            onClick={() => openModal('section2')}
            className="bg-[#800020] text-white px-4 py-3 rounded-lg hover:bg-[#5D4037] transition-colors font-medium"
          >
            Section 2
          </button>
          <button
            onClick={() => openModal('section3')}
            className="bg-[#800020] text-white px-4 py-3 rounded-lg hover:bg-[#5D4037] transition-colors font-medium"
          >
            Section 3
          </button>
          <button
            onClick={() => openModal('section4')}
            className="bg-[#800020] text-white px-4 py-3 rounded-lg hover:bg-[#5D4037] transition-colors font-medium"
          >
            Section 4
          </button>
          <button
            onClick={() => openModal('section5')}
            className="bg-[#800020] text-white px-4 py-3 rounded-lg hover:bg-[#5D4037] transition-colors font-medium"
          >
            Section 5
          </button>
          <button
            onClick={() => setReviewsModalOpen(true)}
            className="bg-[#800020] text-white px-4 py-3 rounded-lg hover:bg-[#5D4037] transition-colors font-medium"
          >
            Reviews
          </button>
        </div>

        {/* Saved Sections Display */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#5D4037] mb-4">Saved Content</h2>
          
          {sections.section1.isSaved && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#5D4037]">Section 1</h3>
                  <p className="text-sm text-gray-600 mt-1"><strong>Title:</strong> {sections.section1.title || 'Not set'}</p>
                  {sections.section1.subtitle && (
                    <p className="text-sm text-gray-600"><strong>Subtitle:</strong> {sections.section1.subtitle}</p>
                  )}
                  {sections.section1.description && (
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {sections.section1.description.substring(0, 100)}...</p>
                  )}
                  <p className="text-sm text-gray-600"><strong>Paragraphs:</strong> {sections.section1.paragraphs?.length || 0}</p>
                </div>
                <button
                  onClick={() => openModal('section1')}
                  className="text-[#800020] hover:text-[#5D4037] text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {sections.section2.isSaved && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#5D4037]">Section 2</h3>
                  <p className="text-sm text-gray-600 mt-1"><strong>Title:</strong> {sections.section2.title || 'Not set'}</p>
                  {sections.section2.subtitle && (
                    <p className="text-sm text-gray-600"><strong>Subtitle:</strong> {sections.section2.subtitle}</p>
                  )}
                  {sections.section2.description && (
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {sections.section2.description.substring(0, 100)}...</p>
                  )}
                  <p className="text-sm text-gray-600"><strong>Paragraphs:</strong> {sections.section2.paragraphs?.length || 0}</p>
                </div>
                <button
                  onClick={() => openModal('section2')}
                  className="text-[#800020] hover:text-[#5D4037] text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {sections.section3.isSaved && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#5D4037]">Section 3</h3>
                  <p className="text-sm text-gray-600 mt-1"><strong>Title:</strong> {sections.section3.title || 'Not set'}</p>
                  {sections.section3.subtitle && (
                    <p className="text-sm text-gray-600"><strong>Subtitle:</strong> {sections.section3.subtitle}</p>
                  )}
                  {sections.section3.description && (
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {sections.section3.description.substring(0, 100)}...</p>
                  )}
                  <p className="text-sm text-gray-600"><strong>Paragraphs:</strong> {sections.section3.paragraphs?.length || 0}</p>
                </div>
                <button
                  onClick={() => openModal('section3')}
                  className="text-[#800020] hover:text-[#5D4037] text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {sections.section4.isSaved && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#5D4037]">Section 4</h3>
                  <p className="text-sm text-gray-600 mt-1"><strong>Title:</strong> {sections.section4.title || 'Not set'}</p>
                  {sections.section4.subtitle && (
                    <p className="text-sm text-gray-600"><strong>Subtitle:</strong> {sections.section4.subtitle}</p>
                  )}
                  {sections.section4.description && (
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {sections.section4.description.substring(0, 100)}...</p>
                  )}
                  <p className="text-sm text-gray-600"><strong>Paragraphs:</strong> {sections.section4.paragraphs?.length || 0}</p>
                </div>
                <button
                  onClick={() => openModal('section4')}
                  className="text-[#800020] hover:text-[#5D4037] text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {sections.section5.isSaved && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#5D4037]">Section 5</h3>
                  <p className="text-sm text-gray-600 mt-1"><strong>Title:</strong> {sections.section5.title || 'Not set'}</p>
                  {sections.section5.subtitle && (
                    <p className="text-sm text-gray-600"><strong>Subtitle:</strong> {sections.section5.subtitle}</p>
                  )}
                  {sections.section5.description && (
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {sections.section5.description.substring(0, 100)}...</p>
                  )}
                  <p className="text-sm text-gray-600"><strong>Paragraphs:</strong> {sections.section5.paragraphs?.length || 0}</p>
                </div>
                <button
                  onClick={() => openModal('section5')}
                  className="text-[#800020] hover:text-[#5D4037] text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-[#5D4037]">Reviews</h3>
                  <p className="text-sm text-gray-600 mt-1">{reviews.length} review(s) added</p>
                </div>
                <button
                  onClick={() => setReviewsModalOpen(true)}
                  className="text-[#800020] hover:text-[#5D4037] text-sm"
                >
                  Manage
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section Modal - Same fields for all sections */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#800020] px-6 py-3 flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-bold text-white">
                  Edit {currentSection === 'section1' ? 'Section 1' : 
                         currentSection === 'section2' ? 'Section 2' :
                         currentSection === 'section3' ? 'Section 3' :
                         currentSection === 'section4' ? 'Section 4' : 'Section 5'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <SectionForm 
                  data={tempSectionData} 
                  setData={setTempSectionData} 
                />
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSection}
                    className="px-4 py-2 bg-[#800020] text-white rounded hover:bg-[#5D4037]"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Modal */}
        {reviewsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#800020] px-6 py-3 flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-bold text-white">Manage Reviews</h2>
                <button
                  onClick={() => setReviewsModalOpen(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Add/Edit Review Form */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      {editingReview ? 'Edit Review' : 'Add New Review'}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
                          placeholder="Customer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={reviewForm.location}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex gap-2">
                          {[5, 4, 3, 2, 1].map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setReviewForm(prev => ({ ...prev, rating: num }))}
                              className={`px-3 py-1 rounded ${reviewForm.rating === num ? 'bg-[#800020] text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              {num}★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
                          placeholder="Review comment"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        {editingReview && (
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={handleAddReview}
                          className="px-4 py-2 bg-[#800020] text-white rounded hover:bg-[#5D4037]"
                        >
                          {editingReview ? 'Update' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Existing Reviews</h3>
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No reviews yet</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {reviews.map((review) => (
                          <div key={review.id} className="border border-gray-200 rounded p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-semibold">{review.name}</p>
                                {review.location && <p className="text-xs text-gray-500">{review.location}</p>}
                                <div className="flex mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                                  ))}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="text-blue-600 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="text-red-600 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Section Form Component with consistent fields for all sections
const SectionForm = ({ data, setData }) => {
  const [paragraphs, setParagraphs] = useState(data.paragraphs || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
    setData(prev => ({ ...prev, paragraphs: newParagraphs }));
  };

  const addParagraph = () => {
    const newParagraphs = [...paragraphs, ''];
    setParagraphs(newParagraphs);
    setData(prev => ({ ...prev, paragraphs: newParagraphs }));
  };

  const removeParagraph = (index) => {
    const newParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphs(newParagraphs);
    setData(prev => ({ ...prev, paragraphs: newParagraphs }));
  };

  return (
    <div className="space-y-5">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={data.title || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
          placeholder="Enter section title"
        />
      </div>

      {/* Subtitle Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <input
          type="text"
          name="subtitle"
          value={data.subtitle || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
          placeholder="Enter section subtitle"
        />
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={data.description || ''}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
          placeholder="Enter section description"
        />
      </div>

      {/* Button Text Field */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Button Text
        </label>
        <input
          type="text"
          name="buttonText"
          value={data.buttonText || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
          placeholder="Enter button text (e.g., Learn More, Shop Now)"
        />
      </div> */}

      {/* Paragraphs Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Paragraphs
        </label>
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                rows="4"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
                placeholder={`Paragraph ${index + 1}`}
              />
              {paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="px-3 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addParagraph}
          className="mt-3 text-[#800020] hover:text-[#5D4037] text-sm font-medium"
        >
          + Add Paragraph
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Add multiple paragraphs to create rich content sections
        </p>
      </div>
    </div>
  );
};

export default AdminAbout;