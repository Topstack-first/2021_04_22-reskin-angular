import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DashboardService} from '../../_services/dashboard.service';
import {MatDialog} from '@angular/material/dialog';
import {DraftListComponent as ArticleDraftListComponent} from '../../../article/_components/draft-list/draft-list.component';
import {ContestService} from '../../../contest/_services/contest.service';
import {DraftListComponent as ContestDraftListComponent} from '../../../contest/_components/draft-list/draft-list.component';
import {ArticleService} from '../../../article/_services/article.service';
import {Router} from '@angular/router';
import {CommonService} from '../../../common/_services/common.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatMenuTrigger} from '@angular/material/menu';
import {EntityHomepageService} from '../../../entity-homepage/_services/entity-homepage.service';
import {ProfileService} from '../../../profile/_services/profile.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  profile;
  entityId;
  data;
  challengesCounts;
  projects;
  newsfeedCounts;
  newsfeedHomepage;
  skills;
  achievements;
  leaderboard;
  articleButton: boolean;
  contestButton: boolean;
  projectButton: boolean;

  profileInterval;
  challengeInterval;
  newsfeedInterval;
  activityInterval;
  leaderboardInterval;
  createcontentInterval;

  url = 'https://app1.a-gora.com/api/v1/files/download/';
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';
  sendForm: FormGroup;
  shareForm: FormGroup;
  commentForm: FormGroup;
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  myShareSets;
  myNetwork;
  comments: Array<any>;

  constructor(private service: DashboardService,
              private entityService: EntityHomepageService,
              private userService: ProfileService,
              private commonService: CommonService,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private snackbar: MatSnackBar,
              private articleService: ArticleService,
              private contestService: ContestService,
              private router: Router) {
    this.commonService.changeData(false);

    this.sendForm = fb.group({
      userid: [null],
    });

    this.shareForm = fb.group({
      mynetwork: [null]
    });

    this.commentForm = fb.group({
      comment: ['']
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.activityInterval);
    clearInterval(this.newsfeedInterval);
    clearInterval(this.profileInterval);
    clearInterval(this.challengeInterval);
    clearInterval(this.leaderboardInterval);
    clearInterval(this.createcontentInterval);
  }

  ngOnInit(): void {
    this.getButtons();
    this.getWidgets();
    this.getUserProfile();
    this.getChallenges();
    this.getNewsfeed();
    this.getActivities();
    this.getLeaderboard();

    this.getMyShareSets();
    this.getMyNetwork();
  }

  getUrl(id): any {
    return this.profilePictureUrl + id;
  }

  getWidgets(): any {
    const leftcolumn = document.getElementById('leftcolumn');
    const rightcolumn = document.getElementById('rightcolumn');
    const widgets = {};
    this.service.getWidgets().subscribe(resp => {
      this.data = resp.data;
      this.data.sort((a, b) => (a.screenorder > b.screenorder) ? 1 : -1);

      for (const obj of this.data) {
        widgets[obj.widgetname] = +obj.reloadrate;
        if (obj.screenorder <= 3) {
          const element = document.getElementById(obj.widgetname);
          element.style.display = 'block';
          leftcolumn.append(element);
        } else if (obj.screenorder > 3 && obj.screenorder <= 6) {
          const element = document.getElementById(obj.widgetname);
          element.style.display = 'block';
          rightcolumn.append(element);
        }
      }

      if (widgets['challengesboard'] !== 0) {
        this.challengeInterval = setInterval(() => this.getChallenges(), widgets['challengesboard'] * 1000);
      }

      if (widgets['profile'] !== 0) {
        this.profileInterval = setInterval(() => this.getUserProfile(), widgets['profile'] * 1000);
      }

      if (widgets['newsfeed'] !== 0) {
        this.newsfeedInterval = setInterval(() => this.getNewsfeed(), widgets['newsfeed'] * 1000);
      }

      if (widgets['activities'] !== 0) {
        this.activityInterval = setInterval(() => this.getActivities(), widgets['activities'] * 1000);
      }

      if (widgets['leaderboard'] !== 0) {
        this.leaderboardInterval = setInterval(() => this.getLeaderboard(), widgets['leaderboard'] * 1000);
      }

      if (widgets['createcontent'] !== 0) {
        this.createcontentInterval = setInterval(() => this.getButtons(), widgets['createcontent'] * 1000);
      }
    });
  }

  getUserProfile(): any {
    this.service.getUserProfile().subscribe(resp => {
      this.profile = resp.data;
      this.entityId = this.profile.entityid;
    });
  }

  getChallengesCounts(): any {
    this.service.getChallengesCounts().subscribe(resp => this.challengesCounts = resp['data'][0]);
  }

  getChallengesProjects(): any {
    this.service.getChallengesProjects().subscribe(resp => this.projects = resp['data']['projects']);
  }

  getChallenges(): any {
    this.getChallengesCounts();
    this.getChallengesProjects();
  }

  getNewsfeedCounts(): any {
    this.service.getNewsfeedCounts().subscribe(resp => this.newsfeedCounts = resp['data']);
  }

  getNewsfeedHomepage(): any {
    this.service.getNewsfeedHomepage().subscribe(resp => {
      if (JSON.stringify(resp['data']['newsfeed']) !== JSON.stringify(this.newsfeedHomepage)) {
        this.newsfeedHomepage = resp['data']['newsfeed'];
      }
    });
  }

  getNewsfeed(): any {
    this.getNewsfeedCounts();
    this.getNewsfeedHomepage();
  }

  getActivities(): any {
    this.service.getUserActivity().subscribe(resp => {
      this.skills = resp.skills;
      this.achievements = resp.achievements;
    });
  }

  createArticle(): any {
    this.articleService.getDrafts(this.entityId).subscribe(resp => {
      if (resp.data.length !== 0) {
        this.dialog.open(ArticleDraftListComponent, {
          width: '600px',
          data: {drafts: resp.data, entityId: this.entityId},
          autoFocus: false,
        });
      } else {
        this.router.navigate(['article/form', {id: 0, entityId: this.entityId}]).then();
      }
    });
  }

  readArticleContest(id, type): any {
    if (type === 'article') {
      this.router.navigate(['article/read', {id, entityId: this.entityId}]).then();
    } else {
      this.router.navigate(['contest/read', {id, entityId: this.entityId}]).then();
    }
  }

  createContest(): any {
    this.contestService.getDrafts(this.entityId).subscribe(resp => {
      if (resp.data.length !== 0) {
        this.dialog.open(ContestDraftListComponent, {
          width: '600px',
          data: {drafts: resp.data, entityId: this.entityId},
          autoFocus: false,
        });
      } else {
        this.router.navigate(['contest/form', {id: 0, entityId: this.entityId}]).then();
      }
    });
  }

  getLeaderboard(): any {
    this.service.getLeaderboard().subscribe(resp => this.leaderboard = resp['data']['feeds']);
  }

  getButtons(): any {
    this.service.getButtons().subscribe(resp => {
      this.articleButton = resp['data']['article'];
      this.contestButton = resp['data']['quest'];
      this.projectButton = resp['data']['project'];
    });
  }

  send(): any {
    this.entityService.send(this.entityId, this.sendForm.value).subscribe(() => {
      this.trigger.toArray()[7].closeMenu();
      this.snackbar.open('Message Sent!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
      this.sendForm.reset();
    }, () => {
      this.snackbar.open('Message Failed To Send!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
    });
  }

  share(): any {
    this.entityService.newsfeedShare(this.entityId, this.shareForm.value).subscribe(() => {
      this.trigger.toArray()[6].closeMenu();
      this.snackbar.open('Shared Successfully!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
      this.shareForm.reset();
    }, () => {
      this.snackbar.open('Sharing Failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
    });
  }

  getMyShareSets(): any {
    this.userService.getMyShareSets().subscribe(resp => this.myShareSets = resp.data.entities);
  }

  getMyNetwork(): any {
    this.userService.getMyNetwork({}).subscribe(resp => this.myNetwork = resp.data.entities);
  }

  getComments(id): any {
    this.entityService.getComments(id).subscribe(resp => this.comments = resp.data.comments);
  }

  comment(id): any {
    this.entityService.postComment(id, this.commentForm.value).subscribe(resp => {
      this.trigger.toArray()[5].closeMenu();
      this.snackbar.open('Comment Added!', 'Close', {duration: 3000, panelClass: 'success-snackbar'});
      this.commentForm.reset();
    }, () => {
      this.snackbar.open('Comment Failed!', 'Close', {duration: 3000, panelClass: 'danger-snackbar'});
    });
  }

  likeUnlike(newsfeed): any {
    if (newsfeed.entity.is_liked) {
      this.entityService.unlike(newsfeed.objectd).subscribe(resp => newsfeed.entity.is_liked = !newsfeed.entity.is_liked);
    } else {
      this.entityService.like(newsfeed.objectd).subscribe(resp => newsfeed.entity.is_liked = !newsfeed.entity.is_liked);
    }
  }
}

