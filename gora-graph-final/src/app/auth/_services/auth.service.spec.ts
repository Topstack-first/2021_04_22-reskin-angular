import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {environment} from '../../../environments/environment';
import {Token} from '../_models/auth.model';

describe('AuthService', () => {
    let authService: AuthService;
    let cookieService: CookieService;

    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                ReactiveFormsModule,
                RouterTestingModule
            ]
        });
        authService = TestBed.inject(AuthService);
        cookieService = TestBed.inject(CookieService);

        httpTestingController = TestBed.inject(HttpTestingController);
    });

    describe('Initial Values Tests', () => {
        const today = new Date();

        it('should be created', () => {
            expect(authService).toBeTruthy();
        });

        it('should set tomorrow variable correctly', () => {
            expect(authService.tomorrow.getFullYear()).toBe(today.getFullYear());
            expect(authService.tomorrow.getMonth()).toBe(today.getMonth());
            expect(authService.tomorrow.getDate()).toBe(today.getDate() + 1);
        });

        it('should set nextWeek variable correctly', () => {
            expect(authService.nextWeek.getFullYear()).toBe(today.getFullYear());
            expect(authService.nextWeek.getMonth()).toBe(today.getMonth());
            expect(authService.nextWeek.getDate()).toBe(today.getDate() + 7);
        });
    });

    describe('Cookie Tests', () => {
        it('should get all cookies from CookieService', () => {
            spyOn(cookieService, 'getAll');
            authService.getCurrentTokenValue();
            expect(cookieService.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('Login Tests', () => {
        const loginUrl = `${environment.API_HOST}/user/login/`;
        const loginData = {email: 'test@test.com', password: 'password'};
        const responseData: Token = {access: '', email: ''};

        beforeEach(() => {
        });

        afterEach(() => {
            httpTestingController.verify();
        });

        it('should call http.post with email and password in body', () => {
            authService.login(loginData).subscribe(response => {
                expect(response).toBe(undefined);
            });

            const req = httpTestingController.expectOne(loginUrl);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(loginData);

            req.flush(responseData);
        });

        it('should call setTokenToCookies with response data', () => {
            spyOn(authService, 'setTokenToCookies');
            authService.login(loginData).subscribe();

            const req = httpTestingController.expectOne(loginUrl);
            req.flush(responseData);

            expect(authService.setTokenToCookies).toHaveBeenCalledWith(responseData);
            expect(authService.setTokenToCookies).toHaveBeenCalledTimes(1);
        });

        it('should NOT call setTokenToCookies if response is null', () => {
            spyOn(authService, 'setTokenToCookies');
            authService.login(loginData).subscribe();

            const req = httpTestingController.expectOne(loginUrl);
            req.flush(null);

            expect(authService.setTokenToCookies).not.toHaveBeenCalled();
        });

    });

    describe('Logout Tests', () => {

        it('should delete all cookies', () => {
            spyOn(cookieService, 'deleteAll');
            authService.logout();
            expect(cookieService.deleteAll).toHaveBeenCalledWith('/');
        });

        it('should delete current groups if there are groups in cookies', () => {
            spyOn(cookieService, 'check').and.returnValue(true);
            spyOn(cookieService, 'delete');
            authService.logout();

            expect(cookieService.delete).toHaveBeenCalled();
        });
    });

    describe('Password Tests', () => {
        const changePasswordUrl = `${environment.API_HOST}/auth/change-password/`;

        beforeEach(() => {
        });

        afterEach(() => {
            httpTestingController.verify();
        });

        it('should put data to change password', () => {
            const passwordData = {};
            authService.changePassword(passwordData).subscribe(response => {
                expect(response).toEqual(passwordData);
            });

            const req = httpTestingController.expectOne(changePasswordUrl);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(passwordData);

            req.flush(passwordData);
        });
    });

    describe('Get Tests', () => {
        beforeEach(() => {
        });

        afterEach(() => {
            httpTestingController.verify();
        });
    });
});
