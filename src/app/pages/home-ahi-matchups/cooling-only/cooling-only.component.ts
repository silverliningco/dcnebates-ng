import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cooling-only',
  templateUrl: './cooling-only.component.html',
  styleUrls: ['./cooling-only.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class CoolingOnlyComponent implements OnInit {

  commerceInfoGroup !: FormGroup;
  nominalSizeGroup !: FormGroup;
  locationGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;
  payloadRebates: Array<any> = [];

  stepperOrientation: Observable<StepperOrientation>;

  productLines!: any;
  filters: Array<any> = [];
  
  results!: any;
  noResults!: boolean;
  p: number = 1;
  beginning?: number;
  end?: number;
  rows!: number;

  /* display columns when they have data in table of results */
  showFurnace: boolean = true;
  showHSPF: boolean = true;

  /* display title when exist filter */
  showModelNrs: boolean = false;
  showIndoorUnit: boolean = false;
  showOptions: boolean = false;

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

    this.commerceInfoGroup = this._formBuilder.group({
      storeId: 1,
      showAllResults: [false, Validators.required],
    });

    this.nominalSizeGroup = this._formBuilder.group({
      coolingTons: ['', Validators.required],
    });

    this.productLinesGroup = this._formBuilder.group({
      productLine: ['', Validators.required],
    });

    this.filtersGroup = this._formBuilder.group({
      indoorUnitSKU: ['', Validators.required],
      outdoorUnitSKU: ['', Validators.required],
      furnaceSKU: ['', Validators.required],

      coilType: ['', Validators.required],
      flushCoils: ['', Validators.required],
      coilCasing: ['', Validators.required],
      configuration: ['', Validators.required],
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
      commerceInfo: this.commerceInfoGroup.value,
      searchType: "Cooling Only",
      nominalSize: this.nominalSizeGroup.value,
      requiredRebates: this.payloadRebates
    }
    this.CallProductLines(payload);
  }

  CallProductLines(payload: any) {
    this._api.ProductLines(JSON.stringify(payload)).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.productLines = resp

          // Call Filters with selected product line
          this.productLinesGroup.controls['productLine'].setValue(resp[0].id);
          payload.systemTypeId = this.productLinesGroup.controls['productLine'].value;
          payload.filters = [];
          this.CallFilters(payload, '');

          this.noResults = false;
        } else {
          this.noResults = true;
        }
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  SelectProductLine(systemTypeId:number) {
    let payload = {
      commerceInfo: this.commerceInfoGroup.value,
      searchType: "Cooling Only",
      nominalSize: this.nominalSizeGroup.value,
      systemTypeId:systemTypeId,
      filters: [],
      requiredRebates: this.payloadRebates   
    }

    // Call Filters with selected product line
    this.filtersGroup.controls['indoorUnitSKU'].setValue("");
    this.filtersGroup.controls['outdoorUnitSKU'].setValue("");
    this.filtersGroup.controls['furnaceSKU'].setValue("");
    this.filtersGroup.controls['coilType'].setValue("");
    this.filtersGroup.controls['flushCoils'].setValue("");
    this.filtersGroup.controls['coilCasing'].setValue("");
    this.filtersGroup.controls['configuration'].setValue("");
    this.CallFilters(payload,'')

    this.p = 1;

    this.results = [];
  }

  CallFilters(payload: any, mySelectedFilter:any) {
    this._api.Filters(JSON.stringify(payload)).subscribe({
      next: (resp:Array<any>) => {
        if (resp.length > 0) {

          // in selected filter value is empty, rdont filter response
          if (mySelectedFilter !="" && this.filtersGroup.controls[mySelectedFilter].value != "") {
            const mySelectedOptions = this.filters.filter(f => f.filterName == mySelectedFilter);
            const respFilters:Array<any> =[];

            resp.forEach(element => {
              if(element.filterName== mySelectedFilter){
                element = mySelectedOptions[0];
              }
              respFilters.push(element);
            });
            this.filters = respFilters;

          } else{
            // else, filter 
            this.filters = resp;
          }

          this.showTitleFilter(this.filters);
          this.CallSearch(payload);
        } else {
          alert("No filters where found.")
        }
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  showTitleFilter(filters: any){

    this.showModelNrs = false;
    this.showIndoorUnit = false;
    this.showOptions = false;

    filters.forEach((ele : any) => {
      if (ele.filterValues.length >= 1 && ele.filterName === 'outdoorUnitSKU' || ele.filterName === 'indoorUnitSKU' || ele.filterName === 'furnaceSKU' ){
        this.showModelNrs = true
      }

      if (ele.filterValues.length >= 1 && ele.filterName === 'coilType' || ele.filterName === 'configuration' || ele.filterName === 'coilCasing' ){
        this.showIndoorUnit = true
      }

      if (ele.filterValues.length >= 1 && ele.filterName === 'flushCoils' ){
        this.showOptions = true
      }

    });
  }


  SelectFilters(myFilterName:any) {

    let myfilters: {
      filterName: string;
      filterValues: any[];
    }[] = [];

    Object.entries(this.filtersGroup.value).forEach(
      ([key, value]) => {
        if (value && value != "") {
          myfilters.push({
            filterName: key,
            filterValues: (Array.isArray(value)) ? value :[value]
          });
          this.p = 1;
        } else{
          myfilters.push({
            filterName: key,
            filterValues: ["*"]
          });
          this.p = 1;
        }
      }
    );

    let payload = {
      commerceInfo: this.commerceInfoGroup.value,
      searchType: "Cooling Only",
      nominalSize: this.nominalSizeGroup.value,
      systemTypeId: this.productLinesGroup.controls['productLine'].value,
      filters: myfilters,
      requiredRebates: this.payloadRebates
    }
    this.CallFilters(payload, myFilterName);
  }

  CallSearch(payload: any) {
    this._api.Search(JSON.stringify(payload)).subscribe({
      next: (resp) => {
          this.results = resp;
          this.showColum(this.results);
          this.ObtainPaginationText();
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  showColum(resp: any){

    /* If no values are received for the furnaceSKU, then the columns should not be displayed:
        furnaceSKU, furnaceConfigurations, AFU.
       In the case of the HSPF column, it is handled independently
    */

    let countFurnace: number = 0;
    let countHSPF: number = 0;

    /* furnaceSKU */
    resp.forEach((element:any) => {
      if (element.furnaceSKU != null){
        countFurnace += 1;
      }
    });

    if (countFurnace === 0 ){
      this.showFurnace = false;
    } else {
      this.showFurnace = true;
    } 

    /* HSPF */
    resp.forEach((element:any) => {
      if (element.HSPF != null){
        countHSPF += 1;
      }
    });

    if (countHSPF === 0 ){
      this.showHSPF = false;
    } else {
      this.showHSPF = true;
    } 
  }


   // Pagination funtions
   ObtainPaginationText() {
    let totalPages = Math.ceil(this.results?.length / this.rows)
    this.beginning = this.p === 1 ? 1 : this.rows * (this.p - 1) + 1;
    this.end = this.p === totalPages ? this.results?.length : this.beginning + this.rows - 1
  }
  pageChanged(event: number) {
    this.p = event;
  }

}
