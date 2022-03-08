import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// services
import { AHRICombinationService } from '../../../services/AHRICombinations.service';
import { paramsDetailService } from '../../../services/params-detail.service';

// model
import { FormInfo } from '../../../models/formInfo.model';
import { detailParams } from '../../../models/detail.model';

@Component({
  selector: 'app-heating-cooling',
  templateUrl: './heating-cooling.component.html',
  styleUrls: ['./heating-cooling.component.css']
})
export class HeatingCoolingComponent implements OnInit {

  formInfo: FormInfo = new FormInfo();
  payloadDetailParams: detailParams = new detailParams();

  formGroup !: FormGroup ;  
  productLines!: any;
  data!: any;
  selectProductLine!: any;

  showfurnaceFuel: boolean = false;
  GasOilUtility: boolean = false;

  // ******* send ids itulities *******
  sendElectric!: any;
  sendGasOil!: any; 
  // ******* send ids itulities end *******

  // ******* send eligibilityDetail *******
 /*  getpreExistingHeating!: any;
  getHPSole!: any; 
  getexistingFurnace!: any; */
  // ******* send eligibilityDetail end *******

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
    private _formBuilder: FormBuilder,
    public _paramsDetailService: paramsDetailService
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
       
        // Hardcoded for now
        rebateIds: [[], Validators.required],
        storeId: [ 1, Validators.required],
        showAllResults: [ true, Validators.required],
        country: ["US", Validators.required],
        
        // data of form
        nominalSize: this._formBuilder.group({
          coolingTons: [ , Validators.required],
          heatingBTUH: [ , Validators.required],
        }),                     
        fuelSource: ['', Validators.required],
        state: ['', Validators.required],
        electricUtility: ['', Validators.required],
        gasOilUtility:  ['', Validators.required],
        preExistingHeatingType: ['', Validators.required],
        HPSoleSource: ['', Validators.required],
        existingFurnaceType: ['', Validators.required],
        eligibilityDetail: ['', Validators.required],

    });
  
    // enable or disable option
    //this.fuelSource();

    // send utilities ids
    this.sendElectricID();
    this.sendGasOilID();

    // json eligibilityDetail
    /* this.getPreExistingHeatingType();
    this.getHPSoleSource();
    this.getExistingFurnaceType() */;  
  }



  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }

    // send data of stepper to product line service
    this.formInfo = this.formGroup.value;
    this.formInfo.electricUtilityId = this.sendElectric;
    this.formInfo.gasOilUtilityId = this.sendGasOil;
    // json struct for eligibilityDetail
    this.formInfo.eligibilityDetail =  [];

    this.loadDataDetailParams(this.formInfo);

    let jsonPay = JSON.stringify(this.formInfo);    

    this._ahriCombinationService.ProductLines(jsonPay)
            .subscribe( (resp:any) => {
              this.productLines = resp;
              console.log(this.productLines);

              // load by default the first element of the array
              this.formInfo = this.formGroup.value;
              if (resp.length > 0) {
                this.formInfo.systemTypeId = resp[0].id;
              } else {
                alert("No product lines where found.")
              }

              this.formInfo.matchFilters = null;
              this.formInfo.rangeFilters = null;

              let jsonPay2 = JSON.stringify(this.formInfo); 

              console.log(jsonPay2);
              
              this._ahriCombinationService.search(jsonPay2)
                  .subscribe( (resp:any) => {
                    this.data = resp;
              },
              err => {
                alert(err.error)
              });
            },
            err => {
              alert(err.error)
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

    console.log(jsonPay);
    
    this._ahriCombinationService.search(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp;
            },
            err => {
              alert(err.error)
            });
  }
  
  // ******* select *******
    changeState_electric(count: any) {
      this.electric = this.State.find((con: any) => con.name == count.value).electric;
    }

    changeState_gas(count: any) {
      this.gas = this.State.find((con: any) => con.name == count.value).gas;
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

    sendGasOilID(){
      this.formGroup.get('gasOilUtility')?.valueChanges.subscribe( (val: any) => {
      
        switch (val) {
          case 'Berkshire Gas':
            this.sendGasOil = 1;
            break;
          case 'Eversource':
            this.sendGasOil = 3;
            break;
          case 'Liberty':
            this.sendGasOil = 4;
            break;
          case 'National Grid':
            this.sendGasOil = 5;
            break;
          case 'Unitil':
            this.sendGasOil = 6;
            break;
          /* case 'Other':
            this.sendGasOil = null;
            break; */
        }
        
      });
    }

  // ******* select end *******


  // ******** json eligibilityDetail *****
    //capture the data
    /* getPreExistingHeatingType(){
      this.formGroup.get('preExistingHeatingType')?.valueChanges.subscribe( (val: any) => {

        switch (val) {
          case 'Natural Gas':
            this.getpreExistingHeating =  { "name":"Pre-existing heating type", "value":[ "Natural Gas"]};            
            break;
          case 'Propane':
            this.getpreExistingHeating =  { "name":"Pre-existing heating type", "value":[ "Propane"]};
            break;
          case 'Heating Oil':
            this.getpreExistingHeating =  { "name":"Pre-existing heating type", "value":[ "Heating Oil"]};
            break;
          case 'Resistance heat':
            this.getpreExistingHeating = { "name":"Pre-existing heating type", "value":[ "Resistance heat"]};
            break; 
        }       
    
      });

    }

    getHPSoleSource(){
      this.formGroup.get('HPSoleSource')?.valueChanges.subscribe( (val: any) => {

        switch (val) {
          case 'Yes':
            this.getHPSole = { "name":"HP is sole source of heating", "value": "Yes"};
            break;
          case 'No':
            this.getHPSole = { "name":"HP is sole source of heating", "value": "No"};
            break;
        } 
        
      });
    }

    getExistingFurnaceType(){
      this.formGroup.get('existingFurnaceType')?.valueChanges.subscribe( (val: any) => {
        switch (val) {
          case 'Condensing':
            this.getexistingFurnace = { "name":"Existing furnace type", "value": "Condensing"};
            break;
          case 'Non-condensing':
            this.getexistingFurnace = { "name":"Existing furnace type", "value": "Non-condensing"};
            break;
        } 
      });     
    }
  // ******** json eligibilityDetail end *****
  


  // enable or disable option

  fuelSource(){
    this.formGroup.get('fuelSource')?.valueChanges.subscribe( (val: any) => {
      
      if(val === 'Natural Gas' || val === 'Heating Oil' || val === 'Propane'){
        this.GasOilUtility = true;
      }
      else{
        this.GasOilUtility = false;
      }
      
    });
  } */



}
