import {Component, OnInit} from '@angular/core';
import {base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform} from 'ngx-image-cropper';
import {ProfileService} from '../../_services/profile.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  error = false;
  errorMessage = 'Max 1000x1000 and 100 kB';

  constructor(private service: ProfileService,
              private dialogRef: MatDialogRef<ImageCropperComponent>,
              private snackbar: MatSnackBar) {
  }

  save(): any {
    const formData: FormData = new FormData();
    const file = base64ToFile(this.croppedImage) as File;
    formData.append('filecontent', file, file.name);
    this.service.uploadProfilePicture(formData).subscribe(() => this.onSuccess(), () => this.onError());
  }


  close(): any {
    this.dialogRef.close({hasOperations: false});
  }

  onSuccess(): any {
    this.snackbar.open('Operation finished successfully!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
    this.dialogRef.close({hasOperations: true});
  }

  onError(): any {
    this.snackbar.open('Operation Failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): any {
    this.croppedImage = event.base64;
    // console.log(event, base64ToFile(event.base64));

    const file = base64ToFile(event.base64) as File;
    this.error = !(event.width <= 1000 && event.height <= 1000 && file.size <= 100000);
  }

  imageLoaded(): any {
    this.showCropper = true;
    // console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions): any {
    // console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed(): any {
    // console.log('Load failed');
  }

  rotateLeft(): any {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight(): any {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate(): any {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal(): any {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical(): any {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage(): any {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  slideZoom(event): any {
    this.scale = event;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  // zoomOut(): any {
  //   this.scale -= .1;
  //   console.log(this.scale);
  //   this.transform = {
  //     ...this.transform,
  //     scale: this.scale
  //   };
  // }
  //
  // zoomIn(): any {
  //   this.scale += .1;
  //   console.log(this.scale);
  //   this.transform = {
  //     ...this.transform,
  //     scale: this.scale
  //   };
  // }

  toggleContainWithinAspectRatio(): any {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation(): any {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  ngOnInit(): void {
  }

}
