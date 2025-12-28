// Firebase configuration and initialization
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDhBjHOn7T9bJmzvOL-d1H1AqQ8iAinGxc",
  authDomain: "minex-a370e.firebaseapp.com",
  projectId: "minex-a370e",
  storageBucket: "minex-a370e.firebasestorage.app",
  messagingSenderId: "821749934154",
  appId: "1:821749934154:web:234b379a13557035d01eb3",
  measurementId: "G-J58H7W9B82",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Initialize Analytics (only in browser)
let analytics = null
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { analytics }
