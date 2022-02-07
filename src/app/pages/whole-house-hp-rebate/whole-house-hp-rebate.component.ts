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

    // ************************************************************************
    //  capturar los valores en tiemporeal
    this.userData();

  }


  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f);

    this._ahriCombinationService.save(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
            });
  }

  // funcion para capturar datos en tiempo real
  userData(){
    this.formGroup.get('nominalSize.heatingBTUH')?.valueChanges.subscribe( (val: any) => {
      console.log(`heatingBTUH -> ${val}`);
    });
  }
  

}