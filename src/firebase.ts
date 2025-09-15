// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf698FoD5XFyk6wOODZ87skXMh6Bo0vR0",
  authDomain: "mocv-34b60.firebaseapp.com",
  projectId: "mocv-34b60",
  storageBucket: "mocv-34b60.firebasestorage.app",
  messagingSenderId: "63883009963",
  appId: "1:63883009963:web:856e02f8d43133958cfcee",
  measurementId: "G-WNNBR5LD8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
