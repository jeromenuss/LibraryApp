import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/.environment";
import { Book } from '../model/book.model';
import {Pagination} from "../model/pagination.model";

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private http = inject(HttpClient);

  constructor() { }

  getAllBooks(page:number, pageSize:number):Observable<Pagination<Book>> {
    //Création des paramètres
    //let params:HttpParams = new HttpParams();
    //params.set('pageSize', pageSize);
    //params.set('page', page);

    //console.log(params);

    //Appel au service
    return this.http.get<Pagination<Book>>(environment.apiUrl + '/books', { params : {
        page : page + 1,
        pageSize : pageSize
      }});
  }
}
