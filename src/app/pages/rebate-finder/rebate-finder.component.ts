import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { utilityInfo } from '../../models/utilities';


@Component({
  selector: 'app-rebate-finder',
  templateUrl: './rebate-finder.component.html',
  styleUrls: ['./rebate-finder.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})
export class RebateFinderComponent implements OnInit {

  nominalSizeGroup !: FormGroup;
  furnaceGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;
  stateGroup !: FormGroup;
  utilityGroup !: FormGroup;
  availableRebatesGroup  !: FormGroup;

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

  sendElectric: Array<any> = [];
  sendGasOil: Array<any> = [];

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

    this.stateGroup = this._formBuilder.group({
      state: ['', Validators.required]
    });

    this.utilityGroup = this._formBuilder.group({
      electricUtility: ['', Validators.required],
      gasOilUtility: ['', Validators.required]
    });

    this.availableRebatesGroup = this._formBuilder.group({

    });

    this.nominalSizeGroup = this._formBuilder.group({
      heatingBTUH: ['', Validators.compose([Validators.required, Validators.min(0)])],
      coolingTons: ['', Validators.compose([Validators.required, Validators.min(0)])],
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
      state: this.stateGroup.value
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
  SelectProductLine(systemTypeId: number) {
    let payload = {
      commerceInfo: {
        storeId: 1,
        showAllResults: false
      },
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      systemTypeId: systemTypeId,
      filters: []
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
        } else {
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
      filters: myfilters
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

  // utilities
  changeState() {

    this.sendGasOil = [];
    this.sendElectric = [];

    this._api.Utilities(this.stateGroup.controls['state'].value).subscribe({
      next: (resp: any) => {
        /*
                let newPay: any = [
                  {
                    "utilityId": 1,
                    "title": "Cape Light Compact",
                    "description": "",
                    "states": ["MA"],
                    "country": "US",
                    "fuel":["Electricity"]
                },
                {
                    "utilityId": 2,
                    "title": "National Grid",
                    "description": "",
                    "states": ["MA"],
                    "country": "US",
                    "fuel":["Electricity","Natural Gas"]
                },
                {
                    "utilityId": 3,
                    "title": "Liberty",
                    "description": "",
                    "states": ["MA"],
                    "country": "US",
                    "fuel":["Natural Gas"]
                }
                ];*/
        let listUtilities: Array<utilityInfo> = resp;
        this.transform(listUtilities);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }


  transform(array: Array<utilityInfo>): any[] {

    return array.filter((d: any) => d.fuel.find((a: any) => {

      if (a.includes('Electricity')) {
        this.sendElectric.push(d);
      } if (a.includes('Natural Gas')) {
        this.sendGasOil.push(d);
      }

    }));

  }

  AvailableRebates() {
    let myUtilityIds: Array<any> = [
      this.utilityGroup.controls['electricUtility'].value,
      this.utilityGroup.controls['gasOilUtility'].value
    ];
   
    this._api.AvailableRebates(this.stateGroup.controls['state'].value, JSON.stringify(myUtilityIds)).subscribe({
      next: (resp) => {

        let myresp: any = [
          {
             "rebateId":1,
             "title":"Mass Save Heat Pump rebates",
             "description":"",
             "period":"2022",
             "link":"",
             "rebateCriteria":[
                "Heat pump(s) are used to replace or supplement existing oil, propane or electric baseboard heating."
             ],
             "rebateTiers":[
                {
                   "title":"Partial home/supplemental HP",
                   "rebateTierCriteria":[
                      "Heat Pumps must be used to supplement the pre-existing heating system during heating season.",
                      "If pre-existing system is oil or propane, integrated controls must be installed."
                   ]
                },
                {
                   "title":"Whole house HP",
                   "rebateTierCriteria":[
                      "Heat pumps must be used as the sole source of heating during heating season.",
                      "Whole-home verification form must be completed and signed"
                   ]
                }
             ]
          },
          {
             "rebateId":2,
             "title":"Mass Save Gas Heating",
             "description":"",
             "period":"2022",
             "link":"",
             "rebateCriteria":null,
             "rebateTiers":[
                {
                   "title":"Default",
                   "rebateTierCriteria":null
                }
             ]
          }
       ]; 

      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })

  }




}
