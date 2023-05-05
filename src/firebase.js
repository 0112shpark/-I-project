// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHcapNthGtxiWfwLqFJ-lAaixYIHNhDdw",
  authDomain: "jaban-7c8c2.firebaseapp.com",
  databaseURL: "https://jaban-7c8c2-default-rtdb.firebaseio.com",
  projectId: "jaban-7c8c2",
  storageBucket: "jaban-7c8c2.appspot.com",
  messagingSenderId: "862801813260",
  appId: "1:862801813260:web:4a8e0911e28ed43cd5b329",
  measurementId: "G-B6Q439LLL4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// export default analytics;
export default app;
