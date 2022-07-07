import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { payloadForm } from '../../../models/payloadFrom';
import { ModelNr, PostBodyNr } from '../../../models/modelNr';
import { Rebate, RebateTier } from '../../../models/rebate';
import { Detail } from '../../../models/detailBestOption';
import { bridgeService } from '../../../services/bridge.service';


@Component({
  selector: 'app-results-rebate',
  templateUrl: './results-rebate.component.html',
  styleUrls: ['./results-rebate.component.css']
})
export class ResultsRebateComponent implements OnInit {

  commerceInfoGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;

  productLines!: any;
  noResults!: boolean;
  results!: any;
  bestResults!: any;
  filters: Array<any> = [];

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm;
  myPayloadRebate!: any;

  /* display title when exist filter */
  showIndoorUnit: boolean = false;

  availableRebates!: Array<Rebate>;
  NoExistAvailableRebates: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _bridge: bridgeService,
  ) { }

  ngOnInit(): void {


    /* receiving form data */
    /*   this._bridge.sentRebateParams
                 .subscribe((payload: any) => {
   
           this.myPayloadForm.commerceInfo = payload.data.commerceInfo;
           this.myPayloadForm.nominalSize = payload.data.nominalSize;
           this.myPayloadForm.fuelSource = payload.data.fuelSource;
           this.myPayloadForm.searchType = payload.data.searchType;
           this.myPayloadForm.state = payload.data.state;
   //        this.myPayloadForm.elegibilityQuestions = payload.data.elegibilityQuestions;
           this.myPayloadForm.utilityProviders = payload.data.utilityProviders;
   
           this.CallProductLines();
           this.GetAvailableRebates();
           this.CallSearch(this.myPayloadForm);
         });
   */
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

    this.myPayloadForm = {
      "commerceInfo": {
        "storeId": 1,
        "showAllResults": false
      },
      "nominalSize": {
        "heatingBTUH": 58000,
        "coolingTons": 2
      },
      "fuelSource": "Natural Gas",
      "state": "MA",
      "searchType": "Heating and Cooling",
      "utilityProviders": {
        "electricUtility": 5,
        "fossilFuelUtilityId": 4
      }
    };

    this.CallProductLines();
    this.CallAvailableRebates();

    //this.CallSearch(this.myPayloadForm);

  }

  CallSearch() {

    this._api.Search(this.Payload()).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          console.log(resp)
          this.results = resp
          
          console.log(this.filterBestResults(resp));
          this.bestResults = this.filterBestResults(resp);
        }
      }
    })
  }

  filterBestResults(resp: Detail[][]) {
    var bestResults: any = []
    resp.forEach(element => {
      // Get element with the highest rebate amount.  
      let myBestTotalAvailableRebate = Math.max.apply(
        Math, element.map(function (rt: any) {
          return rt.totalAvailableRebates;
        }));

      const mySystem = element?.filter(sys => sys.totalAvailableRebates == myBestTotalAvailableRebate)[0];
      
      // load all indoor units
      let myIndoorUnits: Array<any> = []  
      let myFurnaceUnits: Array<any> = []  
      element.forEach(subel => {
        myIndoorUnits.push(subel.indoorUnitSKU)
        myFurnaceUnits.push(subel.furnaceSKU)
      });
      mySystem.indoorUnits = myIndoorUnits;
      mySystem.furnaceUnits = myFurnaceUnits;

      bestResults.push(mySystem)
    });

    return (bestResults);
  }
