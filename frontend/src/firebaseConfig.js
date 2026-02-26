import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuration de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNjZwoAc8wtYblSfBzP1aLftKYzugOA7Q",
  authDomain: "car-marketplace-68f1d.firebaseapp.com",
  projectId: "car-marketplace-68f1d",
  storageBucket: "car-marketplace-68f1d.firebasestorage.app",
  messagingSenderId: "174543898994",
  appId: "1:174543898994:web:a2b737333689e901b335eb",
  measurementId: "G-Q0YTLCETS3"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);