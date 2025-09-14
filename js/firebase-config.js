const firebaseConfig = {
  apiKey: "AIzaSyC1OJ4rXWvQdh8ewlP_4yQZL7VQXj2nHvU",
  authDomain: "sgbacquapark.firebaseapp.com",
  projectId: "sgbacquapark",
  storageBucket: "sgbacquapark.appspot.com",
  messagingSenderId: "430467866459",
  appId: "1:430467866459:web:9fcb8fe3cc990d3cebc47e",
  measurementId: "G-QZ7RMEZGG5"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const functions = firebase.functions();