import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3V82mH6Ydl_hlMbB6b7ioLFT_1Gcz8Bc",
  authDomain: "exercise-d4c15.firebaseapp.com",
  projectId: "exercise-d4c15",
  storageBucket: "exercise-d4c15.appspot.com",
  messagingSenderId: "833031562012",
  appId: "1:833031562012:web:e44d878e820e3a7c3690d9"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export { fire };
export default firebase;
