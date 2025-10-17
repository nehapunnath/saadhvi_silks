// src/Services/productApi.js
const BASE_URL = 'http://localhost:5000'; // Change to your deployed URL later

import authApi from './authApi';

const productApi = {
  // 🔥 ADD PRODUCT - 5 IMAGES
  addProduct: async (productData) => {
    const token = authApi.getToken();
    const formData = new FormData();
    
    // Append all TEXT fields
    Object.keys(productData).forEach(key => {
      if (key === 'occasion') {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (key === 'images') {
        // 🔥 MULTIPLE IMAGES - Append each file
        productData.images.forEach((imageFile, index) => {
          formData.append('images', imageFile);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await fetch(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // 🔥 NO content-type - let browser set multipart
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  // 🔥 GET ALL PRODUCTS
  getProducts: async () => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/products`, {
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

  // 🔥 GET SINGLE PRODUCT
  getProduct: async (id) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
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

 // 🔥 UPDATE FULL PRODUCT
updateProduct: async (id, productData, newImages = []) => {
  const token = authApi.getToken();
  const formData = new FormData();
  
  Object.keys(productData).forEach(key => {
    if (key === 'occasion') {
      formData.append(key, JSON.stringify(productData[key]));
    } else if (key === 'images' && newImages.length > 0) {
      newImages.forEach((imageFile) => {
        formData.append('images', imageFile);
      });
    } else {
      formData.append(key, productData[key]);
    }
  });

  const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
},
  // 🔥 DELETE PRODUCT
  deleteProduct: async (id) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

export default productApi;