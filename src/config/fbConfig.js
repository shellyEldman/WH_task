import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAS-XGt9QKEQawhOf7S80o8mHEklTHO3bM",
  authDomain: "webhose-task.firebaseapp.com",
  databaseURL: "https://webhose-task.firebaseio.com",
  projectId: "webhose-task",
  storageBucket: "webhose-task.appspot.com",
  messagingSenderId: "346757756366",
  appId: "1:346757756366:web:374e7cd180f5013d96279f"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
