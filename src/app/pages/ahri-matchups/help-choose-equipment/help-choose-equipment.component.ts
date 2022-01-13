import { Component, OnInit } from '@angular/core';


import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-help-choose-equipment',
  templateUrl: './help-choose-equipment.component.html',
  styleUrls: ['./help-choose-equipment.component.css']
})
export class HelpChooseEquipmentComponent implements OnInit {

  // table
  displayedColumns: string[] = ['outdoorUnit', 'indoorUnit', 'furnace', 'seer', 'eer', 'hspf', 'afue', 'totalRebate'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // select

  selectedValue!: string;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];


  constructor() { }

  ngOnInit(): void {
  }

}



const ELEMENT_DATA: PeriodicElement[] = [
  {outdoorUnit: 1, indoorUnit: 1, furnace: 1.0079, seer: 1,eer: 12,hspf: 12,afue: 12,totalRebate: 12},
  {outdoorUnit: 1, indoorUnit: 1, furnace: 1.0079, seer: 1,eer: 12,hspf: 12,afue: 12,totalRebate: 12}
];

export interface PeriodicElement {
  outdoorUnit: number;
  indoorUnit: number;
  furnace: number;
  seer: number;
  eer: number;
  hspf: number;
  afue: number;
  totalRebate: number;
}

//select
interface Food {
  value: string;
  viewValue: string;
}


