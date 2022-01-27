import { Component, Input, OnInit } from '@angular/core';

import {AHRIMatchups} from '../../models/AHRIMatchups.model';

@Component({
  selector: 'app-results-par',
  templateUrl: './results-par.component.html',
  styleUrls: ['./results-par.component.css']
})
export class ResultsParComponent implements OnInit {

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
