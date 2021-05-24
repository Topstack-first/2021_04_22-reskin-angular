import {Component, Inject, OnInit} from '@angular/core';
import {MONTHS} from '../../../common/const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProfileService} from '../../_services/profile.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements OnInit {

  months = MONTHS;
  years = [];
  educationForm: FormGroup;

  constructor(private fb: FormBuilder,
              private service: ProfileService,
              private dialogRef: MatDialogRef<EducationFormComponent>,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.educationForm = this.fb.group({
      eid: [''],
      sequential: [1],
      country: [''],
      entityname: [''],
      degree: [''],
      fieldofstudy: [''],
      fromyear: [null],
      toyear: [null],
      frommonth: [''],
      tomonth: [''],
      isexpected: [0]
    });


    if (data) {
      this.educationForm.patchValue(data);
    } else {
      this.educationForm.removeControl('eid');
    }
  }

  ngOnInit(): void {
    const date = new Date();
    for (let i = date.getFullYear(); i > 1950; i--) {
      this.years.push(i);
    }
  }

  submit(): void {
    if (this.educationForm.valid) {
      this.service.postUserEducation(this.educationForm.value).subscribe(resp => this.onSuccess(), error => this.onError(error));
    }
  }

  close(): any {
    this.dialogRef.close({hasOperations: false});
  }

  onSuccess(): any {
    this.snackbar.open('Operation finished successfully!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
    this.dialogRef.close({hasOperations: true});
  }

  onError(error): any {
    this.snackbar.open('Operation failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
  }

}
