import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for your project
const firebaseConfig = {
    apiKey: "AIzaSyCVCS4f0yic_YeOveeeqBsy0jKX_VIbYoY",
    authDomain: "ruactive-96ef3.firebaseapp.com",
    projectId: "ruactive-96ef3",
    storageBucket: "ruactive-96ef3.appspot.com",
    messagingSenderId: "673882759964",
    appId: "1:673882759964:web:cb690006705c52fd0090d9",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Firestore instance

export { auth, provider, signInWithPopup, db };
