import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-ahri-ratings',
  templateUrl: './ahri-ratings.component.html',
  styleUrls: ['./ahri-ratings.component.css'], 
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})
export class AHRIRatingsComponent implements OnInit {

  hiddenHome: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.hiddenHome = false;
  }


  onActivate(eventOutlet : any) {    

    if (eventOutlet = 'CoolingOnlyComponent' || 'HeatingCoolingComponent' || 'KnowModelNrComponent'){
      this.hiddenHome = true;
    } else {
      this.hiddenHome = false;
    }
  }

}
