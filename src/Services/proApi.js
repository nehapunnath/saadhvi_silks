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
  const { id, name, price, image, quantity } = item;

  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, name, price, image, quantity })
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
  },

  checkout: async (checkoutData) => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkoutData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Checkout failed');
  return data;
},
getOrders: async () => {
    const token = authApi.getToken();
    const res = await fetch(`${BASE_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  getOrderById: async (orderId) => {
  const token = authApi.getToken();
  const res = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.order;
},

  updateOrder: async (orderId, updates) => {
    const token = authApi.getToken();
    const res = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  deleteOrder: async (orderId) => {
    const token = authApi.getToken();
    const res = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
  
  // In your proApi.js - enhance the search function
searchProducts: async (query) => {
  if (!query || query.trim().length < 2) {
    console.log('Search query too short');
    return { results: [] };
  }

  try {
    const cleanQuery = query.trim();
    console.log(`🔍 Frontend searching for: "${cleanQuery}"`);
    
    const response = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(cleanQuery)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Search API error: ${response.status}`, errorText);
      
      if (response.status === 404) {
        console.warn('Search endpoint not found');
        // Try alternative endpoint
        try {
          const altResponse = await fetch(`${BASE_URL}/products?search=${encodeURIComponent(cleanQuery)}`);
          if (altResponse.ok) {
            const data = await altResponse.json();
            return { results: data.products || [] };
          }
        } catch (altError) {
          console.error('Alternative search also failed:', altError);
        }
      }
      
      return { results: [], error: `Search failed: ${response.status}` };
    }
    
    const data = await response.json();
    console.log(`✅ Search successful, found ${data.results?.length || 0} results`);
    
    return { 
      results: data.results || [],
      count: data.count || 0
    };
    
  } catch (err) {
    console.error('❌ Search API error:', err);
    return { results: [], error: 'Network error during search' };
  }
},

  
};

export default productApi;