import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../services/AHRICombinations.service';
// model
import {FormInfo} from '../../models/formInfo.model';

@Component({
  selector: 'app-whole-house-hp-rebate',
  templateUrl: './whole-house-hp-rebate.component.html',
  styleUrls: ['./whole-house-hp-rebate.component.css']
})


export class WholeHouseHPRebateComponent implements OnInit {

  formInfo: FormInfo = new FormInfo();

  formGroup !: FormGroup ;  
  productLines!: any;
  data!: any;
  selectProductLine!: any;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        rebateIds: [ [2] , Validators.required],
        
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
          heatingBTUH: ['', Validators.required],
        }),

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
            });
  }

  
  // submint info of product line to endpoint equipment search
  submitProductLine(index: number) {

    // verificar que funcione bien cuando varie el numero de datos que se resiven
    //console.log(index)
    switch(index){
      case 0:
        this.selectProductLine = this.productLines[0];
        //console.log(this.selectProductLine);
        break;
      case 1:
        this.selectProductLine = this.productLines[1];
        //console.log(this.selectProductLine);
        break;
      case 2:
        this.selectProductLine = this.productLines[2];
        //console.log(this.selectProductLine);
        break;
      case 3:
        this.selectProductLine = this.productLines[3];
        //console.log(this.selectProductLine);
        break;
      case 4:
        this.selectProductLine = this.productLines[4];
        //console.log(this.selectProductLine);
        break;
    }

    /* nota: falta implementar los casos:
    1. la primera ves-> el valor de product line deve de enviarse con el primer valor del array
    2. el resto de veces -> debe de enviarse el product line con el valor que corresponda al boton que se haga click */

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
  

}