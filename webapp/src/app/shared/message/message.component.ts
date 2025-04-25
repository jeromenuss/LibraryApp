import {Component, Input, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NgClass} from "@angular/common";

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

  @Input()
  Type:"danger" | "success" | "info" | "warning" = 'info';

  onClose(){
    const element = document.querySelector('.alert-card');
    if(element){
      element.remove();
    }
  }


}
