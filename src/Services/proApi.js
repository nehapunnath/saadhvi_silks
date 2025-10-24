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
   getWishlist: async () => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/wishlist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch wishlist');
    return data;
  },

  addToWishlist: async (item) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add to wishlist');
    return data;
  },

  removeFromWishlist: async (id) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/wishlist/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to remove from wishlist');
    return data;
  },
  getCart: async () => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch cart');
    return data;
  },

  addToCart: async (item) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add to cart');
    return data;
  },

  updateCartItem: async (id, quantity) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update cart');
    return data;
  },

  removeFromCart: async (id) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to remove from cart');
    return data;
  }

  
};

export default productApi;