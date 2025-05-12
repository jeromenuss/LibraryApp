import {Environment} from "./environment.interface";

export const environment : Environment = {
  production: false,
  apiUrl: "http://127.0.0.1:5001/library-app-20329/us-central1/api",
  applicationName: "Library App",
  firebaseApp:{
    apiKey: "apiKey",
    authDomain: "firebase-app",
    projectId: "firebase-app",
    storageBucket: "firebase-app",
    messagingSenderId: "messaging_id",
    appId: "app_id"
  }
}
