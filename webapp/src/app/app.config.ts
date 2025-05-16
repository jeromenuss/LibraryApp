import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
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
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter} from "@angular/material/core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.firebaseApp)),
    provideAuth(() => getAuth()),
    {provide: LOCALE_ID, useValue: 'fr-FR'},
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}
  ]
};
