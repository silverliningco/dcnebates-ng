import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// services
import {AHRICombinationService} from '../../../services/AHRICombinations.service';

@Component({
  selector: 'app-know-model-nr',
  templateUrl: './know-model-nr.component.html',
  styleUrls: ['./know-model-nr.component.css']
})
export class KnowModelNrComponent implements OnInit {
    
  formGroup !: FormGroup ;  

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

        rebate_id: [ null , Validators.required],
        title: ['Mass Save Gas Heating', Validators.required],
      
        model_numbers: this._formBuilder.group({
          outdoor_unitCtrl: ['', Validators.required],
          indoor_unitCtrl: ['', Validators.required],
          replace_displace_fuelCtrl: ['', Validators.required],
          // no se considero el campo que esta en duda
          furnaceCtrl: ['', Validators.required],
          fuelCtrl: ['', Validators.required],
        }),

        eligibility_detail: this._formBuilder.group({
          stateCtrl: ['', Validators.required],
          electric_utitlity_providerCtrl: ['', Validators.required],
          gas_oil_utilityCtrl: ['', Validators.required],
          existen_furnace_typeCtrl: ['', Validators.required],
          hpS_source_headCtrl: ['', Validators.required]
        }),
      
     
    });
  }

  //  control - group 

  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f);
  
    this._ahriCombinationService.save(jsonPay)
          .subscribe( a => {
          });
  }


  // select 
  changeState_electric(count: any) {
    this.electric = this.State.find((con: any) => con.name == count.value).electric;
  }

  changeState_gas(count: any) {
    this.gas = this.State.find((con: any) => con.name == count.value).gas;
  }
  //select end


  goToLink(){
    let url = 'https://marbleheadelectric.com/pdfs/rebates/2021-Marblehead-Cool-Homes-Application-ACC.pdf';
    window.open(url, "_blank");    
  }

}
