import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { Borrow } from 'src/core/models/borrow.model';
import {boolean, number} from "zod";
import {BorrowsDto} from "../../core/DTO/borrows.dto";
import {ProfilesService} from "../profiles/profiles.service";
import {BooksService} from "../books/books.service";

@Injectable()
export class BorrowsService extends FirebaseRepository<Borrow> {
  constructor(private profileService:ProfilesService, private bookService:BooksService) {
    super();
  }

  /*async getBorrowsWithPagination(state:string, limit: number, typeRead: 'previous' | 'next' = 'next', idDocPosition?: string){

    const query = this.collection.orderBy('borrow');

    const totalCount = await query.count().get();



  }*/

  async createBorrow(borrowDto:BorrowsDto):Promise<string>{

    //On vérifie si l'utilisateur peut emprunter
    let userCanBorrow:boolean = await this.profileService.checkUserCanBorrow(borrowDto.userId);

    //On vérifie si le livre est diponnible
    let bookHasCopie:boolean = await this.bookService.checkBookIsBorrowed(borrowDto.bookId);

    if (userCanBorrow && bookHasCopie) {
      let borrow:Borrow = await this.createDocAsync({
        borrowDate : borrowDto.borrowDate,
        previsiousDateBack : borrowDto.borrowBackDate,
        userId : borrowDto.userId,
        bookId: borrowDto.bookId,
        state : "Emprunté",
        realDateBack: new Date("2999-12-31")
      });

      if(borrow.id){
        await this.bookService.decreaseCopyNumber(borrow.bookId);
        return borrow.id;
      }
    }

    return "";
  }

  async backBook(borrowId:string):Promise<void>{
    let borrow:Borrow = await this.getDocByIdAsync(borrowId);
    borrow.realDateBack = new Date(Date.now());
    borrow.state = "Rendu";

    await this.updateDocAsync(borrowId, borrow);
    await this.bookService.increaseCopyNumber(borrow.bookId);
  }

  /*async createBorrowAsync(borrow: BorrowsDto) {
    throw new NotFoundException();
  }*/
}
