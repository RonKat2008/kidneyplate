import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as firebaseAuth from 'firebase/auth';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Config } from "./environment";

const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  databaseURL: Config.FIREBASE_DATABASE_URL,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  measurementId: Config.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app only once
const app = initializeApp(firebaseConfig);
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
        

const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };
export default app;