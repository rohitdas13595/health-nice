// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { settings } from "../settings";
import {getStorage, ref, uploadBytes} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: settings.apiKey,
  authDomain: settings.authDomain,
  projectId: settings.projectId,
  storageBucket: settings.storageBucket,
  messagingSenderId:  settings.messagingSenderId,
  appId: settings.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const storage =  getStorage(app);



export const  uploadFile = async (file: File) => {
  const storageRef = ref(storage, file.name);

   await uploadBytes(storageRef, file);

}



