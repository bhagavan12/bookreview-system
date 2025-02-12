import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import{getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_API_KEY),
  authDomain: String(import.meta.env.VITE_AUTHDOMAIN),
  projectId: String(import.meta.env.VITE_PROJECTID),
  storageBucket: String(import.meta.env.VITE_STROAGEBUCKET),
  messagingSenderId: String(import.meta.env.VITE_MSG),
  appId: String(import.meta.env.VITE_APPID)
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app); 
const db = getFirestore(app); // Firestore
const auth = getAuth(app);
export { storage, db ,auth};

