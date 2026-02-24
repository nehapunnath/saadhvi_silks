import BASE_URL from './base_url';
import { auth } from './firebase'; 
import { signInWithCustomToken , onAuthStateChanged } from 'firebase/auth'; 

const authApi = {
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
      if (data.username) localStorage.setItem('username', data.username); // only as fallback

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
      return { ...data, token: idToken };
    } catch (error) {
      console.error('Registration error:', error.message);
      throw new Error(error.message || 'Network error');
    }
  },
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
            displayName: profile?.username || localStorage.getItem('username') || firebaseUser.email?.split('@')[0] || 'User',
            token: idToken,
            isAdmin: !!localStorage.getItem('adminToken') // or better: check from backend
          });
        } catch (err) {
          // Fallback if profile fetch fails
          resolve({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: localStorage.getItem('username') || firebaseUser.email?.split('@')[0] || 'User',
            token: await firebaseUser.getIdToken(),
            isAdmin: !!localStorage.getItem('adminToken')
          });
        }
      });
    });
  },

  getToken: () => localStorage.getItem('adminToken') || localStorage.getItem('userToken'),

  // Improved getUserType
 logout: async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userUid');
      localStorage.removeItem('username');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUid');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  },

  // Helper checks (now using Firebase)
  isLoggedIn: () => !!auth.currentUser,
  getUserType: () => localStorage.getItem('adminToken') ? 'admin' : (auth.currentUser ? 'user' : null),

};

export default authApi;