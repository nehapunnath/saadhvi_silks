import BASE_URL from './base_url'; 

import authApi from './authApi';

const productApi = {
  addProduct: async (productData) => {
    const token = authApi.getToken();
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key === 'occasion') {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (key === 'images') {
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
      body: formData, 
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },


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

 updateProduct: async (id, productData, newImages = []) => {
  const token = authApi.getToken();
  const formData = new FormData();
  
  Object.keys(productData).forEach(key => {
    if (key === 'images') return; 
    if (key === 'occasion') {
      formData.append(key, JSON.stringify(productData[key]));
    } else {
      formData.append(key, productData[key]);
    }
  });

  newImages.forEach((imageFile) => {
    formData.append('images', imageFile);
  });

  console.log('🔄 Sending:', productData.name, 'New images:', newImages.length); 

  const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
},
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
  },
updateStock: async (id, stock) => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stock })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
},
 getPublicProducts: async () => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getPublicProduct: async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },
};

export default productApi;