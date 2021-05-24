import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { QuillModule } from 'ngx-quill';
import { PipesModule } from '../pipes/pipes.module';
import { ContestRoutingModule } from './contest-routing.module';
import { ContestFormComponent } from './_components/contest-form/contest-form.component';
import { ContestReadComponent } from './_components/contest-read/contest-read.component';
import { DraftListComponent } from './_components/draft-list/draft-list.component';
import { ContestDraftListComponent } from './_components/contest-draft-list/contest-draft-list.component';


@NgModule({
  declarations: [
    ContestFormComponent,
    DraftListComponent,
    ContestReadComponent,
    ContestDraftListComponent
  ],
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
    MatMenuModule,
  ]
})
export class ContestModule {
}
