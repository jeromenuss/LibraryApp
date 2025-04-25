import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as admin from 'firebase-admin';
import {FirebaseRepository} from "../../firebase/firebase.repository";
import {Book} from "../../core/models/book.model";
import {app} from "firebase-admin";

@Injectable()
export class BooksService extends FirebaseRepository<Book>{

    constructor() {
        super();
    }

    /*async findAllAsync(pageSize:number, page:number): Promise<Book[]>{
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => {
           const data = doc.data();
           return {
               id: doc.id,
               ...data
           } as Book;
        });
    }*/

    /*async findByIdAsync(id:string):Promise<Book>{
        return await this.collection.doc(id).get().then((doc) => {
            if(!doc.exists){
                throw new NotFoundException("Le livre est introuvable");
            }

            const data = doc.data() as Omit<Book, 'id'>;
            return {
                id: doc.id,
                ...data,
            } as Book;
        });
    }*/

    /*async createAsync(book: Book):Promise<Book>{
        const bookData = {
            ...book,
            addDate: book.addDate instanceof Date
                ? admin.firestore.Timestamp.fromDate(book.addDate as Date)
                : book.addDate,
        };

        const docRef = await this.collection.add(bookData);

        return {
            id: docRef.id,
            ...book
        };
    }*/

    /*async updateAsync(id:string, book:Partial<Book>):Promise<void>{
        return this.collection.doc(id).then(async (docRef) => {
            if(!docRef.exists){
                throw new NotFoundException("Le livre est introuvable");
            }

            const updateData = {...book};

            if(book.addDate instanceof Date){
                updateData.addDate = admin.firestore.Timestamp.fromDate(book.addDate);

                await docRef.update(updateData);
            }
        });






    }*/

    /*async deleteAsync(id:string):Promise<void>{
        await this.firebaseRepository.collection.doc(id).delete();
    }*/

    /*
    async createRangeAsync(books: Book[]){
        await this.bookRepository.insert(books);
    }

    async deleteAsync(id:number){
        await this.bookRepository.delete(id)
    }

    async updateAsync(book:Book){
        await this.bookRepository.update(book.id, book)
    }

    private async findAsync(pageSize:number, pageNumber:number = 1, optionWhere: FindOptionsWhere<Book>[] = []) : Promise<Book[]>{
        return await new Promise((resolve, reject) => {
            const start:number = (pageNumber - 1) * pageSize;

            this.bookRepository.find({where : optionWhere, skip : start, take: pageSize}).then(result => {
                resolve(result)
            });
        });
    }

    private async countAsync(optionWhere: FindOptionsWhere<Book>[] = []):Promise<number>{
        return await new Promise((resolve, reject) => {
            this.bookRepository.count({where : optionWhere}).then(result => {
                resolve(result);
            });
        });
    }

    private generateOption(title:string = "", author:string = "", minYearPublish:number = 0, maxYearPublish:number = 0, kind:string = ""):FindOptionsWhere<Book>[]{
        //Construction de la recherche
        let optionWhere: FindOptionsWhere<Book>[] = [];
        let optionWhereAnd: FindOptionsWhere<Book> = {};

        if(title != ""){
            optionWhereAnd.title = Like(`%${title}%`)
        }

        if(author != ""){
            optionWhereAnd.author = Like(`%${author}%`)
        }

        if(kind != ""){
            optionWhereAnd.kind = Like(`%${kind}%`);
        }

        let currentYear = new Date(Date.now()).getFullYear();

        if(minYearPublish > 0 && maxYearPublish > 0){
            optionWhereAnd.yearPublish = Between(minYearPublish, maxYearPublish);
        } else {
            if(minYearPublish >= 1400){
                optionWhereAnd.yearPublish = MoreThan(minYearPublish);
            }
            if(minYearPublish == 0 && maxYearPublish <= currentYear){
                optionWhereAnd.yearPublish = LessThan(maxYearPublish)
            }
        }

        optionWhere.push(optionWhereAnd);

        return optionWhere;
    }
*/
}
