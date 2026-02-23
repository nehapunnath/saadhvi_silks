// src/Services/badgeApi.js
import BASE_URL from './base_url';
import authApi from './authApi';

const badgeApi = {
  /**
   * Get all badges (admin view)
   * @returns {Promise<{success: boolean, badges: Array}>}
   */
  getBadges: async () => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/badges`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch badges');
    return data;
  },

  /**
   * Add a new badge
   * @param {Object} badgeData - { name: string, ...other fields if added later }
   */
  addBadge: async (badgeData) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/badges`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(badgeData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add badge');
    return data;
  },

  /**
   * Update an existing badge
   * @param {string} id - badge ID
   * @param {Object} badgeData - { name: string, ... }
   */
  updateBadge: async (id, badgeData) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/badges/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(badgeData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update badge');
    return data;
  },

  /**
   * Delete a badge
   * @param {string} id - badge ID
   * @param {string} [excludeProductId=null] - optional: product to ignore during usage check
   */
  deleteBadge: async (id, excludeProductId = null) => {
    const token = authApi.getToken();
    
    const requestBody = {};
    if (excludeProductId) {
      requestBody.excludeProductId = excludeProductId;
    }
    
    const response = await fetch(`${BASE_URL}/admin/badges/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete badge');
    return data;
  },

  

getPublicBadges: async () => {
  const response = await fetch(`${BASE_URL}/badges`, {   // ← public route (no token)
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch public badges');
  return data;
},
};

export default badgeApi;