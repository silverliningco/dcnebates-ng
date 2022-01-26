import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// services
import {AHRIMatchupsService} from '../../../services/AHRIMatchups.service';

// model
import {AHRIMatchups}  from '../../../models/AHRIMatchups.model';

// temporal
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-help-choose-equipment',
  templateUrl: './help-choose-equipment.component.html',
  styleUrls: ['./help-choose-equipment.component.css']
})
export class HelpChooseEquipmentComponent implements OnInit {

  ahriMatchups: AHRIMatchups[] = []; 

  columnsTable: string[] = ['nr','outdoorUnit', 'indoorUnit', 'furnace', 'seer', 'eer', 'hspf', 'afue', 'totalRebate'];

  formGroup !: FormGroup ;  

  data!: any;
  cargando: boolean = false;

  // ******* select *******
  State: Array<any> = [
    { name: 'MA', electric: ['Cape Light Compact', 'Eversource', 'National Grid', 'Unitil', 'Marblehead Municipal Light Department', 'Other'], gas: ['Berkshire Gas', 'Eversource', 'Liberty', 'National Grid', 'Unitil', 'Other'] },
    { name: 'ME', electric: ['aaaaaaa', 'bbbbbbb'], gas: ['aaaaaa', 'bbbbbbb'] },
    { name: 'NH', electric: ['11111', '222222'], gas: ['1111', '22222'] },
    { name: 'RI', electric: ['National Grid'], gas: ['National Grid']  },
  ];
  electric:  Array<any> = [];
  gas:  Array<any> = [];

  // ******* select end *******

  constructor(
    public _AHRIMatchupsService: AHRIMatchupsService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      
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
          stateCtrl: ['', Validators.required],
          electric_utitlity_providerCtrl: ['', Validators.required],
          gas_oil_utilityCtrl: ['', Validators.required],
          existen_furnace_typeCtrl: ['', Validators.required],
          hpS_source_headCtrl: ['', Validators.required]
        }),
      
     
    });
  }

    
  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    let jsonPay = JSON.stringify(f);
    
    console.log(jsonPay);
    

    this._AHRIMatchupsService.save(jsonPay)
          .subscribe( (resp:any) => {
            this.data = resp;
            console.log(this.data);
          });
  }

  loadTable( ) {
    //console.log(this.data);
    
    //this.cargando = true;
  }

 


  // ******* select *******
  changeState_electric(count: any) {
    this.electric = this.State.find((con: any) => con.name == count.value).electric;
  }

  changeState_gas(count: any) {
    this.gas = this.State.find((con: any) => con.name == count.value).gas;
  }
  // ******* select end *******
}
