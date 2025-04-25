import {Component, Input} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {SlicePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {Book} from "../../core/model/book.model";

@Component({
  selector: 'app-book-card',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    SlicePipe
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {

  @Input() book!: Book;


  borrowBook(id: number) {

  }

  viewBookDetails(id: number) {

  }
}
