// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD63f9TUicXWEVnm7vYM-g6uTOUtwazPcs",
  authDomain: "spontify-backend.firebaseapp.com",
  projectId: "spontify-backend",
  storageBucket: "spontify-backend.firebasestorage.app",
  messagingSenderId: "436955983049",
  appId: "1:436955983049:web:fd51cd9e99c54c01f43118",
  measurementId: "G-PJV1RVX4KB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);