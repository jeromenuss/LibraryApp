import {Injectable, NotFoundException} from '@nestjs/common';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { Book } from '../../core/models/book.model';
import { firestore } from 'firebase-admin';
import Query = firestore.Query;
import { PaginationDto } from '../../core/DTO/pagination.dto';
import {Profile} from "../../core/models/profile.model";
import {ApiHttpException} from "../../core/commons/api-http.exception";

@Injectable()
export class BooksService extends FirebaseRepository<Book> {
  constructor() {
    super();
  }

  async getBookByIsbn(isbn:string):Promise<Book> {
    const querySnapshot = await this.collection.where('isbn', '==', isbn).get();

    if (querySnapshot.empty) {
      throw new ApiHttpException("book.not_found");
    }

    const bookDoc = querySnapshot.docs[0];

    return {
      id: bookDoc.id,
      ...(bookDoc.data() as Book),
    };
  }

  async checkBookIsBorrowed(bookId:string):Promise<boolean>{
    const documentSnapshot = await this.collection.doc(bookId).get();

    if(!documentSnapshot.exists) {
      throw new ApiHttpException("book.not_found");
    }

    const book = documentSnapshot.data() as Book;

    if(book.copiesNumber == 0){
      throw new ApiHttpException("book.unavailable");
    }

    return true;
  }

  async decreaseCopyNumber(bookId:string):Promise<void> {
    let book = await this.getDocByIdAsync(bookId);
    book.copiesNumber = book.copiesNumber - 1;

    await this.updateDocAsync(bookId, book);
  }

  async increaseCopyNumber(bookId:string):Promise<void> {
    let book = await this.getDocByIdAsync(bookId);
    book.copiesNumber = book.copiesNumber + 1;

    await this.updateDocAsync(bookId, book);
  }

  async searchAsync(
    minYearPublish: number = 0,
    maxYearPublish: number = 0,
    limit: number,
    typeRead: 'previous' | 'next' = 'next',
    idDocPosition?: string,
  ): Promise<PaginationDto<Book>> {
    let query: FirebaseFirestore.Query<
      FirebaseFirestore.DocumentData,
      FirebaseFirestore.DocumentData
    > = this.collection.orderBy('title');

    query = this.generationWhere(query, minYearPublish, maxYearPublish);

    return await this.getDocsWithPagination(
      query,
      limit,
      typeRead,
      idDocPosition,
    );
  }

  private generationWhere(
    query: Query,
    minYearPublish: number = 0,
    maxYearPublish: number = 0,
  ): FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData> {
    const currentYear = new Date(Date.now()).getFullYear();

    if (minYearPublish > 0 && maxYearPublish > 0) {
      query = query
        .where('yearPublish', '>=', Number(minYearPublish))
        .where('yearPublish', '<=', Number(maxYearPublish));
    } else {
      if (minYearPublish >= 1400) {
        query = query.where('yearPublish', '>=', Number(minYearPublish));
      }
      if (
        minYearPublish == 0 &&
        maxYearPublish > 0 &&
        maxYearPublish <= currentYear
      ) {
        query = query.where('yearPublish', '<=', Number(maxYearPublish));
      }
    }

    return query;
  }
}
