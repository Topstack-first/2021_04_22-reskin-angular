import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  private ENTITY_URL = `${environment.API_HOST}/entity/`;

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}contest/maincategories/`);
  }

  getSubCategories(data): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}contest/subcategories/`, data);
  }

  getDrafts(entityId): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${entityId}/contest/getdrafts/`);
  }

  getDraft(entityId, id): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${entityId}/contest/getdraft/${id}/`);
  }

  getContest(entityId, id): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${entityId}/contest/read/${id}/`);
  }

  postDraft(entityId, data): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${entityId}/contest/draft/`, data);
  }

  getNewDraftId(entityId): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${entityId}/contest/getnewdraftid/`);
  }

  createContest(entityId, data): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${entityId}/contest/create/`, data);
  }

  getFiles(entityId, draftId): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${entityId}/contest/getfiles/${draftId}/`);
  }

  addFile(entityId, data, id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${entityId}/contest/addfile/${id}/`, data);
  }

  removeFile(entityId, data): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${entityId}/contest/removefile`, data);
  }

  deleteDraft(entityId, id): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${entityId}/contest/discard/${id}/`, {});
  }

  postMainimage(entityId, data): Observable<any> {
    return this.http.post<any>(`${this.ENTITY_URL}${entityId}/contest/draft/mainimage`, data);
  }

  getComments(entityId, draftId): Observable<any> {
    return this.http.get<any>(`${this.ENTITY_URL}${entityId}/contest/comments/${draftId}/`);
  }
}
