// import firebase from "firebase/compat/app"
// import { initializeApp } from "firebase/app";
// import "firebase/compat/auth"


// const app = firebase.initializeApp({
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_API_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_API_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_API_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_API_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_API_APP_ID,
    // measurementId: process.env.REACT_APP_FIREBASE_API_MEASUREMENT_ID
// })

// export const auth = app.auth()
// export default app

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDsFEawD0VGa-0hB9nVnZPXrpWmqsspbAg",
    authDomain: "inventory-table-3ec95.firebaseapp.com",
    projectId: "inventory-table-3ec95",
    storageBucket: "inventory-table-3ec95.appspot.com",
    messagingSenderId: "1076135018363",
    appId: "1:1076135018363:web:4cd52b8249e5bfe92e47de",
    measurementId: "G-H6N2MTJFV6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export{app, auth};

