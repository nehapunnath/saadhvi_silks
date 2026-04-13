import BASE_URL from './base_url';
import { auth } from './firebase'; 
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth'; 

const authApi = {
  // ============ EXISTING METHODS ============
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      // Exchange custom token → real Firebase session
      const userCredential = await signInWithCustomToken(auth, data.token);
      const idToken = await userCredential.user.getIdToken();

      // Store minimal data
      localStorage.setItem('authToken', idToken);
      localStorage.setItem('userUid', data.uid);
      localStorage.setItem('authMethod', 'email');
      if (data.username) localStorage.setItem('username', data.username);
      if (data.isAdmin) localStorage.setItem('adminToken', data.token);

      return { ...data, token: idToken };
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  },

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
      localStorage.setItem('username', username);
      localStorage.setItem('authMethod', 'email');
      return { ...data, token: idToken };
    } catch (error) {
      console.error('Registration error:', error.message);
      throw new Error(error.message || 'Network error');
    }
  },

  // ============ NEW PHONE AUTHENTICATION METHODS ============
  
  // Send OTP to phone number
  sendPhoneOtp: async (phoneNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      // Store phone number temporarily for verification
      localStorage.setItem('tempPhoneNumber', phoneNumber);
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  },

  // Verify OTP and login/register via phone
  verifyPhoneOtp: async (otp, name = null) => {
    try {
      const phoneNumber = localStorage.getItem('tempPhoneNumber');
      if (!phoneNumber) {
        throw new Error('Phone number not found. Please request OTP again.');
      }

      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp, name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');

      // Exchange custom token → real Firebase session
      const userCredential = await signInWithCustomToken(auth, data.token);
      const idToken = await userCredential.user.getIdToken();

      // Store user data
      localStorage.setItem('authToken', idToken);
      localStorage.setItem('userUid', data.uid);
      localStorage.setItem('phoneNumber', data.phoneNumber);
      localStorage.setItem('authMethod', 'phone');
      if (data.name) localStorage.setItem('username', data.name);
      
      // Clean up temporary data
      localStorage.removeItem('tempPhoneNumber');

      return { 
        ...data, 
        token: idToken,
        isNewUser: data.isNewUser || false
      };
    } catch (error) {
      throw new Error(error.message || 'Verification failed');
    }
  },

  // Resend OTP
  resendPhoneOtp: async () => {
    try {
      const phoneNumber = localStorage.getItem('tempPhoneNumber');
      if (!phoneNumber) {
        throw new Error('Phone number not found');
      }
      return await authApi.sendPhoneOtp(phoneNumber);
    } catch (error) {
      throw new Error(error.message || 'Failed to resend OTP');
    }
  },

  // Link phone number to existing email account
  linkPhoneNumber: async (phoneNumber, otp) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${BASE_URL}/auth/link-phone`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to link phone');
      
      localStorage.setItem('phoneNumber', phoneNumber);
      localStorage.setItem('phoneVerified', 'true');
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to link phone number');
    }
  },

  // Check if phone is verified (for existing users)
  isPhoneVerified: () => {
    return localStorage.getItem('phoneVerified') === 'true';
  },

  // Get user's phone number
  getUserPhone: () => {
    return localStorage.getItem('phoneNumber') || null;
  },

  // ============ EXISTING METHODS CONTINUED ============
  
  getCurrentUser: () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe(); // listen once

        if (!firebaseUser) {
          resolve(null);
          return;
        }

        try {
          const idToken = await firebaseUser.getIdToken();
          // Try to get fresh username from backend (recommended)
          const res = await fetch(`${BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          const profile = await res.json();

          resolve({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            phoneNumber: localStorage.getItem('phoneNumber') || profile?.phoneNumber || null,
            displayName: profile?.username || localStorage.getItem('username') || firebaseUser.email?.split('@')[0] || firebaseUser.phoneNumber || 'User',
            token: idToken,
            isAdmin: !!localStorage.getItem('adminToken'),
            authMethod: localStorage.getItem('authMethod') || 'email'
          });
        } catch (err) {
          // Fallback if profile fetch fails
          resolve({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            phoneNumber: localStorage.getItem('phoneNumber') || null,
            displayName: localStorage.getItem('username') || firebaseUser.email?.split('@')[0] || firebaseUser.phoneNumber || 'User',
            token: await firebaseUser.getIdToken(),
            isAdmin: !!localStorage.getItem('adminToken'),
            authMethod: localStorage.getItem('authMethod') || 'email'
          });
        }
      });
    });
  },

  getToken: () => localStorage.getItem('authToken') || localStorage.getItem('adminToken') || localStorage.getItem('userToken'),

  logout: async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userUid');
      localStorage.removeItem('username');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUid');
      localStorage.removeItem('phoneNumber');
      localStorage.removeItem('tempPhoneNumber');
      localStorage.removeItem('phoneVerified');
      localStorage.removeItem('authMethod');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  },

  // Helper checks
  isLoggedIn: () => !!auth.currentUser,
  getUserType: () => localStorage.getItem('adminToken') ? 'admin' : (auth.currentUser ? 'user' : null),
  getAuthMethod: () => localStorage.getItem('authMethod') || null,
};

export default authApi;