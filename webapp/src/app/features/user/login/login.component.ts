import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthErrorCodes } from '@angular/fire/auth';
import {MessagesService} from "../../../core/services/messages.service";
import {AuthService} from "../../../core/services/auth.service";
import {MessageComponent} from "../../../shared/message/message.component";

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

  constructor(private fb: FormBuilder, private authService:AuthService, private router: Router, private route:ActivatedRoute, private messagesService:MessagesService) {
    this.loginForm = this.fb.nonNullable.group({
      email: ["nuss.j@sfeir.com", [Validators.required, Validators.email]],
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
    this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
      next: ()=> {
        this.messagesService.sendMessage("success", "Vous êtes maintenant connecté");
        this.router.navigate(['home']);
      },
      error: (error)=> {
        this.handleAuthError(error);
      }
    })
  }

  private handleAuthError(error: any): void {
    let message = 'Une erreur est survenue';

    switch (error.code) {
      case AuthErrorCodes.USER_DELETED:
      case AuthErrorCodes.USER_DISABLED:
        message = 'Votre compte est désactivé';
        break;

      case AuthErrorCodes.INVALID_EMAIL:
        message = 'Adresse email invalide';
        break;

      case AuthErrorCodes.INVALID_PASSWORD:
        message = 'Mot de passe incorrect';
        break;

      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        message = 'Trop de tentatives, veuillez réessayer plus tard';
        break;

      case AuthErrorCodes.NETWORK_REQUEST_FAILED:
        message = 'Erreur de connexion réseau';
        break;

      default:
        console.error('Firebase Auth Error:', error);
        message = 'Une erreur inattendue est survenue';
    }

    this.messagesService.sendMessage('danger', message);
  }
}
