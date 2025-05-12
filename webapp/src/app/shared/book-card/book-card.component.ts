import {Component, Input, OnInit} from '@angular/core';
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
import {RouterLink} from "@angular/router";

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
    SlicePipe,
    RouterLink
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent implements OnInit {

  @Input() book!: Book;

  bookId:string = "";

  ngOnInit(){
    this.bookId= this.book.id??""
  }

  borrowBook(id: string) {

  }

  viewBookDetails(id: string) {
  }
}
