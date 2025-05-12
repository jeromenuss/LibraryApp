import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {ProfilesService} from "../services/profiles.service";
import {firstValueFrom} from "rxjs";

export const adminGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfilesService);
  const router = inject(Router);

  const profile = await firstValueFrom(profileService.getCurrentProfile());

  if(profile.role != "Admin"){
    await router.navigate(['/home']);
    return false;
  }

  return true;
};
