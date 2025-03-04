import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo95NqFMsHlLl1P3GivauMKzcBGtSXFWA",
  authDomain: "expo-4341b.firebaseapp.com",
  projectId: "expo-4341b",
  storageBucket: "expo-4341b.appspot.com",
  messagingSenderId: "265358126530",
  appId: "1:265358126530:web:dfa9fa7573b18acac83a5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };