import {FormControl, FormGroup} from '@angular/forms';


export function noWhiteSpaceValidator(control: FormControl): any {
  const isWhiteSpace = (control.value || '').trim().length === 0;
  const isValid = !isWhiteSpace;
  return isValid ? null : {whiteSpace: true};
}

export function passwordMisMatchValidator(changePasswordForm: FormGroup): any {
  if (!(changePasswordForm.dirty && changePasswordForm.touched)) {
    return null;
  }
  const password = changePasswordForm.get('new_password');
  const repeat_new_password = changePasswordForm.get('repeat_new_password');
  if (password.value === repeat_new_password.value) {
    repeat_new_password.setErrors(null);
    return null;
  } else {
    repeat_new_password.setErrors({passwordMismatch: true});
    return {passwordMismatch: true};
  }
}
