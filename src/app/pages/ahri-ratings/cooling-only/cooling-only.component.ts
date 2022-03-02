import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import { AHRICombinationService } from '../../../services/AHRICombinations.service';
import { paramsDetailService } from '../../../services/params-detail.service';

// model
import { FormInfo } from '../../../models/formInfo.model';
import { detailParams } from '../../../models/detail.model';

@Component({
  selector: 'app-cooling-only',
  templateUrl: './cooling-only.component.html',
  styleUrls: ['./cooling-only.component.css']
})
export class CoolingOnlyComponent implements OnInit {

  formInfo: FormInfo = new FormInfo();
  payloadDetailParams: detailParams = new detailParams();

  formGroup !: FormGroup ;  
  productLines!: any;
  data!: any;
  selectProductLine!: any;

  // ******* select *******
  State: Array<any> = [
    { name: 'MA', electric: ['Cape Light Compact', 'Eversource', 'National Grid', 'Unitil', 'Marblehead Municipal Light Department', 'Other']},
    { name: 'ME', electric: ['Other']},
    { name: 'NH', electric: ['Other']},
    { name: 'RI', electric: ['National Grid', 'Other']},
  ];
  electric:  Array<any> = [];

  // ******* select end *******

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder,
    public _paramsDetailService: paramsDetailService
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        /* rebateIds: [ null, Validators.required],

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
        }),

        state: ['', Validators.required],
        electricUtilityProvider: ['', Validators.required],  */

        // Hardcoded for now
        rebateIds: [[2], Validators.required],
        storeId: [ 1, Validators.required],
        showAllResults: [ true, Validators.required],
        country: ["US", Validators.required],
        //gasOilUtilityId: [ 3, Validators.required],
        //fuelSource: ['Natural Gas', Validators.required],
        /* eligibilityDetail: [[{ "name": "Pre-existing heating type", 
                              "value": ["Electric Resistance Heat"] }, 
                            { "name": "HP is sole source of heating", 
                              "value": "Yes" }]], */

        // data of form
        nominalSize: this._formBuilder.group({
          heatingBTUH: [26000, Validators.required],
          coolingTons: [ , Validators.required],// Hardcoded for now
        }),
        state: ['', Validators.required],
        electricUtilityId: ['', Validators.required],


    });

  }



  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    // *load data in detailParams model
    this.payloadDetailParams.rebateIds = this.formGroup.get('rebateIds')?.value;
    this.payloadDetailParams.storeId = this.formGroup.get('storeId')?.value;
    this.payloadDetailParams.country = this.formGroup.get('country')?.value;
    this.payloadDetailParams.electricUtilityId = this.formGroup.get('electricUtilityId')?.value;
    this.payloadDetailParams.gasOilUtilityId = this.formGroup.get('gasOilUtilityId')?.value;
    this.payloadDetailParams.state = this.formGroup.get('state')?.value;
    this.payloadDetailParams.eligibilityDetail = this.formGroup.get('eligibilityDetail')?.value;
    //console.log(this.payloadDetailParams);
    this._paramsDetailService.sentParams.emit({
      data:this.payloadDetailParams 
    });
    // *load data in detailParams model end

    // send data of stepper to product line service
    let jsonPay = JSON.stringify(f);    

    this._ahriCombinationService.ProductLines(jsonPay)
            .subscribe( (resp:any) => {
              this.productLines = resp.body;

              // cargar por defecto el primer elemento del arreglo
              this.formInfo = this.formGroup.value;
              this.formInfo.systemTypeId = resp.body[0].id;

              this.formInfo.matchFilters = null;
              this.formInfo.rangeFilters = null;

              let jsonPay2 = JSON.stringify(this.formInfo); 
              
              this._ahriCombinationService.search(jsonPay2)
                  .subscribe( (resp:any) => {
                    console.log(resp),
                    this.data = resp.body;
              });
            });
  }


  // submint info of product line to endpoint equipment search
  submitProductLine(id: number) {
    // payload 
    this.formInfo = this.formGroup.value;
    this.formInfo.systemTypeId = id;
    this.formInfo.matchFilters = null;
    this.formInfo.rangeFilters = null;

    let jsonPay = JSON.stringify(this.formInfo); 
    
    this._ahriCombinationService.search(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
            });
  }

  
  // ******* select *******
  changeState_electric(count: any) {
    this.electric = this.State.find((con: any) => con.name == count.value).electric;
  }
  // ******* select end *******


}

