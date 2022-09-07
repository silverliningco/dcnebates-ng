import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BestDetail } from '../../../models/detailBestOption';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

  commerceInfo: any;
  availableRebates: any = [];
  mySystems: any;
  home:string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog
  ) {
    this.commerceInfo = data.commerceInfo;
    this.availableRebates = data.availableRebates;
    this.mySystems = data.systems;
    this.home = data.home;
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.closeAll();
  }

  sendModelNrs(myCombination: BestDetail) {

    let myAHRIs: String[] = []
    myCombination.components!.forEach(element => {
      myAHRIs.push(element.SKU!)
    });

    let body = {
      commerceInfo: this.commerceInfo,
      skus: myAHRIs,
      availableRebates: this.availableRebates
    }
    let url = '/home/detail/' + JSON.stringify(body);
    window.open(url)
  }
}
