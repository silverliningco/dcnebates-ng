import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-know-model-nbr',
  templateUrl: './know-model-nbr.component.html',
  styleUrls: ['./know-model-nbr.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class KnowModelNbrComponent implements OnInit {

  modelNumberGroup !: FormGroup;
  eligibilityDetail !: FormGroup;

  stepperOrientation: Observable<StepperOrientation>;

  myCommerInfo !: any;

  constructor(
    private _formBuilder: FormBuilder,
    public breakpointObserver: BreakpointObserver,
    private _api: ApiService
  ) { 
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.myCommerInfo = {
      storeId: 1,
      showAllResults: false
    }

    this.modelNumberGroup = this._formBuilder.group({
      outdoorUnit: ['', ],
      indoorUnit: ['', ],
      replaceDisplaceFuel: ['', ],
      furnace: ['', ],
      existing_nonECM: ['', ],
      fuel: ['', ],
    });

    this.eligibilityDetail = this._formBuilder.group({
      state: ['', ],
      electricProvider: ['', ],
      gasOilUtility: ['', ],
      existingFurnaceType: ['', ],
      hpSystem: ['', ],
      replaceDisplaceFuel: ['', ],
    });

    
  }

}
