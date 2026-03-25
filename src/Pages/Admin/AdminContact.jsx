// components/admin/AdminContactManager.jsx
import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar';

const AdminContact = () => {
  const [contactInfo, setContactInfo] = useState({
    title: 'Get in Touch',
    subtitle: 'Visit our store or reach out to us through any of the following methods. We\'re here to help you find the perfect silk saree.',
    address: {
      line1: '#69/2, AGR Tower, Carmelaram Post,',
      line2: 'Kaikondrahalli, Sarjapur Main Road,',
      line3: 'Bengaluru - 560035'
    },
    phones: ['8861315710', '080-41706009'],
    email: 'saadhvisilksblr@gmail.com',
    businessHours: {
      weekday: 'Monday - Saturday: 10:00 AM - 8:00 PM',
      sunday: 'Sunday: 11:00 AM - 6:00 PM'
    },
    socialMedia: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      pinterest: 'https://pinterest.com'
    },
    whyVisit: {
      title: 'Why Visit Our Store?',
      points: [
        'Expert assistance in selecting the perfect silk saree',
        'See and feel the quality of our fabrics in person',
        'Get personalized recommendations based on your preferences',
        'Learn about proper saree maintenance and care'
      ]
    },
    mapLocation: {
      address: '#69/2, AGR Tower, Carmelaram Post, Bengaluru',
      embedUrl: ''
    },
    isSaved: false
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [tempData, setTempData] = useState(null);

  const openModal = () => {
    setTempData({ ...contactInfo });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTempData(null);
  };

  const handleSave = () => {
    if (tempData) {
      setContactInfo({ ...tempData, isSaved: true });
      alert('Contact information saved successfully!');
      closeModal();
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Sidebar />
      <div className="container mx-auto px-4 max-w-7xl py-8 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#5D4037] mb-2">Contact Page Manager</h1>
          <p className="text-gray-600">Customize all contact information for the contact us page</p>
        </div>

        {/* Edit Button */}
        {/* <div className="mb-8">
          <button
            onClick={openModal}
            className="bg-[#800020] text-white px-6 py-3 rounded-lg hover:bg-[#5D4037] transition-colors font-medium shadow-md"
          >
            Edit Contact Information
          </button>
        </div> */}

        {/* Saved Contact Information Display */}
        {contactInfo.isSaved && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#5D4037] mb-4">Saved Contact Information</h2>
            
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg text-[#5D4037] mb-3">Page Header</h3>
              <div className="space-y-2">
                <p><strong>Title:</strong> {contactInfo.title}</p>
                <p><strong>Subtitle:</strong> {contactInfo.subtitle}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg text-[#5D4037] mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p><strong>Address:</strong></p>
                <p className="ml-4">{contactInfo.address.line1}</p>
                <p className="ml-4">{contactInfo.address.line2}</p>
                <p className="ml-4">{contactInfo.address.line3}</p>
                <p><strong>Phone Numbers:</strong> {contactInfo.phones.join(', ')}</p>
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Business Hours:</strong></p>
                <p className="ml-4">{contactInfo.businessHours.weekday}</p>
                <p className="ml-4">{contactInfo.businessHours.sunday}</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg text-[#5D4037] mb-3">Social Media Links</h3>
              <div className="space-y-1">
                <p><strong>Facebook:</strong> {contactInfo.socialMedia.facebook}</p>
                <p><strong>Instagram:</strong> {contactInfo.socialMedia.instagram}</p>
                <p><strong>Pinterest:</strong> {contactInfo.socialMedia.pinterest}</p>
              </div>
            </div>

            {/* Why Visit Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg text-[#5D4037] mb-3">{contactInfo.whyVisit.title}</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {contactInfo.whyVisit.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Map Location */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg text-[#5D4037] mb-3">Map Location</h3>
              <p><strong>Display Address:</strong> {contactInfo.mapLocation.address}</p>
              {contactInfo.mapLocation.embedUrl && (
                <p><strong>Map Embed URL:</strong> {contactInfo.mapLocation.embedUrl}</p>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#800020] px-6 py-3 flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-bold text-white">Edit Contact Information</h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <ContactForm 
                  data={tempData} 
                  setData={setTempData} 
                />
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#800020] text-white rounded hover:bg-[#5D4037]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Contact Form Component
const ContactForm = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (field, value) => {
    setData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...data.phones];
    newPhones[index] = value;
    setData(prev => ({ ...prev, phones: newPhones }));
  };

  const addPhone = () => {
    setData(prev => ({ ...prev, phones: [...prev.phones, ''] }));
  };

  const removePhone = (index) => {
    const newPhones = data.phones.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, phones: newPhones }));
  };

  const handleSocialChange = (platform, value) => {
    setData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const handleWhyVisitPointChange = (index, value) => {
    const newPoints = [...data.whyVisit.points];
    newPoints[index] = value;
    setData(prev => ({
      ...prev,
      whyVisit: { ...prev.whyVisit, points: newPoints }
    }));
  };

  const addWhyVisitPoint = () => {
    setData(prev => ({
      ...prev,
      whyVisit: { ...prev.whyVisit, points: [...prev.whyVisit.points, ''] }
    }));
  };

  const removeWhyVisitPoint = (index) => {
    const newPoints = data.whyVisit.points.filter((_, i) => i !== index);
    setData(prev => ({
      ...prev,
      whyVisit: { ...prev.whyVisit, points: newPoints }
    }));
  };

  const handleMapChange = (field, value) => {
    setData(prev => ({
      ...prev,
      mapLocation: { ...prev.mapLocation, [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Page Header</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter page title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              name="subtitle"
              value={data.subtitle}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter page subtitle"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input
              type="text"
              value={data.address.line1}
              onChange={(e) => handleAddressChange('line1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter address line 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input
              type="text"
              value={data.address.line2}
              onChange={(e) => handleAddressChange('line2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter address line 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3</label>
            <input
              type="text"
              value={data.address.line3}
              onChange={(e) => handleAddressChange('line3', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter address line 3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers</label>
            {data.phones.map((phone, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  placeholder={`Phone ${index + 1}`}
                />
                {data.phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="px-3 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhone}
              className="text-[#800020] hover:text-[#5D4037] text-sm font-medium"
            >
              + Add Phone Number
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weekday Hours</label>
            <input
              type="text"
              value={data.businessHours.weekday}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessHours: { ...prev.businessHours, weekday: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="e.g., Monday - Saturday: 10:00 AM - 8:00 PM"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Hours</label>
            <input
              type="text"
              value={data.businessHours.sunday}
              onChange={(e) => setData(prev => ({
                ...prev,
                businessHours: { ...prev.businessHours, sunday: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="e.g., Sunday: 11:00 AM - 6:00 PM"
            />
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Social Media Links</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input
              type="url"
              value={data.socialMedia.facebook}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={data.socialMedia.instagram}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pinterest URL</label>
            <input
              type="url"
              value={data.socialMedia.pinterest}
              onChange={(e) => handleSocialChange('pinterest', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="https://pinterest.com/yourpage"
            />
          </div>
        </div>
      </div>

      {/* Why Visit Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Why Visit Section</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={data.whyVisit.title}
              onChange={(e) => setData(prev => ({
                ...prev,
                whyVisit: { ...prev.whyVisit, title: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            {data.whyVisit.points.map((point, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleWhyVisitPointChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  placeholder={`Point ${index + 1}`}
                />
                {data.whyVisit.points.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWhyVisitPoint(index)}
                    className="px-3 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addWhyVisitPoint}
              className="text-[#800020] hover:text-[#5D4037] text-sm font-medium"
            >
              + Add Point
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#5D4037] mb-4">Map Location</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Address</label>
            <textarea
              value={data.mapLocation.address}
              onChange={(e) => handleMapChange('address', e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Enter address to display on map"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL (Optional)</label>
            <input
              type="url"
              value={data.mapLocation.embedUrl}
              onChange={(e) => handleMapChange('embedUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Get embed URL from Google Maps by clicking "Share" → "Embed a map" and copying the URL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;