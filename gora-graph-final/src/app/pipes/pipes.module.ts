import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurePipe} from './pipes/secure.pipe';
import {CustomDatePipe} from './pipes/custom-date.pipe';
import {FileSizePipe} from './pipes/file-size.pipe';



@NgModule({
  declarations: [SecurePipe, CustomDatePipe, FileSizePipe],
  imports: [
    CommonModule
  ],
  exports: [
    SecurePipe,
    CustomDatePipe,
    FileSizePipe
  ]
})
export class PipesModule { }
