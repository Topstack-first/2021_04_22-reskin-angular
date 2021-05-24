import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {NavigationExtras, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../auth/_services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {Token} from '../../auth/_models/auth.model';
import {MESSAGE_403} from '../const';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private readonly REFRESH_URL = `${environment.API_HOST}/user/login/`;
    private readonly REFRESH_TOKEN = 'refresh';
    private readonly ACCESS_TOKEN = 'access';

    today = new Date();
    tomorrow: Date = new Date();
    nextWeek: Date = new Date();

    navigationExtras: NavigationExtras = {
        state: {
            message: '',
            path: ''
        }
    };

    constructor(private authService: AuthService,
                private router: Router,
                private cookieService: CookieService,
                private http: HttpClient
    ) {

        this.tomorrow.setDate(this.today.getDate() + 1);
        this.nextWeek.setDate(this.today.getDate() + 7);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((error: any) => {
            let err = error.error;
            if (error.status === 0) {
                err.message = 'Connection to server failed!';
                throw(err);
            }
            if (error.status === 401) {
                if (error.error.detail && error.error.detail === 'Authentication credentials were not provided.') {
                    this.authService.logout();
                    this.router.navigate(['login/']).then();
                } else {
                    const {access, refresh} = this.authService.getCurrentTokenValue();
                    return this.http.post<Token>(this.REFRESH_URL, {refresh}).pipe(flatMap((data: any) => {
                        if (data) {
                            this.cookieService.delete(this.ACCESS_TOKEN, '/');
                            this.cookieService.delete(this.REFRESH_TOKEN, '/');

                            this.cookieService.set(this.ACCESS_TOKEN, data.access, this.nextWeek, '/', '', false, 'Strict');
                            this.cookieService.set(this.REFRESH_TOKEN, data.refresh, this.nextWeek, '/', '', false, 'Strict');

                            request = request.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${data['access']}`
                                }
                            });
                            return next.handle(request);
                        } else {
                            this.authService.logout();
                            this.router.navigate(['login/']).then();
                        }
                    }));
                }
            } else if (error.status === 400) {
                err = error.error;
            } else if (error.status === 500) {
                err = error.error;
            } else if (error.status === 403) {
                // this.authService.logout();
                // this.router.navigate(['login/']).then();
                this.navigationExtras.state['message'] = MESSAGE_403;
                this.navigationExtras.state['path'] = '/dashboard';
                this.router.navigate([`error-page/`], this.navigationExtras);
            }

            throw(err || error.statusText);
        }));
    }
}

