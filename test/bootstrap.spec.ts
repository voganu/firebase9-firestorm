import dotenv from "dotenv";
import * as firestorm from "../src";
// import { IFireormConfig } from "../src/types";
// import * as firebase from 'firebase/app';
import { FirebaseApp, initializeApp, deleteApp } from "firebase/app";
import { getAuth, useAuthEmulator } from "firebase/auth";
import { getFunctions, useFunctionsEmulator } from "firebase/functions";
// import { firebaseConfig } from "./.firebase";
// import firebaseAdmin from "firebase-admin";
// import 'firebase/firestore';
// import 'firebase/auth';
import {
  FirebaseFirestore,
  useFirestoreEmulator,
  getFirestore as getFirestoreOrig,
} from "firebase/firestore";
dotenv.config();

// let firestore: firebase.firestore.Firestore;
// let app: firebase.app.App;
let firestore: FirebaseFirestore;
let app: FirebaseApp;
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};
before(async (): Promise<void> => {
  // app = initializeApp(JSON.parse(process.env.CLIENT_SDK_CONFIG as string));
  app = initializeApp(firebaseConfig);
  firestore = getFirestoreOrig(app);
  // const admin = firebaseAdmin.initializeApp();
  useFirestoreEmulator(firestore, "localhost", 8080);
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
  firestorm.initialize(firestore, config);
};

export const reset = (): void => {
  firestorm.destroy();
};

export const getFirestore = (): FirebaseFirestore => firestore;
export const bootstrapNull = (): void => {
  firestorm.initialize(null as any);
};
