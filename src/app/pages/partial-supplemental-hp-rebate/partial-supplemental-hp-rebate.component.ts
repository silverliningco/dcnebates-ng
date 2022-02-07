import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../services/AHRICombinations.service';


@Component({
  selector: 'app-partial-supplemental-hp-rebate',
  templateUrl: './partial-supplemental-hp-rebate.component.html',
  styleUrls: ['./partial-supplemental-hp-rebate.component.css']
})
export class PartialSupplementalHPRebateComponent implements OnInit {

    
  formGroup !: FormGroup ;  

  data!: any;

  showStep3ad4: boolean = false;

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



  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f);
    console.log(jsonPay);
    
    this._ahriCombinationService.save(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
            });
  }

  // funcion para capturar datos en tiempo real
  userData(){
    this.formGroup.get('energyDistributionMethod')?.valueChanges.subscribe( (val: any) => {
      
      if(val === 'Forced air'){
        this.showStep3ad4 = true;
      }
      else{
        this.showStep3ad4 = false;
      }
      
    });
  }


}
