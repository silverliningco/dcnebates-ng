import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-heating-cooling',
  templateUrl: './heating-cooling.component.html',
  styleUrls: ['./heating-cooling.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class HeatingCoolingComponent implements OnInit {
  
  nominalSizeGroup !: FormGroup;
  furnaceGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;
  payloadRebates: Array<any> = [];

  stepperOrientation: Observable<StepperOrientation>;

  myCommerInfo !: any;
  productLines!: any;
  filters!: any;
  results!: any;
  noResults!: boolean;
  p: number = 1;
  beginning?: number;
  end?: number;
  rows!: number;

  constructor(
    private _formBuilder: FormBuilder,
    public breakpointObserver: BreakpointObserver,
    private _api: ApiService
    ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {

    this.myCommerInfo = {
      storeId: 1,
      showAllResults: false
    }

    this.nominalSizeGroup = this._formBuilder.group({
      heatingBTUH: ['', [this.ValidateHeatingBTUH, this.ValidateNumber]],
      coolingTons: ['', [this.ValidateCoolingToms, this.ValidateNumber]],
    });

    this.furnaceGroup = this._formBuilder.group({
      fuelSource: ['', Validators.required],
    });
    this.productLinesGroup = this._formBuilder.group({
      productLine: ['', Validators.required],
    });

    this.filtersGroup = this._formBuilder.group({
      indoorUnitSKU: ['', Validators.required],
      outdoorUnitSKU: ['', Validators.required],
      furnaceSKU: ['', Validators.required],
    });

    // If small screen, load only 3 rows for results else 10.
    this.breakpointObserver
      .observe(['(min-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.rows = 10;
        } else {
          this.rows = 3;
        }
      });

    this.ObtainPaginationText();
  }

  submitForm() {
    let payload = {
      commerceInfo: this.myCommerInfo,
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      requiredRebates: this.payloadRebates
    }
    this.CallProductLines(payload);
  }

  // CallProductLines
  CallProductLines(payload: any) {
    this._api.ProductLines(JSON.stringify(payload)).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.productLines = resp

          // Call Filters with selected product line
          this.productLinesGroup.controls['productLine'].setValue(resp[0].id);
          payload.systemTypeId = this.productLinesGroup.controls['productLine'].value;
          payload.filters = [];
          this.CallFilters(payload);

          this.noResults = false;
        } else {
          this.noResults = true;
        }
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }
  // SelectProductLine
  SelectProductLine(systemTypeId:number) {
    let payload = {
      commerceInfo: {
        storeId: 1,
        showAllResults: false
      },
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      systemTypeId:systemTypeId,
      filters: [],
      requiredRebates: this.payloadRebates   
    }

    // Call Filters with selected product line
    this.filtersGroup.controls['indoorUnitSKU'].setValue("");
    this.filtersGroup.controls['outdoorUnitSKU'].setValue("");
    this.filtersGroup.controls['furnaceSKU'].setValue("");
    this.CallFilters(payload)

    this.results = [];
  }

  // CallFilters
  CallFilters(payload: any) {
    this._api.Filters(JSON.stringify(payload)).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.filters = resp;
          this.CallSearch(payload);
        } else {
          alert("No filters where found.")
        }
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  //selectFilters
  SelectFilters() {

    let myfilters: {
      filterName: string;
      filterValues: any[];
    }[] = [];

    Object.entries(this.filtersGroup.value).forEach(
      ([key, value]) => {
        if (value && value != "") {
          myfilters.push({
            filterName: key,
            filterValues: [value]
          });
        } else{
          myfilters.push({
            filterName: key,
            filterValues: ["*"]
          });
        }
      }
    );

    let payload = {
      commerceInfo: {
        storeId: 1,
        showAllResults: false
      },
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      systemTypeId: this.productLinesGroup.controls['productLine'].value,
      filters: myfilters,
      requiredRebates: this.payloadRebates
    }
    this.CallFilters(payload);
    this.CallSearch(payload);
  }

  // Call search
  CallSearch(payload: any) {
    this._api.Search(JSON.stringify(payload)).subscribe({
      next: (resp) => {
          this.results = resp;
          this.ObtainPaginationText();
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  // Pagination funtions
  ObtainPaginationText() {
    let totalPages = Math.ceil(this.results?.length / this.rows)
    this.beginning = this.p === 1 ? 1 : this.rows * (this.p - 1) + 1;
    this.end = this.p === totalPages ? this.results?.length : this.beginning + this.rows - 1
  }
  pageChanged(event: number) {
    this.p = event;
    this.ObtainPaginationText();
  }

  /* validators */
  /* note: it will always show the error: "Cooling tons is required"
     when "e" is entered as input, because its type = object and its value = null */
  ValidateNumber(control: AbstractControl) : ValidationErrors | null  {

    let coolingToms = control.value;
    let typeCT = typeof coolingToms;

    if (typeCT === 'number' ){
      return null;
    } 
    else {
      if (typeCT === 'object' &&  coolingToms === null){
        return  { null_not_permit : true };
      } if (typeCT === 'string' &&  coolingToms === ''){
        return  { need_1_or_3_characters : true };
      } 
      else{
        return  { is_not_number : true };
      }
      
    }
   
  }

  ValidateCoolingToms(control: AbstractControl) : ValidationErrors | null  {

    let coolingToms = control.value;
    let lengthCoolingToms!: string;

    if (coolingToms != null){
      lengthCoolingToms = coolingToms.toString();
    }else {
      return  { null_not_permit : true };
    }
    
    
    if (lengthCoolingToms.length === 1 || lengthCoolingToms.length === 3 ) {
      if (coolingToms === 0.5 || coolingToms === 1.0 || coolingToms === 1.5 || coolingToms === 2.0 || coolingToms === 2.5 ||
        coolingToms === 3.0 || coolingToms === 3.5 || coolingToms === 4.0 || coolingToms === 4.5 || coolingToms === 5.0 ||
        coolingToms === 1 || coolingToms === 2 || coolingToms === 3 || coolingToms === 4 || coolingToms === 5){
        return null;
      }
      else {
        return  { CT_invalid_value: true };
      }
    }
    else {
      return  { need_1_or_3_characters: true };
    }


    
  }


  ValidateHeatingBTUH(control: AbstractControl) : ValidationErrors | null  {

    let heatingBTUH = control.value;
    let lengthHeatingBTUH!: string;    


    if (heatingBTUH != null){
      lengthHeatingBTUH = heatingBTUH.toString();
    }else {
      return  { null_not_permit: true };
    }
    

    // first verify if the number is integer
     if (heatingBTUH % 1 === 0){
      if (lengthHeatingBTUH.length === 4 || lengthHeatingBTUH.length === 5 || lengthHeatingBTUH.length === 6) {

        if (heatingBTUH >= 8000 && heatingBTUH <= 135000 ){

          return null;
        } else {
          return  { Hbtuh_invalid_value: true };
        }

      } else {
        return  {  need_between_4_6_characters: true };
      }

    } else {
      return  { it_not_integer: true };
    }

  }

}

