import { Component, Input, OnInit } from '@angular/core';

import {AHRICombinations} from '../../models/AHRICombinations.model';

// sevice
import {AHRICombinationService} from '../../services/AHRICombinations.service';


@Component({
  selector: 'app-results-par',
  templateUrl: './results-par.component.html',
  styleUrls: ['./results-par.component.css']
})
export class ResultsParComponent implements OnInit {

  ahriCombinations: AHRICombinations[] = [];
  p: number =1;

  ahriCombinationsDetail!: AHRICombinations;
  

  @Input('data')
    set data( data:any){
      this.ahriCombinations = data;
      this.ahriCombinationsDetail = data;
    }

  constructor(
    public _ahriCombinationService: AHRICombinationService
  ) { }

  ngOnInit(): void {
  }

  detail(){

    this._ahriCombinationService.senddetail(this.ahriCombinationsDetail);

  }

}
