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

  constructor() { }

  ngOnInit(): void {
  }

}
