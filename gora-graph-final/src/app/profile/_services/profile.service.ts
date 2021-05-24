import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly USER_PROFILE_URL = `${environment.API_HOST}/user/profile/`;
  private readonly UPLOAD_PROFILE_PICTURE_URL = `${environment.API_HOST}/files/uploadprofilepicture/`;
  private readonly USER_INTRO_URL = `${environment.API_HOST}/user/intro/`;
  private readonly USER_EXPERIENCE_URL = `${environment.API_HOST}/user/experience/`;
  private readonly USER_SORT_EXPERIENCE_URL = `${environment.API_HOST}/user/sort/experience/`;
  private readonly USER_EXPERIENCE_REMOVE_URL = `${environment.API_HOST}/user/experience/remove/`;
  private readonly USER_EDUCATION_URL = `${environment.API_HOST}/user/education/`;
  private readonly USER_SORT_EDUCATION_URL = `${environment.API_HOST}/user/sort/education/`;
  private readonly USER_EDUCATION_REMOVE_URL = `${environment.API_HOST}/user/education/remove/`;
  private readonly USER_QUALIFICATION_URL = `${environment.API_HOST}/user/qualification/`;
  private readonly USER_SORT_QUALIFICATION_URL = `${environment.API_HOST}/user/sort/qualification/`;
  private readonly USER_QUALIFICATION_REMOVE_URL = `${environment.API_HOST}/user/qualification/remove/`;
  private readonly USER_PORTFOLIO_URL = `${environment.API_HOST}/user/portfolio/`;
  private readonly USER_SORT_PORTFOLIO_URL = `${environment.API_HOST}/user/sort/portfolio/`;
  private readonly USER_PORTFOLIO_REMOVE_URL = `${environment.API_HOST}/user/portfolio/remove/`;
  private readonly USER_SKILL_URL = `${environment.API_HOST}/user/skills/`;
  private readonly USER_SORT_SKILL_URL = `${environment.API_HOST}/user/sort/skills/`;
  private readonly USER_SKILL_REMOVE_URL = `${environment.API_HOST}/user/skills/remove/`;
  private readonly SKILL_INDUSTRY_URL = `${environment.API_HOST}/user/skills/industries/`;
  private readonly SKILL_SEARCH_URL = `${environment.API_HOST}/user/skills/search/`;
  private readonly ENTITY_INDUSTRY_URL = `${environment.API_HOST}/entity/industries/`;
  private readonly ACADEMIC_DISCIPLINES_URL = `${environment.API_HOST}/entity/academic/disciplines/`;
  private readonly GET_ENTITY_URL = `${environment.API_HOST}/entity/get/`;
  private readonly CREATE_ENTITY_URL = `${environment.API_HOST}/entity/create/`;
  private readonly UPLOAD_LOGO_URL = `${environment.API_HOST}/entity/uploadlogo/`;
  private readonly GET_LOGO_URL = `${environment.API_HOST}/entity/getlogo/`;
  private readonly ORGANIZATION_TYPE_URL = `${environment.API_HOST}/entity/organizationtypes/`;
  private readonly ORGANIZATION_LEGAL_TYPE_URL = `${environment.API_HOST}/entity/organizationlegaltypes/`;
  private readonly MY_NETWORK_URL = `${environment.API_HOST}/user/mynetwork/`;
  private readonly MY_SHARE_SETS_URL = `${environment.API_HOST}/user/mysharesets/`;


  constructor(private http: HttpClient) {
  }

  postUserProfile(data): Observable<any> {
    return this.http.post<any>(this.USER_PROFILE_URL, data);
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.USER_PROFILE_URL);
  }

  uploadProfilePicture(data): Observable<any> {
    return this.http.post<any>(this.UPLOAD_PROFILE_PICTURE_URL, data);
  }

  postUserIntro(data): Observable<any> {
    return this.http.post<any>(this.USER_INTRO_URL, data);
  }

  getUserIntro(): Observable<any> {
    return this.http.get<any>(this.USER_INTRO_URL);
  }

  postUserExperience(data): Observable<any> {
    return this.http.post<any>(this.USER_EXPERIENCE_URL, data);
  }

  getUserExperience(): Observable<any> {
    return this.http.get<any>(this.USER_EXPERIENCE_URL);
  }

  removeUserExperience(id): Observable<any> {
    return this.http.get<any>(`${this.USER_EXPERIENCE_REMOVE_URL}${id}`);
  }

  sortUserExperience(data): Observable<any> {
    return this.http.post<any>(this.USER_SORT_EXPERIENCE_URL, data);
  }

  postUserEducation(data): Observable<any> {
    return this.http.post<any>(this.USER_EDUCATION_URL, data);
  }

  getUserEducation(): Observable<any> {
    return this.http.get<any>(this.USER_EDUCATION_URL);
  }

  removeUserEducation(id): Observable<any> {
    return this.http.get<any>(`${this.USER_EDUCATION_REMOVE_URL}${id}`);
  }

  sortUserEducation(data): Observable<any> {
    return this.http.post<any>(this.USER_SORT_EDUCATION_URL, data);
  }

  postUserQualification(data): Observable<any> {
    return this.http.post<any>(this.USER_QUALIFICATION_URL, data);
  }

  getUserQualification(): Observable<any> {
    return this.http.get<any>(this.USER_QUALIFICATION_URL);
  }

  removeUserQualification(id): Observable<any> {
    return this.http.get<any>(`${this.USER_QUALIFICATION_REMOVE_URL}${id}`);
  }

  sortUserQualification(data): Observable<any> {
    return this.http.post<any>(this.USER_SORT_QUALIFICATION_URL, data);
  }

  postUserPortfolio(data): Observable<any> {
    return this.http.post<any>(this.USER_PORTFOLIO_URL, data);
  }

  getUserPortfolio(): Observable<any> {
    return this.http.get<any>(this.USER_PORTFOLIO_URL);
  }

  removeUserPortfolio(id): Observable<any> {
    return this.http.get<any>(`${this.USER_PORTFOLIO_REMOVE_URL}${id}`);
  }

  sortUserPortfolio(data): Observable<any> {
    return this.http.post<any>(this.USER_SORT_PORTFOLIO_URL, data);
  }

  postUserSkills(data): Observable<any> {
    return this.http.post<any>(this.USER_SKILL_URL, data);
  }

  getUserSkills(): Observable<any> {
    return this.http.get<any>(this.USER_SKILL_URL);
  }

  removeUserSkills(id): Observable<any> {
    return this.http.get<any>(`${this.USER_SKILL_REMOVE_URL}${id}`);
  }

  sortUserSkills(data): Observable<any> {
    return this.http.post<any>(this.USER_SORT_SKILL_URL, data);
  }

  searchSkillIndustries(data): Observable<any> {
    return this.http.post<any>(this.SKILL_INDUSTRY_URL, data);
  }

  searchSkills(data): Observable<any> {
    return this.http.post<any>(this.SKILL_SEARCH_URL, data);
  }

  searchEntityIndustries(data): Observable<any> {
    return this.http.post<any>(this.ENTITY_INDUSTRY_URL, data);
  }

  searchAcademicDisciplines(data): Observable<any> {
    return this.http.post<any>(this.ACADEMIC_DISCIPLINES_URL, data);
  }

  getEntity(id): Observable<any> {
    return this.http.get<any>(`${this.GET_ENTITY_URL}${id}`);
  }

  createEntity(data): Observable<any> {
    return this.http.post<any>(this.CREATE_ENTITY_URL, data);
  }

  uploadLogo(data): Observable<any> {
    return this.http.post<any>(this.UPLOAD_LOGO_URL, data);
  }

  getOrgTypes(): Observable<any> {
    return this.http.get<any>(this.ORGANIZATION_TYPE_URL);
  }

  getOrgLegalTypes(): Observable<any> {
    return this.http.get<any>(this.ORGANIZATION_LEGAL_TYPE_URL);
  }

  getMyShareSets(): Observable<any> {
    return this.http.get<any>(this.MY_SHARE_SETS_URL);
  }

  getMyNetwork(data): Observable<any> {
    return this.http.post<any>(this.MY_NETWORK_URL, data);
  }
}
