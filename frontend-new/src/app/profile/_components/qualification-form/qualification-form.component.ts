import {Component, Inject, OnInit} from '@angular/core';
import {MONTHS} from '../../../common/const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProfileService} from '../../_services/profile.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-qualification-form',
  templateUrl: './qualification-form.component.html',
  styleUrls: ['./qualification-form.component.scss']
})
export class QualificationFormComponent implements OnInit {

  months = MONTHS;
  years = [];
  qualificationForm: FormGroup;

  constructor(private fb: FormBuilder,
              private service: ProfileService,
              private dialogRef: MatDialogRef<QualificationFormComponent>,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.qualificationForm = this.fb.group({
      qid: [''],
      sequential: [1],
      description: [''],
      organization: [''],
      summary: [''],
      foryear: [null],
      certid: [''],
      certurl: [''],
      iscurrent: [0]
    });


    if (data) {
      this.qualificationForm.patchValue(data);
    } else {
      this.qualificationForm.removeControl('qid');
    }
  }

  ngOnInit(): void {
    const date = new Date();
    for (let i = date.getFullYear(); i > 1950; i--) {
      this.years.push(i);
    }
  }

  submit(): void {
    if (this.qualificationForm.valid) {
      this.service.postUserQualification(this.qualificationForm.value).subscribe(resp => this.onSuccess(), error => this.onError(error));
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
