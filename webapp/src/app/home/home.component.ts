import {Component, inject, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Book} from "../core/model/book.model";
import {Pagination} from "../core/model/pagination.model";
import {BooksService} from "../core/services/books.service";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {BookCardComponent} from "../shared/book-card/book-card.component";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {MessageComponent} from "../shared/message/message.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardContent,
    MatPaginator,
    BookCardComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatIconButton,
    MatIconModule,
    MessageComponent,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  pageSize:number = 10;
  pageIndex:number = 1;
  currentYear:number = new Date().getFullYear();

  booksPaginate:Pagination<Book> = {
    data : [],
    page : this.pageIndex,
    pageSize : this.pageSize,
    totalCount : 0
  };

  private booksService:BooksService = inject(BooksService);

  ngOnInit(): void {
    this.getBooks();
  }

  onPageChange($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getBooks();
  }

  borrowBook(id:number) {

  }

  viewBookDetails(id:number) {

  }

  private getBooks(){
    this.booksService.getAllBooks(this.pageIndex, this.pageSize).subscribe((data) => {
      this.booksPaginate = data;
    });
  }
}
