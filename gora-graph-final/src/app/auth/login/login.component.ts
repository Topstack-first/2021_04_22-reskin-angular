import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorHandler} from '../../common/error-handler/error.handler';
import {MatDialogRef} from '@angular/material/dialog';
import {passwordMisMatchValidator} from '../../common/error-handler/customValidators';
import {MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('mtg', {static: true}) mtg: MatTabGroup;
  loginForm: FormGroup;
  pinForm: FormGroup;
  errors: any = {};
  returnUrl: string;
  errorMessage = null;

  constructor(private authService: AuthService,
              private router: Router,
              private errorHandler: ErrorHandler,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.authService.logout();
    this.loginForm = this.getLoginForm();
    this.initialPinForm();
    this.onFormValueChanges();
    this.returnUrl = 'dashboard';
  }

  public getLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(150)]],
      password: ['', [Validators.required, Validators.maxLength(128)]]
    });
  }

  initialPinForm(): any {
    this.pinForm = this.fb.group({
      pincode: ['', Validators.required],
    });
  }

  login(): any {
    if (this.loginForm.invalid) {
      this.errorHandler.handleErrors(this.loginForm, this.errors);
      return;
    }

    this.authService.login(this.loginForm.value).subscribe((resp) => {
        if (!resp['data']['profileConfirmed']) {
          this.mtg.selectedIndex = 1;
        } else {
          this.onSuccess();
        }
      },
      error => this.onError(error));
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

  onFormValueChanges(): any {
    this.loginForm.valueChanges.subscribe(() => {
      this.errors.serverError = null;
      this.errorMessage = null;
    });
  }

  goToSignup(): any {
    this.router.navigate(['auth/signup/']).then();
  }

  goToLogin(): any {
    this.mtg.selectedIndex = 0;
    this.loginForm.reset();
  }

  getNewPinCode(): any {
    this.authService.getNewPinCode().subscribe(
      () => this.snackBar.open('Pin Code sent to email!', 'Close', {duration: 3000, panelClass: 'success-snackbar'}));
  }

  onSuccess(): void {
    this.router.navigate([this.returnUrl]).then();
  }

  onError(error): void {
    this.errorHandler.organizeServerErrors(error.errors, this.loginForm);
    this.errorMessage = error['data']['msg'];
    // this.snackBar.open(error.message, 'Close', {duration: 3000});
  }
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.html',
  styleUrls: ['./login.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  passwordForm: FormGroup;
  errors: any = {};

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandler,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.passwordForm = this.getChangePasswordForm();
  }

  public getChangePasswordForm(): FormGroup {
    const passwordValidators = [Validators.required, Validators.maxLength(128), Validators.minLength(8)];
    return this.fb.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [...passwordValidators]],
      repeat_new_password: ['', [...passwordValidators]]
    }, {validators: passwordMisMatchValidator});
  }

  public close(): void {
    this.dialogRef.close();
  }

  public changePassword(): any {
    if (this.passwordForm.invalid) {
      this.errorHandler.handleErrors(this.passwordForm, this.errors);
      return;
    }

    this.authService.changePassword(this.passwordForm.value).subscribe(
      response => this.onSuccess(response),
      error => this.onError(error)
    );
  }

  private onSuccess({message}): void {
    this.snackBar.open(message, 'Close', {duration: 4000});
    this.authService.logout();
    this.dialogRef.close();
    this.router.navigate(['/login']).then();
  }

  private onError(error): void {
    this.errorHandler.organizeServerErrors(error.errors, this.passwordForm);
  }
}

