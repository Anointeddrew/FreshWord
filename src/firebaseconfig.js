// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiQPk1J-CvvfGEcF3LQhmTjJtqevslIWE",
  authDomain: "churchmanagementsystem-b8de0.firebaseapp.com",
  projectId: "churchmanagementsystem-b8de0",
  storageBucket: "churchmanagementsystem-b8de0.firebasestorage.app",
  messagingSenderId: "553678854614",
  appId: "1:553678854614:web:1f7c1f0ee97db83e98ec77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;