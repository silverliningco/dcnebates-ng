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

  productLines!: any;  
  formGroup !: FormGroup ;  
  data!: any;
  

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        //rebateIds: [ [2] , Validators.required],
        
        // Hardcoded for now
        heated: true,
        cooled: true,
        storeId: 1,
        country: "US",
        state:"MA",
        utilityId: 3,
    
        eligibilityDetail: [[ { "name": "HP is sole source of heating","value": "Yes" } ]],
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
              console.log(this.productLines);

              // load by default the first element of the array
              this.formInfo = this.formGroup.value;
              this.formInfo.productLine = resp.body[0].cc_system_definition_id;
              let jsonPay2 = JSON.stringify(this.formInfo); 

              console.log(jsonPay2);
              
              this._ahriCombinationService.search(jsonPay2)
                  .subscribe( (resp:any) => {
                    console.log(resp);
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
  

}