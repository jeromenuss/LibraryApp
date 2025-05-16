import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BOOK_GENRES} from "../../../core/commons/kind.constants";
import {Book} from "../../../core/model/book.model";
import {ActivatedRoute, Router} from "@angular/router";
import {BooksService} from "../../../core/services/books.service";
import {MatHint, MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {finalize, firstValueFrom} from "rxjs";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  imports: [
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatIcon,
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatHint,
    MatProgressBar
  ],
  selector: 'app-book-edit',
  styleUrl: './book-edit.component.scss',
  templateUrl: './book-edit.component.html'
})
export class BookEditComponent implements OnInit {

  private readonly DEFAULT_COVER = "assets/img/cover.png";
  currentCoverUrl:string = this.DEFAULT_COVER;

  bookForm!: FormGroup<{
    useExternalApi:FormControl<boolean>
    title:FormControl<string>,
    author:FormControl<string>,
    isbn:FormControl<string>,
    category:FormControl<string>,
    kind:FormControl<string>,
    yearPublish:FormControl<number>,
    description:FormControl<string>,
  }>;

  selectedCategory: string = "";
  genres:string[] = []

  bookToEdit?:Book;
  bookId:string = "";
  isEdition:boolean = false;
  isLoading = false;

  protected readonly BOOK_GENRES = BOOK_GENRES;

  constructor(private fb:FormBuilder, private activatedRoute:ActivatedRoute, private router:Router, private bookService:BooksService){
    this.createBookForm();

    const categorySelected = BOOK_GENRES[0];
    this.selectedCategory = categorySelected.category;
    this.genres = categorySelected.genres;
  }


  ngOnInit(){
    if(this.activatedRoute.snapshot.params['id']){
      this.isLoading = true;
      this.bookId = this.activatedRoute.snapshot.params['id'];
      this.isEdition = true;

      this.bookService.getBookById(this.bookId)
        .pipe(
          finalize(() => {
            this.getCoverUrl();
            this.isLoading = false;
          })
        )
        .subscribe(async (bookResult) => {
          this.bookForm.patchValue(bookResult);
       })
    } else {
      this.isEdition = false
    }
  }

  private createBookForm(){
    console.log('isbn', this.bookToEdit?.isbn);

    this.bookForm = this.fb.nonNullable.group({
      useExternalApi: [false],
      title: ["", Validators.required],
      author: ["", Validators.required],
      isbn: ["", Validators.required],
      category: ["", Validators.required],
      kind: ["", Validators.required],
      yearPublish: [0, Validators.required],
      description: ["", Validators.required],
    });
  }

  onSubmit() {
    if(this.isEdition && this.bookId != ""){
      let bookToUpdate = this.bookForm.value as Partial<Book>;
      bookToUpdate.id = this.bookId;

      this.bookService.updateBook(bookToUpdate).subscribe(async () => {
        await this.router.navigate([`book/view/${bookToUpdate.id}`]);
      })
    } else {
      console.log("book", this.bookForm.value as Partial<Book>);
      this.bookService.createBook(this.bookForm.value as Partial<Book>).subscribe(async (bookResult) => {
        if(bookResult != null){
          await this.router.navigate([`book/view/${bookResult.id}`]);
        }
      });
    }
  }

  onCancel() {

  }

  onCategoryChange() {
    const categorySelected = BOOK_GENRES.find(c => c.category == this.bookForm.value.category);
    if(categorySelected){
      this.selectedCategory = categorySelected.category;
      this.genres = categorySelected.genres;
    }
  }

  onChangeISBN() {
    this.getCoverUrl();
  }

  private getCoverUrl() {
    this.isLoading = true;

    this.bookService.getBookFromGoogleApi(this.bookForm.controls.isbn.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }))
      .subscribe(async (bookFromExternalApi) => {
        if (bookFromExternalApi && bookFromExternalApi.totalItems >= 1) {
          if (bookFromExternalApi.items[0].volumeInfo.imageLinks) {
            this.currentCoverUrl = bookFromExternalApi.items[0].volumeInfo.imageLinks.thumbnail;
          } else {
            this.currentCoverUrl = this.DEFAULT_COVER;
          }
        } else {
          this.currentCoverUrl = this.DEFAULT_COVER;
        }
      });


  }
}
