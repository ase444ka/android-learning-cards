// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: `${import.meta.env.VITE_DOMAIN}.firebaseapp.com`,
  projectId: import.meta.env.VITE_DOMAIN,
  storageBucket: `${import.meta.env.VITE_DOMAIN}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_SENDER,
  appId: `1:376202058658:web:${import.meta.env.VITE_APP_ID}`,
};
console.log('test env vars - ', import.meta.env.VITE_TEST)


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export default app;
export const applicationId = import.meta.env.VITE_API_KEY