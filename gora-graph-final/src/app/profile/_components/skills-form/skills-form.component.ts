import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MONTHS} from '../../../common/const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProfileService} from '../../_services/profile.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
export class SkillsFormComponent implements OnInit {

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;

  months = MONTHS;
  years = [];
  skillsForm: FormGroup;
  industries: Observable<string[]>;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skills: Observable<string[]>;
  selectedSkills: string[] = [];

  constructor(private fb: FormBuilder,
              private service: ProfileService,
              private dialogRef: MatDialogRef<SkillsFormComponent>,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.skillsForm = this.fb.group({
      sid: [''],
      sequential: [1],
      industry: [''],
      skills: [''],
    });


    if (data) {
      this.skillsForm.patchValue(data);
      this.skillsForm.controls['skills'].patchValue('');
      this.selectedSkills = this.data.skills.map(value => value.skill);
    } else {
      this.skillsForm.removeControl('sid');
    }
  }

  ngOnInit(): void {
    const date = new Date();
    for (let i = date.getFullYear(); i > 1950; i--) {
      this.years.push(i);
    }

    this.industries = this.skillsForm.controls['industry'].valueChanges.pipe(
      startWith(''),
      map(value => this.getIndustryPredictions(value)));

    this.skills = this.skillsForm.controls['skills'].valueChanges.pipe(
      startWith(''),
      map(value => this.getSkillsPredictions(value)));
  }

  getIndustryPredictions(input: string): Array<any> {
    const list = [];
    this.service.searchSkillIndustries({srch: input}).subscribe(response => {
      response['data'].forEach(item => list.push(item.industry));
    });
    return list;
  }

  getSkillsPredictions(input: string): Array<any> {
    const list = [];
    this.service.searchSkills({srch: input, industry: this.skillsForm.value.industry}).subscribe(response => {
      response['data'].forEach(item => list.push(item.skill));
    });
    return list;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add skill
    if ((value || '').trim()) {
      this.selectedSkills.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: string): void {
    const index = this.selectedSkills.indexOf(skill);

    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedSkills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillsForm.controls['skills'].patchValue('');
  }

  submit(): void {
    if (this.skillsForm.valid) {
      this.skillsForm.removeControl('skills');
      const formValues = Object.assign({}, this.skillsForm.value);
      formValues['skills'] = this.selectedSkills.map(value => {
        return {skill: value};
      });
      this.service.postUserSkills(formValues).subscribe(resp => this.onSuccess(), error => this.onError(error));
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
