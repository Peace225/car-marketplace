import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
// 1. NOUVEAU : Importe la fonction d'authentification
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyBNjZwoAc8wtYblSfBzP1aLftKYzugOA7Q",
  authDomain: "car-marketplace-68f1d.firebaseapp.com",
  projectId: "car-marketplace-68f1d",
  storageBucket: "car-marketplace-68f1d.firebasestorage.app",
  messagingSenderId: "174543898994",
  appId: "1:174543898994:web:a2b737333689e901b335eb",
  measurementId: "G-Q0YTLCETS3"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 2. NOUVEAU : Initialise et exporte "auth" pour tes pages Login et Register
export const auth = getAuth(app);