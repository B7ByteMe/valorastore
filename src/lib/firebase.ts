import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbdxEPz_EHcP9Byoi6VBh7SpZ6eWRY_4E",
  authDomain: "valora-store-c24d0.firebaseapp.com",
  projectId: "valora-store-c24d0",
  storageBucket: "valora-store-c24d0.firebasestorage.app",
  messagingSenderId: "462023576839",
  appId: "1:462023576839:web:11752450216a1ee12f09a2",
  measurementId: "G-WJPGZZVQ81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
