import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EntityHomepageService } from '../../_services/entity-homepage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContestService } from '../../../contest/_services/contest.service';
import { DraftListComponent as ContestDraftListComponent } from '../../../contest/_components/draft-list/draft-list.component';
import { DraftListComponent as ArticleDraftListComponent } from '../../../article/_components/draft-list/draft-list.component';
import { ArticleService } from '../../../article/_services/article.service';
import { CommonService } from '../../../common/_services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { ProfileService } from '../../../profile/_services/profile.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

  entityId;
  entity;
  newsfeeds;
  contests = []
  projects;
  jobs;
  people = [];
  logoRefresh = [1];
  mainImageRefresh = [1];
  hasLogo = false;
  hasMainImage = false;
  // mainImageId = null;
  pictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';
  messageForm: FormGroup;
  shareForm: FormGroup;
  sendForm: FormGroup;
  newsfeedShareForm: FormGroup;
  commentForm: FormGroup;
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  myShareSets;
  myNetwork;
  comments: Array<any>;

  selectedTab = 'newsfeed';

  watcher: Subscription;
  isMobile = false;

  constructor(private service: EntityHomepageService,
    private userService: ProfileService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private contestService: ContestService,
    private articleService: ArticleService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private mediaObserver: MediaObserver,
  ) {
    this.matIconRegistry.addSvgIcon("postSettings", domSanitizer.bypassSecurityTrustResourceUrl("/assets/post-settings.svg"))
    this.matIconRegistry.addSvgIcon("like", domSanitizer.bypassSecurityTrustResourceUrl("/assets/like.svg"))
    this.matIconRegistry.addSvgIcon("comment", domSanitizer.bypassSecurityTrustResourceUrl("/assets/comment.svg"))
    this.matIconRegistry.addSvgIcon("share", domSanitizer.bypassSecurityTrustResourceUrl("/assets/share.svg"))
    this.matIconRegistry.addSvgIcon("send", domSanitizer.bypassSecurityTrustResourceUrl("/assets/send.svg"))
    this.matIconRegistry.addSvgIcon("post-image", domSanitizer.bypassSecurityTrustResourceUrl("/assets/post-image.svg"))
    this.matIconRegistry.addSvgIcon("instagram", domSanitizer.bypassSecurityTrustResourceUrl("/assets/mobile-icon/instagram.svg"))
    this.matIconRegistry.addSvgIcon("facebook", domSanitizer.bypassSecurityTrustResourceUrl("/assets/mobile-icon/facebook.svg"))
    this.matIconRegistry.addSvgIcon("twitter", domSanitizer.bypassSecurityTrustResourceUrl("/assets/mobile-icon/twitter.svg"))
    this.matIconRegistry.addSvgIcon("crown", domSanitizer.bypassSecurityTrustResourceUrl("/assets/crown.svg"))


    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.isMobile = change.mqAlias == 'xs'
    })


    this.entityId = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe(params => {
      this.entityId = params.id;
      this.getAllData();
    });
    this.commonService.changeData(true);

    this.messageForm = fb.group({
      subject: [''],
      message: ['']
    });

    this.shareForm = fb.group({
      person: [null],
      mynetwork: [null]
    });

    this.sendForm = fb.group({
      userid: [null],
    });

    this.newsfeedShareForm = fb.group({
      mynetwork: [null]
    });

    this.commentForm = fb.group({
      comment: ['']
    });
  }

  ngOnInit(): void {
  }

  getAllData(): any {
    // this.getMainImage();
    this.getEntity();
    this.getNewsfeed();
    this.getContests();
    this.getProjects();
    this.getJobs();
    this.getPeople();

    this.getMyShareSets();
    this.getMyNetwork();
  }

  // getMainImage(): any {
  //   this.service.transform(this.getMainImageUrl()).subscribe(resp => {
  //     // this.mainImageUrl = resp['changingThisBreaksApplicationSecurity'];
  //     this.mainImageId = true;
  //   }, () => this.mainImageId = false);
  // }

  getEntity(): any {
    this.service.getEntity(this.entityId).subscribe(resp => {
      this.entity = resp.data[0];
      if (this.entity.logofileid) {
        this.hasLogo = true;
        this.logoRefresh = [2];
      } else {
        this.hasLogo = false;
        this.logoRefresh = [2];
      }

      if (this.entity.mainimage) {
        this.hasMainImage = true;
        this.mainImageRefresh = [2];
      } else {
        this.hasMainImage = false;
        this.mainImageRefresh = [2];
      }
    });
  }

  getNewsfeed(): any {
    this.service.getNewsfeed(this.entityId).subscribe(resp => this.newsfeeds = resp.data.newsfeed);
  }

  getContests(): any {
    this.service.getContests(this.entityId).subscribe(resp => this.contests = resp.data);
  }

  getProjects(): any {
    this.service.getProjects(this.entityId).subscribe(resp => this.projects = resp.data);
  }

  getJobs(): any {
    this.service.getJobs(this.entityId).subscribe(resp => this.jobs = resp.data);
  }

  getPeople(): any {
    this.service.getPeople(this.entityId).subscribe(resp => this.people = resp.data);
  }

  getLogoUrl(): string {
    return this.pictureUrl + this.entity.logofileid;
  }

  getUrl(id): any {
    return this.pictureUrl + id;
  }

  createArticle(): any {
    this.articleService.getDrafts(this.entityId).subscribe(resp => {
      if (resp.data.length !== 0) {
        this.dialog.open(ArticleDraftListComponent, {
          width: '600px',
          data: { drafts: resp.data, entityId: this.entityId },
          autoFocus: false,
        });
      } else {
        this.router.navigate(['article/form', { id: 0, entityId: this.entityId }]).then();
      }
    });
  }

  createContest(): any {
    this.contestService.getDrafts(this.entityId).subscribe(resp => {
      if (resp.data.length !== 0) {
        this.dialog.open(ContestDraftListComponent, {
          width: '600px',
          data: { drafts: resp.data, entityId: this.entityId },
          autoFocus: false,
        });
      } else {
        this.router.navigate(['contest/form', { id: 0, entityId: this.entityId }]).then();
      }
    });
  }

  readArticleContest(id, type): any {
    if (type === 'article') {
      this.router.navigate(['article/read', { id, entityId: this.entityId }]).then();
    } else {
      this.router.navigate(['contest/read', { id, entityId: this.entityId }]).then();
    }
  }

  changeLogo(event): any {
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.changeLogo(formData, this.entityId).subscribe(resp => {
      this.entity.logofileid = resp.logofileid;
      this.logoRefresh = [3];
      this.hasLogo = true;
    }, () => {
    });
  }

  changeMainImage(event): any {
    const formData: FormData = new FormData();
    const file: File = event.target.files[0];
    formData.append('filecontent', file, file.name);
    this.service.changeMainImage(formData, this.entityId).subscribe(resp => {
      this.entity.mainimage = resp.logofileid;
      this.mainImageRefresh = [3];
      this.hasMainImage = true;
    }, () => {
    });
  }

  followUnfollow(): any {
    if (this.entity.following) {
      this.service.unfollow(this.entityId).subscribe(() => this.entity.following = !this.entity.following);
    } else {
      this.service.follow(this.entityId).subscribe(() => this.entity.following = !this.entity.following);
    }
  }

  report(): any {
    this.service.reportAbuse(this.entityId).subscribe();
  }

  sendMessage(): any {
    this.service.message(this.entityId, this.messageForm.value).subscribe(() => {
      // this.trigger.closeMenu();
      this.trigger.toArray()[1].closeMenu();
      this.snackbar.open('Message Sent!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      this.messageForm.reset();
    }, () => {
      this.snackbar.open('Message Failed To Send!', 'Close', { duration: 3000, panelClass: 'danger-snackbar' });
    });
  }

  share(): any {
    this.service.entityShare(this.entityId, this.shareForm.value).subscribe(() => {
      // this.trigger.closeMenu();
      this.trigger.toArray()[0].closeMenu();
      this.snackbar.open('Shared Successfully!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      this.shareForm.reset();
    }, () => {
      this.snackbar.open('Sharing Failed!', 'Close', { duration: 3000, panelClass: 'danger-snackbar' });
    });
  }

  _filterShareSets(name: string): any {
    const filterValue = name.toLowerCase();
    return this.myShareSets.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getMyShareSets(): any {
    this.userService.getMyShareSets().subscribe(resp => {
      this.myShareSets = resp.data.entities;
      // this.filteredShareSets = this.shareForm.controls['person'].valueChanges
      //   .pipe(
      //     startWith(''),
      //     map(value => typeof value === 'string' ? value : value.name),
      //     map(name => name ? this._filterShareSets(name) : this.myShareSets.slice())
      //   );
    });
  }

  getMyNetwork(): any {
    this.userService.getMyNetwork({}).subscribe(resp => this.myNetwork = resp.data.entities);
  }

  getComments(id): any {
    this.service.getComments(id).subscribe(resp => this.comments = resp.data.comments);
  }

  comment(id): any {
    this.service.postComment(id, this.commentForm.value).subscribe(resp => {
      this.trigger.toArray()[4].closeMenu();
      this.snackbar.open('Comment Added!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      this.commentForm.reset();
    }, () => {
      this.snackbar.open('Comment Failed!', 'Close', { duration: 3000, panelClass: 'danger-snackbar' });
    });
  }

  shareNewsfeed(): any {
    this.service.newsfeedShare(this.entityId, this.newsfeedShareForm.value).subscribe(() => {
      this.trigger.toArray()[5].closeMenu();
      this.snackbar.open('Shared Successfully!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      this.shareForm.reset();
    }, () => {
      this.snackbar.open('Sharing Failed!', 'Close', { duration: 3000, panelClass: 'danger-snackbar' });
    });
  }

  send(): any {
    this.service.send(this.entityId, this.sendForm.value).subscribe(() => {
      this.trigger.toArray()[6].closeMenu();
      this.snackbar.open('Message Sent!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      this.sendForm.reset();
    }, () => {
      this.snackbar.open('Message Failed To Send!', 'Close', { duration: 3000, panelClass: 'danger-snackbar' });
    });
  }

  likeUnlike(newsfeed): any {
    if (newsfeed.entity.is_liked) {
      this.service.unlike(newsfeed.objectd).subscribe(resp => newsfeed.entity.is_liked = !newsfeed.entity.is_liked);
    } else {
      this.service.like(newsfeed.objectd).subscribe(resp => newsfeed.entity.is_liked = !newsfeed.entity.is_liked);
    }
  }

  onSuccess(): any {
    this.snackbar.open('Operation finished successfully!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
  }

  onError(error): any {
    this.snackbar.open('Operation Failed!', 'Close', { duration: 3000, panelClass: 'danger-snackbar' });
  }

  newsFeed() {
    this.selectedTab = 'newsfeed'
  }

  profile() {
    this.selectedTab = "profile"
  }

  createContent() {
    this.selectedTab = "content"
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

}
