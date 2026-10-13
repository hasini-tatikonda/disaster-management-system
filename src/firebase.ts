import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmA0cA823jY1tfdYhyy4KK-17Z67Wa8LA",
  authDomain: "resq-disaster-management-a6fc3.firebaseapp.com",
  projectId: "resq-disaster-management-a6fc3",
  storageBucket: "resq-disaster-management-a6fc3.firebasestorage.app",
  messagingSenderId: "50758137204",
  appId: "1:50758137204:web:f193b1d5760e03070e2821"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;