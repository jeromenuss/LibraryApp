import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./user/login/login.component";
import {RegisterComponent} from "./user/register/register.component";
import {ProfileComponent} from "./user/profile/profile.component";

export const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'user', children: [
      {path:'login', component:LoginComponent},
      {path:'register', component:RegisterComponent},
      {path:'profile/:id', component:ProfileComponent},
    ]
  },
  {path:'', redirectTo:'/home', pathMatch:'prefix'},
];
