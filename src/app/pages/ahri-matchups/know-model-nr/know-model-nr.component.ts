import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

// tempotal
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

// services
import {AHRIMatchupsService} from '../../../services/AHRIMatchups.service';

@Component({
  selector: 'app-know-model-nr',
  templateUrl: './know-model-nr.component.html',
  styleUrls: ['./know-model-nr.component.css']
})
export class KnowModelNrComponent implements OnInit {

  // arrayform - control - group 
    
  formGroup !: FormGroup ;  
  
 // arrayform - control - group  end

 // select
  State: Array<any> = [
    { name: 'MA', electric: ['Cape Light Compact', 'Eversource', 'National Grid', 'Unitil', 'Marblehead Municipal Light Department', 'Other'], gas: ['Berkshire Gas', 'Eversource', 'Liberty', 'National Grid', 'Unitil', 'Other'] },
    { name: 'ME', electric: ['aaaaaaa', 'bbbbbbb'], gas: ['aaaaaa', 'bbbbbbb'] },
    { name: 'NH', electric: ['11111', '222222'], gas: ['1111', '22222'] },
    { name: 'RI', electric: ['National Grid'], gas: ['National Grid']  },
  ];
  electric:  Array<any> = [];
  gas:  Array<any> = [];

// select end
 

  // table
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
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
    public _AHRIMatchupsService: AHRIMatchupsService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({

        rebate_id: [ [3] , Validators.required],
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

    this._AHRIMatchupsService.save(jsonPay)
          .subscribe( a => {
            console.log(a);
          });
  }

  // control - group  end

  // select 
  changeState_electric(count: any) {
    //console.log(count);
    this.electric = this.State.find((con: any) => con.name == count.value).electric;
  }

  changeState_gas(count: any) {
    //console.log(count);
    this.gas = this.State.find((con: any) => con.name == count.value).gas;
  }
  //select end


}





const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

//select 
interface Food {
  value: string;
  viewValue: string;
}
