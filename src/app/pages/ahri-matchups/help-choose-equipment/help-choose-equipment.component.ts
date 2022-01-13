import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

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


  // arrayform - control - group 
    
  formGroup !: FormGroup ;  
  
 // arrayform - control - group  end

  // table
  displayedColumns: string[] = ['outdoorUnit', 'indoorUnit', 'furnace', 'seer', 'eer', 'hspf', 'afue', 'totalRebate'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // select

  selectedValue!: string;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];


  constructor(
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


  // arrayform - control - group 
    
  get formArray(): AbstractControl | null { 
    return this.formGroup.get('formArray'); 
  } 

  submit(f: FormGroup) {
    if (f.invalid) {
      return;
    }
    // tranformandolo a json
    let jsonPay = JSON.stringify(f);
    
    console.log(jsonPay);
  }

// arrayform - control - group  end

}




// table and select
const ELEMENT_DATA: PeriodicElement[] = [
  {outdoorUnit: 1, indoorUnit: 1, furnace: 1.0079, seer: 1,eer: 12,hspf: 12,afue: 12,totalRebate: 12},
  {outdoorUnit: 1, indoorUnit: 1, furnace: 1.0079, seer: 1,eer: 12,hspf: 12,afue: 12,totalRebate: 12}
];

export interface PeriodicElement {
  outdoorUnit: number;
  indoorUnit: number;
  furnace: number;
  seer: number;
  eer: number;
  hspf: number;
  afue: number;
  totalRebate: number;
}

//select
interface Food {
  value: string;
  viewValue: string;
}


