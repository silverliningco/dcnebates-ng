import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRICombinationService} from '../../../services/AHRICombinations.service';
// model
import {FormInfo} from '../../../models/formInfo.model';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-heating-cooling',
  templateUrl: './heating-cooling.component.html',
  styleUrls: ['./heating-cooling.component.css']
})
export class HeatingCoolingComponent implements OnInit {

  formInfo: FormInfo = new FormInfo();

  formGroup !: FormGroup ;  
  productLines!: any;
  data!: any;
  selectProductLine!: any;

  showfurnaceFuel: boolean = false;
  GasOilUtility: boolean = false;

  // ******* select *******
  State: Array<any> = [
    { name: 'MA', electric: ['Cape Light Compact', 'Eversource', 'National Grid', 'Unitil', 'Marblehead Municipal Light Department', 'Other'], gas: ['Berkshire Gas', 'Eversource', 'Liberty', 'National Grid', 'Unitil', 'Other'] },
    { name: 'ME', electric: ['Other'], gas: ['Other'] },
    { name: 'NH', electric: ['Other'], gas: ['Other'] },
    { name: 'RI', electric: ['National Grid', 'Other'], gas: ['National Grid', 'Other']  },
  ];
  electric:  Array<any> = [];
  gas:  Array<any> = [];

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
          heatingBTUH: [ , Validators.required],
        }),

        fuelSource: ['', Validators.required],

        state: ['', Validators.required],
        electricUtilityProvider: ['', Validators.required],
        gasOilUtility:  ['', Validators.required],

        eligibilityDetail:[ [ { "name": "HP is sole source of heating","value": "No" } ]],

        //eligibilityDetail: this._formBuilder.group({
          preExistingHeatingType: ['', Validators.required],
          HPSoleSource: ['', Validators.required],
          existingFurnaceType: ['', Validators.required],
        //}),

    });
  
    //  capturar los valores en tiemporeal
    this.fuelSource();
    this.getUtility(this.furnaceFuel(), this.state());
  
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
  
  // ******* select *******
  changeState_electric(count: any) {
    this.electric = this.State.find((con: any) => con.name == count.value).electric;
  }

  changeState_gas(count: any) {
    this.gas = this.State.find((con: any) => con.name == count.value).gas;
  }
  // ******* select end *******

  // get furnce fuel
  furnaceFuel(){
    this.formGroup.get('fuelSource')?.valueChanges.subscribe( (runFuel: any) => {
      console.log(runFuel);  
      return runFuel;
    });
  }

  // get state
  state(){
    this.formGroup.get('fuelSource')?.valueChanges.subscribe( (runFuel: any) => {
      console.log(runFuel);
      return runFuel
    });
  }

  // get utilities
  getUtility(fuel: any, state: any){
    // call service
    this._ahriCombinationService.getUtilities(fuel, state)
          .subscribe((resp:any) => {
            console.log(resp);
          });
    

  }

  // funcion para capturar datos en tiempo real

  fuelSource(){
    this.formGroup.get('fuelSource')?.valueChanges.subscribe( (val: any) => {
      
      if(val === 'Natural Gas' || val === 'Heating Oil' || val === 'Propane'){
        this.GasOilUtility = true;
      }
      else{
        this.GasOilUtility = false;
      }
      
    });
  }



}
