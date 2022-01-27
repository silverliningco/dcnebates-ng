import { Component, Input, OnInit } from '@angular/core';

import {AHRIMatchups} from '../../../models/AHRIMatchups.model';

@Component({
  selector: 'app-results-help',
  templateUrl: './results-help.component.html',
  styleUrls: ['./results-help.component.css']
})
export class ResultsHelpComponent implements OnInit {

  ahriMatchups: AHRIMatchups[] = [];
  p: number =1;
  

  @Input('data')
    set data( data:any){
      this.ahriMatchups = data;
    }

  constructor() { }

  ngOnInit(): void {
  }

}
