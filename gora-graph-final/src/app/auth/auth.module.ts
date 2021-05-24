import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {ChangePasswordDialogComponent, LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FlexModule} from '@angular/flex-layout';
import {MatDialogModule} from '@angular/material/dialog';
import {SignupComponent} from './signup/signup.component';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations: [LoginComponent, ChangePasswordDialogComponent, SignupComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FlexModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    MatIconModule
  ]
})
export class AuthModule {
}
