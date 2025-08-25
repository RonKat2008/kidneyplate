import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJZ0IK6Tfvt45L8h4SVXh8cbFN5QXxHUc",
  authDomain: "kidneyplatedatabase.firebaseapp.com",
  databaseURL: "https://kidneyplatedatabase-default-rtdb.firebaseio.com",
  projectId: "kidneyplatedatabase",
  storageBucket: "kidneyplatedatabase.appspot.com", // fix the typo here
  messagingSenderId: "157810271411",
  appId: "1:157810271411:web:fc9df04e7aa1e7157c7cc6",
  measurementId: "G-E006GKPQ7G",
};

// Initialize Firebase app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
