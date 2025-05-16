import {Component, Input, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NgClass} from "@angular/common";
import {MessagesService} from "../../core/services/messages.service";

@Component({
  selector: 'app-message',
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    NgClass
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  constructor(private messagesService:MessagesService) {
  }

  @Input()
  Type:"danger" | "success" | "info" | "warning" = 'info';

  onClose(){
    this.messagesService.destroyMessage()
  }


}
