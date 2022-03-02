import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

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

  EligibilityDetailStructure!: any;

  showStep4and5: boolean = false;
  submintOnlyFurnace: boolean = true;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder,
    public _paramsDetailService: paramsDetailService
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

       /*  rebateIds: [ [1] , Validators.required],

        // Hardcoded for now
        heated: true,
        cooled: true,
        storeId: 1,
        country: "US",
        state:"MA",
        utilityId: 3,
        //  Hardcoded for now end

        showAllResults: [ true , Validators.required],
        
        nominalSize: this._formBuilder.group({
          coolingTons: [ , Validators.required],
          heatingBTUH: [ , Validators.required],
        }),
        fuelSource: ['', Validators.required],
        gasOilUtility: ['', Validators.required],
        eligibilityDetail:[ [ { "name": "HP is sole source of heating","value": "No" } ]] */

        //************************************************************************************ */
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
        gasOilUtilityId: [3, Validators.required],
        eligibilityDetail: [[ { "name": "Pre-existing heating type","value": [ "Natural Gas" ] }, { "name": "HP is sole source of heating","value": "No" }]],
        existingFurnaceType: ['', Validators.required]

    });


    //  capturar los valores en tiemporeal
    this.fuelSource();
    //this.EligibilityDetailNewStructure();
  }//


  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    // load data in detailParams model
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

    // send data of stepper to product line service
    this.formInfo = this.formGroup.value;
    //this.formInfo.eligibilityDetail = this.EligibilityDetailStructure;
    let jsonPay = JSON.stringify(this.formInfo); 

    console.log(jsonPay);

    this._ahriCombinationService.ProductLines(jsonPay)
            .subscribe( (resp:any) => {

              console.log(resp);

              this.productLines = resp.body;

              // load by default the first element of the array
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
    this.formInfo.productLine = id;
    this.formInfo.matchFilters = null;
    this.formInfo.rangeFilters = null;

    let jsonPay = JSON.stringify(this.formInfo); 
    console.log(this.formInfo);
    
    this._ahriCombinationService.search(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
            });
  }

  // funcion para capturar datos en tiempo real 
   fuelSource(){
    this.formGroup.get('fuelSource')?.valueChanges.subscribe( (val: any) => {
      console.log(val);
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

  // prueva para cambiar de clave valor -> name value
  EligibilityDetailNewStructure(){
    this.formGroup.get('eligibilityDetail')?.valueChanges.subscribe( (val: any) => {

      if (val === 'Condensing') {
       this.EligibilityDetailStructure = [ { "name": "Existing furnace type","value": "Condensing" } ];
      } else {
        this.EligibilityDetailStructure = [ { "name": "Existing furnace type", "value": "Non-condensing" } ];
      }
    });
  }  


}
