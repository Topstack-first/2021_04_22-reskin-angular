import {Component, ElementRef, HostListener, Inject, OnInit} from '@angular/core';
import {DashboardService} from '../../_services/dashboard.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {

  notificationCount;
  notifications;
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';

  constructor(private service: DashboardService,
              private dialogRef: MatDialogRef<NotificationDialogComponent>,
              public hostElement: ElementRef,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.notificationCount = data['data'][0]['notificationscount'];
    this.notifications = data['data'][1]['notifications'];
  }


  ngOnInit(): void {
    // this.getNotifications();
  }

  // getNotifications(): any {
  //   this.service.getNotifications().subscribe(resp => {
  //     this.notificationCount = resp['data'][0]['notificationscount'];
  //     this.notifications = resp['data'][1]['notifications'];
  //   });
  // }

  getUrl(id): any {
    return this.profilePictureUrl + id;
  }

}
