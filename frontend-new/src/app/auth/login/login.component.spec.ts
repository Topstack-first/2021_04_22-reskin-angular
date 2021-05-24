import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {Component} from '@angular/core';
import {of, throwError} from 'rxjs';
import {ErrorHandler} from '../../common/error-handler/error.handler';
import {Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: { login, logout };
  let errorHandler: ErrorHandler;
  let helper: Helper;
  let router: Router;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthSmService', ['login', 'logout']);
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(
          [{path: 'agent/sale/list', component: DummyComponent}]
        ),
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    errorHandler = TestBed.inject(ErrorHandler);
    helper = new Helper(fixture);
    router = TestBed.inject(Router);
  });

  describe('Initial Value Tests', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initiate loginForm', () => {
      expect(component.loginForm).toBeDefined();
    });

    it('should have email and password as controls', () => {
      expect(component.loginForm.contains('email')).toBe(true);
      expect(component.loginForm.contains('password')).toBe(true);
    });

    it('#returnUrl should have `agent/sale/list` as initial value', () => {
      expect(component.returnUrl).toBe('agent/sale/list/');
    });

    it('should call `onFormValueChanges` after initialization', () => {
      spyOn(component, 'onFormValueChanges');
      component.ngOnInit();
      expect(component.onFormValueChanges).toHaveBeenCalledTimes(1);
    });

  });

  describe('Submit of Login Form', () => {

    it('should NOT call service if form is invalid', () => {
      expect(component.loginForm.invalid).toBe(true);
      component.login();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should call #handleErrors when invalid form has been submit', () => {
      expect(component.loginForm.invalid).toBe(true);
      spyOn(errorHandler, 'handleErrors');
      component.login();

      expect(errorHandler.handleErrors).toHaveBeenCalledTimes(1);
    });

    it('should call login if form is valid', async(() => {
      helper.makeSuccessfulLogin(authServiceSpy);
      fixture.whenStable().then(() => {
        expect(component.loginForm.invalid).toBe(false);
        expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm.value);
      });
    }));

    it('#login should call #onSuccess when response is successful', fakeAsync(() => {
      spyOn(component, 'onSuccess');
      helper.makeSuccessfulLogin(authServiceSpy);

      expect(component.onSuccess).toHaveBeenCalledTimes(1);
    }));

    it('should call #onError when response is NOT successful', fakeAsync(() => {
      fixture.componentInstance.loginForm.patchValue({email: 'test@test.com', password: 'password'});
      authServiceSpy.login.and.returnValue(throwError({}));
      spyOn(component, 'onError');
      fixture.componentInstance.login();

      expect(component.onError).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Additional Methods', () => {

    it('#onFormValueChanges should set server error to null', () => {
      component.errors.serverError = 'just a value';
      component.loginForm.patchValue({email: 'different.email'});

      expect(component.errors.serverError).toBe(null);
    });

    it('#onFormValueChanges should set errorMessage to null on form value changes', () => {
      component.errorMessage = 'an error message';
      component.loginForm.patchValue({email: 'different.email'});

      expect(component.errorMessage).toBe(null);
    });

    it('#onSuccess should navigate to `returnUrl` ', async(() => {
      spyOn(router, 'navigate').and.returnValue(of(true).toPromise());
      component.onSuccess();

      fixture.whenStable().then(() => {
        expect(router.navigate).toHaveBeenCalledWith([component.returnUrl]);
      });
    }));

    it('#onError should call organizeServerErrors', () => {
      spyOn(errorHandler, 'organizeServerErrors');
      const error = {errors: null};
      component.onError(error);

      expect(errorHandler.organizeServerErrors).toHaveBeenCalledTimes(1);
      expect(errorHandler.organizeServerErrors).toHaveBeenCalledWith(error.errors, component.loginForm);
    });

    it('#onError should assign errorMessage with `error.message` ', () => {
      const error = {message: 'error message'};
      component.onError(error);

      expect(component.errorMessage).toBe(error.message);
    });
  });
});


class Helper {
  fixture: ComponentFixture<LoginComponent>;

  constructor(fixture: ComponentFixture<LoginComponent>) {
    this.fixture = fixture;
  }

  /**
   * Helper function to make a successful login
   */
  makeSuccessfulLogin(authServiceSpy) {
    this.fixture.componentInstance.loginForm.patchValue({email: 'test@test.com', password: 'password'});
    this.fixture.detectChanges();
    authServiceSpy.login.and.returnValue(of({}));
    this.fixture.componentInstance.login();
  }
}


@Component({template: ''})
class DummyComponent {
}
