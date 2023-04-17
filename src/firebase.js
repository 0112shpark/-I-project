// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN5Yy32-z2V11Rt8Csu-RdhPVbc16WkFs",
  authDomain: "capston-design-1.firebaseapp.com",
  projectId: "capston-design-1",
  storageBucket: "capston-design-1.appspot.com",
  messagingSenderId: "610152427611",
  appId: "1:610152427611:web:dc73bc4ba6d0d81a30cf7e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
