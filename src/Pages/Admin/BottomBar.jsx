// src/pages/admin/BottomBarManagement.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../Components/SideBar';
import BottomBarApi from '../../Services/BottomBarApi';
import categoryApi from '../../Services/CategoryApi';

const BottomBar = () => {
  const [categories, setCategories] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // Multiple categories selection
  const [formData, setFormData] = useState({
    collectionTitle: '',
    displayOrder: '',
    isActive: true
  });

  // Load all categories and featured collections
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all active categories
      const categoriesResult = await categoryApi.getPublicCategories();
      if (categoriesResult.success) {
        setCategories(categoriesResult.categories || []);
      }

      // Fetch featured collections
      const featuredResult = await BottomBarApi.getFeaturedCategories();
      if (featuredResult.success) {
        setFeaturedCategories(featuredResult.categories || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Handle category checkbox selection (multiple)
  const handleCategorySelection = (categoryId) => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Select all categories
  const handleSelectAll = () => {
    const availableCategories = getAvailableCategories();
    setSelectedCategoryIds(availableCategories.map(cat => cat.id));
  };

  // Deselect all categories
  const handleDeselectAll = () => {
    setSelectedCategoryIds([]);
  };

  // Get available categories (not already in any collection)
  const getAvailableCategories = () => {
    const usedCategoryIds = featuredCategories.flatMap(fc => fc.categoryIds || []);
    return categories.filter(cat => !usedCategoryIds.includes(cat.id));
  };

  // Get category names by IDs
  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds)) return [];
    return categoryIds
      .map(id => categories.find(cat => cat.id === id)?.name)
      .filter(Boolean);
  };

  // Add collection with multiple categories
  const handleAddFeatured = async () => {
    if (selectedCategoryIds.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    if (!formData.collectionTitle.trim()) {
      toast.error('Please enter a collection title');
      return;
    }

    setSaving(true);
    try {
      await BottomBarApi.addFeaturedCategory({
        categoryIds: selectedCategoryIds, // Array of category IDs
        collectionTitle: formData.collectionTitle.trim(),
        displayOrder: formData.displayOrder || featuredCategories.length + 1,
        isActive: formData.isActive
      });
      
      toast.success(`Collection "${formData.collectionTitle}" added with ${selectedCategoryIds.length} categories!`);
      fetchData();
      setShowAddModal(false);
      setSelectedCategoryIds([]);
      setFormData({ collectionTitle: '', displayOrder: '', isActive: true });
    } catch (err) {
      console.error('Error adding collection:', err);
      toast.error(err.message || 'Failed to add collection');
    } finally {
      setSaving(false);
    }
  };

  // Remove collection from bottom bar
  const handleRemoveFeatured = async (id, title) => {
    if (!window.confirm(`Remove collection "${title}" from the bottom bar?`)) return;

    try {
      await BottomBarApi.removeFeaturedCategory(id);
      toast.success('Collection removed successfully');
      fetchData();
    } catch (err) {
      console.error('Error removing collection:', err);
      toast.error(err.message || 'Failed to remove collection');
    }
  };

  // Toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await BottomBarApi.toggleActiveStatus(id, !currentStatus);
      toast.success(`Collection ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (err) {
      console.error('Error toggling status:', err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Move item up
  const handleMoveUp = async (item, index) => {
    if (index === 0) return;
    
    const newOrder = [...featuredCategories];
    const tempOrder = newOrder[index].displayOrder;
    newOrder[index].displayOrder = newOrder[index - 1].displayOrder;
    newOrder[index - 1].displayOrder = tempOrder;
    
    const orderMap = {};
    newOrder.forEach(cat => {
      orderMap[cat.id] = cat.displayOrder;
    });
    
    try {
      await BottomBarApi.reorderFeaturedCategories(orderMap);
      setFeaturedCategories(newOrder);
      toast.success('Order updated');
    } catch (err) {
      console.error('Error reordering:', err);
      toast.error(err.message || 'Failed to reorder');
    }
  };

  // Move item down
  const handleMoveDown = async (item, index) => {
    if (index === featuredCategories.length - 1) return;
    
    const newOrder = [...featuredCategories];
    const tempOrder = newOrder[index].displayOrder;
    newOrder[index].displayOrder = newOrder[index + 1].displayOrder;
    newOrder[index + 1].displayOrder = tempOrder;
    
    const orderMap = {};
    newOrder.forEach(cat => {
      orderMap[cat.id] = cat.displayOrder;
    });
    
    try {
      await BottomBarApi.reorderFeaturedCategories(orderMap);
      setFeaturedCategories(newOrder);
      toast.success('Order updated');
    } catch (err) {
      console.error('Error reordering:', err);
      toast.error(err.message || 'Failed to reorder');
    }
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedCategoryIds(item.categoryIds || []);
    setFormData({
      collectionTitle: item.collectionTitle || item.displayTitle,
      displayOrder: item.displayOrder,
      isActive: item.isActive
    });
  };

  // Update collection
  const handleUpdate = async () => {
    if (!formData.collectionTitle.trim()) {
      toast.error('Please enter collection title');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setSaving(true);
    try {
      await BottomBarApi.updateFeaturedCategory(editingItem.id, {
        categoryIds: selectedCategoryIds,
        collectionTitle: formData.collectionTitle.trim(),
        displayOrder: formData.displayOrder,
        isActive: formData.isActive
      });
      toast.success('Collection updated successfully!');
      fetchData();
      setEditingItem(null);
      setSelectedCategoryIds([]);
      setFormData({ collectionTitle: '', displayOrder: '', isActive: true });
    } catch (err) {
      console.error('Error updating collection:', err);
      toast.error(err.message || 'Failed to update collection');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#800020] border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      {/* <div className="flex-1 ml-64"> */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Collection Navigation Manager</h1>
                  <p className="text-gray-600 mt-2">
                    Create collections by grouping multiple categories together for the bottom navigation bar
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#800020] text-white px-5 py-2.5 rounded-lg hover:bg-[#A0002A] transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Collection</span>
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-900">How Collections Work</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Create a collection title and select multiple related categories .
                    When users click on this collection, they'll see products from ALL selected categories combined.
                  </p>
                </div>
              </div>
            </div>

            {/* Collections List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#F9F3F3] to-[#F7F0E8]">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Collections in Bottom Bar</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {featuredCategories.length} collection(s) in bottom bar
                    </p>
                  </div>
                </div>
              </div>

              {featuredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
                  <p className="text-gray-500">Create your first collection to display in the bottom navigation bar</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {featuredCategories
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((item, index) => {
                      const categoryNames = getCategoryNames(item.categoryIds || []);
                      return (
                        <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              {/* Order Number Badge */}
                              <div className="flex-shrink-0 w-12">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                                  item.isActive 
                                    ? 'bg-[#800020]/10 text-[#800020]' 
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {item.displayOrder || index + 1}
                                </span>
                              </div>

                              {/* Collection Icon */}
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#800020]/20 to-[#A0002A]/20 rounded-lg flex items-center justify-center">
                                  <svg className="w-6 h-6 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                </div>
                              </div>

                              {/* Collection Info */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {item.collectionTitle || item.displayTitle}
                                  </h3>
                                  {!item.isActive && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs text-gray-500">Includes:</span>
                                  {categoryNames.map((name, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                      {name}
                                    </span>
                                  ))}
                                  <span className="text-xs text-gray-400 ml-1">
                                    ({item.categoryIds?.length || 0} categories)
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-1">
                                {/* Move Up */}
                                <button
                                  onClick={() => handleMoveUp(item, index)}
                                  disabled={index === 0}
                                  className={`p-2 rounded-lg transition-all ${
                                    index === 0
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-gray-500 hover:bg-gray-100 hover:text-[#800020]'
                                  }`}
                                  title="Move Up"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>

                                {/* Move Down */}
                                <button
                                  onClick={() => handleMoveDown(item, index)}
                                  disabled={index === featuredCategories.length - 1}
                                  className={`p-2 rounded-lg transition-all ${
                                    index === featuredCategories.length - 1
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-gray-500 hover:bg-gray-100 hover:text-[#800020]'
                                  }`}
                                  title="Move Down"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {/* Toggle Active */}
                                <button
                                  onClick={() => handleToggleActive(item.id, item.isActive)}
                                  className={`p-2 rounded-lg transition-all ${
                                    item.isActive
                                      ? 'text-green-600 hover:bg-green-50'
                                      : 'text-gray-400 hover:bg-gray-100'
                                  }`}
                                  title={item.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>

                                {/* Remove */}
                                <button
                                  onClick={() => handleRemoveFeatured(item.id, item.collectionTitle || item.displayTitle)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Remove from bottom bar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Live Preview Section */}
            {featuredCategories.filter(c => c.isActive).length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
                    <span className="text-xs text-gray-500">How it looks on your website</span>
                  </div>
                </div>
                
                {/* Bottom Bar Preview */}
                <div className="bg-gradient-to-r from-[#800020] to-[#6B001A] px-6 py-4">
                  <div className="flex items-center justify-center space-x-3 flex-wrap gap-3">
                    {featuredCategories
                      .filter(cat => cat.isActive)
                      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                      .map((category) => (
                        <div
                          key={category.id}
                          className="group relative px-5 py-2 rounded-full text-sm font-semibold bg-white/10 text-white hover:bg-[#FFD700] hover:text-[#800020] transition-all duration-300 cursor-pointer backdrop-blur-sm"
                        >
                          {category.collectionTitle || category.displayTitle}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Add Collection Modal with Category Checkboxes */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-800">Create New Collection</h2>
                    <p className="text-gray-500 text-sm mt-1">Group multiple categories under one collection name</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Collection Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Collection Title *
                      </label>
                      <input
                        type="text"
                        value={formData.collectionTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, collectionTitle: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                        placeholder="e.g., Cotton Sarees, Silk Collection, Party Wear"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This is what users will see in the navigation bar
                      </p>
                    </div>

                    {/* Categories Selection with Checkboxes */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Categories to Include *
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-xs text-[#800020] hover:text-[#A0002A] font-medium"
                          >
                            Select All
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {categories.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            No categories available
                          </div>
                        ) : (
                          categories.map(category => {
                            // Check if category is already used in any collection
                            const isUsed = featuredCategories.some(fc => 
                              fc.categoryIds?.includes(category.id)
                            );
                            
                            return (
                              <label
                                key={category.id}
                                className={`flex items-center p-4 transition-colors ${
                                  isUsed 
                                    ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                                    : 'hover:bg-gray-50 cursor-pointer'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedCategoryIds.includes(category.id)}
                                  onChange={() => handleCategorySelection(category.id)}
                                  disabled={isUsed}
                                  className="h-4 w-4 text-[#800020] focus:ring-[#800020] border-gray-300 rounded"
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-800 font-medium">{category.name}</span>
                                    {isUsed && (
                                      <span className="text-xs text-amber-600">
                                        Already in another collection
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </label>
                            );
                          })
                        )}
                      </div>
                      {selectedCategoryIds.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          {selectedCategoryIds.length} category(s) selected
                        </p>
                      )}
                    </div>

                    {/* Display Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                        placeholder="Auto-assigned if left empty"
                        min="1"
                      />
                    </div>

                    {/* Active Status Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="font-medium text-gray-700">
                          Active Status
                        </label>
                        <p className="text-xs text-gray-500">Show/Hide in bottom bar</p>
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          formData.isActive ? 'bg-[#800020]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedCategoryIds([]);
                        setFormData({ collectionTitle: '', displayOrder: '', isActive: true });
                      }}
                      className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddFeatured}
                      disabled={saving || selectedCategoryIds.length === 0 || !formData.collectionTitle.trim()}
                      className="bg-[#800020] text-white px-5 py-2 rounded-lg hover:bg-[#A0002A] disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-all flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create Collection</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Collection Modal */}
            {editingItem && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-800">Edit Collection</h2>
                    <p className="text-gray-500 text-sm mt-1">Update collection settings and categories</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Collection Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Collection Title *
                      </label>
                      <input
                        type="text"
                        value={formData.collectionTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, collectionTitle: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                      />
                    </div>

                    {/* Categories Selection */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Categories to Include *
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-xs text-[#800020] hover:text-[#A0002A] font-medium"
                          >
                            Select All
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {categories.map(category => {
                          // Check if category is used in other collections
                          const usedInOtherCollection = featuredCategories.some(fc => 
                            fc.id !== editingItem.id && fc.categoryIds?.includes(category.id)
                          );
                          
                          return (
                            <label
                              key={category.id}
                              className={`flex items-center p-4 transition-colors ${
                                usedInOtherCollection 
                                  ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                                  : 'hover:bg-gray-50 cursor-pointer'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedCategoryIds.includes(category.id)}
                                onChange={() => handleCategorySelection(category.id)}
                                disabled={usedInOtherCollection}
                                className="h-4 w-4 text-[#800020] focus:ring-[#800020] border-gray-300 rounded"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-800 font-medium">{category.name}</span>
                                  {usedInOtherCollection && (
                                    <span className="text-xs text-amber-600">
                                      Already in another collection
                                    </span>
                                  )}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-sm text-green-600 mt-2">
                        {selectedCategoryIds.length} category(s) selected
                      </p>
                    </div>

                    {/* Display Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                        min="1"
                      />
                    </div>

                    {/* Active Status Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="font-medium text-gray-700">Active Status</label>
                        <p className="text-xs text-gray-500">Show/Hide in bottom bar</p>
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.isActive ? 'bg-[#800020]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setSelectedCategoryIds([]);
                        setFormData({ collectionTitle: '', displayOrder: '', isActive: true });
                      }}
                      className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={saving || selectedCategoryIds.length === 0 || !formData.collectionTitle.trim()}
                      className="bg-[#800020] text-white px-5 py-2 rounded-lg hover:bg-[#A0002A] disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-all flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    // </div>
  );
};

export default BottomBar;