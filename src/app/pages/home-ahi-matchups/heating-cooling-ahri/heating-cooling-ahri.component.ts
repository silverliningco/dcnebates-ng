import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { bridgeService } from '../../../services/bridge.service';
import { payloadForm } from '../../../models/payloadFrom';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-heating-cooling-ahri',
  templateUrl: './heating-cooling-ahri.component.html',
  styleUrls: ['./heating-cooling-ahri.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class HeatingCoolingAhriComponent implements OnInit {

  heatingCoolingGroup !: FormGroup;

  myCoolingTons: Array<number> =  [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

  payloadRebates: Array<any> = [];
  payload:payloadForm = new payloadForm ;

  stepperOrientation: Observable<StepperOrientation>;

  /* change the values of from */
  newValueForm!: any;

  /* intercambio de datos */
  data!: any;

  /* for detrminate if the form has changes */
  isDirty!: Observable<boolean>;
  
  constructor(
    private _formBuilder: FormBuilder,
    public breakpointObserver: BreakpointObserver,
    public _bridge: bridgeService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
   }

  ngOnInit(): void {


    this.heatingCoolingGroup = this._formBuilder.group({
      /* form grups */
      'commerceInfoGroup': this._formBuilder.group({
        'storeId': 1,
        'showAllResults': [false, Validators.required],
      }),

      'nominalSizeGroup': this._formBuilder.group({
        'heatingBTUH': ['', [this.ValidateHeatingBTUH, this.ValidateNumber]],
        'coolingTons': ['', Validators.required],
        /* equipmentSize: ['', Validators.required], */
      }),

      'furnaceGroup': this._formBuilder.group({
        'fuelSource': ['', Validators.required],
      }),

    });


    /* chekeck if exists changes in values of forms */
    this.isDirty = this.heatingCoolingGroup.valueChanges.pipe(
      /* dirtyCheck(this.payload), */
    );

  }

  /* validators */
  /* note: it will always show the error: "Cooling tons is required"
     when "e" is entered as input, because its type = object and its value = null */
     ValidateNumber(control: AbstractControl) : ValidationErrors | null  {

      let coolingToms = control.value;
      let typeCT = typeof coolingToms;
  
      if (typeCT === 'number' ){
        return null;
      } 
      else {
        if (typeCT === 'object' &&  coolingToms === null){
          return  { null_not_permit : true };
        } if (typeCT === 'string' &&  coolingToms === ''){
          return  { need_1_or_3_characters : true };
        } 
        else{
          return  { is_not_number : true };
        }
        
      }
     
    }
  
    ValidateHeatingBTUH(control: AbstractControl) : ValidationErrors | null  {
  
      let heatingBTUH = control.value;
      let lengthHeatingBTUH!: string;    
  
  
      if (heatingBTUH != null){
        lengthHeatingBTUH = heatingBTUH.toString();
      }else {
        return  { null_not_permit: true };
      }
      
  
      // first verify if the number is integer
       if (heatingBTUH % 1 === 0){
        if (lengthHeatingBTUH.length === 4 || lengthHeatingBTUH.length === 5 || lengthHeatingBTUH.length === 6) {
  
          if (heatingBTUH >= 8000 && heatingBTUH <= 135000 ){
  
            return null;
          } else {
            return  { Hbtuh_invalid_value: true };
          }
  
        } else {
          return  {  need_between_4_6_characters: true };
        }
  
      } else {
        return  { it_not_integer: true };
      }
  
    }

    submitForm() {  

      console.log(this.heatingCoolingGroup.value.commerceInfoGroup.control['fuelSource'].value);

      /* this.payload = {
        commerceInfo: this.heatingCoolingGroup.value.commerceInfoGroup,
        searchType: "Heating and Cooling",
        nominalSize: this.heatingCoolingGroup.value.nominalSizeGroup,
        fuelSource: this.furnaceGroup.controls['fuelSource'].value,
        requiredRebates: this.payloadRebates
      } */

      /* sent the infor to product-lines-components */
      /* this._bridge.sentParams.emit({
        data: this.payload
      }); */


      /* this.change(this.payload);*/
    
    }


    change(payload: any){
      this.newValueForm = new BehaviorSubject<payloadForm>(payload);
      console.log(this.newValueForm);
    }
    

}


