import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
})

export class DialogConfirmComponent implements OnInit {
  public message: string;

  constructor(public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.message = this.data;
    } else {
      this.message = 'Are you sure you want to continue?';
    }
  }

  openDialog(callback): any {
    const currentDialog = this.dialog.open(DialogConfirmComponent, { width: '300px', data: this.message });
    currentDialog.afterClosed().subscribe(result => {
      callback(result);
      this.message = '';
    });
  }

}

