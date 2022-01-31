import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../services/AHRICombinations.service';


@Component({
  selector: 'app-partial-supplemental-hp-rebate',
  templateUrl: './partial-supplemental-hp-rebate.component.html',
  styleUrls: ['./partial-supplemental-hp-rebate.component.css']
})
export class PartialSupplementalHPRebateComponent implements OnInit {

    
  formGroup !: FormGroup ;  

  data!: any;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        /* rebate_id: [ [1] , Validators.required],
        title: ['Mass Save Air Source HP (Partial home supplemental)', Validators.required],
        
        equipment_size: this._formBuilder.group({
          cooling_tomsCtrl: ['', Validators.required],
          heating_btuhCtrl: ['', Validators.required],
        }),

        energy_distribution: this._formBuilder.group({
          methodCtrl: ['', Validators.required],
        }),

        furnace: this._formBuilder.group({
          fuelCtrl: ['', Validators.required],
        }),

        eligibility_detail: this._formBuilder.group({
          gas_oil_utilityCtrl: ['', Validators.required],
          existen_furnace_typeCtrl: ['', Validators.required],
        }), */
      

        /*http://localhost:8081/search-equipment?params=
        {"storeId": 1,
        "showAllResults":true,
        "heated": true,
        "cooled": true,
        "energyDistributionMethod":"Forced air",
        "fuelSource":"Natural Gas",
        "nominalSize":{"coolingTons":null,"heatingBTUH":25000},
        "systemDetails": {
          "compressorStages":"1",
          "brandedTiersMatch": false,
          "indoorUnitConfiguration": "Multipoise",
          "nominalCoolingTonsMatch": true
        },
        "eligibilityDetail":{}}
         */
        // ****************************************************************
        rebateIds: [ [1] , Validators.required],

        /* Hardcoded for now */
        heated: true,
        cooled: true,
        storeId: 1,
        country: "US",
        state:"MA",
        utilityId: 3,

        showAllResults: [ true , Validators.required],

        energyDistributionMethod: ['', Validators.required],

        fuelSource: ['', Validators.required],
        
        nominalSize: this._formBuilder.group({
          coolingTons: [ , Validators.required],
          heatingBTUH: [ , Validators.required],
        }),
        eligibilityDetail:  this._formBuilder.group({
          gasOilUtility: ['', Validators.required],
          existingFurnaceType: ['', Validators.required],
        }),
    });
  }



  submit(f: FormGroup) {
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


}
