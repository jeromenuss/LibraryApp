import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, filter, from, map, Observable, of, switchMap} from "rxjs";
import {
  Auth,
  setPersistence,
  browserSessionPersistence,
  user,
  User,
  signInWithEmailAndPassword,
  signOut,
  IdTokenResult
} from "@angular/fire/auth";
import {environment} from "@env/.environment";
import {RegisterDto} from "../dto/register.dto";
import {UpdateProfileDto} from "../dto/update-profile.dto";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  user$: Observable<User | null>;

  constructor(private http:HttpClient, private firebaseAuth:Auth) {
    this.setSessionStoragePersistance().then(() => {})
    this.user$ = user(this.firebaseAuth);
  }

  login(email:string,password:string):Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(async (userCredential) => {
        //Récupère le token
        console.log(await userCredential.user.getIdTokenResult(true));
      });

    console.log(this.firebaseAuth.currentUser?.getIdToken());

    return from(promise);
  }

  logout(){
    const promise = signOut(this.firebaseAuth).then(() => {});
    return from(promise);
  }

  register(registerDto:RegisterDto):Observable<void> {
    console.log("registerDto", registerDto);
    return this.http.post<void>(environment.apiUrl + '/auth/register', registerDto);
  }

  update(updateUser:UpdateProfileDto):Observable<void> {
    console.log("updateUser", updateUser);
    return this.http.patch<void>(environment.apiUrl + `/auth/update/${updateUser.id}`, updateUser);
  }

  getToken() {
      if (this.firebaseAuth.currentUser) {
        const token = this.firebaseAuth.currentUser.getIdTokenResult(true).then(result => {
          return result.token;
        });
        return from(token);
      }
      return of("");
  }

  get currentUser(){
    console.log("currentUser");
    return this.user$;
  }

  get hasLogin(){
    console.log("hasLogin");
    return this.user$.pipe(
      map(user => user !== null)
    );
  }

  private async setSessionStoragePersistance() {
    await setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

}
