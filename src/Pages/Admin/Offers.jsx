// src/pages/admin/Offers.js
import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar';

const Offers = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Festival Special",
      discount: "20% OFF",
      description: "On all traditional silk sarees",
      code: "FEST20",
      expiry: "2024-12-31",
      status: "Active",
      type: "Percentage",
      minOrder: 0,
      maxDiscount: 2000,
      usageLimit: 100,
      usedCount: 45,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "First Purchase",
      discount: "15% OFF",
      description: "For new customers",
      code: "WELCOME15",
      expiry: "2024-12-31",
      status: "Active",
      type: "Percentage",
      minOrder: 1000,
      maxDiscount: 1500,
      usageLimit: 500,
      usedCount: 289,
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      title: "Free Shipping",
      discount: "FREE",
      description: "On orders above ₹9999",
      code: "SHIPFREE",
      expiry: "2024-06-30",
      status: "Active",
      type: "Free Shipping",
      minOrder: 9999,
      maxDiscount: 0,
      usageLimit: 1000,
      usedCount: 623,
      createdAt: "2024-02-01"
    },
    {
      id: 4,
      title: "Bridal Package",
      discount: "25% OFF",
      description: "On bridal collection",
      code: "BRIDE25",
      expiry: "2024-03-31",
      status: "Expired",
      type: "Percentage",
      minOrder: 5000,
      maxDiscount: 5000,
      usageLimit: 50,
      usedCount: 50,
      createdAt: "2024-01-01"
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [newOffer, setNewOffer] = useState({
    title: '',
    discount: '',
    description: '',
    code: '',
    expiry: '',
    type: 'Percentage',
    minOrder: '',
    maxDiscount: '',
    usageLimit: ''
  });

  const offerTypes = ['Percentage', 'Fixed Amount', 'Free Shipping', 'Buy One Get One'];
  const statusOptions = ['All', 'Active', 'Expired', 'Draft'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Percentage': return 'bg-blue-100 text-blue-800';
      case 'Fixed Amount': return 'bg-purple-100 text-purple-800';
      case 'Free Shipping': return 'bg-green-100 text-green-800';
      case 'Buy One Get One': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateUsagePercentage = (used, limit) => {
    return (used / limit) * 100;
  };

  const isOfferExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const filteredOffers = offers.filter(offer => {
    const matchesStatus = filterStatus === 'All' || offer.status === filterStatus;
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleCreateOffer = (e) => {
    e.preventDefault();
    const offer = {
      id: offers.length + 1,
      ...newOffer,
      status: 'Active',
      usedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      minOrder: parseInt(newOffer.minOrder) || 0,
      maxDiscount: parseInt(newOffer.maxDiscount) || 0,
      usageLimit: parseInt(newOffer.usageLimit) || 100
    };
    
    setOffers([...offers, offer]);
    setShowCreateModal(false);
    setNewOffer({
      title: '',
      discount: '',
      description: '',
      code: '',
      expiry: '',
      type: 'Percentage',
      minOrder: '',
      maxDiscount: '',
      usageLimit: ''
    });
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setNewOffer({
      title: offer.title,
      discount: offer.discount,
      description: offer.description,
      code: offer.code,
      expiry: offer.expiry,
      type: offer.type,
      minOrder: offer.minOrder,
      maxDiscount: offer.maxDiscount,
      usageLimit: offer.usageLimit
    });
    setShowEditModal(true);
  };

  const handleUpdateOffer = (e) => {
    e.preventDefault();
    setOffers(prev => 
      prev.map(offer => 
        offer.id === selectedOffer.id 
          ? { 
              ...offer, 
              ...newOffer,
              minOrder: parseInt(newOffer.minOrder) || 0,
              maxDiscount: parseInt(newOffer.maxDiscount) || 0,
              usageLimit: parseInt(newOffer.usageLimit) || 100
            }
          : offer
      )
    );
    setShowEditModal(false);
    setSelectedOffer(null);
    setNewOffer({
      title: '',
      discount: '',
      description: '',
      code: '',
      expiry: '',
      type: 'Percentage',
      minOrder: '',
      maxDiscount: '',
      usageLimit: ''
    });
  };

  const handleDeleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(prev => prev.filter(offer => offer.id !== id));
    }
  };

  const toggleOfferStatus = (id) => {
    setOffers(prev =>
      prev.map(offer =>
        offer.id === id 
          ? { ...offer, status: offer.status === 'Active' ? 'Draft' : 'Active' }
          : offer
      )
    );
  };

  const generateOfferCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewOffer(prev => ({ ...prev, code }));
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
                  <h1 className="text-3xl font-bold text-gray-800">Offers Management</h1>
                  <p className="text-gray-600 mt-1">Create and manage special offers and promotions</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Offer</span>
                </button>
              </div>

              {/* Stats Overview */}
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Offers</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">{offers.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Offers</p>
                      <p className="text-3xl font-bold text-green-600 mt-1">
                        {offers.filter(offer => offer.status === 'Active').length}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Usage</p>
                      <p className="text-3xl font-bold text-purple-600 mt-1">
                        {offers.reduce((total, offer) => total + offer.usedCount, 0)}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Expired Offers</p>
                      <p className="text-3xl font-bold text-red-600 mt-1">
                        {offers.filter(offer => offer.status === 'Expired').length}
                      </p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="lg:w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Offers</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by title or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offers Grid */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {filteredOffers.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                    <p className="text-gray-500 mb-4">Create your first offer to get started.</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200"
                    >
                      Create Offer
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                      <div key={offer.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        {/* Offer Header */}
                        <div className="bg-gradient-to-r from-[#6B2D2D] to-[#8B3A3A] p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-white">{offer.title}</h3>
                            <span className="text-2xl font-bold text-white">{offer.discount}</span>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                              {offer.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(offer.type)}`}>
                              {offer.type}
                            </span>
                          </div>
                        </div>

                        {/* Offer Details */}
                        <div className="p-4">
                          <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                          
                          <div className="bg-white rounded-lg p-3 mb-3 border">
                            <div className="text-center">
                              <span className="text-xs text-gray-500">Use Code:</span>
                              <div className="font-mono font-bold text-lg text-[#6B2D2D]">{offer.code}</div>
                            </div>
                          </div>

                          {/* Offer Conditions */}
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {offer.minOrder > 0 && (
                              <div className="flex justify-between">
                                <span>Min. Order:</span>
                                <span className="font-medium">{formatPrice(offer.minOrder)}</span>
                              </div>
                            )}
                            {offer.maxDiscount > 0 && (
                              <div className="flex justify-between">
                                <span>Max. Discount:</span>
                                <span className="font-medium">{formatPrice(offer.maxDiscount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Expires:</span>
                              <span className="font-medium">{new Date(offer.expiry).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Usage Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Usage: {offer.usedCount}/{offer.usageLimit}</span>
                              <span>{calculateUsagePercentage(offer.usedCount, offer.usageLimit).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${calculateUsagePercentage(offer.usedCount, offer.usageLimit)}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditOffer(offer)}
                              className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-lg hover:bg-yellow-200 transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => toggleOfferStatus(offer.id)}
                              className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{offer.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Create Offer Modal */}
              {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Offer</h2>
                    
                    <form onSubmit={handleCreateOffer} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title *</label>
                          <input
                            type="text"
                            value={newOffer.title}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="e.g., Festival Special"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                          <input
                            type="text"
                            value={newOffer.discount}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, discount: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="e.g., 20% OFF or ₹500 OFF"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                          <textarea
                            value={newOffer.description}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="Describe the offer details..."
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Code *</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newOffer.code}
                              onChange={(e) => setNewOffer(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                              placeholder="e.g., FEST20"
                              required
                            />
                            <button
                              type="button"
                              onClick={generateOfferCode}
                              className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 whitespace-nowrap"
                            >
                              Generate
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type *</label>
                          <select
                            value={newOffer.type}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          >
                            {offerTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                          <input
                            type="date"
                            value={newOffer.expiry}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, expiry: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order (₹)</label>
                          <input
                            type="number"
                            value={newOffer.minOrder}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, minOrder: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount (₹)</label>
                          <input
                            type="number"
                            value={newOffer.maxDiscount}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, maxDiscount: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit *</label>
                          <input
                            type="number"
                            value={newOffer.usageLimit}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, usageLimit: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            placeholder="100"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowCreateModal(false)}
                          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200"
                        >
                          Create Offer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Offer Modal */}
              {showEditModal && selectedOffer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Offer</h2>
                    
                    <form onSubmit={handleUpdateOffer} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title *</label>
                          <input
                            type="text"
                            value={newOffer.title}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                          <input
                            type="text"
                            value={newOffer.discount}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, discount: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                          <textarea
                            value={newOffer.description}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Code *</label>
                          <input
                            type="text"
                            value={newOffer.code}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type *</label>
                          <select
                            value={newOffer.type}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          >
                            {offerTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                          <input
                            type="date"
                            value={newOffer.expiry}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, expiry: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order (₹)</label>
                          <input
                            type="number"
                            value={newOffer.minOrder}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, minOrder: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount (₹)</label>
                          <input
                            type="number"
                            value={newOffer.maxDiscount}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, maxDiscount: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit *</label>
                          <input
                            type="number"
                            value={newOffer.usageLimit}
                            onChange={(e) => setNewOffer(prev => ({ ...prev, usageLimit: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditModal(false);
                            setSelectedOffer(null);
                            setNewOffer({
                              title: '',
                              discount: '',
                              description: '',
                              code: '',
                              expiry: '',
                              type: 'Percentage',
                              minOrder: '',
                              maxDiscount: '',
                              usageLimit: ''
                            });
                          }}
                          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200"
                        >
                          Update Offer
                        </button>
                      </div>
                    </form>
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

export default Offers;