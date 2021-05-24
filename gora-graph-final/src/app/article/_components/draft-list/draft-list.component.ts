import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../_services/article.service';

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.scss']
})

export class DraftListComponent implements OnInit {
  drafts;
  entityId;

  constructor(
    private service: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.entityId = this.route.snapshot.queryParamMap.get('entityId')
    this.getDrafts()
  }

  ngOnInit(): void {
  }

  getDrafts(): any {
    this.service.getDrafts(this.entityId).subscribe(resp => this.drafts = resp['data']);
  }

  select(id): any {
    this.router.navigate(['article/form', { id, entityId: this.entityId }]).then();
  }

  deleteDraft(id): any {
    /*   this.deleteDialog.message = 'Are you sure you want to discard this draft?';
      this.deleteDialog.openDialog((value) => {
        if (value) {
          this.service.deleteDraft(this.entityId, id).subscribe(() => {
            this.getDrafts();
          }, () => {
          });
        }
      }); */
  }

}
