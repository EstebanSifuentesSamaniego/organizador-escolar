// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmAGr1edriwtEv4norx47yLXrZOtdNmss",
  authDomain: "apppadres.firebaseapp.com",
  projectId: "apppadres",
  storageBucket: "apppadres.firebasestorage.app",
  messagingSenderId: "60941271808",
  appId: "1:60941271808:web:1f264a279d82a33feea9e5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <-- inicializa Firebase Storage
export default app;
