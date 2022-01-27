import { Component, Input, OnInit } from '@angular/core';

import {AHRIMatchups} from '../../models/AHRIMatchups.model';

@Component({
  selector: 'app-results-who',
  templateUrl: './results-who.component.html',
  styleUrls: ['./results-who.component.css']
})
export class ResultsWhoComponent implements OnInit {

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
