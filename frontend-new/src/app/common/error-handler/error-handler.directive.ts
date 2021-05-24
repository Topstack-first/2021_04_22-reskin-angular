import {Directive, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ErrorHandler} from './error.handler';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[handleErrors]'
})
export class ErrorHandlerDirective implements OnInit {
  @Input() private formGroup: FormGroup;
  @Input() private errors: any;

  constructor(private errorHandler: ErrorHandler) {
  }

  ngOnInit(): void {
    if (this.formGroup && this.errors) {
      console.log('Form Group inside error handler directive constr', this.formGroup);
      this.errorHandler.handleErrors(this.formGroup, this.errors);
    }
  }

}
