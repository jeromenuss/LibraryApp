import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatError, MatInput, MatLabel} from "@angular/material/input";
import {Profile} from "../../../core/model/profile.model";
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {UpdateProfileDto} from "../../../core/dto/update-profile.dto";
import {confirmPasswordValidator} from "../../../core/validators/confirm-password.validator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-edit',
  imports: [
    MatButton,
    MatDivider,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatError,
    ReactiveFormsModule
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit {

  @Input()
  profile!: Profile;

  @Output()
  profileView:EventEmitter<Profile> = new EventEmitter();

  profileForm!:FormGroup<{
    name:FormControl<string>;
    lastName:FormControl<string>;
    mail:FormControl<string>;
    phone:FormControl<string>;
    password:FormControl<string>;
    passwordConfirm:FormControl<string>;
  }>;

  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router) {

  }

  ngOnInit(): void {
    console.log("Profile", this.profile);
    this.profileForm = this.fb.nonNullable.group({
      name: [this.profile!.name, [Validators.required]],
      lastName: [this.profile!.lastName, [Validators.required]],
      mail: [this.profile!.mail, [Validators.required, Validators.email]],
      phone: this.profile!.phone!,
      password: ['', [Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.minLength(6), confirmPasswordValidator]]
    })
  }

  onCancel() {

    this.profileView.emit(this.profile);
  }

  onSubmit() {
    const updateProfile:UpdateProfileDto = {
      id : this.profile.id,
      email : this.profileForm.value.mail!,
      name : this.profileForm.value.name!,
      lastname : this.profileForm.value.lastName!,
      phone : this.profileForm.value.phone!,
      password: this.profileForm.value.password!
    }

    this.authService.update(updateProfile).subscribe({
      next:async ()=>{
        if(updateProfile.password != ""){
          this.authService.logout().subscribe(async () => {
            await this.router.navigate(['user/login'], {queryParams : {logout:true}});
          });
        }
        //console.log("Profile updated", this.profileForm.value as Profile);
        this.profileView.emit(this.profileForm.value as Profile);
      },
      error:()=>{
        console.log("Error updating profile", this.profile);
      }
    });
  }
}
