import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly PROFILE_URL = `${environment.API_HOST}/user/profile/`;
  private readonly WIDGETS_URL = `${environment.API_HOST}/home/widgets/`;
  private readonly CHALLENGES_COUNTS_URL = `${environment.API_HOST}/challenges/counts/`;
  private readonly CHALLENGES_PROJECTS_URL = `${environment.API_HOST}/challenges/projects/`;
  private readonly NEWSFEED_HOMEPAGE_URL = `${environment.API_HOST}/newsfeed/homepage/`;
  private readonly NEWSFEED_COUNTS_URL = `${environment.API_HOST}/newsfeed/counts/`;
  private readonly ACTIVITY_URL = `${environment.API_HOST}/user/activities/`;
  private readonly LEADERBOARD_URL = `${environment.API_HOST}/leaderboard/summary/`;
  private readonly MESSAGE_URL = `${environment.API_HOST}/home/messages/`;
  private readonly NOTIFICATION_URL = `${environment.API_HOST}/home/notifications/`;
  private readonly CHALLENGE_URL = `${environment.API_HOST}/home/challenges/`;
  private readonly BUTTON_URL = `${environment.API_HOST}/home/createcontent/`;

  constructor(private http: HttpClient) {
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.PROFILE_URL);
  }

  getWidgets(): Observable<any> {
    return this.http.get<any>(this.WIDGETS_URL);
  }

  getChallengesCounts(): Observable<any> {
    return this.http.post<any>(this.CHALLENGES_COUNTS_URL, {});
  }

  getChallengesProjects(): Observable<any> {
    return this.http.post<any>(this.CHALLENGES_PROJECTS_URL, {});
  }

  getNewsfeedHomepage(): Observable<any> {
    return this.http.post<any>(this.NEWSFEED_HOMEPAGE_URL, {});
  }

  getNewsfeedCounts(): Observable<any> {
    return this.http.get<any>(this.NEWSFEED_COUNTS_URL);
  }

  getUserActivity(): Observable<any> {
    return this.http.get<any>(this.ACTIVITY_URL);
  }

  getLeaderboard(): Observable<any> {
    return this.http.post<any>(this.LEADERBOARD_URL, {});
  }

  getMessages(): Observable<any> {
    return this.http.get<any>(this.MESSAGE_URL);
  }

  getNotifications(): Observable<any> {
    return this.http.get<any>(this.NOTIFICATION_URL);
  }

  getChallenges(): Observable<any> {
    return this.http.get<any>(this.CHALLENGE_URL);
  }

  getButtons(): Observable<any> {
    return this.http.get<any>(this.BUTTON_URL);
  }
}
