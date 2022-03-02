import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

// services
import { AHRICombinationService } from '../../services/AHRICombinations.service';
import { paramsDetailService } from '../../services/params-detail.service';

// model
import { FormInfo } from '../../models/formInfo.model';
import { detailParams } from '../../models/detail.model';

@Component({
  selector: 'app-whole-house-hp-rebate',
  templateUrl: './whole-house-hp-rebate.component.html',
  styleUrls: ['./whole-house-hp-rebate.component.css']
})


export class WholeHouseHPRebateComponent implements OnInit {

  formInfo: FormInfo = new FormInfo();
  payloadDetailParams: detailParams = new detailParams();


  productLines!: any;
  formGroup !: FormGroup;
  data!: any;


  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder,
    public _paramsDetailService: paramsDetailService
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      // Hardcoded for now
      rebateIds: [[2], Validators.required],
      storeId: [ 1, Validators.required],
      showAllResults: [ true, Validators.required],
      country: ["US", Validators.required],
      state: ["MA" , Validators.required],
      electricUtilityId: [ 3, Validators.required],
      //electricUtilityId: [[2,3,5,6], Validators.required], 
      gasOilUtilityId: [ 3, Validators.required],
      // gasOilUtilityId: [[2,3,5,6], Validators.required],
      fuelSource: ['Natural Gas', Validators.required],
      eligibilityDetail: [[{ "name": "Pre-existing heating type", 
                             "value": ["Electric Resistance Heat"] }, 
                           { "name": "HP is sole source of heating", 
                             "value": "Yes" }]],

      // data of form
      nominalSize: this._formBuilder.group({
        heatingBTUH: ['', Validators.required],
        coolingTons: [  3.0, Validators.required],// Hardcoded for now
      }),
  
    });

  }


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