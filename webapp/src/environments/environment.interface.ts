export interface Environment{
  production: boolean,
  apiUrl: string,
  applicationName: string,
  firebaseApp: {
    apiKey:string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string
  }
}
