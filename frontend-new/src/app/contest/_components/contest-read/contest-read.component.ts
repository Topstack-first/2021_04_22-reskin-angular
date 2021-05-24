import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContestService} from '../../_services/contest.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-contest-read',
  templateUrl: './contest-read.component.html',
  styleUrls: ['./contest-read.component.scss']
})
export class ContestReadComponent implements OnInit {

  id;
  entityId;
  contest;
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';
  list = [];
  files: Array<any>;
  comments: any[];

  constructor(private service: ContestService,
              private route: ActivatedRoute,
              private location: Location) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.entityId = this.route.snapshot.paramMap.get('entityId');
  }

  ngOnInit(): void {
    this.getContest();
    this.getFiles();
    this.getComments();
  }

  getContest(): any {
    this.service.getContest(this.entityId, this.id).subscribe(resp => {
      this.contest = resp.data[0];
      if (this.contest.leadingimage) {
        this.list = [1];
      }
    });
  }

  getFiles(): any {
    this.service.getFiles(this.entityId, this.id).subscribe(resp => {
      this.files = resp.data;
    });
  }

  getUrl(id): any {
    return this.profilePictureUrl + id;
  }

  getComments(): any {
    this.service.getComments(this.entityId, this.id).subscribe(resp => this.comments = resp.data.comments);
  }

  goBack(): any {
    this.location.back();
  }

}
