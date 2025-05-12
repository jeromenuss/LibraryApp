import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { app, firestore } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { WithId } from 'src/core/models/with-id.model';
import { PaginationDto } from '../core/DTO/pagination.dto';
import { number } from 'zod';
import Query = firestore.Query;

@Injectable()
export class FirebaseRepository<T extends WithId> implements OnModuleInit {
  #db: FirebaseFirestore.Firestore;
  protected collection: FirebaseFirestore.CollectionReference;

  @Inject('FIREBASE_APP')
  private readonly firebaseApp: app.App;

  constructor() {}

  onModuleInit() {
    this.#db = this.firebaseApp.firestore();

    const collectionName = this.getCollectionNameFromType();
    this.collection = this.#db.collection(collectionName);
  }

  async getDocByIdAsync(id: string) {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) throw new NotFoundException('Le document est introuvable');

    return this.convertToObject(doc);
  }

  async getAllDocsAsync() {
    const allDocs = await this.collection.get();
    return allDocs.docs.map((doc) => this.convertToObject(doc));
  }

  async getAllDocsWithPagination(
    limit: number,
    typeRead: 'previous' | 'next' = 'next',
    idDocPosition?: string,
  ): Promise<PaginationDto<T>> {
    const query = this.collection.orderBy('title');

    return await this.getDocsWithPagination(
      query,
      limit,
      typeRead,
      idDocPosition,
    );
  }

  protected async getDocsWithPagination(
    query: Query,
    limit: number,
    typeRead: 'previous' | 'next' = 'next',
    idDocPosition?: string,
  ): Promise<PaginationDto<T>> {
    const totalCount = await query.count().get();

    if (idDocPosition) {
      const positionDoc = await this.collection.doc(idDocPosition).get();

      if (!positionDoc.exists)
        throw new NotFoundException('Le document positionné est introuvable');

      query =
        typeRead === 'previous'
          ? query.endBefore(positionDoc).limitToLast(limit)
          : query.startAfter(positionDoc).limit(limit + 1);
    }

    const snapshot = await query.get();

    const isLastPage =
      typeRead === 'previous' ? false : snapshot.docs.length < limit + 1;
    const dataReturn = snapshot.docs
      .slice(0, limit)
      .map((doc) => this.convertToObject(doc));

    return {
      pageSize: limit,
      data: dataReturn.slice(0, limit),
      totalCount: totalCount.data().count,
      isLastPage: isLastPage,
    };
  }

  async createDocAsync(data: T) {
    const prepareData = this.prepareForFirestore(data);
    const docRef = await this.collection.add(prepareData);
    const newDoc = await docRef.get();

    return this.convertToObject(newDoc);
  }

  async deleteDocAsync(id: string) {
    return await this.collection.doc(id).delete();
  }

  async updateDocAsync(id: string, data: Partial<T>) {
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
    Object.keys(result).forEach((key) => {
      console.log(result[key]);
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
    Object.keys(result).forEach((key) => {
      console.log(key);
      console.log(result[key]);
      if (
        result[key] &&
        typeof result[key] === 'object' &&
        result[key].hasOwnProperty('seconds') &&
        result[key].hasOwnProperty('nanoseconds')
      ) {
        result[key] = result[key].toDate();
      }
    });

    return result as T;
  }

  protected getCollectionNameFromType(): string {
    const constructorName = this.constructor.name;

    if (constructorName.endsWith('Service')) {
      const entityName = constructorName.replace('Service', '');
      return entityName.toLowerCase();
    }

    return 'items';
  }
}
