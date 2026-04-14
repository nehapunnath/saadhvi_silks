import BASE_URL from './base_url'; 

import authApi from './authApi';
import imageCompression from 'browser-image-compression';


const compressImage = async (file) => {
  const options = {
    maxSizeMB: 2.5,
    maxWidthOrHeight: 1920,
    initialQuality: 0.95,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // console.log(
    //   `Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)} MB → ` +
    //   `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    // );
    return compressedFile;
  } catch (error) {
    console.error('Compression failed for', file.name, error);
    return file; // fallback
  }
};

const productApi = {
  addProduct: async (productData) => {
    const token = authApi.getToken();
    const formData = new FormData();

    // Compress images if any
    let compressedImages = [];
    if (productData.images?.length > 0) {
      compressedImages = await Promise.all(
        productData.images.map(file => compressImage(file))
      );
    }

    Object.keys(productData).forEach(key => {
      if (key === 'occasion') {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (key === 'images') {
        compressedImages.forEach(imageFile => {
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

// Update the updateProduct function in your proApi.js file

updateProduct: async (id, productData, newImages = [], imagesToDelete = []) => {
    const token = authApi.getToken();
    const formData = new FormData();

    // Compress new images if any
    let compressedNewImages = [];
    if (newImages?.length > 0) {
      compressedNewImages = await Promise.all(
        newImages.map(file => compressImage(file))
      );
    }

    Object.keys(productData).forEach(key => {
      if (key === 'images') return;
      if (key === 'occasion') {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });

    compressedNewImages.forEach(imageFile => {
      formData.append('images', imageFile);
    });

    // Add images to delete as JSON string
    if (imagesToDelete && imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }

    console.log('🔄 Sending:', productData.name, 
                'New images:', compressedNewImages.length,
                'Images to delete:', imagesToDelete.length);

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

  console.log('📤 Adding to cart:', { id, name, price, image, quantity });
  console.log('🔑 Token exists:', !!token);
  console.log('🌐 API URL:', `${BASE_URL}/cart`);

  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, name, price, image, quantity })
    });

    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (!response.ok) throw new Error(data.error || 'Failed to add to cart');
    return data;
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    throw error;
  }
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

toggleProductVisibility: async (productId, isVisible) => {
    const token = authApi.getToken();

    const response = await fetch(`${BASE_URL}/admin/products/${productId}/visibility`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isVisible })   // true = show, false = hide
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update product visibility');
    }

    return data;
  },

reorderProducts: async (orderMap) => {
    const token = authApi.getToken();

    if (!orderMap || typeof orderMap !== 'object' || Object.keys(orderMap).length === 0) {
      throw new Error('orderMap must be a non-empty object { productId: number, ... }');
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/products/reorder`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderMap }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Reorder failed:', data);
        throw new Error(data.error || 'Failed to reorder products');
      }

      console.log(`Reordered ${Object.keys(orderMap).length} products successfully`);
      return data;
    } catch (err) {
      console.error('reorderProducts error:', err);
      throw err;
    }
  },

  // Optional: helper to fetch current order (mostly for debugging)
  getVisibleProductsOrder: async () => {
    const token = authApi.getToken();

    const response = await fetch(`${BASE_URL}/admin/products/visible-order`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch visible order');
    return data;
  },
  // Add to your productApi object
getHomepageSettings: async () => {
  const response = await fetch(`${BASE_URL}/settings/homepage`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
},

updateHomepageSettings: async (selectedProductIds, count) => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/settings/homepage`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ selectedProductIds, count })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
},

getBudgetSelections: async () => {
  const response = await fetch(`${BASE_URL}/settings/budget-selections`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
},

updateBudgetSelections: async (selections) => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/settings/budget-selections`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selections)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
},
  
// Get all offers (admin)
  getOffers: async () => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/offers`, {
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

  // Create a new offer (admin)
  createOffer: async (offerData) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/offers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(offerData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  // Update an offer (admin)
  updateOffer: async (offerId, offerData) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/offers/${offerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(offerData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  // Delete an offer (admin)
  deleteOffer: async (offerId) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/offers/${offerId}`, {
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

  // Apply offer to a product (admin)
  applyOfferToProduct: async (productId, offerId, customPrice = null) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/products/${productId}/apply-offer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offerId, customPrice })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  // Remove offer from a product (admin)
  removeOfferFromProduct: async (productId) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/products/${productId}/remove-offer`, {
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

  // Get active offers with their products (public - for homepage)
  getActiveOffersWithProducts: async () => {
    const response = await fetch(`${BASE_URL}/offers/active`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  // Get all products under a specific offer (public)
  getProductsByOffer: async (offerId) => {
    const response = await fetch(`${BASE_URL}/offers/${offerId}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  // Legacy updateProductOffer method (keeping for backward compatibility)
  updateProductOffer: async (productId, offerData) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/products/${productId}/offer`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(offerData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update offer');
    return data;
  }


};

export default productApi;