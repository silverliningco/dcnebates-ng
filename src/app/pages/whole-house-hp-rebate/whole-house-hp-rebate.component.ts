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

  data!: any;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        /* rebate_id: [ [2] , Validators.required],
        title: ['Mass Save Air Source HP (Whole home)', Validators.required],
      
        equipment_size: this._formBuilder.group({
          manualj_heating_btuhCtrl: ['', Validators.required],
        }),

        energy_distribution: this._formBuilder.group({
          methodCtrl: ['', Validators.required],
        }), 
         */
        // **************************************************************
        rebateIds: [ [2] , Validators.required],
        
        /* Hardcoded for now */
        heated: true,
        cooled: true,
        storeId: 1,
        country: "US",
        state:"MA",
        utilityId: 3,
        
        showAllResults: [ true , Validators.required],

        nominalSize: this._formBuilder.group({
          heatingBTUH: ['', Validators.required],
        }),

        energyDistributionMethod: ['', Validators.required],


    });
  }


  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    // tranformandolo a json
    let jsonPay = JSON.stringify(f);

    console.log(jsonPay);

    this._ahriCombinationService.save(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
            });
  }

}