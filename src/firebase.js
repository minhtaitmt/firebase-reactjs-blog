import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import {getAuth} from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyD96YQ905PKzc3txMWNuv221XjW6DKw0hw",
    authDomain: "react-blogs-app-8475a.firebaseapp.com",
    projectId: "react-blogs-app-8475a",
    storageBucket: "react-blogs-app-8475a.appspot.com",
    messagingSenderId: "877683484517",
    appId: "1:877683484517:web:1419131840a2424cf7638c"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export {auth, db, storage}
