import {Inject, Injectable, NotFoundException, OnModuleInit} from "@nestjs/common";
import {app} from "firebase-admin";
import * as admin from 'firebase-admin';
import { WithId } from "src/core/models/with-id.model";
import {PaginationDto} from "../core/DTO/pagination.dto";
import {number} from "zod";


@Injectable()
export class FirebaseRepository<T extends WithId> implements OnModuleInit {
    #db: FirebaseFirestore.Firestore;
    protected collection: FirebaseFirestore.CollectionReference;

    @Inject('FIREBASE_APP')
    private readonly firebaseApp: app.App

    constructor() {
    }

    onModuleInit() {
        this.#db = this.firebaseApp.firestore();

        const collectionName = this.getCollectionNameFromType()
        this.collection = this.#db.collection(collectionName);
    }

    async getDocByIdAsync<T>(id:string){
        const doc = await this.collection.doc(id).get();

        if(!doc.exists)
            throw new NotFoundException("Le document est introuvable");

        return this.convertToObject(doc);
    }

    async getAllDocsAsync(){
        const allDocs = await this.collection.get();
        return allDocs.docs.map(doc => this.convertToObject(doc)) as T[];
    }

    async getAllDocsWithPagination(limit:number, startAfterDoc?:any):Promise<PaginationDto<T>>{
        let query = this.collection.orderBy('title').limit(limit);

        //Prendre après le document
        if(startAfterDoc){
            query = query.startAfter(startAfterDoc);
        }

        const snapshot = await query.get();
        const totalCount = await this.collection.count().get();

        return {
            pageSize : limit,
            data : snapshot.docs.map(doc => this.convertToObject(doc)) as T[],
            totalCount : totalCount.data().count,
            page : 1
        }
    }


    async createDocAsync(data:T){
        const prepareData = this.prepareForFirestore(data);
        const docRef = await this.collection.add(prepareData);
        const newDoc = await docRef.get();

        return this.convertToObject(newDoc);
    }

    async deleteDocAsync(id:string){
        return await this.collection.doc(id).delete();
    }

    async updateDocAsync(id:string, data:Partial<T>){
        const prepareData = this.prepareForFirestore(data);

        //Ajout de la date de mise à jour
        prepareData.updateDate = admin.firestore.Timestamp.now();

        await this.collection.doc(id).update(prepareData);
    }


    protected prepareForFirestore(data: Partial<T>): any {
        const result: any = { ...data };

        // Supprimer l'ID s'il existe
        if ('id' in result) {
            delete result.id;
        }

        // Convertir les Date en Timestamp
        Object.keys(result).forEach(key => {
            if (result[key] instanceof Date) {
                result[key] = admin.firestore.Timestamp.fromDate(result[key]);
            }
        });

        return result;
    }

    protected convertToObject(doc: admin.firestore.DocumentSnapshot): T {
        const data = doc.data();
        const result: any = { id: doc.id, ...data };

        // Convertir les Timestamps en Date
        Object.keys(result).forEach(key => {
            if (result[key] instanceof admin.firestore.Timestamp) {
                result[key] = result[key].toDate();
            }
        });

        return result as T;
    }

    protected getCollectionNameFromType():string{
        const constructorName = this.constructor.name;

        if(constructorName.endsWith("Service")){
            const entityName = constructorName.replace("Service", "");
            return entityName.toLowerCase();
        }

        return "items";
    }

}