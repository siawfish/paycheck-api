import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDd7FwrmKxpvNIbIUhdNqC-QpLuKi9Ydj4',
  authDomain: 'paycheck-8cd70.firebaseapp.com',
  projectId: 'paycheck-8cd70',
  storageBucket: 'paycheck-8cd70.appspot.com',
  messagingSenderId: '98235990',
  appId: '1:98235990:web:17e603414927857ad56df7',
  measurementId: 'G-YVMVG4QQ9J',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);

export default firebase;
