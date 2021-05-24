import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ProfileService} from '../../_services/profile.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-organization-entity',
  templateUrl: './organization-entity.component.html',
  styleUrls: ['./organization-entity.component.scss']
})
export class OrganizationEntityComponent implements OnInit {

  form: FormGroup;
  industries: Observable<string[]>;
  disciplines: Observable<string[]>;
  isEducational = false;
  list = [];
  orgLegalTypes;
  orgTypes;
  loading = false;
  logoUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';

  constructor(private fb: FormBuilder,
              private service: ProfileService,
              private snackbar: MatSnackBar,
              private router: Router,
              private dialogRef: MatDialogRef<OrganizationEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      orgtype: [null],
      orgname: [''],
      description: [''],
      website: [''],
      publicurls: this.fb.array([
        this.initPublicUrl()
      ]),
      industry: [''],
      academicdiscipline: [''],
      isinstitution: [''],
      legaltype: [''],
      logofileid: ['']
    });
  }

  ngOnInit(): void {
    this.getOrgTypes();
    this.getOrgLegalTypes();

    this.form.controls['orgtype'].valueChanges.subscribe(value => {
      this.form.controls['orgname'].patchValue('');
      this.form.controls['description'].patchValue('');
      this.form.controls['website'].patchValue('');
      this.form.controls['publicurls'].reset();
      this.form.controls['industry'].patchValue('');
      this.form.controls['academicdiscipline'].patchValue('');
      this.form.controls['isinstitution'].patchValue('');
      this.form.controls['legaltype'].patchValue('');
      this.form.controls['logofileid'].patchValue('');
      this.list = [];
      if (value === 'Educational institution') {
        this.isEducational = true;
        this.form.controls['isinstitution'].patchValue(1);
        this.disciplines = this.form.controls['academicdiscipline'].valueChanges.pipe(
          startWith(''),
          map(val => this.getAcademicPredictions(val)));
      } else {
        this.isEducational = false;
        this.form.controls['isinstitution'].patchValue(0);
        this.industries = this.form.controls['industry'].valueChanges.pipe(
          startWith(''),
          map(val => this.getIndustryPredictions(val)));
      }
    });
  }

  getIndustryPredictions(input: string): Array<any> {
    const list = [];
    this.service.searchEntityIndustries({srch: input}).subscribe(response => {
      response['data'].forEach(item => list.push(item.industry));
    });
    return list;
  }

  getAcademicPredictions(input: string): Array<any> {
    const list = [];
    this.service.searchAcademicDisciplines({srch: input}).subscribe(response => {
      response['data'].forEach(item => list.push(item.academicdiscipline));
    });
    return list;
  }

  getOrgLegalTypes(): any {
    this.service.getOrgLegalTypes().subscribe(resp => this.orgLegalTypes = resp['data']);
  }

  getOrgTypes(): any {
    this.service.getOrgTypes().subscribe(resp => this.orgTypes = resp['data']);
  }

  handleFileInput(event): any {
    this.loading = true;
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.uploadLogo(formData).subscribe(resp => {
      this.form.controls['logofileid'].patchValue(resp['logofileid']);
      this.list = [1];
      this.loading = false;
    }, () => {
    });
  }

  getUrl(): string {
    return this.logoUrl + this.form.controls['logofileid'].value;
  }

  submit(): any {
    this.service.createEntity(this.form.value).subscribe((resp) => this.onSuccess(resp), (error) => this.onError(error));
  }

  initPublicUrl(): any {
    return this.fb.group({
      name: [''],
      url: ['']
    });
  }

  addPublicUrl(): any {
    const control = this.form.controls['publicurls'] as FormArray;
    control.push(this.initPublicUrl());
  }

  removePublicUrl(i: number): any {
    const control = this.form.controls['publicurls'] as FormArray;
    control.removeAt(i);
  }

  close(): any {
    this.dialogRef.close({hasOperations: false});
  }

  onSuccess(resp): any {
    this.snackbar.open('Operation finished successfully!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
    this.dialogRef.close({hasOperations: true});
    this.router.navigateByUrl(`entity/homepage/${resp.entityid}`);
  }

  onError(error): any {
    this.snackbar.open('Operation Failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
    this.setServerErrors(error);
  }

  setServerErrors(error): any {
    error.data?.msg.forEach(obj => {
      this.form.get(obj.param).setErrors({serverError: obj.msg});
    });
  }

}
