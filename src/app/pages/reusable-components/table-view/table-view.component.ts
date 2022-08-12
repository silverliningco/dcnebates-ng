import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

  myCombinations: any;

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog
  ) {
    this.myCombinations = data;
   }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.closeAll();
  }
  
}
