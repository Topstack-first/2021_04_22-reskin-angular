import {Component, Inject, OnInit} from '@angular/core';
import {MONTHS} from '../../../common/const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProfileService} from '../../_services/profile.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-portfolio-form',
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.scss']
})
export class PortfolioFormComponent implements OnInit {

  months = MONTHS;
  years = [];
  portfolioForm: FormGroup;

  constructor(private fb: FormBuilder,
              private service: ProfileService,
              private dialogRef: MatDialogRef<PortfolioFormComponent>,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.portfolioForm = this.fb.group({
      pid: [''],
      sequential: [1],
      title: [''],
      description: [''],
    });


    if (data) {
      this.portfolioForm.patchValue(data);
    } else {
      this.portfolioForm.removeControl('pid');
    }
  }

  ngOnInit(): void {
    const date = new Date();
    for (let i = date.getFullYear(); i > 1950; i--) {
      this.years.push(i);
    }
  }

  submit(): void {
    if (this.portfolioForm.valid) {
      this.service.postUserPortfolio(this.portfolioForm.value).subscribe(resp => this.onSuccess(), error => this.onError(error));
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
