import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AuthService} from "../../core/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageComponent} from "../../shared/message/message.component";

@Component({
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatIconButton,
    MatIcon,
    MatButton,
    MatLabel,
    MatError,
    MessageComponent
  ],
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  hidePassword = true;

  isLogout = false;
  isRegister: boolean = false;

  constructor(private fb: FormBuilder, private authService:AuthService, private router: Router, private route:ActivatedRoute) {
    this.loginForm = this.fb.nonNullable.group({
      email: ["jerome@exemple.com", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    }) ;
  }

  ngOnInit() {
    this.isLogout = false;

    this.route.queryParams.subscribe(params => {
      this.isLogout = params['logout'];
      console.log('islogout = ', this.isLogout);
    })
  }

  getErrorMessage(password: string) {
    return "";
  }

  async onSubmit() {
    console.log("Valeur du formulaire", this.loginForm.value);
    this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
      next: ()=> {
        this.router.navigate(['home']);
      },
      error: (error)=> {
        console.error('Email/Password Sign-In error:', error);
      }
    })
  }
}
