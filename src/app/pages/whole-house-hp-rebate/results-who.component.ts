import { Component, Input, OnInit } from '@angular/core';

import {AHRICombinations} from '../../models/AHRICombinations.model';

@Component({
  selector: 'app-results-who',
  templateUrl: './results-who.component.html',
  styleUrls: ['./results-who.component.css']
})
export class ResultsWhoComponent implements OnInit {

  ahriCombinations: AHRICombinations[] = [];
  p: number =1;
  

  @Input('data')
    set data( data:any){
      this.ahriCombinations = data;
    }

  constructor() { }

  ngOnInit(): void {
  }

}
