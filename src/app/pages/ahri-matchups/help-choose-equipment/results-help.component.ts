import { Component, Input, OnInit } from '@angular/core';

import {AHRICombinations} from '../../../models/AHRICombinations.model';

@Component({
  selector: 'app-results-help',
  templateUrl: './results-help.component.html',
  styleUrls: ['./results-help.component.css']
})
export class ResultsHelpComponent implements OnInit {

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
