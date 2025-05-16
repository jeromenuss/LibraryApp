import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {Profile} from "../../../core/model/profile.model";

@Component({
  selector: 'app-profile-view',
  imports: [
    MatIcon,
    MatDivider,
    MatButton
  ],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss'
})
export class ProfileViewComponent {

  @Input()
  profile?:Profile;

  @Input()
  canEditProfile:boolean = false;

  @Output()
  editProfile:EventEmitter<void> = new EventEmitter();

  onEditProfile(){
    this.editProfile.emit();
  }

}
