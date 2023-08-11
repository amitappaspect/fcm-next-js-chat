import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxtnZxCrMc1YsMHCi-zDqaZJNXFbc8gmY",
    authDomain: "nextjs-test-b5bde.firebaseapp.com",
    projectId: "nextjs-test-b5bde",
    storageBucket: "nextjs-test-b5bde.appspot.com",
    messagingSenderId: "599615624123",
    appId: "1:599615624123:web:6180d370fbe17a609f2a9e"
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {
    app,
    auth,
    db
}