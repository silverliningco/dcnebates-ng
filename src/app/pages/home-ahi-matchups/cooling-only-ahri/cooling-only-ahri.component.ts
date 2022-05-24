import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { bridgeService } from '../../../services/bridge.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-cooling-only-ahri',
  templateUrl: './cooling-only-ahri.component.html',
  styleUrls: ['./cooling-only-ahri.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class CoolingOnlyAhriComponent implements OnInit {

  commerceInfoGroup !: FormGroup;
  nominalSizeGroup !: FormGroup;
  furnaceGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;

  payloadRebates: Array<any> = [];
  payload: any;

  stepperOrientation: Observable<StepperOrientation>;

  /* intercambio de datos */
  data!: any;

  constructor(
    private _formBuilder: FormBuilder,
    public breakpointObserver: BreakpointObserver,
    private _api: ApiService,
    public _bridge: bridgeService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
   }

  ngOnInit(): void {

    this.commerceInfoGroup = this._formBuilder.group({
      storeId: 1,
      showAllResults: [false, Validators.required],
    });

    this.nominalSizeGroup = this._formBuilder.group({
      coolingTons: ['', Validators.required],
    });

  }

  submitForm() {  

    this.payload = {
      commerceInfo: this.commerceInfoGroup.value,
      searchType: "Cooling Only",
      nominalSize: this.nominalSizeGroup.value,
      requiredRebates: this.payloadRebates
    }  

    console.log(this.payload);
    /* sent the infor to product-lines-components */
    this._bridge.sentParams.emit({
      data: this.payload
    });
  
  }

}
