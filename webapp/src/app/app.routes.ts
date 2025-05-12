import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./user/login/login.component";
import {RegisterComponent} from "./user/register/register.component";
import {ProfileComponent} from "./user/profile/profile.component";
import {BookComponent} from "./book/view/book.component";
import {BookEditComponent} from "./book/edit/book-edit.component";
import {authGuard} from "./core/guards/auth.guard";
import {adminGuard} from "./core/guards/admin.guard";

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
  {path:'', redirectTo:'/home', pathMatch:'prefix'},
];
