export interface Profile {
  id:string;
  uuid:string;
  name:string;
  lastName:string;
  mail:string;
  phone?:string;
  registered: Date;
  isActive:boolean;
  role:'User'|'Admin';
}
