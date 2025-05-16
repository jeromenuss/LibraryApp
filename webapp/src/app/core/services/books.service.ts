import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, throwError} from "rxjs";
import {environment} from "@env/.environment";
import { Book } from '../model/book.model';
import {Pagination} from "../model/pagination.model";
import {SearchDto} from "../dto/search.dto";
import {AppError} from "../commons/app.error";
import {CodeMessage} from "../commons/error-code.enum";
import {BaseService} from "./base.service";
import {MessagesService} from "./messages.service";

@Injectable({
  providedIn: 'root'
})
export class BooksService extends BaseService {

  private URL_BASE_COVER = "https://covers.openlibrary.org/b/isbn/";
  private URL_BASE_GOOGLE_BOOK = "https://www.googleapis.com/books/v1/volumes?q=isbn:";
  private readonly DEFAULT_COVER = "assets/img/cover.png";

  constructor() {
    super();
  }

  getAllBooks(page:number, typeRead:"previous" | "next" = "next", lastItemId:string):Observable<Pagination<Book>> {
    //Création des paramètres
    //let params:HttpParams = new HttpParams();
    //params.set('pageSize', pageSize);
    //params.set('page', page);

    //console.log(params);

    //Appel au service
    return this.http.get<Pagination<Book>>(environment.apiUrl + '/books', { params : {
        page : page + 1,
        typeRead : typeRead,
        lastItemId : lastItemId
      }});
  }

  getBookById(bookId:string):Observable<Book> {
    return this.http.get<Book>(environment.apiUrl + '/books/'+bookId);
  }

  getBookByIsbn(isbn:string):Observable<Book> {
    return this.http.get<Book>(environment.apiUrl + '/books/isbn/'+ isbn)
  }

  getBookFromGoogleApi(isbn:string):Observable<any> {
    return this.http.get<any>(this.URL_BASE_GOOGLE_BOOK + isbn);
  }

  getCompleteBookInfo(isbn:string){
    return forkJoin({
      book: this.getBookByIsbn(isbn),
      bookFromApi: this.getBookFromGoogleApi(isbn)
    }).pipe(
      map(({book, bookFromApi}) => {
        let coverUrl:string = this.DEFAULT_COVER;
        if (bookFromApi && bookFromApi.totalItems >= 1) {
          if (bookFromApi.items[0].volumeInfo.imageLinks) {
            coverUrl = bookFromApi.items[0].volumeInfo.imageLinks.thumbnail;
          }
        }
        return {
          bookDetails: book,
          coverUrl:coverUrl
        }
      })
    )
  }

  searchBooks(page:number, typeRead:"previous" | "next" = "next", lastItemId:string, minYear:number, maxYear:number){
    const searchParams:SearchDto = {
      page : page + 1,
      typeRead : typeRead,
      lastItemId : lastItemId,
    };

    if(minYear > 0) searchParams.minYear = minYear;
    if(maxYear > 0) searchParams.maxYear = maxYear;

    //Constitution des paramètres
    const paramsRecord:Record<string, string | number | boolean> = {};
    //Pour chaque propriétés de la classe SearchDto, on récupère la clé (propriété) et la valeur
    Object.entries(searchParams).forEach(([key, value]) => {
      //Si la valeur est null ou indéfini, on ne crée pas le paramètre.
      if (value !== undefined && value !== null) {
        paramsRecord[key] = value;
      }
    });

    return this.http.get<Pagination<Book>>(environment.apiUrl + '/books/search', {params : new HttpParams({fromObject: paramsRecord})});
  }

  getCovertUrl(isbn:string, size:'S' | 'M' | 'L' = "M"){
    return `${this.URL_BASE_COVER}${isbn}-${size}.jpg`;
  }

  createBook(book:Partial<Book>):Observable<Book> {
    //Ajout de la date de création
    book.addDate = new Date(Date.now());
    //Mise en place du nombre de copie à 1
    book.copiesNumber = 1;

    //console.log("Book to add", book as Book);

    return this.http.post<Book>(`${environment.apiUrl}/books`, book as Book, {});
  }

  updateBook(book:Partial<Book>):Observable<void> {
    book.updateDate = new Date(Date.now());

    //console.log("Book to update", book as Book);

    return this.http.put<void>(`${environment.apiUrl}/books/${book.id}`, book);
  }

  /*private handleError(error:HttpErrorResponse) {
    let errorApp: AppError = new AppError();

    if(error.error instanceof ErrorEvent) {
      errorApp.code = CodeMessage.CLIENT;
      errorApp.message = error.error.message;
      errorApp.name = error.name;
    }else{
      errorApp.code = String(error.status);
      errorApp.message = ;
      errorApp.name = error.name;
    }

    return throwError(() => new Error(error.message));
  }*/
}
