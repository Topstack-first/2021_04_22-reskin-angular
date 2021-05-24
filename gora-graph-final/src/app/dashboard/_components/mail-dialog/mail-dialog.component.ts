import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {DashboardService} from '../../_services/dashboard.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.scss']
})
export class MailDialogComponent implements OnInit {

  messageCount;
  messages;
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';

  constructor(private service: DashboardService,
              public hostElement: ElementRef,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.messageCount = data['data']['messagecount'];
    this.messages = data['data']['messages'];
  }

  ngOnInit(): void {
    // this.getMessages();
  }

  // getMessages(): any {
  //   this.service.getMessages().subscribe(resp => {
  //     this.messageCount = resp['data']['messagecount'];
  //     this.messages = resp['data']['messages'];
  //   });
  // }

  getUrl(id): any {
    return this.profilePictureUrl + id;
  }

}