/*
   removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}*/


  filterIndoorBySKU(val:string){
    console.log(val);
    this.results = this.filterBestResults(this.results);
  }

  // Call Product lines.
  CallProductLines() {
    var body = this.myPayloadForm

    //update commerce info with "updated show all results" input.
    this.myPayloadForm.commerceInfo.showAllResults = this.commerceInfoGroup.controls['showAllResults'].value;

    this._api.ProductLines(JSON.stringify(body)).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.productLines = resp

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

    this.filters = [];

    this.CallFilters();
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

    let body = {
      "groupBy": "Outdoor unit",
      "searchType": this.myPayloadForm.searchType,
      "fuelSource": this.myPayloadForm.fuelSource,
      "commerceInfo": this.commerceInfoGroup.value,
      "nominalSize": this.myPayloadForm.nominalSize,
      "systemTypeId": this.productLinesGroup.controls['productLine'].value,
      "filters": myfilters,
      "requiredRebates": this.getSelectedRebates()
    }

    return JSON.stringify(body);
  }

  showTitleFilter(filters: any) {

    this.showIndoorUnit = false;

    filters.forEach((ele: any) => {
      if (ele.filterName === 'indoorUnitConfiguration') {
        this.showIndoorUnit = true
      }
    });
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
            if (filter.filterName == 'coastal') {
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

  //================================== Available rebates
  // Call Available rebates
  CallAvailableRebates() {
    let myBodyRebate = {
      "country": "US",
      "state": this.myPayloadForm.state,
      "utilityProviders": this.myPayloadForm.utilityProviders,
      "fuelSource": this.myPayloadForm.fuelSource,
      "rebateTypes": ["electric", "fossil fuel", "OEM", "distributor"],
      "OEM": "Carrier",
      "storeIds": []
    }
    this._api.AvailableRebates(myBodyRebate).subscribe({
      next: (resp: any) => {
        this.processingAvailableRebates(resp)
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    });
  }
  processingAvailableRebates(myResp: any) {
    this.availableRebates = [];

    /* confirm if exists data */
    if (myResp.length === 0) {
      this.NoExistAvailableRebates = true;
    } else {
      this.NoExistAvailableRebates = false;
    }

    /* processing data */
    if (myResp.length > 0) {
      for (let indx = 0; indx < myResp.length; indx++) {
        const reb = myResp[indx];

        /* matches the level RebateTier in the defined model */
        let myTier: Array<RebateTier> = [];

        var myMax = Math.max.apply(Math, reb.rebateTiers.map(function (rt: any) { return rt.accessibilityRank; }))

        let myFirstOccurrence = false;

        reb.rebateTiers?.forEach((element: any) => {
          let myDefault = false;
          if (!myFirstOccurrence && myMax == element.accessibilityRank) {
            myFirstOccurrence = true;
            myDefault = (myMax == element.accessibilityRank) ? true : false;
          }

          myTier.push({
            title: element.title,
            rebateTierId: element.rebateTierId,
            completed: myDefault,
            defaultTier: myDefault,
            notes: element.notes
          });
        });

        this.availableRebates.push({
          title: reb.title,
          rebateId: reb.rebateId,
          rebateTiers: myTier,
          notes: reb.notes,
          rebateType: reb.rebateNotes,
          completed: true
        });
      }
    }

  }


  /* Elegibility detail codes */
  reb_tier_change(rebTier: RebateTier, reb: Rebate) {

    // If there are multiple rebate tiers in a given rebate,
    // checking one rebate tier should always uncheck the remaining tier(s).
    this.uncheckRemainingTiers(rebTier, reb);


    // Call search.
    this.CallSearch();

  }

  // If there are multiple rebate tiers in a given rebate,
  // checking one rebate tier should always uncheck the remaining tier(s).
  uncheckRemainingTiers(rebTier: RebateTier, reb: Rebate) {

    const resultTier = reb.rebateTiers?.filter(rt => rt.completed == true);

    if (resultTier!.length > 0) {
      reb.completed = true;
    } else {
      reb.completed = false;
    }

    reb.rebateTiers?.forEach(element => {

      if (element.title != rebTier.title) {
        // Uncheck rebate tier.
        element.completed = false;
      }
    });
  }


  rebate_change(reb: Rebate) {
    // add rebate tier  selections TODO
    //...
    reb.rebateTiers?.forEach(tier => {
      if (!reb.completed) {
        tier.completed = reb.completed!;
      } else {
        tier.completed = tier.defaultTier;
      }
    })

    // Call search.
    this.CallSearch();
  }

  getSelectedRebates() {

    let getformat!: any;
    let collectFormat: Array<JSON> = [];

    // available Rebates selected (completed = true)
    this.availableRebates?.filter(e => {

      if (e.completed === true) {

        e.rebateTiers?.filter(e2 => {

          if (e2.completed == true) {
            getformat = { "rebateId": e.rebateId, "rebateTierId": e2.rebateTierId, "isRequired": false };
            collectFormat.push(getformat);
          }

        });

      }

    });
    return collectFormat;

  }

  // function to remove selections filters from my filters.
  removeFilter(myFilter: any, option: any): void {
    if (option) {
      this.filtersGroup.controls[myFilter].setValue(this.filtersGroup.controls[myFilter].value.filter((e: string) => e !== option))
    } else {
      this.filtersGroup.controls[myFilter].reset();
    }
    this.CallFilters()
  }

  isArray(obj: any) {
    if (Array.isArray(obj)) {
      return true

    } else {
      return false
    }
  }
}


