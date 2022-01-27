import { Component, Input, OnInit } from '@angular/core';

import {AHRICombinations} from '../../models/AHRICombinations.model';

@Component({
  selector: 'app-results-par',
  templateUrl: './results-par.component.html',
  styleUrls: ['./results-par.component.css']
})
export class ResultsParComponent implements OnInit {

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
