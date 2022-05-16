import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-rebates',
  templateUrl: './rebates.component.html',
  styleUrls: ['./rebates.component.css']
})
export class RebatesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RebatesComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }

}
