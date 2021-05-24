import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MONTHS} from '../../../common/const';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatStepper} from '@angular/material/stepper';
import {ProfileService} from '../../_services/profile.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ExperienceFormComponent} from '../experience-form/experience-form.component';
import {EducationFormComponent} from '../education-form/education-form.component';
import {QualificationFormComponent} from '../qualification-form/qualification-form.component';
import {PortfolioFormComponent} from '../portfolio-form/portfolio-form.component';
import {DialogConfirmComponent} from '../../../common/dialog-confirm/dialog-confirm.component';
import {SkillsFormComponent} from '../skills-form/skills-form.component';

@Component({
  selector: 'app-user-entity',
  templateUrl: './user-entity.component.html',
  styleUrls: ['./user-entity.component.scss'],
  providers: [DialogConfirmComponent]
})
export class UserEntityComponent implements OnInit {

  @ViewChild('stepper', {static: true}) stepper: MatStepper;

  introForm: FormGroup;

  experiences;
  educations;
  qualifications;
  portfolios;
  skills;

  months = MONTHS;
  years = [];

  constructor(private fb: FormBuilder,
              private service: ProfileService,
              private dialog: MatDialog,
              private deleteDialog: DialogConfirmComponent,
              private dialogRef: MatDialogRef<UserEntityComponent>) {

    this.introForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      title: [''],
      summary: ['']
    });

  }

  ngOnInit(): void {
    this.getIntro();
    this.getExperience();
    this.getEducation();
    this.getQualification();
    this.getPortfolio();
    this.getSkills();

    const date = new Date();
    for (let i = date.getFullYear(); i > 1950; i--) {
      this.years.push(i);
    }
  }

  getIntro(): void {
    this.service.getUserIntro().subscribe(resp => this.introForm.patchValue(resp['data']['result'][0]));
  }

  getExperience(): void {
    this.service.getUserExperience().subscribe(resp => this.experiences = resp['data']['result']);
  }

  getEducation(): void {
    this.service.getUserEducation().subscribe(resp => this.educations = resp['data']['result']);
  }

  getQualification(): void {
    this.service.getUserQualification().subscribe(resp => this.qualifications = resp['data']['result']);
  }

  getPortfolio(): void {
    this.service.getUserPortfolio().subscribe(resp => this.portfolios = resp['data']['result']);
  }

  getSkills(): void {
    this.service.getUserSkills().subscribe(resp => this.skills = resp['data']['result']);
  }

  submitIntro(): void {
    if (this.introForm.valid) {
      this.service.postUserIntro(this.introForm.value).subscribe(resp => {
        this.stepper.next();
      });
    }
  }

  dropExperience(event: CdkDragDrop<string[]>): any {
    moveItemInArray(this.experiences, event.previousIndex, event.currentIndex);
    const sortedArray = [];
    for (let i = 0; i < this.experiences.length; i++) {
      sortedArray.push({id: this.experiences[i]['eid'], seqnum: i});
    }
    this.service.sortUserExperience({data: sortedArray}).subscribe(resp => this.getExperience());
  }

  dropEducation(event: CdkDragDrop<string[]>): any {
    moveItemInArray(this.educations, event.previousIndex, event.currentIndex);
    const sortedArray = [];
    for (let i = 0; i < this.educations.length; i++) {
      sortedArray.push({id: this.educations[i]['eid'], seqnum: i});
    }
    this.service.sortUserEducation({data: sortedArray}).subscribe(resp => this.getEducation());
  }

  dropQualification(event: CdkDragDrop<string[]>): any {
    moveItemInArray(this.qualifications, event.previousIndex, event.currentIndex);
    const sortedArray = [];
    for (let i = 0; i < this.qualifications.length; i++) {
      sortedArray.push({id: this.qualifications[i]['qid'], seqnum: i});
    }
    this.service.sortUserQualification({data: sortedArray}).subscribe(resp => this.getQualification());
  }

  dropPortfolio(event: CdkDragDrop<string[]>): any {
    moveItemInArray(this.portfolios, event.previousIndex, event.currentIndex);
    const sortedArray = [];
    for (let i = 0; i < this.portfolios.length; i++) {
      sortedArray.push({id: this.portfolios[i]['pid'], seqnum: i});
    }
    this.service.sortUserPortfolio({data: sortedArray}).subscribe(resp => this.getPortfolio());
  }

  dropSkills(event: CdkDragDrop<string[]>): any {
    moveItemInArray(this.skills, event.previousIndex, event.currentIndex);
    const sortedArray = [];
    for (let i = 0; i < this.skills.length; i++) {
      sortedArray.push({id: this.skills[i]['sid'], seqnum: i});
    }
    this.service.sortUserSkills({data: sortedArray}).subscribe(resp => this.getSkills());
  }

  openExperienceForm(experience): any {
    this.dialog.open(ExperienceFormComponent, {width: '600px', data: experience, disableClose: true})
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.getExperience();
        }
      });
  }

  openEducationForm(education): any {
    this.dialog.open(EducationFormComponent, {width: '600px', data: education, disableClose: true})
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.getEducation();
        }
      });
  }

  openQualificationForm(qualification): any {
    this.dialog.open(QualificationFormComponent, {width: '600px', data: qualification, disableClose: true})
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.getQualification();
        }
      });
  }

  openPortfolioForm(portfolio): any {
    this.dialog.open(PortfolioFormComponent, {width: '600px', data: portfolio, disableClose: true})
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.getPortfolio();
        }
      });
  }

  openSkillsForm(skills): any {
    this.dialog.open(SkillsFormComponent, {width: '600px', data: skills, autoFocus: false, disableClose: true})
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.getSkills();
        }
      });
  }

  deleteExperience(id): any {
    this.deleteDialog.message = 'Are you sure you want to remove this Experience?';
    this.deleteDialog.openDialog((value) => {
      if (value) {
        this.service.removeUserExperience(id)
          .subscribe(() => {
            this.getExperience();
          }, () => {
          });
      }
    });
  }

  deleteEducation(id): any {
    this.deleteDialog.message = 'Are you sure you want to remove this Education?';
    this.deleteDialog.openDialog((value) => {
      if (value) {
        this.service.removeUserEducation(id)
          .subscribe(() => {
            this.getEducation();
          }, () => {
          });
      }
    });
  }

  deleteQualification(id): any {
    this.deleteDialog.message = 'Are you sure you want to remove this Qualification?';
    this.deleteDialog.openDialog((value) => {
      if (value) {
        this.service.removeUserQualification(id)
          .subscribe(() => {
            this.getQualification();
          }, () => {
          });
      }
    });
  }

  deletePortfolio(id): any {
    this.deleteDialog.message = 'Are you sure you want to remove this Portfolio?';
    this.deleteDialog.openDialog((value) => {
      if (value) {
        this.service.removeUserPortfolio(id)
          .subscribe(() => {
            this.getPortfolio();
          }, () => {
          });
      }
    });
  }

  deleteSkill(id): any {
    this.deleteDialog.message = 'Are you sure you want to remove this Skill?';
    this.deleteDialog.openDialog((value) => {
      if (value) {
        this.service.removeUserSkills(id)
          .subscribe(() => {
            this.getSkills();
          }, () => {
          });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
