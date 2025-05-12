import * as admin from 'firebase-admin';
import { WithId } from './with-id.model';

export interface Book extends WithId {
  isbn: string;
  title: string;
  author: string;
  yearPublish: number;
  kind: string;
  description: string;
  copiesNumber: number;
  addDate: Date | admin.firestore.Timestamp;
}
