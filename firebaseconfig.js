// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCydywIhPiAtVCacZFx7_PbML3g4SrUPIE",
    authDomain: "eqa-main.firebaseapp.com",
    projectId: "eqa-main",
    storageBucket: "eqa-main.appspot.com",
    messagingSenderId: "601694077431",
    appId: "1:601694077431:web:e3501d050c411698c0aef2",
    measurementId: "G-PN9W6597NK"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const db = app.firestore();
