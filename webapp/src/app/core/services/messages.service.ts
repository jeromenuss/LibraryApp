import { Injectable } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {BehaviorSubject, throwError} from "rxjs";
import {MessageDto} from "../dto/message.dto";
import {CodeMessage} from "../commons/error-code.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {AppError} from "../commons/app.error";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private sanitizer: DomSanitizer) { }

  private messageSource = new BehaviorSubject<MessageDto>({type:"info", hasMessage: false});
  currentMessage$ = this.messageSource.asObservable();

  sendMessage(type:"danger" | "success" | "info" | "warning", message:string) {
    this.messageSource.next({
      hasMessage : true,
      message : message,
      type : type,
    });
    console.log(this.currentMessage$);
  }


  destroyMessage() {
    this.messageSource.next({
      hasMessage : false,
      type : "info",
    });
    console.log(this.currentMessage$);
  }
}
