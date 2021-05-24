import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {Token} from '../_models/auth.model';
import {CookieService} from 'ngx-cookie-service';
import {NgxPermissionsService} from 'ngx-permissions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = 'access';
  private readonly CURRENT_EMAIL = 'email';
  private readonly LOGIN_URL = `${environment.API_HOST}/user/login/`;
  private readonly SIGNUP_URL = `${environment.API_HOST}/user/register/`;
  private readonly PROFILE_PICTURE_UPLOAD_URL = `${environment.API_HOST}/files/uploadprofilepicture/`;
  private readonly PROFILE_STATE_URL = `${environment.API_HOST}/user/profilestate/`;
  private readonly PROFILE_URL = `${environment.API_HOST}/user/profile/`;
  private readonly ACTIVATE_PROFILE_URL = `${environment.API_HOST}/user/activateprofile/`;
  private readonly NEW_PIN_CODE_URL = `${environment.API_HOST}/user/getnewpincode/`;
  private currentTokenSubject: BehaviorSubject<Token>;
  private currentToken: Observable<Token>;
  private httpWithoutInterceptor;

  today = new Date();
  tomorrow: Date = new Date();
  nextWeek: Date = new Date();

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private httpBackEnd: HttpBackend,
    private cookieService: CookieService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
  ) {
    const access = this.cookieService.get(this.ACCESS_TOKEN);
    const email = this.cookieService.get(this.CURRENT_EMAIL);

    this.tomorrow.setDate(this.today.getDate() + 1);
    this.nextWeek.setDate(this.today.getDate() + 7);

    this.currentTokenSubject = new BehaviorSubject<Token>({access, email});
    this.currentToken = this.currentTokenSubject.asObservable();
    this.httpWithoutInterceptor = new HttpClient(httpBackEnd);
  }

  public getCurrentTokenValue(): any {
    return this.cookieService.getAll();
  }

  public login({email, password}): any {
    return this.http.post<Token>(this.LOGIN_URL, {email, password}).pipe(
      map(data => {
        if (data['data']['token']) {
          const token = data['data']['token'];
          this.cookieService.set(this.ACCESS_TOKEN, token, this.nextWeek, '/', '', false, 'Strict');
          this.currentTokenSubject.next(token);
        }
        return data;
      })
    );
  }

  isLoggedInPermissions(): any {
    // if user is logged it, request for its permissions
    if (this.cookieService.check(this.ACCESS_TOKEN)) {
      const profileState = this.cookieService.get('profile_state');
      this.permissionsService.addPermission(profileState);
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  setTokenToCookies(token: Token): any {
    this.cookieService.set(this.ACCESS_TOKEN, token.access, this.nextWeek, '/', '', false, 'Strict');
    // this.cookieService.set(this.CURRENT_EMAIL, token.email, this.nextWeek, '/', '', false, 'Strict');
  }

  signup(email: string, password: string): Observable<any> {
    return this.http.post(this.SIGNUP_URL, {email, password}).pipe(
      map(data => {
        if (data['data']['token']) {
          const token = data['data']['token'];
          this.cookieService.set(this.ACCESS_TOKEN, token, this.nextWeek, '/', '', false, 'Strict');
          this.currentTokenSubject.next(token);
        }
      })
    );
  }

  public logout(): any {
    this.cookieService.deleteAll('/');
    this.permissionsService.flushPermissions();
    this.currentTokenSubject.next(null);
  }

  public changePassword(data): any {
    return this.http.put('', data).pipe(
      catchError(this.handleError(`changePassword`, null))
    );
  }

  public uploadProfilePicture(data): Observable<any> {
    return this.http.post(this.PROFILE_PICTURE_UPLOAD_URL, data);
  }

  public postProfileState(data): Observable<any> {
    return this.http.post<any>(this.PROFILE_STATE_URL, data);
  }

  public getProfileState(): Observable<any> {
    return this.http.get<any>(this.PROFILE_STATE_URL);
  }

  public getProfile(): Observable<any> {
    return this.http.get<any>(this.PROFILE_URL);
  }

  public activateProfile(data): Observable<any> {
    return this.http.post<any>(this.ACTIVATE_PROFILE_URL, data);
  }

  public getNewPinCode(): Observable<any> {
    return this.http.get<any>(this.NEW_PIN_CODE_URL);
  }

  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      throw error;
    };
  }
}
