import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {firstValueFrom, takeUntil} from "rxjs";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasLogin = await firstValueFrom(authService.hasLogin)
  if(!hasLogin){
    await router.navigate(['/user/login']);
    return false;
  }

  return true;
};
