import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleFormComponent} from './_components/article-form/article-form.component';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {QuillModule} from 'ngx-quill';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {DraftListComponent} from './_components/draft-list/draft-list.component';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ArticleRoutingModule} from './article-routing.module';
import {PipesModule} from '../pipes/pipes.module';
import { ArticleReadComponent } from './_components/article-read/article-read.component';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [ArticleFormComponent, DraftListComponent, ArticleReadComponent],
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
        MatMenuModule
    ]
})
export class ArticleModule {
}
