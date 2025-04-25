import {Environment} from "./environment.interface";

export const environment : Environment = {
  production: false,
  apiUrl: "http://localhost:3001/api",
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
