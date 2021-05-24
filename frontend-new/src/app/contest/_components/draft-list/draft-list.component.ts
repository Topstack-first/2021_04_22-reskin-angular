import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogConfirmComponent} from '../../../common/dialog-confirm/dialog-confirm.component';
import {ContestService} from '../../_services/contest.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrls: ['./draft-list.component.scss'],
  providers: [DialogConfirmComponent]
})
export class DraftListComponent implements OnInit {

  drafts;
  entityId;

  constructor(private service: ContestService,
              private dialogRef: MatDialogRef<DraftListComponent>,
              private dialog: MatDialog,
              private router: Router,
              private deleteDialog: DialogConfirmComponent,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.drafts = data.drafts;
    this.entityId = data.entityId;
  }

  ngOnInit(): void {
  }

  getDrafts(): any {
    this.service.getDrafts(this.entityId).subscribe(resp => this.drafts = resp['data']);
  }

  close(): any {
    this.dialogRef.close();
  }

  select(id): any {
    this.close();
    this.router.navigate(['contest/form', {id, entityId: this.entityId}]).then();
  }

  deleteDraft(id): any {
    this.deleteDialog.message = 'Are you sure you want to discard this draft?';
    this.deleteDialog.openDialog((value) => {
      if (value) {
        this.service.deleteDraft(this.entityId, id)
          .subscribe(() => {
            this.getDrafts();
          }, () => {
          });
      }
    });
  }
}
