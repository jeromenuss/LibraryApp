import {Component, inject, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Book} from "../../core/model/book.model";
import {Pagination} from "../../core/model/pagination.model";
import {BooksService} from "../../core/services/books.service";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {BookCardComponent} from "../../shared/book-card/book-card.component";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

const MIN_YEAR_SEARCH:number = 1400;

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
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {


  pageSize:number = 10;
  pageIndex:number = 0;
  currentYear:number = new Date().getFullYear();

  booksPaginate:Pagination<Book> = {
    data : [],
    isLastPage: false,
    pageSize : this.pageSize,
    totalCount : 0
  };

  searchForm!: FormGroup<{
    minYear: FormControl<number>;
    maxYear: FormControl<number>;
  }>;

  constructor(private booksService:BooksService, private fb:FormBuilder) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.nonNullable.group({
      minYear:[MIN_YEAR_SEARCH, [Validators.min(1400)]],
      maxYear:[this.currentYear, [Validators.max(this.currentYear)]]
    });
    this.getBooks("next", true);
  }

  onPageChange($event: PageEvent) {
    const prevPage = $event.previousPageIndex ?? 0;
    const isPreviousPage = prevPage >= $event.pageIndex;

    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;

    const typeRead = isPreviousPage ? "previous" : "next";

    this.getBooks(typeRead, false);
  }

  borrowBook(id:number) {

  }

  viewBookDetails(id:number) {

  }

  private getBooks(typeRead:"previous" | "next" = "next", isInit:Boolean = false) {

    let positionId = "";
    if(!isInit){
      if(typeRead == "previous"){
        positionId = this.booksPaginate.data[0].id;
      }else{
        positionId = this.booksPaginate.data.length > 0 ? this.booksPaginate.data[this.booksPaginate.data.length - 1].id : "";
      }
    }

    console.log(positionId);

    this.booksService.searchBooks(
      this.pageIndex,
      typeRead,
      positionId,
      this.searchForm.value.minYear ?? 0,
      this.searchForm.value.maxYear ?? 0
    ).subscribe((data) => {
      this.booksPaginate = data;
      if(isInit) this.pageIndex = 0;
    });
  }

  onSearch() {
    this.getBooks("next", true);
  }

  onReinit(){
    this.searchForm.controls.minYear.setValue(MIN_YEAR_SEARCH);
    this.searchForm.controls.maxYear.setValue(this.currentYear);
    this.getBooks("next", true);
  }
}
