import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../services/AHRICombinations.service';
// model
import {FormInfo} from '../../models/formInfo.model';


@Component({
  selector: 'app-partial-supplemental-hp-rebate',
  templateUrl: './partial-supplemental-hp-rebate.component.html',
  styleUrls: ['./partial-supplemental-hp-rebate.component.css']
})
export class PartialSupplementalHPRebateComponent implements OnInit {
 
  formInfo: FormInfo = new FormInfo();

  formGroup !: FormGroup ;  
  productLines!: any;
  data!: any;
  selectProductLine!: any;

  showfurnaceInfo: boolean = false;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        rebateIds: [ [1] , Validators.required],

        // Hardcoded for now
        heated: true,
        cooled: true,
        storeId: 1,
        country: "US",
        state:"MA",
        utilityId: 3,
        //  Hardcoded for now end

        showAllResults: [ true , Validators.required],

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

    //  capturar los valores en tiemporeal
    this.userData();
  }


  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }

    let jsonPay = JSON.stringify(f);    

    this._ahriCombinationService.ProductLines(jsonPay)
            .subscribe( (resp:any) => {

              console.log(resp);
              this.productLines = resp.body;
            });
  }

  // submint info of product line to endpoint equipment search
  submitProductLine(index: number) {

    switch(index){
      case 0:
        this.selectProductLine = this.productLines[0];
        break;
      case 1:
        this.selectProductLine = this.productLines[1];
        break;
      case 2:
        this.selectProductLine = this.productLines[2];
        break;
      case 3:
        this.selectProductLine = this.productLines[3];
        break;
      case 4:
        this.selectProductLine = this.productLines[4];
        break;
    }

    // payload 
    this.formInfo = this.formGroup.value;
    this.formInfo.productLine = this.selectProductLine;
    console.log(this.formInfo);
    let jsonPay = JSON.stringify(this.formInfo); 
    
    this._ahriCombinationService.search(jsonPay)
            .subscribe( (resp:any) => {

              console.log(resp),
              this.data = resp.body;
            });
  }
 


 
/* 
  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f);
    console.log(jsonPay);
    
    this._ahriCombinationService.search(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
            });
  } */

  // funcion para capturar datos en tiempo real
  userData(){
    this.formGroup.get('fuelSource')?.valueChanges.subscribe( (val: any) => {

      console.log(val);
      
      if(val === 'Natural Gas' || val === 'Oil'){
        this.showfurnaceInfo = true;
      }
      else{
        this.showfurnaceInfo = false;
      }
      
    });
  }


}
