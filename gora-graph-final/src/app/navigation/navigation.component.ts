import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/_services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../dashboard/_components/notification-dialog/notification-dialog.component';
import { MailDialogComponent } from '../dashboard/_components/mail-dialog/mail-dialog.component';
import { ChallengesDialogComponent } from '../dashboard/_components/challenges-dialog/challenges-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { DashboardService } from '../dashboard/_services/dashboard.service';
import { ProfileFormComponent } from '../profile/_components/profile-form/profile-form.component';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { COMPLETED_STATE } from '../common/const';
import { EntityHomepageService } from '../entity-homepage/_services/entity-homepage.service';
import { CommonService } from '../common/_services/common.service';
import { DashboardComponent } from '../dashboard/_components/dashboard/dashboard.component';
import { HomepageComponent } from '../entity-homepage/_components/homepage/homepage.component';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {

  today = new Date();
  nextWeek: Date = new Date();
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';
  pictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';
  isEntity = false;
  entityId;
  hasLogo = true;

  constructor(private authService: AuthService,
    private dashboardService: DashboardService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private entityService: EntityHomepageService,
    private cookieService: CookieService,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private permissionsService: NgxPermissionsService,
    private overlay: Overlay) {

    this.matIconRegistry.addSvgIcon("search", domSanitizer.bypassSecurityTrustResourceUrl("/assets/menu-icon/search.svg"))
    this.matIconRegistry.addSvgIcon("language", domSanitizer.bypassSecurityTrustResourceUrl("/assets/menu-icon/language.svg"))
    this.matIconRegistry.addSvgIcon("challenge", domSanitizer.bypassSecurityTrustResourceUrl("/assets/menu-icon/challenge.svg"))
    this.matIconRegistry.addSvgIcon("d-arrow", domSanitizer.bypassSecurityTrustResourceUrl("/assets/menu-icon/d-arrow.svg"))
    this.matIconRegistry.addSvgIcon("activity", domSanitizer.bypassSecurityTrustResourceUrl("/assets/menu-icon/activity.svg"))
    this.matIconRegistry.addSvgIcon("bell", domSanitizer.bypassSecurityTrustResourceUrl("/assets/menu-icon/bell.svg"))
    this.matIconRegistry.addSvgIcon("message", domSanitizer.bypassSecurityTrustResourceUrl("/assets/menu-icon/message.svg"))
    this.matIconRegistry.addSvgIcon("home", domSanitizer.bypassSecurityTrustResourceUrl("/assets/home.svg"))
    this.matIconRegistry.addSvgIcon("polls", domSanitizer.bypassSecurityTrustResourceUrl("/assets/polls.svg"))
    this.matIconRegistry.addSvgIcon("search", domSanitizer.bypassSecurityTrustResourceUrl("/assets/search.svg"))
    this.matIconRegistry.addSvgIcon("user", domSanitizer.bypassSecurityTrustResourceUrl("/assets/user.svg"))
    this.nextWeek.setDate(this.today.getDate() + 7)
  }

  @ViewChild('snav', { static: true }) snav: MatSidenav;
  opened: boolean;
  settingsOpened: boolean;
  notificationCount;
  notificationReloadRate = 100;
  messagesCount;
  messageReloadRate = 100;
  userName;
  profile;
  entityList = [];

  notificationsInterval;
  messagesInterval;
  challengesInterval;

  notificationResponse;
  messageResponse;
  challengesResponse;

  secondToolbar = false;

  clickoutHandler: Function;

  notificationDialogRef: MatDialogRef<NotificationDialogComponent>;
  mailDialogRef: MatDialogRef<MailDialogComponent>;
  challengesDialogRef: MatDialogRef<ChallengesDialogComponent>;

  @HostListener('document:click', ['$event'])
  clickout(event): any {
    if (this.clickoutHandler) {
      this.clickoutHandler(event);
    }
  }

  ngOnInit(): void {
    this.getProfileState();
    this.getNotifications();
    this.getMessages();
    this.getChallenges();
    // this.getProfile();
    this.notificationsInterval = setInterval(() => this.getNotifications(), this.notificationReloadRate * 1000);
    this.messagesInterval = setInterval(() => this.getMessages(), this.messageReloadRate * 1000);
    this.challengesInterval = setInterval(() => this.getChallenges(), 100000);

    // this.router.events.subscribe((val) => {
    //   if (val instanceof NavigationEnd) {
    //     // if (val.url ){
    //     //   this.getEntity()
    //     // }
    //     // console.log(val);
    //   }
    //   console.log(val);
    // });
    this.commonService.data$.subscribe(resp => this.isEntity = resp);
  }

  ngOnDestroy(): any {
    clearInterval(this.notificationsInterval);
    clearInterval(this.messagesInterval);
    clearInterval(this.challengesInterval);
  }

  activatedComponent(event): any {
    if (event instanceof DashboardComponent) {
      this.getProfile();
    } else if (event instanceof HomepageComponent) {
      this.getProfile();
      this.getEntity(event.entityId);
    }
  }

  logout(): any {
    this.authService.logout();
    this.router.navigateByUrl('auth/login');
  }

  toggleSettings(): any {
    this.snav.toggle();
    this.settingsOpened = !this.opened;
  }

  toggle(): any {
    if (!this.settingsOpened) {
      this.snav.toggle();
    }
  }

  getProfileState(): any {
    if (!this.cookieService.check('profile_state')) {
      this.authService.getProfileState().subscribe(resp => {
        if (resp['data']['profilestate'] === 'completed') {
          this.cookieService.set('profile_state', COMPLETED_STATE, this.nextWeek, '/', '', false, 'Strict');
          this.permissionsService.addPermission(COMPLETED_STATE);
          this.router.navigate(['dashboard/']).then();
        } else {
          this.dialog.open(ProfileFormComponent, { width: '400px', disableClose: true })
            .afterClosed()
            .subscribe((result) => {
              if (result && result.hasOperations) {
                this.cookieService.set('profile_state', COMPLETED_STATE, this.nextWeek, '/', '', false, 'Strict');
                this.permissionsService.addPermission(COMPLETED_STATE);
                this.router.navigate(['dashboard/']).then();
              }
            });
        }
      });
    }
  }

  getEntity(id): any {
    this.isEntity = true;
    this.entityService.getEntity(id).subscribe(resp => {
      this.userName = resp.data[0].orgname;
      this.entityId = id;
      if (resp.data[0].logofileid) {
        this.pictureUrl = this.profilePictureUrl + resp.data[0].logofileid;
        this.hasLogo = true;
      } else {
        this.hasLogo = false;
        this.pictureUrl = '';
      }
    });
  }

  getProfile(): any {
    this.authService.getProfile().subscribe(resp => {
      this.profile = resp.data;
      this.userName = resp.data.firstname;
      this.entityId = this.profile.entityid;
      this.entityList = [];
      this.profile.entities.forEach(obj => {
        this.entityService.getEntity(obj.eid).subscribe(resp1 => this.entityList.push({ eid: obj.eid, orgname: resp1.data[0].orgname }));
      });
    });
  }

  getUserName(): any {
    this.isEntity = false;
    this.authService.getProfile().subscribe(resp => {
      this.userName = resp.data.firstname;
      this.pictureUrl = this.profilePictureUrl;
      this.hasLogo = true;
      this.entityId = resp.data.entityid;
    });
  }

  openPrifileForm(): any {
    this.dialog.open(ProfileFormComponent, { width: '400px', autoFocus: false })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.hasOperations) {
          this.getProfile();
        }
      });
  }

  openNotificationsDialog(): any {
    // this.dialogRef = this.dialog.open(NotificationDialogComponent, {
    //   width: '350px',
    //   data: this.notificationResponse,
    //   // backdropClass: 'backgroundColor:white',
    //   hasBackdrop: false,
    //   panelClass: 'custom-dialog',
    //   position: {top: '64px', left: '250px'},
    //   autoFocus: false,
    //   // scrollStrategy: this.overlay.scrollStrategies.reposition()
    // });

    setTimeout(() => {
      this.notificationDialogRef = this.dialog.open(NotificationDialogComponent, {
        width: '350px',
        data: this.notificationResponse,
        hasBackdrop: false,
        panelClass: 'custom-dialog',
        position: { top: '64px', left: '250px' },
        autoFocus: false,
      });

      this.notificationDialogRef.afterOpened().subscribe(() => {
        this.clickoutHandler = this.closeNotificationDialogFromClickout;
      });

      this.notificationDialogRef.afterClosed().subscribe(() => {
        this.clickoutHandler = null;
      });
    });
  }

  openNotificationsDialogMobile(): any {
    const dialog = this.dialog.open(NotificationDialogComponent, {
      width: '100%',
      maxWidth: '100%',
      data: this.notificationResponse,
      backdropClass: 'backgroundColor:white',
      panelClass: 'custom-dialog',
      position: { top: '128px', left: '0px' },
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  openMailDialog(): any {
    // this.dialog.open(MailDialogComponent, {
    //   width: '400px',
    //   data: this.messageResponse,
    //   backdropClass: 'backgroundColor:white',
    //   panelClass: 'custom-dialog',
    //   position: {top: '64px', left: '320px'},
    //   autoFocus: false,
    // });

    setTimeout(() => {
      this.mailDialogRef = this.dialog.open(MailDialogComponent, {
        width: '400px',
        data: this.messageResponse,
        hasBackdrop: false,
        panelClass: 'custom-dialog',
        position: { top: '64px', left: '320px' },
        autoFocus: false,
      });

      this.mailDialogRef.afterOpened().subscribe(() => {
        this.clickoutHandler = this.closeMailDialogFromClickout;
      });

      this.mailDialogRef.afterClosed().subscribe(() => {
        this.clickoutHandler = null;
      });
    });
  }

  openMailDialogMobile(): any {
    this.dialog.open(MailDialogComponent, {
      width: '100%',
      maxWidth: '100%',
      data: this.messageResponse,
      backdropClass: 'backgroundColor:white',
      panelClass: 'custom-dialog',
      position: { top: '128px', left: '0px' },
      autoFocus: false,
    });
  }

  openChallengesDialog(): any {
    // this.dialog.open(ChallengesDialogComponent, {
    //   width: '70%',
    //   data: this.challengesResponse,
    //   backdropClass: 'backgroundColor:white',
    //   panelClass: 'custom-dialog',
    //   position: {top: '64px', left: '320px'},
    //   autoFocus: false,
    // });

    setTimeout(() => {
      this.challengesDialogRef = this.dialog.open(ChallengesDialogComponent, {
        width: '70%',
        data: { challenges: this.challengesResponse, entityId: this.entityId },
        hasBackdrop: false,
        panelClass: 'custom-dialog',
        position: { top: '64px', left: '320px' },
        autoFocus: false,
      });

      this.challengesDialogRef.afterOpened().subscribe(() => {
        this.clickoutHandler = this.closeChallengesDialogFromClickout;
      });

      this.challengesDialogRef.afterClosed().subscribe(() => {
        this.clickoutHandler = null;
      });
    });
  }

  openChallengesDialogMobile(): any {
    this.dialog.open(ChallengesDialogComponent, {
      width: '100%',
      maxWidth: '100%',
      data: { challenges: this.challengesResponse, entityId: this.entityId },
      backdropClass: 'backgroundColor:white',
      panelClass: 'custom-dialog',
      position: { top: '128px', left: '0px' },
      autoFocus: false,
      maxHeight: '70vh'
    });
  }

  getNotifications(): any {
    this.dashboardService.getNotifications().subscribe(resp => {
      this.notificationResponse = resp;
      this.notificationCount = resp['data'][0]['notificationscount'];
      this.notificationReloadRate = resp['data'][0]['reloadrate'];
    });
  }

  getMessages(): any {
    this.dashboardService.getMessages().subscribe(resp => {
      this.messageResponse = resp;
      this.messagesCount = resp['data']['messagecount'];
      this.messageReloadRate = resp['data']['reloadrate'];
    });
  }

  getChallenges(): any {
    this.dashboardService.getChallenges().subscribe(resp => {
      this.challengesResponse = resp;
    });
  }


  closeNotificationDialogFromClickout(event: MouseEvent): any {
    const notificationMatDialogContainerEl = this.notificationDialogRef.componentInstance.hostElement.nativeElement.parentElement;
    const rect1 = notificationMatDialogContainerEl.getBoundingClientRect();
    if (event.clientX <= rect1.left || event.clientX >= rect1.right ||
      event.clientY <= rect1.top || event.clientY >= rect1.bottom) {
      this.notificationDialogRef.close();
    }
  }

  closeMailDialogFromClickout(event: MouseEvent): any {
    const mailMatDialogContainerEl = this.mailDialogRef.componentInstance.hostElement.nativeElement.parentElement;
    const rect = mailMatDialogContainerEl.getBoundingClientRect();
    if (event.clientX <= rect.left || event.clientX >= rect.right ||
      event.clientY <= rect.top || event.clientY >= rect.bottom) {
      this.mailDialogRef.close();
    }
  }

  closeChallengesDialogFromClickout(event: MouseEvent): any {
    const challengesMatDialogContainerEl = this.challengesDialogRef.componentInstance.hostElement.nativeElement.parentElement;
    const rect = challengesMatDialogContainerEl.getBoundingClientRect();
    if (event.clientX <= rect.left || event.clientX >= rect.right ||
      event.clientY <= rect.top || event.clientY >= rect.bottom) {
      this.challengesDialogRef.close();
    }
  }

}
