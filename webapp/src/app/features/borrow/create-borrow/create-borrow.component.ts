import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatError, MatInput, MatLabel} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {SelectedUserDto} from "../../../core/dto/selected-user.dto";
import {SelectedBookDto} from "../../../core/dto/selected-book.dto";
import {DatePipe} from "@angular/common";
import {MatNativeDateModule} from "@angular/material/core";
import {BooksService} from "../../../core/services/books.service";
import {ProfilesService} from "../../../core/services/profiles.service";
import {combineAll, combineLatestAll, forkJoin, merge} from "rxjs";
import {MessagesService} from "../../../core/services/messages.service";
import {AppError} from "../../../core/commons/app.error";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {BorrowsService} from "../../../core/services/borrows.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-borrow',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatLabel,
    MatFormField,
    MatInput,
    MatIconButton,
    MatIcon,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatError,
    DatePipe,
    MatButton,
    MatSuffix,
    MatChipSet,
    MatChip
  ],
  templateUrl: './create-borrow.component.html',
  styleUrl: './create-borrow.component.scss'
})
export class CreateBorrowComponent {

  borrowForm!: FormGroup<{
    isbnBook:FormControl<string>,
    userEmail:FormControl<string>,
    borrowDate:FormControl<Date>,
    previsiousDateBack:FormControl<Date>,
  }>

  dateNow:Date = new Date(Date.now())

  constructor(private fb:FormBuilder,
              private booksService:BooksService,
              private profileService:ProfilesService,
              private borrowsService:BorrowsService,
              private messagesServices:MessagesService,
              private router:Router

  ) {
    let datePrevisiousDate = new Date();
    datePrevisiousDate.setDate(this.dateNow.getDate() + 14);

    this.borrowForm = this.fb.nonNullable.group({
      isbnBook : ['', [Validators.required]],
      userEmail : ['', [Validators.required, Validators.email]],
      borrowDate : [this.dateNow, [Validators.required]],
      previsiousDateBack : [datePrevisiousDate, [Validators.required]]
    });
  }

  selectedBook!:SelectedBookDto | null;
  selectedUser!:SelectedUserDto;


  onCancel() {

  }

  onSubmit() {
    if(this.borrowForm.valid && this.selectedUser.canBorrow && this.selectedBook?.isBorrowed){
      this.borrowsService.createBorrow({
        borrowDate : this.borrowForm.value.borrowDate!,
        bookId : this.selectedBook.id,
        userId : this.selectedUser.id,
        borrowBackDate : this.borrowForm.value.previsiousDateBack!,
      }).subscribe(async (idBorrow:string) => {
        this.messagesServices.sendMessage("success", "Le livre est maintenant emprunté");
        await this.router.navigate(['/home']);
      });
    }else{
      if(!this.selectedUser.canBorrow)
        this.messagesServices.sendMessage("danger", "L'utilisateur ne peut pas emprunté de livre pour le moment.");
      else if(!this.selectedBook?.isBorrowed)
        this.messagesServices.sendMessage("danger", "Le livre ne peut pas être emprunté pour le moment.");
    }
  }

  onIsbnSearch() {
    if(this.borrowForm.controls.borrowDate.valid && this.borrowForm.value.isbnBook){
      this.booksService.getCompleteBookInfo(this.borrowForm.value.isbnBook).subscribe(
      {
        next: (result) => {
          this.selectedBook = {
            id : result.bookDetails.id,
            title : result.bookDetails.title,
            author : result.bookDetails.author,
            coverUrl : result.coverUrl,
            isBorrowed : result.bookDetails.copiesNumber > 0
          }
        }
      })
    }
  }

  onUserSearch() {
    if(this.borrowForm.controls.userEmail.valid && this.borrowForm.value.userEmail){
      this.profileService.getProfileByEmail(this.borrowForm.value.userEmail).subscribe({
        next: (profile)=> {
          this.selectedUser = profile
        }
      });
    }
  }
}
