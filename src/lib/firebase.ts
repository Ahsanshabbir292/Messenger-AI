import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const configAny = firebaseConfig as any;
export const db = configAny.firestoreDatabaseId && configAny.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, configAny.firestoreDatabaseId)
  : getFirestore(app);
