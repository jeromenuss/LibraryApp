import {WithId} from "./with-id.model";
import * as admin from "firebase-admin";

export interface Borrow extends WithId{
    bookId:string;
    userId:string;
    borrowDate:Date | admin.firestore.Timestamp;
    previsiousDateBack:Date | admin.firestore.Timestamp;
    realDateBack:Date | admin.firestore.Timestamp;
    state:string;
}