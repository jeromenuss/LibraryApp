import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {Book} from "../../../core/model/book.model";
import {BooksService} from "../../../core/services/books.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {MatAnchor, MatButton} from "@angular/material/button";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-book',
  imports: [
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatIcon,
    MatChip,
    MatChipSet,
    MatDivider,
    MatButton,
    DatePipe,
    RouterLink,
    MatAnchor
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss'
})
export class BookComponent implements OnInit {
  bookId:string;
  book!: Book;

  coverUrl:string = "";

  constructor(private bookService:BooksService, private activatedRoute:ActivatedRoute) {
    this.bookId = "";
  }

  ngOnInit() {
    this.bookId = this.activatedRoute.snapshot.params['id'];
    this.bookService.getBookById(this.bookId).subscribe((bookResult) => {
      this.book = bookResult;
      this.coverUrl = this.bookService.getCovertUrl(this.book.isbn, 'M');
    });
  }

  onImageError($event: ErrorEvent) {

  }
}
