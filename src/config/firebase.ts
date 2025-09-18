// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Firebase configuration with environment variable fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBf698FoD5XFyk6wOODZ87skXMh6Bo0vR0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mocv-34b60.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mocv-34b60",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mocv-34b60.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "63883009963",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:63883009963:web:856e02f8d43133958cfcee",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WNNBR5LD8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Storage for file uploads
export const storage = getStorage(app);

// Connect to Firestore emulator in development (optional)
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔥 Connected to Firestore emulator');
  } catch (error) {
    console.warn('Firestore emulator connection failed:', error);
  }
}

// Export the app for other Firebase services
export default app;

// Helper to check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId && 
    firebaseConfig.authDomain
  );
};

// Log configuration status
if (import.meta.env.DEV) {
  console.log('🔥 Firebase initialized:', {
    projectId: firebaseConfig.projectId,
    configured: isFirebaseConfigured()
  });
}
