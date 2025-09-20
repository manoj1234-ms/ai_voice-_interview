// Firebase Admin SDK - Temporarily disabled to prevent errors
// To enable: set up environment variables and uncomment the code below

// export const auth = null;
// export const db = null;

// console.log("Firebase Admin SDK is disabled. To enable server-side authentication:");
// console.log("1. Create .env.local file in ai_mock_interviews directory");
// console.log("2. Add your Firebase Admin SDK credentials");
// console.log("3. Uncomment the code below");

/*
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    // Check if environment variables are available
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.warn("Firebase Admin SDK environment variables are missing. Server-side authentication will be disabled.");
      return {
        auth: null,
        db: null,
      };
    }

    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin SDK:", error);
      return {
        auth: null,
        db: null,
      };
    }
  }

  try {
    return {
      auth: getAuth(),
      db: getFirestore(),
    };
  } catch (error) {
    console.error("Failed to get Firebase Admin services:", error);
    return {
      auth: null,
      db: null,
    };
  }
}

export const { auth, db } = initFirebaseAdmin();
*/

import { initializeApp, getApps, cert } from "firebase-admin/app";
import {getAuth} from 'firebase-admin/auth';
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const apps = getApps();

  if(!apps.length){
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n")
      })
    });
  }
  return{
    auth: getAuth(),
    db: getFirestore()
  }
}

export const { auth, db } = initFirebaseAdmin();