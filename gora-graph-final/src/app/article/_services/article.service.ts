import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private readonly CATEGORY_URL = `${environment.API_HOST}/entity/%entityId%/articles/category/`;
  private readonly PUBLICATION_TYPE_URL = `${environment.API_HOST}/entity/%entityId%/articles/types/`;
  private readonly VISIBILITY_URL = `${environment.API_HOST}/entity/%entityId%/articles/visibilities/`;
  private readonly POST_DRAFT_URL = `${environment.API_HOST}/entity/%entityId%/articles/draft/`;
  private readonly GET_DRAFTS_URL = `${environment.API_HOST}/entity/%entityId%/articles/getdrafts/`;
  private readonly GET_DRAFT_URL = `${environment.API_HOST}/entity/%entityId%/articles/getdraft/`;
  private readonly GET_ARTICLE_URL = `${environment.API_HOST}/entity/%entityId%/articles/read/`;
  private readonly NEW_DRAFT_URL = `${environment.API_HOST}/entity/%entityId%/articles/getnewdraftid/`;
  private readonly CREATE_ARTICLE_URL = `${environment.API_HOST}/entity/%entityId%/articles/create/`;
  private readonly GET_FILES_URL = `${environment.API_HOST}/entity/%entityId%/articles/getfiles/`;
  private readonly ADD_FILE_URL = `${environment.API_HOST}/entity/%entityId%/articles/addfile/`;
  private readonly REMOVE_FILE_URL = `${environment.API_HOST}/entity/%entityId%/articles/removefile/`;
  private readonly DELETE_DRAFT_URL = `${environment.API_HOST}/entity/%entityId%/articles/discard/`;
  private readonly DRAFT_MAINIMAGE_URL = `${environment.API_HOST}/entity/%entityId%/articles/draft/mainimage/`;
  private readonly COMMENTS_URL = `${environment.API_HOST}/entity/%entityId%/articles/comments/`;

  constructor(private http: HttpClient) {
  }

  getCategories(entityId): Observable<any> {
    return this.http.get<any>(this.CATEGORY_URL.replace('%entityId%', entityId));
  }

  getPublicationTypes(entityId): Observable<any> {
    return this.http.get<any>(this.PUBLICATION_TYPE_URL.replace('%entityId%', entityId));
  }

  getVisibilities(entityId): Observable<any> {
    return this.http.get<any>(this.VISIBILITY_URL.replace('%entityId%', entityId));
  }

  getDrafts(entityId): Observable<any> {
    return this.http.get<any>(this.GET_DRAFTS_URL.replace('%entityId%', entityId));
  }

  getDraft(entityId, id): Observable<any> {
    return this.http.get<any>(`${this.GET_DRAFT_URL}${id}/`.replace('%entityId%', entityId));
  }

  getArticle(entityId, id): Observable<any> {
    return this.http.get<any>(`${this.GET_ARTICLE_URL}${id}/`.replace('%entityId%', entityId));
  }

  postDraft(entityId, data): Observable<any> {
    return this.http.post<any>(this.POST_DRAFT_URL.replace('%entityId%', entityId), data);
  }

  getNewDraftId(entityId): Observable<any> {
    return this.http.get<any>(this.NEW_DRAFT_URL.replace('%entityId%', entityId));
  }

  createArticle(entityId, data): Observable<any> {
    return this.http.post<any>(this.CREATE_ARTICLE_URL.replace('%entityId%', entityId), data);
  }

  getFiles(entityId, draftId): Observable<any> {
    return this.http.get<any>(`${this.GET_FILES_URL}${draftId}`.replace('%entityId%', entityId));
  }

  addFile(entityId, data, id): Observable<any> {
    return this.http.post<any>(`${this.ADD_FILE_URL}${id}`.replace('%entityId%', entityId), data);
  }

  removeFile(entityId, data): Observable<any> {
    return this.http.post<any>(this.REMOVE_FILE_URL.replace('%entityId%', entityId), data);
  }

  deleteDraft(entityId, id): Observable<any> {
    return this.http.post<any>(`${this.DELETE_DRAFT_URL}${id}`.replace('%entityId%', entityId), {});
  }

  postMainimage(entityId, data): Observable<any> {
    return this.http.post<any>(this.DRAFT_MAINIMAGE_URL.replace('%entityId%', entityId), data);
  }

  getComments(entityId, draftId): Observable<any> {
    return this.http.get<any>(`${this.COMMENTS_URL}${draftId}`.replace('%entityId%', entityId));
  }
}
