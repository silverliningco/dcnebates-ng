import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../../services/AHRICombinations.service';

@Component({
  selector: 'app-help-choose-equipment',
  templateUrl: './help-choose-equipment.component.html',
  styleUrls: ['./help-choose-equipment.component.css']
})
export class HelpChooseEquipmentComponent implements OnInit {

  formGroup !: FormGroup ;  

  data!: any;

  // ******* select *******
  State: Array<any> = [
    { name: 'MA', electric: ['Cape Light Compact', 'Eversource', 'National Grid', 'Unitil', 'Marblehead Municipal Light Department', 'Other'], gas: ['Berkshire Gas', 'Eversource', 'Liberty', 'National Grid', 'Unitil', 'Other'] },
    { name: 'ME', electric: ['Other'], gas: ['Other'] },
    { name: 'NH', electric: ['Other'], gas: ['Other'] },
    { name: 'RI', electric: ['National Grid', 'Other'], gas: ['National Grid', 'Other']  },
  ];
  electric:  Array<any> = [];
  gas:  Array<any> = [];

  // ******* select end *******

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        rebateIds: [ null, Validators.required],

        // Hardcoded for now
         heated: true,
         cooled: true,
         storeId: 1,
         country: "US",
         utilityId: 3,
        //  Hardcoded for now end

        showAllResults: [ true , Validators.required],

        nominalSize: this._formBuilder.group({
          coolingTons: [ , Validators.required],
          heatingBTUH: [ , Validators.required],
        }),
        
        fuelSource: ['', Validators.required],

        state: ['', Validators.required],

        eligibilityDetail: this._formBuilder.group({
          electricUtilityProvider: ['', Validators.required],
          gasOilUtility:  ['', Validators.required],
          existingFurnaceType:  ['', Validators.required],
          HPSoleSource: ['', Validators.required],
          Replace_displace_fuel_type: ['', Validators.required]
        })
    });
  }

    
  submit(f: FormGroup){
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f); 

    console.log(jsonPay);

    this._ahriCombinationService.save(jsonPay)
          .subscribe( (resp:any) => {
            this.data = resp.body;
          });
  }

  
  // ******* select *******
  changeState_electric(count: any) {
    this.electric = this.State.find((con: any) => con.name == count.value).electric;
  }

  changeState_gas(count: any) {
    this.gas = this.State.find((con: any) => con.name == count.value).gas;
  }
  // ******* select end *******
}
