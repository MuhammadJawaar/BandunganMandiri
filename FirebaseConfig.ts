// FirebaseConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_iohg_oXatZCyG_FJrKG346IMhFk9NXE",
    authDomain: "suratproject-38713.firebaseapp.com",
    projectId: "suratproject-38713",
    storageBucket: "suratproject-38713.appspot.com",
    messagingSenderId: "193264488613",
    appId: "1:193264488613:web:789f56d13c9e48983ebd4c",
    measurementId: "G-YVYM01ZZG9"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export { auth, firestore };
