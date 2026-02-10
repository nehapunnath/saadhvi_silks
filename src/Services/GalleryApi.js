import BASE_URL from './base_url';
import authApi from './authApi';
import imageCompression from 'browser-image-compression';  // ← Add this

// Same helper (copy-paste)
const compressImage = async (file) => {
  const options = {
    maxSizeMB: 2.5,
    maxWidthOrHeight: 1920,
    initialQuality: 0.95,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(
      `Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)} MB → ` +
      `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    );
    return compressedFile;
  } catch (error) {
    console.error('Compression failed for', file.name, error);
    return file;
  }
};

const GalleryApi = {
  addSlide: async (slideData, imageFile) => {
    const token = authApi.getToken();
    const formData = new FormData();

    formData.append('title', slideData.title);
    formData.append('subtitle', slideData.subtitle);
    formData.append('cta', slideData.cta || 'Shop Now');
    if (slideData.order) formData.append('order', slideData.order);
    if (imageFile) {
      const compressed = await compressImage(imageFile);
      formData.append('image', compressed);
    }

    const response = await fetch(`${BASE_URL}/admin/carousel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add slide');
    return data;
  },

  getSlides: async () => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/carousel`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch slides');
    return data; 
  },

  getSlide: async (id) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/carousel/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Slide not found');
    return data; 
  },

  updateSlide: async (id, slideData, imageFile = null) => {
    const token = authApi.getToken();
    const formData = new FormData();

    formData.append('title', slideData.title);
    formData.append('subtitle', slideData.subtitle);
    formData.append('cta', slideData.cta || 'Shop Now');
    if (slideData.order) formData.append('order', slideData.order);
    
   if (imageFile) {
    const compressed = await compressImage(imageFile);
    formData.append('image', compressed);
  }

  // Fix log: use actual processed file if compressed
  console.log('Updating slide:', id, 'With image?', !!imageFile);
    const response = await fetch(`${BASE_URL}/admin/carousel/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update slide');
    return data;
  },

  deleteSlide: async (id) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/carousel/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete slide');
    return data;
  },

  reorderSlides: async (orderMap) => {
    const token = authApi.getToken();
    const response = await fetch(`${BASE_URL}/admin/carousel/reorder`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order: orderMap }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to reorder');
    return data;
  },

  getPublicSlides: async () => {
    const response = await fetch(`${BASE_URL}/carousel`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load carousel');
    return data;
  },
  // src/Services/GalleryApi.js
// Add these methods to your existing GalleryApi

getMainGalleryImage: async () => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/admin/main-gallery-image`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch main gallery image');
  return data;
},

uploadMainGalleryImage: async (imageFile) => {
  const token = authApi.getToken();
  const formData = new FormData();
const compressed = await compressImage(imageFile);
    formData.append('image', compressed);

  const response = await fetch(`${BASE_URL}/admin/main-gallery-image`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to upload main gallery image');
  return data;
},

deleteMainGalleryImage: async () => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/admin/main-gallery-image`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to delete main gallery image');
  return data;
},

// Public method for frontend
getPublicMainGalleryImage: async () => {
  const response = await fetch(`${BASE_URL}/main-gallery-image`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load main gallery image');
  return data;
},
addCollection: async (collectionData, imageFile) => {
  const token = authApi.getToken();
  const formData = new FormData();

  formData.append('name', collectionData.name);
  if (collectionData.description) formData.append('description', collectionData.description);
  if (collectionData.items) formData.append('items', collectionData.items);
  if (collectionData.displayOrder) formData.append('displayOrder', collectionData.displayOrder);
  formData.append('isActive', collectionData.isActive);
  if (imageFile) {
      const compressed = await compressImage(imageFile);
      formData.append('image', compressed);
    }

  const response = await fetch(`${BASE_URL}/admin/collections`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to add collection');
  return data;
},

getCollections: async () => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/admin/collections`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch collections');
  return data;
},

getCollection: async (id) => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/admin/collections/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Collection not found');
  return data;
},

updateCollection: async (id, collectionData, imageFile = null) => {
  const token = authApi.getToken();
  const formData = new FormData();

  formData.append('name', collectionData.name);
  if (collectionData.description) formData.append('description', collectionData.description);
  if (collectionData.items) formData.append('items', collectionData.items);
  if (collectionData.displayOrder) formData.append('displayOrder', collectionData.displayOrder);
  formData.append('isActive', collectionData.isActive);
 if (imageFile) {
      const compressed = await compressImage(imageFile);
      formData.append('image', compressed);
    }

  const response = await fetch(`${BASE_URL}/admin/collections/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update collection');
  return data;
},

deleteCollection: async (id) => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/admin/collections/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to delete collection');
  return data;
},

reorderCollections: async (orderMap) => {
  const token = authApi.getToken();
  const response = await fetch(`${BASE_URL}/admin/collections/reorder`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order: orderMap }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to reorder collections');
  return data;
},

getPublicCollections: async () => {
  const response = await fetch(`${BASE_URL}/collections`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load collections');
  return data;
},

};

export default GalleryApi;