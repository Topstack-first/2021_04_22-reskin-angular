import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileFormComponent} from './_components/profile-form/profile-form.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPermissionsModule} from 'ngx-permissions';
import {MatIconModule} from '@angular/material/icon';
import {UserEntityComponent} from './_components/user-entity/user-entity.component';
import {OrganizationEntityComponent} from './_components/organization-entity/organization-entity.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import {ExperienceFormComponent} from './_components/experience-form/experience-form.component';
import {MatDividerModule} from '@angular/material/divider';
import {EducationFormComponent} from './_components/education-form/education-form.component';
import {QualificationFormComponent} from './_components/qualification-form/qualification-form.component';
import {PortfolioFormComponent} from './_components/portfolio-form/portfolio-form.component';
import {SkillsFormComponent} from './_components/skills-form/skills-form.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {ImageCropperComponent} from './_components/image-cropper/image-cropper.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';
import {PipesModule} from '../pipes/pipes.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [ProfileFormComponent, UserEntityComponent, OrganizationEntityComponent, ExperienceFormComponent, EducationFormComponent, QualificationFormComponent, PortfolioFormComponent, SkillsFormComponent, ImageCropperComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forChild(),
    MatIconModule,
    MatStepperModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    DragDropModule,
    MatDialogModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatRadioModule,
    FormsModule,
    ImageCropperModule,
    MatTooltipModule,
    MatSliderModule,
    PipesModule,
    MatSnackBarModule
  ],
})
export class ProfileModule {
}
