import {Component, EventEmitter, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {MatInput, MatLabel} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {ProfileViewComponent} from "./profile-view/profile-view.component";
import {Profile} from "../../core/model/profile.model";
import {ProfilesService} from "../../core/services/profiles.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-profile',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatDivider,
    MatButton,
    MatLabel,
    ProfileEditComponent,
    ProfileViewComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  canEditProfile = false;
  isEdit: boolean = false;
  userId:string = "me";

  profile!:Profile;

  constructor(private profileService:ProfilesService, private route:ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => this.userId = String(params.get('id')))
    )

    if(this.userId == "me"){
      //On recherche l'utilisateur courant.
      this.profileService.getCurrentProfile().subscribe(profile => {
        this.profile = profile;
        this.canEditProfile = true;
      })
    }else{
      //On récupère l'utilisateur.
    }
  }

  onFinishEdit(profileUpdated: Profile){
    this.profile = profileUpdated;
    this.isEdit = false;
  }

  onEditProfile(){
    this.isEdit = true;
  }
}
