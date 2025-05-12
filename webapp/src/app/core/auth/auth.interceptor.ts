import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {catchError, map, switchMap} from "rxjs";
import {environment} from "@env/.environment";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService= inject(AuthService);

  return authService.getToken().pipe(
    map(token => {
      if(token && req.url.includes(environment.apiUrl)) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return req;
    }),
    switchMap(modifiedRequest => next(modifiedRequest)),
    catchError(error => {
      return next(req);
    })
  )
};
