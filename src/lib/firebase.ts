import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const importMetaAny = import.meta as any;
const firebaseConfig = (importMetaAny.env && importMetaAny.env.VITE_FIREBASE_CONFIG ? JSON.parse(importMetaAny.env.VITE_FIREBASE_CONFIG) : {
  apiKey: "dummy-api-key-placeholder",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "dummy-project-id",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:dummy12345"
}) as any;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const configAny = firebaseConfig;
export const db = configAny.firestoreDatabaseId && configAny.firestoreDatabaseId !== "(default)" && configAny.firestoreDatabaseId !== "default"
  ? getFirestore(app, configAny.firestoreDatabaseId)
  : getFirestore(app);
