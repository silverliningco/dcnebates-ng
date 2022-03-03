import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  // ******* send ids itulities *******
  sendElectric!: any; 
  // ******* send ids itulities end *******

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
        electricUtility: ['', Validators.required],
    });

    // send utilities ids
    this.sendElectricID();

  }



  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    
    // send data of stepper to product line service
    this.formInfo = this.formGroup.value;
    this.formInfo.electricUtilityId = this.sendElectric;

    this.loadDataDetailParams(this.formInfo);


    // send data of stepper to product line service
    let jsonPay = JSON.stringify(f);    

    console.log(f);

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
                    this.data = resp.body;
              });
            });
  }

  // load data in detailParams model
  loadDataDetailParams(formInfo: any){

    this.payloadDetailParams.rebateIds = formInfo.rebateIds;
    this.payloadDetailParams.storeId = formInfo.storeId;
    this.payloadDetailParams.country = formInfo.country;
    this.payloadDetailParams.electricUtilityId = formInfo.electricUtilityId;
    this.payloadDetailParams.gasOilUtilityId = formInfo.gasOilUtilityId;
    this.payloadDetailParams.state = formInfo.state;
    this.payloadDetailParams.eligibilityDetail = formInfo.eligibilityDetail;

    this._paramsDetailService.sentParams.emit({
      data:this.payloadDetailParams 
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

  // send de id of utilities
  sendElectricID(){
    this.formGroup.get('electricUtility')?.valueChanges.subscribe( (val: any) => {
    
      switch (val) {
        case 'Cape Light Compact':
          this.sendElectric = 2;
          break;
        case 'Eversource':
          this.sendElectric = 3;
          break;
        case 'National Grid':
          this.sendElectric= 5;
          break;
        case 'Unitil':
          this.sendElectric = 4;
          break;
        case 'Marblehead Municipal Light Department':
          this.sendElectric = 7;
          break;
        /* case 'Other':
          this.sendElectric = null;
          break; */
      }
      
    });

  }

  // ******* select end *******


}

