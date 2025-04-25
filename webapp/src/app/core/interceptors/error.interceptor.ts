import {HttpHandler, HttpInterceptorFn} from '@angular/common/http';
import {catchError, Observable, retry, throwError} from "rxjs";

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req)
      .pipe(
        retry(2),
        catchError((error) => {
          let errorMessage = "";

          if(error.error instanceof ErrorEvent){
            errorMessage = `Error : ${error.error.message}`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }

          console.log(errorMessage);
          return throwError(() => errorMessage);
        })
      );
};
