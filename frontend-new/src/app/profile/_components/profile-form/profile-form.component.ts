import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileService} from '../../_services/profile.service';
import {COMPLETED_STATE} from '../../../common/const';
import {UserEntityComponent} from '../user-entity/user-entity.component';
import {OrganizationEntityComponent} from '../organization-entity/organization-entity.component';
import {ImageCropperComponent} from '../image-cropper/image-cropper.component';

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

  constructor(private dialogRef: MatDialogRef<ProfileFormComponent>,
              private fb: FormBuilder,
              private service: ProfileService,
              private snackbar: MatSnackBar,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {

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
      this.service.postUserProfile(formValues).subscribe(() => this.onSuccess(), (error) => this.onError(error));
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
    this.close();
    this.dialog.open(OrganizationEntityComponent, {width: '600px', autoFocus: false, disableClose: true});
  }

  openUserEntity(): any {
    this.close();
    this.dialog.open(UserEntityComponent, {width: '800px', autoFocus: false, maxHeight: '80vh', maxWidth: '100%'});
  }

  openImageCropper(): any {
    this.dialog.open(ImageCropperComponent, {width: '800px', autoFocus: false, maxHeight: '80vh', maxWidth: '100%'})
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.list = [3];
        }
      });
  }


  close(): any {
    this.dialogRef.close({hasOperations: false});
  }

  onSuccess(): any {
    this.snackbar.open('Operation finished successfully!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
    this.dialogRef.close({hasOperations: true});
  }

  onError(error): any {
    this.snackbar.open('Operation Failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
  }
}
