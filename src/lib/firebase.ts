// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "learnscape-p4l0x",
  "appId": "1:868525472574:web:c4b9c5cfad5aa09ded4a6f",
  "storageBucket": "learnscape-p4l0x.firebasestorage.app",
  "apiKey": "AIzaSyDid7q5Rm24RQAybdbyiUtdmlkJNHc6dPw",
  "authDomain": "learnscape-p4l0x.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "868525472574"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);

export { app, auth };
