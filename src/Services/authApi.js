// src/Services/authApi.js
import BASE_URL from './base_url';
import { auth } from './firebase'; // Import initialized auth from firebase.js
import { signInWithCustomToken } from 'firebase/auth'; // Import from firebase/auth

const authApi = {
  // Unified Login (User and Admin)
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', email);
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

      console.log('Exchanging custom token for ID token');
      const userCredential = await signInWithCustomToken(auth, data.token);
      const idToken = await userCredential.user.getIdToken();
      console.log('ID token obtained');
      
      return { ...data, token: idToken }; // Return ID token
    } catch (error) {
      console.error('Login error:', error.message);
      throw new Error(error.message || 'Network error');
    }
  },

  // User Registration
  registerUser: async (username, email, password) => {
    try {
      console.log('Attempting registration for:', email);
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('Exchanging custom token for ID token');
      const userCredential = await signInWithCustomToken(auth, data.token);
      const idToken = await userCredential.user.getIdToken();
      console.log('ID token obtained');
      
      return { ...data, token: idToken };
    } catch (error) {
      console.error('Registration error:', error.message);
      throw new Error(error.message || 'Network error');
    }
  },

  // Get stored token
  getToken: () => localStorage.getItem('adminToken') || localStorage.getItem('userToken'),

  // Get user type
  getUserType: () => {
    if (localStorage.getItem('adminToken')) return 'admin';
    if (localStorage.getItem('userToken')) return 'user';
    return null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUid');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userUid');
    localStorage.removeItem('username');
  },

  // Check if logged in
  isLoggedIn: () => !!(localStorage.getItem('adminToken') || localStorage.getItem('userToken')),
};

export default authApi;