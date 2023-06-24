// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-nl-lfIWlwZjwrMyRhHalUmUqPj1UnO4",
  authDomain: "todo-app-351aa.firebaseapp.com",
  projectId: "todo-app-351aa",
  storageBucket: "todo-app-351aa.appspot.com",
  messagingSenderId: "894423551109",
  appId: "1:894423551109:web:1bd0c88af6de3719662dec",
  measurementId: "G-FRW3ZPDGQP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
