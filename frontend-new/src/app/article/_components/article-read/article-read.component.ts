import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../_services/article.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-article-read',
  templateUrl: './article-read.component.html',
  styleUrls: ['./article-read.component.scss']
})
export class ArticleReadComponent implements OnInit {

  id;
  entityId;
  article;
  profilePictureUrl = 'https://app1.a-gora.com/api/v1/files/profilepicture/';
  list = [];
  files: Array<any>;
  comments: any[];

  constructor(private service: ArticleService,
              private route: ActivatedRoute,
              private location: Location) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.entityId = this.route.snapshot.paramMap.get('entityId');
  }

  ngOnInit(): void {
    this.getArticle();
    this.getFiles();
    this.getComments();
  }

  getArticle(): any {
    this.service.getArticle(this.entityId, this.id).subscribe(resp => {
      this.article = resp.data[0];
      if (this.article.mainimage) {
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
