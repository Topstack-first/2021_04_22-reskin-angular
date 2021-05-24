import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Injectable} from '@angular/core';
import {distinctUntilChanged, map} from 'rxjs/operators';


export declare interface ServerError {
    [key: string]: [];
}


@Injectable({
    providedIn: 'root'
})
export class ErrorHandler {
    private form: FormGroup;
    private serverError: any;
    private errorObject: ServerError;
    private message: string;


    private static hasError(control: AbstractControl): boolean {
        return control.invalid;
    }


    /**
     * Takes server error obj and set errors to appropriate fields at form given.
     *
     * @param serverError       Error object that is received from the server
     * @param form              Form to which errors belong to.
     */
    public organizeServerErrors(serverError: ServerError, form: FormGroup): any {
        if (serverError && typeof serverError === 'object') {
            this.form = form;
            this.serverError = serverError;
            this.setErrorToFormFields();
            this.findErrors(form.controls);
        }
    }

    /**
     * Listen's for invalid status of the form given and find's it's errors.
     *
     * @param form              Form to be listened
     * @param errorObject       Error object which to set errors.
     */
    public handleErrors(form: FormGroup, errorObject: any): any {
        this.errorObject = errorObject;
        this.findErrors(form.controls);
        form.valueChanges.pipe(
            distinctUntilChanged(),
            map(() => this.form = form))
            .subscribe(() => {
                if (form.invalid) {
                    this.findErrors(form.controls);
                }
            });
    }

    /** Finds appropriate fields on form and set's the server error. */
    private setErrorToFormFields(): any {
        Object.keys(this.serverError).forEach(field => {
            if ('message' in this.serverError[field][0]) {
                const errorMessages: any[] = this.serverError[field];
                this.form.get(field)?.setErrors({serverError: errorMessages[0].message});
            } else {
                this.setErrorsToNestedFields(field);
            }
        });
    }

    /**
     * Takes nested field name and set's server error to appropriate nested field.
     * @param nestedFieldName       Usually formControlName of a FormArray.
     */
    private setErrorsToNestedFields(nestedFieldName: string): any {
        const nestedFormErrors = this.serverError[nestedFieldName];

        Object.keys(nestedFormErrors).forEach(index => {
            const formControl = this.form.get(nestedFieldName)['controls'][index];
            const formError = this.serverError[nestedFieldName][index];
            const errorFields = Object.keys(formError);
            errorFields.forEach(errorField => {
                formControl.get(errorField)?.setErrors({serverError: formError[errorField][0].message});
            });
        });
    }

    /**
     * Find which control contains the error and set required { control -> error message } combination
     * into the errorObject given previously.
     *
     * @param controls      Abstract Controls of the form which contains errors.
     */
    private findErrors(controls: { [key: string]: AbstractControl }): any {
        Object.keys(controls).forEach((control: string) => {
            if (controls[control] instanceof FormArray) {
                Object.defineProperty(this.errorObject, control, {value: [], writable: true});
                this.findErrorsOnFormArrays(controls[control] as FormArray, control);

            } else if (controls[control] instanceof FormControl) {
                this.findErrorsOnFormControls(controls, control);
            }
        });
    }

    private findErrorsOnFormArrays(formArray: FormArray, formArrayName: string): any {
        let i = 0;
        for (const formGroup of formArray.controls as FormGroup[]) {
            const controls = formGroup.controls;
            const formArrayErrors: any[] = this.errorObject[formArrayName];
            formArrayErrors.push({});
            Object.keys(controls).forEach(control => {
                if (ErrorHandler.hasError(controls[control])) {
                    this.setErrorMessage(controls[control].errors);
                    Object.defineProperty(formArrayErrors[i], control, {value: this.message, writable: true});
                }
            });
            i++;
        }
    }

    private findErrorsOnFormControls(controls: { [key: string]: AbstractControl }, control: string): any {
        if (ErrorHandler.hasError(controls[control])) {
            this.setErrorMessage(controls[control].errors);
            this.setErrorToErrorObject(control);
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
        } else if (errors.whiteSpace) {
            this.message = 'Value cannot be empty';
        } else if (errors.passwordMismatch) {
            this.message = 'Password not the same';
        } else {
            this.message = '';
        }
    }

    /**
     * Set's a new property to errorObject with key from the field's name and error message as a value.
     * @param field         Field which contains error.
     */
    private setErrorToErrorObject(field: string): any {
        Object.defineProperty(this.errorObject, field, {value: this.message, writable: true});
    }
}
