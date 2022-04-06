import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';

import { utilityInfo } from '../../models/utilities';
import { Rebate, RebateTier, Criteria } from '../../models/rebates';


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
  myUtilityIds!: Array<any>;
  myState!: string;

  availableRebates!: Array<Rebate>;
  payloadRebates!: any;
  IsValidAvailabeRebates: boolean = true;

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
      state: this.stateGroup.value,
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
  SelectProductLine(systemTypeId: number) {
    let payload = {
      commerceInfo: {
        storeId: 1,
        showAllResults: false
      },
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      systemTypeId: systemTypeId,
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

  // utilities
  changeState() {

    this.sendGasOil = [];
    this.sendElectric = [];

    this._api.Utilities(this.stateGroup.controls['state'].value).subscribe({
      next: (resp: any) => {
        let listUtilities: Array<utilityInfo> = resp;
        this.transform(listUtilities);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  /* classifies the utility-objects in the sendElectric and sendGasOil arrays depending on 
  the values that each object has in the "fuel" field */
  transform(array: Array<utilityInfo>): any[] {

    return array.filter((d: any) => d.fuel.find((a: any) => {

      if (a.includes('Electricity')) {
        this.sendElectric.push(d);
      } if (a.includes('Natural Gas')) {
        this.sendGasOil.push(d);
      }

    }));

  }

  PrepareAvailableRebates(){
    this.myUtilityIds = [
      this.utilityGroup.controls['electricUtility'].value,
      this.utilityGroup.controls['gasOilUtility'].value
    ];

    this.myState = this.stateGroup.controls['state'].value;

    this.GetAvailableRebates(this.myState, this.myUtilityIds);
  }

  GetAvailableRebates(state: any, utilityIds: any) {
    
    this._api.AvailableRebates(state, JSON.stringify(utilityIds)).subscribe({
      next: (resp) => {
       this.processingAvailableRebates(resp);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  processingAvailableRebates(myResp: any){
    this.availableRebates = [];
    for (let indx = 0; indx < myResp.length; indx++) {
      const reb = myResp[indx];

      /* matches the level rebateCriteria in the defined model */
      let myCriterias: Array<Criteria> = [];
      reb.rebateCriteria?.forEach( (element: any) =>{
        myCriterias.push({ title: element, completed: true });
      });

      /* matches the level RebateTier in the defined model */
      let myTier: Array<RebateTier> = [];
      reb.rebateTiers?.forEach( (element: any) => {

        /* matches the level Tier Criterias in the defined model */
        let myTierCriterias: Array<Criteria> = [];
        element.rebateTierCriteria?.forEach((el: any) =>{
          myTierCriterias.push({ title: el, completed: element.default });
        });

          myTier.push({
          title: element.title,
          rebateTierId: element.rebateTierId,
          rebateTierCriteria: myTierCriterias,
          completed: element.default,
          defaultTier: element.default,

        });
        

        
      });

      this.availableRebates.push({
        title: reb.title,
        rebateId: reb.rebateId,
        rebateCriteria: myCriterias,
        rebateTiers: myTier,
        completed: true
      });
    }
  }

  /* Elegibility detail codes */
  reb_tier_change(rebTier: RebateTier, reb: Rebate) {
    rebTier.rebateTierCriteria?.forEach(element => {
      element.completed = rebTier.completed!;
    });

    // If there are multiple rebate tiers in a given rebate,
    // checking one rebate tier should always uncheck the remaining tier(s).
    this.uncheckRemainingTiers(rebTier, reb);

    // validate if at least one rebate is selected
    this.validateSelection();
  }

  // If there are multiple rebate tiers in a given rebate,
  // checking one rebate tier should always uncheck the remaining tier(s).
  uncheckRemainingTiers(rebTier: RebateTier, reb: Rebate){


    const resultTier = reb.rebateTiers?.filter(rt => rt.completed == true);
    const resultTierCriteria = rebTier?.rebateTierCriteria?.filter(rtc => rtc.completed == true);
    const resultCriteria = reb.rebateCriteria?.filter(rc => rc.completed == true);

    if(resultTier!.length > 0 && resultCriteria!.length == reb.rebateCriteria?.length && resultTierCriteria!.length == rebTier.rebateTierCriteria!.length) {
      reb.completed = true;
    } else {
      reb.completed = false;
    }

    reb.rebateTiers?.forEach(element => {

      if( element.title != rebTier.title){
        // Uncheck rebate tier.
        element.completed = false;
        element.rebateTierCriteria?.forEach(el2 => {
          // Uncheck rebate tier criterias.
          if(el2.completed)
          el2.completed = false;
        });
      }
    });
  }

  reb_tier_criteria_change(rebTier: RebateTier, reb: Rebate) {
    let checked_count = 0;

    //Get total checked items
    rebTier.rebateTierCriteria?.forEach(element => {
      if (element.completed)
        checked_count++;
    });

    if (checked_count == rebTier.rebateTierCriteria!.length) {
      //If checked count is equal to total items; then check the master checkbox.
      rebTier.completed = true;

      // If there are multiple rebate tiers in a given rebate,
      // checking one rebate tier should always uncheck the remaining tier(s).
      this.uncheckRemainingTiers(rebTier, reb);

    } else {
      
      rebTier.completed = false;
      
      const resultTier = reb.rebateTiers?.filter(rt => rt.completed == true);
      const resultTierCriteria = rebTier?.rebateTierCriteria?.filter(rtc => rtc.completed == true);
      const resultCriteria = reb.rebateCriteria?.filter(rc => rc.completed == true);

      if(resultTier!.length > 0 && resultCriteria!.length == reb.rebateCriteria?.length && resultTierCriteria!.length == rebTier.rebateTierCriteria!.length) {
        reb.completed = true;
      } else {
        reb.completed = false;
      }

    }


    // validate if at least one rebate is selected
    this.validateSelection();
  }


  rebate_change(reb: Rebate) {
    reb.rebateCriteria?.forEach(element => {
      element.completed = reb.completed!;
    });
    // add rebate tier  selections TODO
    //...
    reb.rebateTiers?.forEach(tier => {
      if(!reb.completed) {

        tier.completed = reb.completed!;
      } else {
        tier.completed = tier.defaultTier;

      }

      tier.rebateTierCriteria?.forEach(element => {
        element.completed = tier.completed!;
      });
     })


    // validate if at least one rebate is selected
    this.validateSelection();
  }


  reb_criteria_change(reb: Rebate) {
    let checked_count = 0;

    //Get total checked items
    reb.rebateCriteria?.forEach(element => {
      if (element.completed)
        checked_count++;
    });

    if (checked_count == reb.rebateCriteria!.length) {
      //If checked count is equal to total items; then check the master checkbox.
      reb.completed = true;
    } else {
      //If none of the checkboxes in the list is checked then uncheck master.
      reb.completed = false;
    }

      // When the user checks all of the rebate_criteria for a given rebate
      // AND one of the rebate tiers is checked, the rebate itself will be selected.
    const resultTier = reb.rebateTiers?.filter(rtc => rtc.completed == true);
    const resultCriteria = reb.rebateCriteria?.filter(rc => rc.completed == true);
      if(resultTier!.length > 0 && resultCriteria!.length == reb.rebateCriteria?.length ) {
        reb.completed = true;
      } else {
        reb.completed = false;

      }

      // validate if at least one rebate is selected
      this.validateSelection();
  }

  // validate if at least one rebate is selected
  validateSelection() {

    const mySelectedRebates = this.availableRebates?.filter(r => r.completed == true);
    if(mySelectedRebates.length > 0) {
      this.IsValidAvailabeRebates = true;
    } else {
      this.IsValidAvailabeRebates = false;
    }

  }

  /* PAYLOAD FORMART -> [ { "rebateId": 1, "rebateTierId": 1, "required": true },
                          { "rebateId": 2, "required": true } ] */
  onSubmit() { 

    let getformat!: any;
    let collectFormat: Array<JSON> = [];  


    // available Rebates selected (completed = true)
    this.availableRebates?.filter( e =>{

      if (e.completed == true){       

        // available Rebates Tier selected (completed = true)
          e.rebateTiers?.filter(e2 => {
            if (e2.completed == true){
              getformat =  {"rebateId": e.rebateId, "rebateTierId": e2.rebateTierId, "isRequired": true};
              collectFormat.push(getformat);
            }
          });
        
        
      }

    });
    this.payloadRebates = collectFormat;
    
  }

 

}