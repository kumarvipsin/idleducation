
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "learnscape-p4l0x",
  "appId": "1:868525472574:web:c4b9c5cfad5aa09ded4a6f",
  "storageBucket": "learnscape-p4l0x.appspot.com",
  "apiKey": "AIzaSyDid7q5Rm24RQAybdbyiUtdmlkJNHc6dPw",
  "authDomain": "learnscape-p4l0x.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "868525472574"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
