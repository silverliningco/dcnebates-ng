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
  p: number =1;

  ahriCombinationsDetail!: AHRICombinations;

  @Input('data')
    set data( data:any){
      this.ahriCombinations = data;
      this.ahriCombinationsDetail = data;
    }

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  detail(){
    //console.log(this.ahriCombinationsDetail);

    //var textj = JSON.stringify(this.ahriCombinations);

    this._ahriCombinationService.senddetail(this.ahriCombinationsDetail);
            /* .subscribe( detail => {
              let data = JSON.stringify(detail);
              console.log(data);
            }); */
  }



}
