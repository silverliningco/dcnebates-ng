import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// temporal
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

// services
import {PartialSupplementalHPService} from '../../services/PartialSupplementalHP.service';


@Component({
  selector: 'app-partial-supplemental-hp-rebate',
  templateUrl: './partial-supplemental-hp-rebate.component.html',
  styleUrls: ['./partial-supplemental-hp-rebate.component.css']
})
export class PartialSupplementalHPRebateComponent implements OnInit {

    
  formGroup !: FormGroup ;  

  data!: any;
  cargando: boolean = true;
  showTable: boolean = false;

  
  constructor(
    public _partialSupplementalHPService: PartialSupplementalHPService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        rebate_id: [ [1] , Validators.required],
        title: ['Mass Save Air Source HP (Partial home\/supplemental)', Validators.required],
        
        equipment_size: this._formBuilder.group({
          cooling_tomsCtrl: ['', Validators.required],
          heating_btuhCtrl: ['', Validators.required],
        }),

        energy_distribution: this._formBuilder.group({
          methodCtrl: ['', Validators.required],
        }),

        furnace: this._formBuilder.group({
          fuelCtrl: ['', Validators.required],
        }),

        eligibility_detail: this._formBuilder.group({
          gas_oil_utilityCtrl: ['', Validators.required],
          existen_furnace_typeCtrl: ['', Validators.required],
        }),
      
     
    });
  }



  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f);
    
    this._partialSupplementalHPService.save(jsonPay)
            .subscribe( (resp:any) => {
              this.data = resp.body;
              console.log(resp);
              this.cargando = false;
              this.showTable = true;
            });
  }


}
