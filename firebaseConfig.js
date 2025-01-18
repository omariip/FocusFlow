import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG4Dd1xvSSKR6H_OEiR1H2bcoLtoub-gE",
  authDomain: "focusflow-51365.firebaseapp.com",
  projectId: "focusflow-51365",
  storageBucket: "focusflow-51365.firebasestorage.app",
  messagingSenderId: "217193980968",
  appId: "1:217193980968:web:4faceef013bc4a9de4411d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
