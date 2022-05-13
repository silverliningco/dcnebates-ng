import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { bridgeService } from '../../../services/bridge.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-exis-non-ecm-ahri',
  templateUrl: './exis-non-ecm-ahri.component.html',
  styleUrls: ['./exis-non-ecm-ahri.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class ExisNonEcmAhriComponent implements OnInit {
  @ViewChild('stepper')
  stepper!: MatStepper;
  commerceInfoGroup !: FormGroup;
  nominalSizeGroup !: FormGroup;
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
      searchType: "Existing or non-ECM furnace installations",
      nominalSize: this.nominalSizeGroup.value,
      requiredRebates: this.payloadRebates
    }  
    /* sent the infor to product-lines-components */
    this._bridge.sentAhriParams.emit({
      data: this.payload
    });
  
  }

  tabChange(e:any){
    // Confirm that it's the last step (ahri combinations).
    if(this.stepper?.steps.length -1 == e.selectedIndex){
      this.submitForm()
    }
  }
}
