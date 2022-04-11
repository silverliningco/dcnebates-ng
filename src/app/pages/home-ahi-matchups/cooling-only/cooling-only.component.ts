import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cooling-only',
  templateUrl: './cooling-only.component.html',
  styleUrls: ['./cooling-only.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class CoolingOnlyComponent implements OnInit {

  nominalSizeGroup !: FormGroup;
  locationGroup !: FormGroup;

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

    this.nominalSizeGroup = this._formBuilder.group({
      heatingBTUH: ['', ],
      coolingTons: ['', ],
    });

    this.locationGroup = this._formBuilder.group({
      location: ['', ],
      electricProvider: ['', ],
    });

  }

}
