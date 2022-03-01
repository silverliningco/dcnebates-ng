import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-ahri-matchups',
  templateUrl: './ahri-matchups.component.html',
  styleUrls: ['./ahri-matchups.component.css'], 
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})
export class AHRIMatchupsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
