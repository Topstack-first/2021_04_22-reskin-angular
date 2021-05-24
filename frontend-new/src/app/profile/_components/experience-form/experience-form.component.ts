import {Component, Inject, OnInit} from '@angular/core';
import {MONTHS} from '../../../common/const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProfileService} from '../../_services/profile.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-experience-form',
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss']
})
export class ExperienceFormComponent implements OnInit {

  months = MONTHS;
  years = [];
  experienceForm: FormGroup;

  constructor(private fb: FormBuilder,
              private service: ProfileService,
              private dialogRef: MatDialogRef<ExperienceFormComponent>,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.experienceForm = this.fb.group({
      eid: [''],
      sequential: [1],
      position: [''],
      company: [''],
      fromyear: [null],
      toyear: [null],
      frommonth: [''],
      tomonth: [''],
      iscurrent: [0],
    });


    if (data) {
      this.experienceForm.patchValue(data);
    } else {
      this.experienceForm.removeControl('eid');
    }
  }

  ngOnInit(): void {
    const date = new Date();
    for (let i = date.getFullYear(); i > 1950; i--) {
      this.years.push(i);
    }
  }

  submit(): void {
    if (this.experienceForm.valid) {
      this.service.postUserExperience(this.experienceForm.value).subscribe(resp => this.onSuccess(), error => this.onError(error));
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
