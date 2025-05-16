import { Routes } from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {RegisterComponent} from "./features/user/register/register.component";
import {ProfileComponent} from "./features/profile/profile.component";
import {BookComponent} from "./features/book/view/book.component";
import {BookEditComponent} from "./features/book/edit/book-edit.component";
import {authGuard} from "./core/guards/auth.guard";
import {adminGuard} from "./core/guards/admin.guard";
import { LoginComponent } from './features/user/login/login.component';
import {CreateBorrowComponent} from "./features/borrow/create-borrow/create-borrow.component";
import {ListBorrowComponent} from "./features/borrow/list-borrow/list-borrow.component";

export const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'user', children: [
      {path:'login', component:LoginComponent},
      {path:'register', component:RegisterComponent},
      {path:'profile/:id', component:ProfileComponent},
    ]
  },
  {path:'book', canActivate: [authGuard], children: [
      {path:'new', component:BookEditComponent, canActivate: [adminGuard]},
      {path:'view/:id', component:BookComponent},
      {path:'edit/:id', component: BookEditComponent, canActivate: [adminGuard]},
    ]
  },
  {path:'borrow', canActivate: [authGuard], children: [
      {path:'list', component: ListBorrowComponent},
      {path:'create', component: CreateBorrowComponent}
    ]
  },
  {path:'', redirectTo:'/home', pathMatch:'prefix'},
];
