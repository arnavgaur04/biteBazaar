// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2kGlA-JCEkhhi8ixQO444c5mJUNbmjIU",
  authDomain: "bitebazaar-ddfe0.firebaseapp.com",
  projectId: "bitebazaar-ddfe0",
  storageBucket: "bitebazaar-ddfe0.appspot.com",
  messagingSenderId: "245245518600",
  appId: "1:245245518600:web:6b0197830c3f7eb435c2bd",
  measurementId: "G-Y04J4S2LLC"
};

//auth using email and Password

const app = initializeApp(firebaseConfig);
const firebaseApp = getApp();

export const storage = getStorage(firebaseApp, "gs://bitebazaar-ddfe0.appspot.com");
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);