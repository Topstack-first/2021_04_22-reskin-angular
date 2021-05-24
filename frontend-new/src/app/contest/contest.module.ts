import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContestRoutingModule} from './contest-routing.module';
import {ContestFormComponent} from './_components/contest-form/contest-form.component';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {QuillModule} from 'ngx-quill';
import {DraftListComponent} from './_components/draft-list/draft-list.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {PipesModule} from '../pipes/pipes.module';
import { ContestReadComponent } from './_components/contest-read/contest-read.component';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [ContestFormComponent, DraftListComponent, ContestReadComponent],
  imports: [
    CommonModule,
    ContestRoutingModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    QuillModule,
    MatDividerModule,
    MatListModule,
    MatAutocompleteModule,
    PipesModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule
  ]
})
export class ContestModule {
}
