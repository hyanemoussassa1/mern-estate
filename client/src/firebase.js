// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4ce12.firebaseapp.com",
  projectId: "mern-estate-4ce12",
  storageBucket: "mern-estate-4ce12.appspot.com",
  messagingSenderId: "429039303174",
  appId: "1:429039303174:web:2ab3ccd0f566e897ff6187"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);