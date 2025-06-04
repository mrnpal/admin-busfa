// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyBePA1HR0HPOk4WxPa-K64GBPS2Ex2fVck",
//     authDomain: "locabizapp.firebaseapp.com",
//     databaseURL: "https://locabizapp-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "locabizapp",
//     storageBucket: "locabizapp.firebasestorage.app",
//     messagingSenderId: "736692931647",
//     appId: "1:736692931647:web:2af33faff1beefa6ebbc8a",
//     measurementId: "G-KEQ84K8YGR"
// };
const firebaseConfig = {
  apiKey: "AIzaSyD63Gm7XPlvNuXp4wKOcjA6Fs0laC_0mRU",
  authDomain: "busfa-app.firebaseapp.com",
  projectId: "busfa-app",
  storageBucket: "busfa-app.firebasestorage.app",
  messagingSenderId: "407653069181",
  appId: "1:407653069181:web:fd8465f7c82d6748491c14",
  measurementId: "G-3RCNXCJVFQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
