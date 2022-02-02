import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// model
import {AHRICombinations} from '../../models/AHRICombinations.model';

// sevice
import {AHRICombinationService} from '../../services/AHRICombinations.service';

@Component({
  selector: 'app-results-who',
  templateUrl: './results-who.component.html',
  styleUrls: ['./results-who.component.css']
})
export class ResultsWhoComponent implements OnInit {

  ahriCombinations: AHRICombinations[] = [];
  p: number = 1;

  load: boolean = true;
  showTable: boolean = false;

  @Input('data')
    set data( data:any){
      this.ahriCombinations = data;
      console.log(this.ahriCombinations);
    }

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }


}
