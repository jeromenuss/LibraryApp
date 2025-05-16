import {MessagesService} from "./messages.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AppError} from "../commons/app.error";
import {CodeMessage} from "../commons/error-code.enum";
import {throwError} from "rxjs";
import {inject} from "@angular/core";

export class BaseService{

  protected http = inject(HttpClient);
  protected messagesService= inject(MessagesService)

  constructor() {}
}
