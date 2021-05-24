import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {LoaderComponent} from '../../loader/_components/loader.component';
import {AuthService} from '../_services/auth.service';
import {ErrorHandler} from '../../common/error-handler/error.handler';
import {MatTabGroup} from '@angular/material/tabs';
import {MatDialog} from '@angular/material/dialog';
import {NgxPermissionsService} from 'ngx-permissions';
import {CookieService} from 'ngx-cookie-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [LoaderComponent]
})

export class SignupComponent implements OnInit {

  @ViewChild('mtg', {static: true}) mtg: MatTabGroup;
  loader = false;
  isUploaded = false;

  signupForm: FormGroup;
  pinForm: FormGroup;
  returnUrl: string;
  serverErrors = '';

  today = new Date();
  nextWeek: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandler,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cookieService: CookieService,
    private permissionsService: NgxPermissionsService,
  ) {
    this.nextWeek.setDate(this.today.getDate() + 7);
  }

  ngOnInit(): void {
    this.authService.logout();
    this.returnUrl = 'dashboard/';
    this.initialSignUpForm();
    this.initialPinForm();
  }

  initialSignUpForm(): any {
    const passwordValidators = [Validators.required, Validators.maxLength(128), Validators.minLength(8)];
    this.signupForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', [...passwordValidators]],
        passwordConfirm: ['', [...passwordValidators]],
      },
      {validator: this.passwordMisMatchValidator}
    );
  }

  initialPinForm(): any {
    this.pinForm = this.fb.group({
      pincode: ['', Validators.required],
    });
  }

  signup(): any {
    this.serverErrors = '';
    const credentials = this.signupForm.value;
    const email = credentials.email;
    const password = credentials.password;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loader = true;
    this.authService.signup(email, password).subscribe((resp) => {
      this.loader = false;
      // this.onSuccess();
      this.mtg.selectedIndex = 2;
    }, (error) => {
      this.onError(error);
      this.loader = false;
    });
  }

  confirm(): any {
    if (this.pinForm.valid) {
      this.authService.activateProfile(this.pinForm.value).subscribe(() => {
        this.onSuccess();
      }, (error) => {
        this.onError(error);
      });
    }
  }

  loginAfterSignUp(credentials: { email: string, password: string }): any {
    this.authService.login(credentials)
      .pipe(first())
      .subscribe(() => {
        this.router.navigate(['dashboard']).then();
      }, () => {
        this.goToLogin();
      });
  }

  goToLogin(): any {
    this.router.navigate(['auth/login/']).then();
  }

  getNewPinCode(): any {
    this.authService.getNewPinCode().subscribe(
      () => this.snackBar.open('Pin Code sent to email!', 'Close', {duration: 3000, panelClass: 'success-snackbar'}));
  }

  onSuccess(): void {
    this.router.navigate([this.returnUrl]).then();
  }

  onError(error): void {
    this.errorHandler.organizeServerErrors(error.errors, this.signupForm);
    this.serverErrors = error['data']['msg'];
    // this.snackBar.open(error.message, 'Close', {duration: 3000});
  }


  equalValueValidator(targetKey: string, toMatchKey: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      if (target.touched && toMatch.touched) {
        const isMatch = target.value === toMatch.value;
        // set equal value error on dirty controls
        if (!isMatch && target.valid && toMatch.valid) {
          toMatch.setErrors({equalValue: targetKey});
          const message = targetKey + ' != ' + toMatchKey;
          return {equalValue: message};
        }
        if (isMatch && toMatch.hasError('equalValue')) {
          toMatch.setErrors(null);
        }
      }
      return null;
    };
  }

  passwordMisMatchValidator(changePasswordForm: FormGroup): any {
    if (!(changePasswordForm.dirty && changePasswordForm.touched)) {
      return null;
    }
    const password = changePasswordForm.get('password');
    const repeat_password = changePasswordForm.get('passwordConfirm');
    if (password.value === repeat_password.value) {
      repeat_password.setErrors(null);
      return null;
    } else {
      repeat_password.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    }
  }

}
