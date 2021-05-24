import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EntityHomepageRoutingModule} from './entity-homepage-routing.module';
import {HomepageComponent} from './_components/homepage/homepage.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PipesModule} from '../pipes/pipes.module';
import {QuillModule} from 'ngx-quill';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    EntityHomepageRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    FlexModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
    PipesModule,
    QuillModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgSelectModule,
  ]
})
export class EntityHomepageModule {
}
