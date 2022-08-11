import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { utilityInfo } from '../../models/utility';

@Component({
  selector: 'app-i-know-model-nr',
  templateUrl: './i-know-model-nr.component.html',
  styleUrls: ['./i-know-model-nr.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})
export class IKnowModelNrComponent implements OnInit {

  @ViewChild('stepper')
  stepper!: MatStepper; 

  utilityOtherValue: number = 0;

  stepperOrientation: Observable<StepperOrientation>;

  /* FORM GRUP */
  stateGroup !: FormGroup;
  utilityGroup !: FormGroup;
  furnaceGroup !: FormGroup; 
  filtersGroup !: FormGroup;

  /* utilities */
  sendElectric: Array<any> = [];
  sendGasOil: Array<any> = [];
  electricity:  Array<utilityInfo> = [];
  fossilFuel: Array<utilityInfo> = [];

  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    public router: Router,
    public breakpointObserver: BreakpointObserver,
  ) { 
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {

    this.stateGroup = this._formBuilder.group({
      state: ['', Validators.required]
    });

    this.utilityGroup = this._formBuilder.group({
      electricUtility: ['', Validators.required],
      fossilFuelUtilityId: ['', Validators.required]
    });

    this.furnaceGroup = this._formBuilder.group({
      fuelSource: ['', Validators.required],
    });
  }

  // utilities
  ChangeState() {

    this.sendGasOil = [];
    this.sendElectric = [];

    this._api.Utilities(this.stateGroup.controls['state'].value).subscribe({
      next: (resp: any) => {
        let listUtilities: Array<utilityInfo> = resp;
        this.SelectUtility(listUtilities);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  SelectUtility(array: Array<utilityInfo>) {

    this.electricity = [];
    this.fossilFuel = [];

    array.forEach(ele => {
      if (ele.electricity === true && ele.fossilFuel === false){
        this.electricity.push(ele);
      } if (ele.electricity === false && ele.fossilFuel === true){
        this.fossilFuel.push(ele);
      } if (ele.electricity === true && ele.fossilFuel === true) {
        this.electricity.push(ele);
        this.fossilFuel.push(ele);
      }
    });
  }

 
  Payload() {
    let payload = {
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      commerceInfo: {    
        "storeId": 1,
        "showAllResults": false  
      }
    };

    return JSON.stringify(payload);
  }

  sentmodelNrs(){
    let body: any = this.Payload();
    let url= '/home/detail-i-know-my-model-nr/' + body;
    window.open(url)  
  }

}

 