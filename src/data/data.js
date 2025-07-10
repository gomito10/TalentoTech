// Import the functions you need from the SDKs you need
import "dotenv/config";
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "talentotech-f3541",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "480058953953",
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
export {db}