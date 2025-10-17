// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4lwNw3wXS0dsqhBgKq7cDvZyZA5IEOuI",
  authDomain: "saadhvi-silks.firebaseapp.com",
  projectId: "saadhvi-silks",
  storageBucket: "saadhvi-silks.firebasestorage.app",
  messagingSenderId: "696011033583",
  appId: "1:696011033583:web:d32519d800ebf0570e041a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;