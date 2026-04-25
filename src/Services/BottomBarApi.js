// src/Services/BottomBarApi.js - Updated for collections
import BASE_URL from './base_url';
import authApi from './authApi';

const BottomBarApi = {
  // Get all featured collections (Admin)
  getFeaturedCategories: async () => {
    try {
      const token = authApi.getToken();
      const response = await fetch(`${BASE_URL}/admin/bottom-bar`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch collections');
      return data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  // Get active featured collections (Public)
  getActiveFeaturedCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/bottom-bar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch active collections');
      return data;
    } catch (error) {
      console.error('Error fetching active collections:', error);
      throw error;
    }
  },

  // Add a collection with multiple categories
  addFeaturedCategory: async (collectionData) => {
    try {
      const token = authApi.getToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${BASE_URL}/admin/bottom-bar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collectionData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add collection');
      return data;
    } catch (error) {
      console.error('Error adding collection:', error);
      throw error;
    }
  },

  // Update a collection
  updateFeaturedCategory: async (id, updateData) => {
    try {
      const token = authApi.getToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${BASE_URL}/admin/bottom-bar/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update collection');
      return data;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },

  // Remove a collection
  removeFeaturedCategory: async (id) => {
    try {
      const token = authApi.getToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${BASE_URL}/admin/bottom-bar/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to remove collection');
      return data;
    } catch (error) {
      console.error('Error removing collection:', error);
      throw error;
    }
  },

  // Reorder collections
  reorderFeaturedCategories: async (orderMap) => {
    try {
      const token = authApi.getToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${BASE_URL}/admin/bottom-bar/reorder`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderMap })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reorder collections');
      return data;
    } catch (error) {
      console.error('Error reordering collections:', error);
      throw error;
    }
  },

  // Toggle active status
  toggleActiveStatus: async (id, isActive) => {
    try {
      const token = authApi.getToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${BASE_URL}/admin/bottom-bar/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to toggle status');
      return data;
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  },

  // Get products by collection (returns products from all categories in the collection)
  getProductsByCollection: async (collectionId) => {
    try {
      const response = await fetch(`${BASE_URL}/bottom-bar/${collectionId}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch collection products');
      return data;
    } catch (error) {
      console.error('Error fetching collection products:', error);
      throw error;
    }
  }
};

export default BottomBarApi;