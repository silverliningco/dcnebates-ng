import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-rebates-dialog',
  templateUrl: './rebates-dialog.component.html',
  styleUrls: ['./rebates-dialog.component.css']
})
export class RebatesDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RebatesDialogComponent>,
    /*@Inject(MAT_DIALOG_DATA) public message: string*/) { 
    
  }

  ngOnInit(): void {
  }

}
