import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmComponent } from 'src/app/common/dialog-confirm/dialog-confirm.component';
import { ContestService } from '../../_services/contest.service';

@Component({
  selector: 'app-contest-draft-list',
  templateUrl: './contest-draft-list.component.html',
  styleUrls: ['./contest-draft-list.component.scss'],
  providers: [DialogConfirmComponent]
})
export class ContestDraftListComponent implements OnInit {

  drafts = [];
  entityId;

  constructor(
    private service: ContestService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private deleteDialog: DialogConfirmComponent,
  ) {

    this.entityId = this.route.snapshot.paramMap.get('entityId');
    this.getDrafts()
  }

  ngOnInit(): void {
  }

  getDrafts(): any {
    this.service.getDrafts(this.entityId).subscribe(resp => this.drafts = resp['data']);
  }

  select(id): any {
    this.router.navigate(['contest/form', { id, entityId: this.entityId }]).then();
  }

  deleteDraft(id): any {
    this.deleteDialog.message = 'Are you sure you want to discard this draft?';
    this.deleteDialog.openDialog((value) => {
      if (value) {
        this.service.deleteDraft(this.entityId, id).subscribe(() => {
          this.getDrafts();
        }, () => {
        });
      }
    });
  }

  goBack(): any {
    this.router.navigate(['/dashboard'])
  }

}
