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

  EligibilityDetailStructure!: any;

  showStep4and5: boolean = false;
  submintOnlyFurnace: boolean = true;

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
        
        nominalSize: this._formBuilder.group({
          coolingTons: [ , Validators.required],
          heatingBTUH: [ , Validators.required],
        }),
        fuelSource: ['', Validators.required],
        gasOilUtility: ['', Validators.required],
        eligibilityDetail:[ [ { "name": "HP is sole source of heating","value": "No" } ]]

    });

    //  capturar los valores en tiemporeal
    this.fuelSource();
    this.EligibilityDetailNewStructure();
  }


  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    
    this.formInfo = this.formGroup.value;
    this.formInfo.eligibilityDetail = this.EligibilityDetailStructure;
    let jsonPay = JSON.stringify(this.formInfo); 

    this._ahriCombinationService.ProductLines(jsonPay)
            .subscribe( (resp:any) => {

              this.productLines = resp.body;

              // cargar por defecto el primer elemento del arreglo
              this.formInfo = this.formGroup.value;
              this.formInfo.productLine = resp.body[0];
              let jsonPay2 = JSON.stringify(this.formInfo); 
              console.log(this.formInfo);
              
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
       this.EligibilityDetailStructure = [ { "name": "Condensing","value": "Condensing" } ];
      } else {
        this.EligibilityDetailStructure = [ { "name": "Non-condensing", "value": "Non-condensing" } ];
      }
    });
  }  


}
