import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// services
import { AHRICombinationService } from '../../services/AHRICombinations.service';
import { paramsDetailService } from '../../services/params-detail.service';

// model
import { FormInfo } from '../../models/formInfo.model';
import { detailParams } from '../../models/detail.model';


@Component({
  selector: 'app-partial-supplemental-hp-rebate',
  templateUrl: './partial-supplemental-hp-rebate.component.html',
  styleUrls: ['./partial-supplemental-hp-rebate.component.css']
})
export class PartialSupplementalHPRebateComponent implements OnInit {
 
  formInfo: FormInfo = new FormInfo();
  payloadDetailParams: detailParams = new detailParams();

  formGroup !: FormGroup ;  
  productLines!: any;
  data!: any;
  selectProductLine!: any;

  // ******* send eligibilityDetail *******
  getpreExistingHeating: any = { "name": "Pre-existing heating type", "value": [ "Electric Resistance Heat" ] };
  getHPSole: any = { "name": "HP is sole source of heating", "value": "No" }; 
  getexistingFurnace!: any;
  // ******* send eligibilityDetail end *******

  showStep4and5: boolean = false;
  submintOnlyFurnace: boolean = true;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder,
    public _paramsDetailService: paramsDetailService
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        // Hardcoded for now
        rebateIds: [[1], Validators.required],
        storeId: [ 1, Validators.required],
        showAllResults: [ true, Validators.required],
        country: ["US", Validators.required],
        state: ["MA" , Validators.required],
        electricUtilityId: [ 3, Validators.required],

        // data of form
        nominalSize: this._formBuilder.group({
          coolingTons: [ , Validators.required],
          heatingBTUH: [ , Validators.required],
        }),
        fuelSource: ['', Validators.required],
        gasOilUtilityId: [ , Validators.required],
        existingFurnaceType: ['', Validators.required],
        eligibilityDetail: ['', Validators.required],

    });


    // enable or disable option
    this.fuelSource();

    // json eligibilityDetail
    this.getExistingFurnaceType();
  }


  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }

    // send data of stepper to product line service
    this.formInfo = this.formGroup.value;
    
    // eligibility Detail is not sent if furnace = none
    if(this.formInfo.fuelSource = 'None'){
      this.formInfo.eligibilityDetail = [];
    } else {
      // json struct for eligibilityDetail
      this.formInfo.eligibilityDetail =  [this.getexistingFurnace, this.getpreExistingHeating, this.getHPSole];
    }

    this.loadDataDetailParams(this.formInfo);

    let jsonPay = JSON.stringify(this.formInfo); 

    console.log(jsonPay);

    this._ahriCombinationService.ProductLines(jsonPay)
            .subscribe( (resp:any) => {

              this.productLines = resp;

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

  // function to capture data in real time 
   fuelSource(){
    this.formGroup.get('fuelSource')?.valueChanges.subscribe( (val: any) => {

      if(val === 'Natural Gas' || val === 'Heating Oil' || val === 'Propane'){
        this.showStep4and5 = true;
        this.submintOnlyFurnace = false;
      }
      else{
        this.showStep4and5 = false;
        this.submintOnlyFurnace = true;
      }
      
    });
  }

  // ******** json eligibilityDetail  *****
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

}
