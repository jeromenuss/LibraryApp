import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {AuthInterceptor} from "./core/auth/auth.interceptor";
import {provideClientHydration} from "@angular/platform-browser";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import { environment } from '@env/.environment';
import {provideAuth, getAuth} from "@angular/fire/auth";
import {ErrorInterceptor} from "./core/interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.firebaseApp)),
    provideAuth(() => getAuth())
  ]
};
