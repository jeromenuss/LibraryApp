import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {User} from "@angular/fire/auth";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/.environment";
import {catchError, filter, map, Observable, of, switchMap} from "rxjs";
import {Profile} from "../model/profile.model";
import {UpdateProfileDto} from "../dto/update-profile.dto";

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(private authService:AuthService, private http:HttpClient) { }

  getDisplayName() {
    return this.authService.currentUser.pipe(
      filter(user => !!user),
      map(user => user.uid),
      switchMap(uid =>
        this.http.get<{ username:string }>(environment.apiUrl + "/profiles/username/" + uid)
      )
    );
  }

  getCurrentProfile(){
    return this.authService.currentUser.pipe(
      filter(user => !!user),
      map(user => user.uid),
      switchMap(uid =>
        this.http.get<Profile>(environment.apiUrl + "/profiles/user/" + uid)
      )
    );
  }

  get isAdmin(): Observable<boolean> {
    return this.getCurrentProfile().pipe(
      filter(user => !!user),
      map(profile => profile.role == "Admin"),
    );
  }
}
