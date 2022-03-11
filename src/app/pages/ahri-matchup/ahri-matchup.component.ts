import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { AHRICombinationService } from '../../services/AHRICombinations.service';
import { paramsDetailService } from '../../services/params-detail.service';

// models
import { FormInfo } from '../../models/formInfo.model';
import { detailParams } from '../../models/detail.model';

@Component({
  selector: 'app-ahri-matchup',
  templateUrl: './ahri-matchup.component.html',
  styleUrls: ['./ahri-matchup.component.css']
})
export class AhriMatchupComponent implements OnInit {

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
      storeId: [1, Validators.required],
      showAllResults: [true, Validators.required],
      country: ["US", Validators.required],
      state: ["MA", Validators.required],

      // data of form
      nominalSize: this._formBuilder.group({
        heatingBTUH: [ , Validators.required],
        coolingTons: [ , Validators.required],
      }),
      fuelSource: ['', Validators.required]

    });
  }



  // *** submit info of form to endpoint product line    
  submitForm(f: FormGroup) {
    if (f.invalid) {
      return;
    }

    // send data of stepper to product line service
    this.formInfo = this.formGroup.value;
    
    // eligibility Detail is empty 
      this.formInfo.eligibilityDetail = [];


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


  // *** load data in detailParams model
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


  // *** submint info of product line to endpoint equipment search
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

}
