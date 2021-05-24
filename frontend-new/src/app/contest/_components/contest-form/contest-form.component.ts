import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {DialogConfirmComponent} from '../../../common/dialog-confirm/dialog-confirm.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, startWith} from 'rxjs/operators';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {ContestService} from '../../_services/contest.service';
import {formatDate, Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Education {
  name: string;
}

export interface Skill {
  name: string;
}

@Component({
  selector: 'app-contest-form',
  templateUrl: './contest-form.component.html',
  styleUrls: ['./contest-form.component.scss'],
  providers: [DialogConfirmComponent, {
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class ContestFormComponent implements OnInit, OnDestroy {

  id;
  entityId;
  formGroup: FormGroup;
  mainCategories;
  subCategories;
  saveInterval;
  loading = false;
  mainImageId = null;
  list = [];

  filteredMainCategories: Observable<[]>;
  filteredSubCategories: Observable<[]>;

  files: Array<any>;
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  education: Education[] = [];
  skills: Skill[] = [];

  constructor(private formBuilder: FormBuilder,
              private service: ContestService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private confirmDialog: DialogConfirmComponent,
              private snackbar: MatSnackBar) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.entityId = this.route.snapshot.paramMap.get('entityId');

    this.formGroup = this.formBuilder.group({
      draftid: [null],
      title: [null],
      abstract: [null],
      maincategory: [null],
      subcategory: [null],
      description: [null],
      newmaincategory: [null],
      newsubcategory: [null],
      evaluation: [null],
      reward: [null],
      startdate: [null],
      enddate: [null],
      requirements: this.formBuilder.array([
        this.initRequirements()
      ])
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getSubCategories();

    if (this.id !== '0') {
      this.formGroup.controls['draftid'].patchValue(this.id);
      this.service.getDraft(this.entityId, this.id).subscribe(resp => {
        const draft = resp.data[0];

        this.addEducationAndSkills(0, draft);
        for (let i = 1; i < draft.requirements.length; i++) {
          this.addRequirement();
          this.addEducationAndSkills(i, draft);
        }

        this.formGroup.patchValue(draft);
        this.mainImageId = draft.leadingimage;
        if (this.mainImageId) {
          this.list = [1];
        }
        this.getFiles();
      });
    } else {
      this.getNewDraftId();
    }
    this.saveInterval = setInterval(() => this.save(), 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.saveInterval);
  }

  addEducation(event: MatChipInputEvent, requirement): void {
    const education = requirement.value['education'];
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      education.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    console.log(requirement);
  }

  removeEducation(education: Education, requirement): void {
    const educations: Education[] = requirement.value['education'];
    const index = educations.indexOf(education);

    if (index >= 0) {
      educations.splice(index, 1);
    }
  }

  addSkills(event: MatChipInputEvent, requirement): void {
    const skills = requirement.value['skills'];
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      skills.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSkills(skill: Skill, requirement): void {
    const skills: Skill[] = requirement.value['skills'];
    const index = skills.indexOf(skill);

    if (index >= 0) {
      skills.splice(index, 1);
    }
  }

  initRequirements(): FormGroup {
    return this.formBuilder.group({
      education: this.formBuilder.array([]),
      skills: this.formBuilder.array([]),
      experience: [null],
      other: [null]
    });
  }

  initSimpleObject(): FormGroup {
    return this.formBuilder.group({
      name: [null],
    });
  }

  addEducationAndSkills(index: number, draft): any {
    const requirementsControl = this.formGroup.controls['requirements'] as FormArray;
    const requirement = requirementsControl.at(index) as FormGroup;
    const educations = requirement.controls['education'] as FormArray;
    const skills = requirement.controls['skills'] as FormArray;
    const educationList: any[] = draft.requirements[index].education;
    const skillList: any[] = draft.requirements[index].skills;
    educationList.forEach(() => educations.push(this.initSimpleObject()));
    skillList.forEach(() => skills.push(this.initSimpleObject()));
  }

  addRequirement(): any {
    const control = this.formGroup.controls['requirements'] as FormArray;
    control.push(this.initRequirements());
  }

  removeRequirement(i: number): any {
    const control = this.formGroup.controls['requirements'] as FormArray;
    control.removeAt(i);
  }

  _filterMainCategories(name: string): any {
    const filterValue = name.toLowerCase();
    return this.mainCategories.filter(option => option.mcategory.toLowerCase().indexOf(filterValue) === 0);
  }

  _filterSubCategories(name: string): any {
    const filterValue = name.toLowerCase();
    return this.subCategories.filter(option => option.scategory.toLowerCase().indexOf(filterValue) === 0);
  }

  getCategories(): any {
    this.service.getCategories().subscribe(resp => {
      this.mainCategories = resp.data.maincategories;
      this.filteredMainCategories = this.formGroup.controls['maincategory'].valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.mcategory),
          map(cat => cat ? this._filterMainCategories(cat) : this.mainCategories.slice())
        );
    });
  }

  getSubCategories(): any {
    this.service.getSubCategories({}).subscribe(resp => {
      this.subCategories = resp.data.subcategories;
      this.filteredSubCategories = this.formGroup.controls['subcategory'].valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.scategory),
          map(scat => scat ? this._filterSubCategories(scat) : this.subCategories.slice())
        );
    });
  }

  getNewDraftId(): any {
    this.service.getNewDraftId(this.entityId).subscribe(resp => {
      this.formGroup.controls['draftid'].patchValue(resp.data.newdraftid);
    });
  }

  submit(): any {
    if (this.formGroup.valid) {
      const formValues = Object.assign({}, this.formGroup.value);
      this.service.postDraft(this.entityId, formValues).subscribe(resp => {
        this.confirmDialog.openDialog((value) => {
          if (value) {
            const payload = {draftid: this.formGroup.value.draftid};
            this.service.createContest(this.entityId, payload).subscribe(() => this.onSuccess(), (error) => this.onError(error));
          }
        });
      });
    }
  }

  save(): any {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      const formValues = Object.assign({}, this.formGroup.value);
      if (formValues.startdate && formValues.enddate) {
        formValues.startdate = formatDate(formValues.startdate, 'MM/dd/yyyy', 'en-US');
        formValues.enddate = formatDate(formValues.enddate, 'MM/dd/yyyy', 'en-US');
      }
      this.service.postDraft(this.entityId, formValues).subscribe(() => null, (error) => this.onError(error));
    }
  }

  handleFileInput(event): any {
    this.loading = true;
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.addFile(this.entityId, formData, this.formGroup.value.draftid).subscribe(() => {
      this.getFiles();
      this.loading = false;
    }, () => {
    });
  }

  handleAbstractFileInput(event): any {
    this.loading = true;
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.addFile(this.entityId, formData, this.formGroup.value.draftid).subscribe(resp => {
      this.selectMainimage(resp.data.fileid);
      if (this.mainImageId) {
        this.removeFile(this.mainImageId);
      }
      this.loading = false;
    }, () => {
    });
  }

  getFiles(): any {
    this.service.getFiles(this.entityId, this.formGroup.value.draftid).subscribe(resp => {
      this.files = resp.data;
      this.files = this.files.filter(obj => obj.id !== this.mainImageId);
    });
  }

  removeFile(fileId): any {
    const data = {fileid: fileId, draftid: this.formGroup.value.draftid};
    this.service.removeFile(this.entityId, data).subscribe(resp => {
      this.getFiles();
    });
  }

  getUrl(id): any {
    return this.profilePictureUrl + id;
  }

  selectMainimage(id): any {
    const data = {draftid: this.formGroup.value.draftid, fileid: id};
    this.service.postMainimage(this.entityId, data).subscribe(resp => {
      this.mainImageId = id;
      this.list = [2];
    });
  }

  onSuccess(): any {
    this.snackbar.open('Operation finished successfully!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
    this.router.navigateByUrl('dashboard').then();
  }

  onError(error): any {
    this.snackbar.open('Operation Failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
    this.setServerErrors(error);
  }

  setServerErrors(error): any {
    error.data?.msg.forEach(obj => {
      this.formGroup.get(obj.param).setErrors({serverError: obj.msg});
    });
  }

  hasErrorFirstTab(): boolean {
    return this.formGroup.controls['title'].hasError('serverError') ||
      this.formGroup.controls['maincategory'].hasError('serverError') ||
      this.formGroup.controls['subcategory'].hasError('serverError') ||
      this.formGroup.controls['abstract'].hasError('serverError');
  }

  hasErrorSecondTab(): boolean {
    return this.formGroup.controls['description'].hasError('serverError');
  }

  hasErrorThirdTab(): boolean {
    return this.formGroup.controls['reward'].hasError('serverError') ||
      this.formGroup.controls['evaluation'].hasError('serverError');
  }

  goBack(): any {
    this.location.back();
  }

}
