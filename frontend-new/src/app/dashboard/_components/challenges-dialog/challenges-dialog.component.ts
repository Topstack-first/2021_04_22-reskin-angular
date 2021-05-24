import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {DashboardService} from '../../_services/dashboard.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {DraftListComponent as ContestDraftListComponent} from '../../../contest/_components/draft-list/draft-list.component';
import {DraftListComponent as ArticleDraftListComponent} from '../../../article/_components/draft-list/draft-list.component';
import {ContestService} from '../../../contest/_services/contest.service';
import {ArticleService} from '../../../article/_services/article.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-challenges-dialog',
  templateUrl: './challenges-dialog.component.html',
  styleUrls: ['./challenges-dialog.component.scss']
})
export class ChallengesDialogComponent implements OnInit {

  image;
  challenges;
  entityId;
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';

  articleButton: boolean;
  contestButton: boolean;
  projectButton: boolean;

  constructor(private service: DashboardService,
              private articleService: ArticleService,
              private contestService: ContestService,
              private dialog: MatDialog,
              private router: Router,
              public hostElement: ElementRef,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.image = data['challenges']['data']['image'];
    this.challenges = data['challenges']['data']['featuredcontect'];
    this.entityId = data.entityId;
  }

  ngOnInit(): void {
    this.getButtons();
  }

  getChallenges(): any {
    this.service.getChallenges().subscribe(resp => {
      this.image = resp['data']['image'];
      this.challenges = resp['data']['featuredcontect'];
    });
  }

  getUrl(id): any {
    return this.profilePictureUrl + id;
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

  getButtons(): any {
    this.service.getButtons().subscribe(resp => {
      this.articleButton = resp['data']['article'];
      this.contestButton = resp['data']['quest'];
      this.projectButton = resp['data']['project'];
    });
  }

}
