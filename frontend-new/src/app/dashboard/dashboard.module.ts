import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {NotificationDialogComponent} from './_components/notification-dialog/notification-dialog.component';
import {MailDialogComponent} from './_components/mail-dialog/mail-dialog.component';
import {ChallengesDialogComponent} from './_components/challenges-dialog/challenges-dialog.component';
import {DashboardComponent} from './_components/dashboard/dashboard.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {PipesModule} from '../pipes/pipes.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {QuillModule} from 'ngx-quill';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  declarations: [
    DashboardComponent,
    NotificationDialogComponent,
    MailDialogComponent,
    ChallengesDialogComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    PipesModule,
    MatTooltipModule,
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class DashboardModule {
}
