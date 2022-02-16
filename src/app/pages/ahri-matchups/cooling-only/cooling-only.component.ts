import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../../services/AHRICombinations.service';
// model
import {FormInfo} from '../../../models/formInfo.model';

@Component({
  selector: 'app-cooling-only',
  templateUrl: './cooling-only.component.html',
  styleUrls: ['./cooling-only.component.css']
})
export class CoolingOnlyComponent implements OnInit {

  formInfo: FormInfo = new FormInfo();

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
        }),

        state: ['', Validators.required],
        electricUtilityProvider: ['', Validators.required], 

    });

  }



  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }

    let jsonPay = JSON.stringify(f);    

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

  
  // ******* select *******
  changeState_electric(count: any) {
    this.electric = this.State.find((con: any) => con.name == count.value).electric;
  }
  // ******* select end *******


}

