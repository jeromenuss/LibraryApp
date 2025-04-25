import { Component } from '@angular/core';
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatIcon } from '@angular/material/icon';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../core/services/auth.service";
import {RegisterDto} from "../../core/dto/register.dto";
import {MessageComponent} from "../../shared/message/message.component";

@Component({
  selector: 'app-register',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    MatAnchor,
    MessageComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm:FormGroup<{
    email:FormControl<string>;
    password:FormControl<string>;
    name:FormControl<string>;
    lastName:FormControl<string>;
  }>

  hidePassword = true;

  hasError = false;
  errorMessage: string = "";

  constructor(private fb: FormBuilder, private authService:AuthService, private router: Router) {
    this.registerForm = this.fb.nonNullable.group({
      email : ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required, Validators.minLength(6)]],
      name:['', [Validators.required]],
      lastName:['', [Validators.required]],
    });
  }

  onRegister(){
    this.authService.register(this.convertToDto).subscribe({
      next: async user => {
        await this.router.navigate(['login'], {queryParams : {register:true}});
      },
      error: error => {
        this.hasError = true;
        this.errorMessage = error.message;
      }
    })
  }

  private get convertToDto():RegisterDto{
    return {
      email:this.registerForm.value.email ? this.registerForm.value.email : "",
      password:this.registerForm.value.password ? this.registerForm.value.password : "",
      name:this.registerForm.value.name ? this.registerForm.value.name : "",
      lastName:this.registerForm.value.lastName ? this.registerForm.value.lastName : "",
    }
  }

}
