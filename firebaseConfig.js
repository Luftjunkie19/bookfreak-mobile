import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import {getAnalytics} from 'firebase/analytics'

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyBOAlYiRDSR11mlH-FS36gVsYsJx_MlCLw",
  authDomain: "bookfreak-954da.firebaseapp.com",
  databaseURL: "https://bookfreak-954da-default-rtdb.firebaseio.com",
  projectId: "bookfreak-954da",
  storageBucket: "bookfreak-954da.appspot.com",
  messagingSenderId: "389109624627",
  appId: "1:389109624627:web:a5667a39e88afc7dc31846",
  measurementId: "G-6YQXFTXRLN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const functions =getFunctions(app);
export const database = getDatabase(app);
export const analytics= getAnalytics(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
export const storage= getStorage(app);