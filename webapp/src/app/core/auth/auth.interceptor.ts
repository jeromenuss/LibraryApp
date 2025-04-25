import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {catchError, map, switchMap} from "rxjs";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService= inject(AuthService);

  return authService.getToken().pipe(
    map(token => {
      if(token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      console.log("request", req);
      return req;
    }),
    switchMap(modifiedRequest => next(modifiedRequest)),
    catchError(error => {
      console.log("error", error);
      return next(req);
    })
  )
};
