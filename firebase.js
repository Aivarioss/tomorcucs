import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase konfigurācija
const firebaseConfig = {
  apiKey: "AIzaSyCtYa_8qA2XZsxRlsNZZDM8xqQD4-HpG48",
  authDomain: "tomandcuc-c2a0c.firebaseapp.com",
  projectId: "tomandcuc-c2a0c",
  storageBucket: "tomandcuc-c2a0c.appspot.com",
  messagingSenderId: "885432885141",
  appId: "1:885432885141:web:b4c9f49851518b2c6d609c",
  measurementId: "G-9EFX9XGLP5"
};

// Inicializēt Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, setDoc, doc };
