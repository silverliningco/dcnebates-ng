import { Component, OnInit } from '@angular/core';
import { bridgeService } from '../../../services/bridge.service';
import { ApiService } from '../../../services/api.service';
import { payloadForm } from '../../../models/payloadFrom';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-results-ahri',
  templateUrl: './results-ahri.component.html',
  styleUrls: ['./results-ahri.component.css']
})
export class ResultsAhriComponent implements OnInit {

  commerceInfoGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;

  productLines!: any;
  noResults!: boolean;
  results!: any;
  filters: Array<any> = [];

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm;

  /* pagination */
  p: number = 1;
  beginning?: number;
  end?: number;
  rows!: number;

  /* display columns when they have data in table of results */
  showFurnace: boolean = true;
  showHSPF: boolean = true;
  showTotal: boolean = true;

  /* display title when exist filter */
  showModelNrs: boolean = false;
  showIndoorUnit: boolean = false;
  showOptions: boolean = false;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _bridge: bridgeService
  ) { }

  ngOnInit(): void {

    /* receiving form data */
    this._bridge.sentParams
      .subscribe((payload: any) => {

        this.myPayloadForm.commerceInfo = payload.data.commerceInfo;
        this.myPayloadForm.nominalSize = payload.data.nominalSize;
        this.myPayloadForm.fuelSource = payload.data.fuelSource;
        this.myPayloadForm.requiredRebates = payload.data.requiredRebates;
        this.myPayloadForm.searchType = payload.data.searchType;
        this.myPayloadForm.state = payload.data.state;

        this.CallProductLines(this.myPayloadForm);
      });


    /* form control */
    this.commerceInfoGroup = this._formBuilder.group({
      storeId: 1,
      showAllResults: [false],
    });

    this.productLinesGroup = this._formBuilder.group({
      productLine: [''],
    });

    this.filtersGroup = this._formBuilder.group({
      indoorUnitSKU: [''],
      outdoorUnitSKU: [''],
      furnaceSKU: [''],
      indoorUnitConfiguration: [null],
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

  CallProductLines(payload: any) {
    this._api.ProductLines(JSON.stringify(payload)).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.productLines = resp

          // Call Filters with selected product line
          this.productLinesGroup.controls['productLine'].setValue(resp[0].id);
          this.CallFilters();

          this.noResults = false;
        } else {
          this.noResults = true;
        }
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  // Function that reset filters and load filters with selected product line
  SelectProductLine() {
    this.filtersGroup.reset();
    this.commerceInfoGroup.controls['showAllResults'].setValue(false);
    this.filters = [];
    this.CallFilters()
  }

  // Function that gets input values from UI and returns payload.
  Payload() {
    let myfilters: {
      filterName: string;
      selectedValues: any[];
    }[] = [];

    Object.entries(this.filtersGroup.value).forEach(
      ([key, value]) => {
        if (value && value != "") {
          myfilters.push({
            filterName: key,
            selectedValues: (Array.isArray(value)) ? value : [value]
          });
        }
      }
    );

    let payload = {
      commerceInfo: this.commerceInfoGroup.value,
      searchType: this.myPayloadForm.searchType,
      nominalSize: this.myPayloadForm.nominalSize,
      fuelSource: this.myPayloadForm.fuelSource,
      systemTypeId: this.productLinesGroup.controls['productLine'].value,
      filters: myfilters,
      requiredRebates: this.myPayloadForm.requiredRebates
    }
    return JSON.stringify(payload);
  }

  // Function that call filters from API and update UI. 
  // also calls Search function to load results.
  CallFilters() {
    this.filtersGroup.disable();

    this._api.Filters(this.Payload()).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.filters = resp;
          this.filtersGroup.reset();
          // Set selected values
          resp.forEach((filter: any) => {
            if (filter.filterName == 'outdoorUnitSKU' || filter.filterName == 'indoorUnitSKU' || filter.filterName == 'furnaceSKU' || filter.filterName == 'coastal') {
              this.filtersGroup.controls[filter.filterName].setValue(filter.selectedValues[0]);
            } else {
              this.filtersGroup.controls[filter.filterName].setValue(filter.selectedValues);
            }
          });

          this.filtersGroup.enable();

        }

        this.showTitleFilter(this.filters);

        // Call search.
        this.CallSearch();
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  // Function that call Search results from API and update UI. 
  CallSearch() {
    this._api.Search(this.Payload()).subscribe({
      next: (resp) => {
        this.results = resp;
        this.showColum(this.results);
        this.ObtainPaginationText();
        this.p = 1;
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  // function to remove selections filters from my filters.
  removeFilter(myFilter: any, option:any): void {
    if(option){
      this.filtersGroup.controls[myFilter].setValue(this.filtersGroup.controls[myFilter].value.filter((e: string) => e !== option))
    } else {
      this.filtersGroup.controls[myFilter].reset();
    }
    this.CallFilters()
  }

  showTitleFilter(filters: any) {

    this.showModelNrs = false;
    this.showIndoorUnit = false;
    this.showOptions = false;

    filters.forEach((ele: any) => {
      if (ele.options.length >= 1 && ele.filterName === 'outdoorUnitSKU' || ele.filterName === 'indoorUnitSKU' || ele.filterName === 'furnaceSKU') {
        this.showModelNrs = true
      }

      if (ele.filterName === 'indoorUnitConfiguration') {
        this.showIndoorUnit = true
      }

    });
  }

  showColum(resp: any) {

    /* If no values are received for the furnaceSKU, then the columns should not be displayed:
        furnaceSKU, furnaceConfigurations, AFU.
       In the case of the HSPF column, it is handled independently
    */

    let countFurnace: number = 0;
    let countHSPF: number = 0;

    /* furnaceSKU */
    resp.forEach((element: any) => {
      if (element.furnaceSKU != null) {
        countFurnace += 1;
      }
    });

    if (countFurnace === 0) {
      this.showFurnace = false;
    } else {
      this.showFurnace = true;
    }

    /* HSPF */
    resp.forEach((element: any) => {
      if (element.HSPF != null) {
        countHSPF += 1;
      }
    });

    if (countHSPF === 0) {
      this.showHSPF = false;
    } else {
      this.showHSPF = true;
    }

    // Show total only if have available rebates
    if(this.myPayloadForm.requiredRebates.length > 0){
      this.showTotal = true;
    } else {
      this.showTotal = false;
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
    this.ObtainPaginationText();
  }

  isArray(obj:any){
    if (Array.isArray(obj)) {
      return true

    } else {
      return false
    }
  }
}
