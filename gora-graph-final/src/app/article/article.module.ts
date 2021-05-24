import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { QuillModule } from 'ngx-quill';
import { PipesModule } from '../pipes/pipes.module';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleDraftListComponent } from './_components/article-draft-list/article-draft-list.component';
import { ArticleFormComponent } from './_components/article-form/article-form.component';
import { ArticleReadComponent } from './_components/article-read/article-read.component';
import { DraftListComponent } from './_components/draft-list/draft-list.component';

@NgModule({
  declarations: [
    ArticleFormComponent,
    DraftListComponent,
    ArticleReadComponent,
    ArticleDraftListComponent,
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    FlexLayoutModule,
    MatSelectModule,
    QuillModule,
    MatIconModule,
    MatAutocompleteModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatDatepickerModule,
    PipesModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
  ]
})
export class ArticleModule {
}
