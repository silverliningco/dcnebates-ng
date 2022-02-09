import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../services/AHRICombinations.service';


@Component({
  selector: 'app-whole-house-hp-rebate',
  templateUrl: './whole-house-hp-rebate.component.html',
  styleUrls: ['./whole-house-hp-rebate.component.css']
})


export class WholeHouseHPRebateComponent implements OnInit {

  formGroup !: FormGroup ;  
  productLine!: any;
  data!: any;

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
              console.log(resp.body);
              this.productLine = resp.body;
            });
  }

  
  // submint info of product line to endpoint equipment search
  submitProductLine(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f);

    this._ahriCombinationService.ProductLines(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
            });
  }
  

}