import * as firestorm from "../src";
// import { IFireormConfig } from "../src/types";
// import * as firebase from 'firebase/app';
import { FirebaseApp, initializeApp, deleteApp } from "firebase/app";
import { getAuth, useAuthEmulator } from "firebase/auth";
import { getFunctions, useFunctionsEmulator } from "firebase/functions";

// import firebaseAdmin from "firebase-admin";
// import 'firebase/firestore';
// import 'firebase/auth';
import {
  FirebaseFirestore,
  useFirestoreEmulator,
  getFirestore as getFirestoreOrig,
} from "firebase/firestore";

// let firestore: firebase.firestore.Firestore;
// let app: firebase.app.App;
let db: FirebaseFirestore;
let app: FirebaseApp;
const firebaseConfig = {
  apiKey: "AIzaSyB-_UmNEJ0bkFX0Mrk_GI5RMVq2qsKG70g",
  authDomain: "fir-1-dd357.firebaseapp.com",
  databaseURL: "https://fir-1-dd357.firebaseio.com",
  projectId: "fir-1-dd357",
  storageBucket: "fir-1-dd357.appspot.com",
  messagingSenderId: "713795347645",
  appId: "1:713795347645:web:4edd0514290fb5698403d4",
  measurementId: "G-FW1W1848XL",
};
before(async (): Promise<void> => {
  // require("dotenv").config();
  // app = initializeApp(JSON.parse(process.env.CLIENT_SDK_CONFIG as string));
  app = initializeApp(firebaseConfig);
  db = getFirestoreOrig(app);
  // const admin = firebaseAdmin.initializeApp();
  useFirestoreEmulator(db, "localhost", 8080);
  const auth = getAuth(app);
  useAuthEmulator(auth, "http://localhost:9099/", { disableWarnings: true });
  const functions = getFunctions();
  useFunctionsEmulator(functions, "localhost", 5001);

  // const token = await admin.auth().createCustomToken("firestorm");
  // const auth = getAuth();
  // await signInWithCustomToken(auth, token);
  // firestore = getFirestoreOrig(app);
});

after((): void => {
  deleteApp(app);
});

export const start = (config?: firestorm.IFireormConfig): void => {
  firestorm.initialize(db, config);
};

export const reset = (): void => {
  firestorm.destroy();
};

export const getFirestore = (): FirebaseFirestore => db;
export const bootstrapNull = (): void => {
  firestorm.initialize(null as any);
};
