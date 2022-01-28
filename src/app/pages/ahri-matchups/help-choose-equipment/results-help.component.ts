import { Component, Input, OnInit } from '@angular/core';

// model
import {AHRICombinations} from '../../../models/AHRICombinations.model';

// sevice
import {AHRICombinationService} from '../../../services/AHRICombinations.service';


@Component({
  selector: 'app-results-help',
  templateUrl: './results-help.component.html',
  styleUrls: ['./results-help.component.css']
})
export class ResultsHelpComponent implements OnInit {

  ahriCombinations: AHRICombinations[] = [];
  p: number =1;

  ahriCombinationsDetail!: AHRICombinations;
  

  @Input('data') 
    set data( data:any){
      this.ahriCombinations = data;
      this.ahriCombinationsDetail = data;
    }

  constructor(
    public _ahriCombinationService: AHRICombinationService,
  ) { }

  ngOnInit(): void {
  }

  detail(){

    this._ahriCombinationService.senddetail(this.ahriCombinationsDetail);

  }

}
