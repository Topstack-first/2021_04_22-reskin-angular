import {FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ControlErrorHandler {
    private errors;
    private message: string;
    private formArrayLength = 0;

    public handleErrors(form: FormGroup, errors: any): any {
        this.errors = errors;
        this.extracted(form);
    }

    private extracted(form: FormGroup): any {
        Object.keys(form.controls).forEach(controlName => {
            const control = form.controls[controlName];
            Object.defineProperty(control, 'formControlName', {value: controlName, writable: true});

            if (control instanceof FormArray) {
                this.dealWithFormArray(control);
                control.valueChanges.subscribe(() => {
                    this.dealWithFormArray(control);
                });
            }

            this.subscribeOnControlChanges(control);
        });
    }

    private dealWithFormArray(control: FormArray): any {
        const length = control.controls.length;
        if (length !== this.formArrayLength) {
            this.formArrayLength = length;
            for (let i = 0; i < length; i++) {
                Object.defineProperty(control.controls[i], 'index', {value: i, writable: true});
            }
            console.log('Form Array length has changed, length: ', this.formArrayLength);
        }
        console.log('Form Array Controls', control.controls);
    }

    private subscribeOnControlChanges(control): any {
        if (control instanceof FormArray) {
            for (const group of control.controls) {
                const formGroup = group as FormGroup;
                this.handleErrors(formGroup, this.errors);
            }
        } else if (control instanceof FormControl) {
            control.valueChanges.subscribe(() => {
                if (control.errors && (control.dirty || control.touched)) {
                    // const firstKey = Object.keys(control.errors)[0];
                    this.setErrorMessage(control.errors);
                    Object.defineProperty(this.errors, control['formControlName'], {value: this.message, writable: true});
                }
            });
        }
    }

    /**
     * Find's error type and set's a message value for this type.
     *
     * @param errors        Validation Error obj.
     */
    private setErrorMessage(errors: ValidationErrors): any {
        if (errors.serverError) {
            this.message = errors.serverError;
        } else if (errors.required) {
            this.message = 'Required field';
        } else if (errors.minlength) {
            this.message = `Minimum length ${errors.minlength.actualLength}/${errors.minlength.requiredLength}`;
        } else if (errors.maxlength) {
            this.message = `Maximum length ${errors.maxlength.actualLength}/${errors.maxlength.requiredLength}`;
        } else if (errors.email) {
            this.message = 'Email not correct';
        } else if (errors.min) {
            this.message = `Min value is ${errors.min.min}, current value ${errors.min.actual}`;
        } else if (errors.max) {
            this.message = `Max value ${errors.max.max}, current value ${errors.max.actual}`;
        } else if (errors.pattern) {
            this.message = 'Value is not correct';
        } else if (errors.passwordMismatch) {
            this.message = 'Password not the same';
        } else {
            this.message = '';
        }
    }
}
