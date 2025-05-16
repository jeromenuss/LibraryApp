import {HttpErrorResponse, HttpHandler, HttpInterceptorFn} from '@angular/common/http';
import {catchError, Observable, retry, throwError} from "rxjs";
import {AppError} from "../commons/app.error";
import {CodeMessage} from "../commons/error-code.enum";
import {inject} from "@angular/core";
import {MessagesService} from "../services/messages.service";

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  let messagesService = inject(MessagesService);

  return next(req)
      .pipe(
        retry(1),
        catchError((error:HttpErrorResponse) => {

          console.log(error.error);

          let errorApp: AppError = new AppError();
          errorApp.code = String(error.error.statusCode);
          errorApp.message = error.error.message;
          errorApp.name = error.name;

          messagesService.sendMessage("danger", errorApp.message);
          return throwError(() => AppError);
        })
      );
};
