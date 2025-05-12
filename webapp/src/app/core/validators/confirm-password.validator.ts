import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl):ValidationErrors | null => {
  const password = control.parent?.get("password");
  const confirmPassword = control.parent?.get("passwordConfirm");

  if(!password || !confirmPassword){
    return null;
  }

  return confirmPassword?.value === password?.value ? null : {"passwordNoMatch": true};
}

