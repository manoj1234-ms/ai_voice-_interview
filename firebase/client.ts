
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXsm70od90FUQx-6AFmVjt-Jtfr8cnC7A",
  authDomain: "prepwise-a380d.firebaseapp.com",
  projectId: "prepwise-a380d",
  storageBucket: "prepwise-a380d.firebasestorage.app",
  messagingSenderId: "891463238724",
  appId: "1:891463238724:web:5d201953490009adcca811",
  measurementId: "G-GM9RS9RGZL"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);