import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkFCLG4n_VlSuKnRwdAvZ22EkGrKc_4wQ",
  authDomain: "quickaid-3c175.firebaseapp.com",
  projectId: "quickaid-3c175",
  storageBucket: "quickaid-3c175.firebasestorage.app",
  messagingSenderId: "659793747948",
  appId: "1:659793747948:web:f92546ea896ba8581e2ac9",
  measurementId: "G-CYX5GM01P1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);