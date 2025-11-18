// src/Services/categoryApi.js
import BASE_URL from './base_url';
import authApi from './authApi';

const categoryApi = {
  getCategories: async () => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/categories`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  addCategory: async (categoryData) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoryData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoryData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  deleteCategory: async (id, excludeProductId = null) => {
    const token = authApi.getToken();
    
    const requestBody = {};
    if (excludeProductId) {
      requestBody.excludeProductId = excludeProductId;
    }
    
    const response = await fetch(`${BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getPublicCategories: async () => {
    const response = await fetch(`${BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

export default categoryApi;