import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EntityHomepageService {

  private readonly ENTITY_URL = `${environment.API_HOST}/entity/`;
  private readonly NEWSFEED_URL = `${environment.API_HOST}/newsfeed/`;


  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private cookieService: CookieService) {
  }

  getEntity(id): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${id}/read/`);
  }

  getNewsfeed(id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/newsfeed/`, {});
  }

  getContests(id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/contests/`, {});
  }

  getProjects(id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/projects/`, {});
  }

  getJobs(id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/jobs/`, {});
  }

  getPeople(id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/people/`, {});
  }

  changeLogo(data, id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/changelogo/`, data);
  }

  changeMainImage(data, id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/changemainimage/`, data);
  }

  follow(id): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${id}/follow/`);
  }

  unfollow(id): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${id}/unfollow/`);
  }

  reportAbuse(id): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${id}/reportabuse/`);
  }

  message(id, data): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/message/`, data);
  }

  entityShare(id, data): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${id}/share/`, data);
  }

  getComments(id): Observable<any> {
    return this.http.get(`${this.NEWSFEED_URL}${id}/comments/`);
  }

  postComment(id, data): Observable<any> {
    return this.http.post(`${this.NEWSFEED_URL}${id}/comment/`, data);
  }

  send(id, data): Observable<any> {
    return this.http.post(`${this.NEWSFEED_URL}${id}/send/`, data);
  }

  newsfeedShare(id, data): Observable<any> {
    return this.http.post(`${this.NEWSFEED_URL}${id}/share/`, data);
  }

  like(id): Observable<any> {
    return this.http.get(`${this.NEWSFEED_URL}${id}/likeit/`);
  }

  unlike(id): Observable<any> {
    return this.http.get(`${this.NEWSFEED_URL}${id}/unlikeit/`);
  }


  transform(url): Observable<SafeUrl> {
    const access = this.cookieService.get('access');
    return this.http.get(url, {responseType: 'blob', headers: {'agora-sec-token': access}}).pipe(
      map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))));
  }
}
