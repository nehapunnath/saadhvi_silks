import BASE_URL from './base_url' 

const authApi = {
  // Admin Login
  loginAdmin: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  },

  // Get stored token
  getToken: () => localStorage.getItem('adminToken'),

  // Verify token (for protected routes)
  verifyToken: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      throw new Error('Token verification failed');
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUid');
  },

  // Check if logged in
  isLoggedIn: () => !!localStorage.getItem('adminToken'),
};

export default authApi;