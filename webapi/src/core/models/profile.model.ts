import {WithId} from "./with-id.model";
import * as admin from 'firebase-admin';

export interface Profile extends WithId{
    uuid:string;
    name?:string;
    lastName?:string;
    mail:string;
    phone?:string;
    registered: Date | admin.firestore.Timestamp;
    isActive:boolean;
}