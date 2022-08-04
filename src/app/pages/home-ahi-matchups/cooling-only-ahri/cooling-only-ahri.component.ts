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
  @ViewChild('stepper')
  stepper!: MatStepper;
  commerceInfoGroup !: FormGroup;
  nominalSizeGroup !: FormGroup;
  furnaceGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;

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
      nominalSize: this.nominalSizeGroup.value,
      levelOneSystemTypeId: 2,
      sizingConstraint: "Nominal cooling tons",
      home: 'ahri'
    }  
    /* sent the infor to product-lines-components */
    this._bridge.sentRebateParams.emit({
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
