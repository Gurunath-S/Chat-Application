import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const provider = new firebase.auth.GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyAWpLwq9uhBCpG9cepLzoRJYp_LoHN5iWY",
  authDomain: "chatify-20eeb.firebaseapp.com",
  projectId: "chatify-20eeb",
  storageBucket: "chatify-20eeb.firebasestorage.app",
  messagingSenderId: "268176489523",
  appId: "1:268176489523:web:7cac75d95046c5aeb9b746",
  measurementId: "G-YJ78WG26E0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, provider, storage };
