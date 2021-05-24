import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { COMPLETED_STATE } from '../../../common/const';
import { ProfileService } from '../../_services/profile.service';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { OrganizationEntityComponent } from '../organization-entity/organization-entity.component';
import { UserEntityComponent } from '../user-entity/user-entity.component';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  profileForm: FormGroup;
  loading = false;
  COMPLETED = COMPLETED_STATE;
  hasProfilePicture = false;
  errors: any = {};
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';
  list = [1];

  constructor(
    private fb: FormBuilder,
    private service: ProfileService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {

    this.matIconRegistry.addSvgIcon('company', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/company.svg'))
    this.matIconRegistry.addSvgIcon('crown-small', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/crown-small.svg'))

    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.getInitialData();
  }

  getInitialData(): any {
    this.service.getUserProfile().subscribe(resp => {
      this.profileForm.patchValue(resp['data']);
      if (resp['data']['profilepicture']) {
        this.hasProfilePicture = true;
      }
    });
  }

  submit(): any {
    if (this.profileForm.valid) {
      this.loading = true;
      const formValues = Object.assign({}, this.profileForm.value);
      this.service.postUserProfile(formValues)
        .subscribe(
          () => {
            this.onSuccess()
            this.loading = false

          },
          (error) => this.onError(error));
    } else {
      this.loading = false;
    }
  }

  handleFileInput(event): any {
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.uploadProfilePicture(formData).subscribe(() => {
      this.list = [2];
    }, () => {
    });
  }

  openOrganizationEntity(): any {
    this.router.navigate(['/organization'])
  }

  openUserEntity(): any {
    this.router.navigate(['/expert'])
  }

  openImageCropper(): any {
    this.dialog.open(ImageCropperComponent, { width: '800px', autoFocus: false, maxHeight: '80vh', maxWidth: '100%' })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.list = [3];
        }
      });
  }


  onSuccess(): any {
    this.snackbar.open('Operation finished successfully!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
  }

  onError(error): any {
    this.snackbar.open('Operation Failed!', 'Close', { duration: 3000, panelClass: 'danger-snackbar' });
  }
}
