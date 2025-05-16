import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/.environment";
import {BorrowDto} from "../dto/borrow.dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BorrowsService {

  constructor(private http:HttpClient) {
  }

  createBorrow(borrow:BorrowDto):Observable<string>{
    return this.http.post<string>(`${environment.apiUrl}/borrows`, borrow);
  };

  backBook(borrowId:string){
    return this.http.patch(`${environment.apiUrl}/borrows/${borrowId}/back`, {});
  }
}
