import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

// services
import { AHRICombinationService } from '../../services/AHRICombinations.service';
// model
import { FormInfo } from '../../models/formInfo.model';

@Component({
  selector: 'app-whole-house-hp-rebate',
  templateUrl: './whole-house-hp-rebate.component.html',
  styleUrls: ['./whole-house-hp-rebate.component.css']
})


export class WholeHouseHPRebateComponent implements OnInit {

  formInfo: FormInfo = new FormInfo();

  productLines!: any;
  formGroup !: FormGroup;
  data!: any;


  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

      nominalSize: this._formBuilder.group({
        heatingBTUH: ['', Validators.required],
        coolingTons: 3.0
      }),
      // Hardcoded for now
      storeId: 1,
      showAllResults: true,
      fuelSource: 'Natural Gas',
      country: "US",
      state: "MA",
      electricUtilityId: 3,
      gasOilUtilityId: 3,
      eligibilityDetail: [[{ "name": "Pre-existing heating type", "value": ["Electric Resistance Heat"] }, { "name": "HP is sole source of heating", "value": "Yes" }]],
      rebateIds: [[2], Validators.required]
    });

  }


  // submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }

    let jsonPay = JSON.stringify(f);

    this._ahriCombinationService.ProductLines(jsonPay)
      .subscribe((resp: any) => {

        this.productLines = resp.body;

        // load by default the first element of the array
        this.formInfo = this.formGroup.value;
        this.formInfo.systemTypeId = resp.body[0].id;

        this.formInfo.matchFilters = null;
        this.formInfo.rangeFilters = null;
        let jsonPay2 = JSON.stringify(this.formInfo);

        this._ahriCombinationService.search(jsonPay2)
          .subscribe((resp: any) => {

            this.data = resp.body;
          });

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
      .subscribe((resp: any) => {
        this.data = resp.body;
      });
  }


}