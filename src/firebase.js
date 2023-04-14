// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1u15rIneFvRBunkYb67UaevZmWMIDoTM",
  authDomain: "geo-puzzle-challenge.firebaseapp.com",
  projectId: "geo-puzzle-challenge",
  storageBucket: "geo-puzzle-challenge.appspot.com",
  messagingSenderId: "989876841999",
  appId: "1:989876841999:web:9390ca2c94b6f527473d7a",
  measurementId: "G-WN81Y7TC4X",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

const savePlayerData = async (playerName, playerScore, playerTime) => {
  try {
    await addDoc(collection(firestore, "players"), {
      name: playerName,
      score: playerScore,
      time: playerTime,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export { savePlayerData };
