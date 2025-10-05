import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRTY-5Th8U535keWtFC8E3MLoktwOgWnM",
  authDomain: "quanlygoiychitieu.firebaseapp.com",
  projectId: "quanlygoiychitieu",
  storageBucket: "quanlygoiychitieu.appspot.com",
  messagingSenderId: "1020004233797",
  appId: "1:1020004233797:web:4ca57477dd9b4ddc35692c",
  measurementId: "G-5094DTFVK3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
