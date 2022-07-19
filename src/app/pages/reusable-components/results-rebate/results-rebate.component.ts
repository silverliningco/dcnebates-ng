import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { payloadForm } from '../../../models/payloadFrom';
import { Rebate, RebateTier } from '../../../models/rebate';
import { BestDetail } from '../../../models/detailBestOption';
import { bridgeService } from '../../../services/bridge.service';

@Component({
  selector: 'app-results-rebate',
  templateUrl: './results-rebate.component.html',
  styleUrls: ['./results-rebate.component.css']
})
export class ResultsRebateComponent implements OnInit {

  /* FORM GRUP */
  commerceInfoGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;

  /* PRODUC LINE */
  productLines!: any;
  noResults!: boolean;
  results!: any;
  bestResults!: any;
  filters: Array<any> = [];

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm;
  myPayloadRebate!: any;

  /* display title when exist filter */
  showIndoorUnitConfig: boolean = false;
  showFurnaceUnits: boolean = false;
  showIndoorUnits: boolean = false;

  /*  AVAILABLE REBATES */
  availableRebates!: Array<Rebate>;
  NoExistAvailableRebates: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _bridge: bridgeService,
  ) { }

  ngOnInit(): void {


    /* receiving form data */
       this._bridge.sentRebateParams
                 .subscribe((payload: any) => {
   
           this.myPayloadForm.commerceInfo = payload.data.commerceInfo;
           this.myPayloadForm.nominalSize = payload.data.nominalSize;
           this.myPayloadForm.fuelSource = payload.data.fuelSource;
           this.myPayloadForm.searchType = payload.data.searchType;
           this.myPayloadForm.state = payload.data.state;
           //this.myPayloadForm.elegibilityQuestions = payload.data.elegibilityQuestions;
           this.myPayloadForm.utilityProviders = payload.data.utilityProviders;
   
           this.CallProductLines();
           this.GetAvailableRebates();
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

  }


/* ****************************************************************************************************************************************************** */
/*                                                          PRODUCT LINE                                                                                  */
/* ****************************************************************************************************************************************************** */

  CallProductLines() {
    //update commerce info with "updated show all results" input.
    this.myPayloadForm.commerceInfo.showAllResults = this.commerceInfoGroup.controls['showAllResults'].value;

    var body = JSON.stringify(this.myPayloadForm);

    this._api.ProductLines(body).subscribe({
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

/* ****************************************************************************************************************************************************** */
/*                                                          PRODUCT LINE END                                                                              */
/* ****************************************************************************************************************************************************** */


/* ****************************************************************************************************************************************************** */
/*                                                        AVAILABLE REBATES                                                                               */
/* ****************************************************************************************************************************************************** */

PrepareDataAvailableRebates(){
  let body= {
    "country": "US",
    "state": this.myPayloadForm.state,
    "utilityProviders": this.myPayloadForm.utilityProviders,
    "fuelSource": this.myPayloadForm.fuelSource,
    "rebateTypes": ["electric", "fossil fuel", "OEM", "distributor"],
    "OEM": "Carrier",
    "storeIds": []
  }

  return JSON.stringify(body);
}  

  GetAvailableRebates() {
   
    this._api.AvailableRebates(this.PrepareDataAvailableRebates()).subscribe({
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

/* ****************************************************************************************************************************************************** */
/*                                                        AVAILABLE REBATES END                                                                           */
/* ****************************************************************************************************************************************************** */

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

CallSearch() {
  this._api.Search(this.Payload()).subscribe({
    next: (resp) => {
      /* resp = a; */
      if (resp.length > 0) {
        this.results = resp;
        this.bestResults = this.filterBestResults(resp);
      }
    }
  })
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

showTitleFilter(filters: any) {

  this.showIndoorUnitConfig = false;

  filters.forEach((ele: any) => {
    if (ele.filterName === 'indoorUnitConfiguration') {
      this.showIndoorUnitConfig = true
    }
  });
}

// Function to compose options for specified model type
loadOptionsModelNrs(myDetails:BestDetail[], modelType:string){
   
  let myModelNrs: Array<any> = []
  myDetails.forEach(subel => {
    if (subel[modelType as keyof typeof subel]) {
      myModelNrs.push(subel[modelType as keyof typeof subel])
    }
  });

  // remove duplicates and asign to variables.
  return myModelNrs.filter((item,index) => myModelNrs.indexOf(item) === index);
}

// Function to Get element with the highest rebate amount.  
GetHighestRebateAmount(myDetails:BestDetail[]){
  let myBestTotalAvailableRebate = Math.max.apply(
    Math, myDetails.map(function (rt: any) {
      return rt.totalAvailableRebates;
    }));

  return myDetails?.filter(sys => sys.totalAvailableRebates == myBestTotalAvailableRebate)[0];
}

filterBestResults(resp: BestDetail[][]) {
  var bestResults: any = []
  resp.forEach(details => {
    // Get element with the highest rebate amount.  
    const mySystem = this.GetHighestRebateAmount(details)
    
    mySystem.indoorUnits = this.loadOptionsModelNrs(details,"indoorUnitSKU");
    mySystem.furnaceUnits = this.loadOptionsModelNrs(details,"furnaceSKU");

    if (mySystem.furnaceUnits.length === 0){
      this.showFurnaceUnits = false;
    } else {
      this.showFurnaceUnits = true;
    }

    if (mySystem.indoorUnits.length === 0){
      this.showIndoorUnits = false;
    } else {
      this.showIndoorUnits = true;
    }

    bestResults.push(mySystem)
  });

  return (bestResults);
}

filterIndoorBySKU(myIndoorUnit: string, i:number) {
  //Search bestOption with user selections
  let myOutdoorUnit = this.bestResults[i].outdoorUnitSKU;
  let myCombination: BestDetail[] = []

  this.results.forEach((subel:BestDetail[]) => {
    let myFind = subel.filter((item: BestDetail)=> item.outdoorUnit == myOutdoorUnit)
    if(myFind.length > 0){
      myCombination = myFind
    }
  });
 
  if(myIndoorUnit){
    let myMatchetIndoor = myCombination.filter((item: BestDetail) => item.indoorUnit == myIndoorUnit);
    if(myMatchetIndoor.length == 1){
      this.bestResults[i] = myMatchetIndoor[0]
    }

    else if(myMatchetIndoor.length > 1){
      // Get element with the highest rebate amount. 
      this.bestResults[i] =this.GetHighestRebateAmount(myMatchetIndoor)  
    }

    // compose options for specified model type
    this.bestResults[i].indoorUnits = this.loadOptionsModelNrs(myCombination,"indoorUnitSKU");
    this.bestResults[i].furnaceUnits = this.loadOptionsModelNrs(myCombination,"furnaceSKU");
  }
}

filterFurnaceBySKU(myFurnaceUnit: string, i:number) {
    let myOutdoorUnit = this.bestResults[i].outdoorUnitSKU;
    let myCombination: BestDetail[] = []

    this.results.forEach((subel:BestDetail[]) => {
      let myFind = subel.filter((item: BestDetail)=> item.outdoorUnit == myOutdoorUnit)
      if(myFind.length > 0){
        myCombination = myFind
      }
    });
    if(myFurnaceUnit){
      let myMatchetIndoor = myCombination.filter((item: BestDetail) => item.furnaceUnit == myFurnaceUnit);
      if(myMatchetIndoor.length == 1){
        this.bestResults[i] = myMatchetIndoor[0]
      }
      else if(myMatchetIndoor.length > 1){
        // Get element with the highest rebate amount. 
        this.bestResults[i] =this.GetHighestRebateAmount(myMatchetIndoor)  
      }

      // compose options for specified model type
      this.bestResults[i].indoorUnits = this.loadOptionsModelNrs(myCombination,"indoorUnitSKU");
      this.bestResults[i].furnaceUnits = this.loadOptionsModelNrs(myCombination,"furnaceSKU");
    }
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


  sentmodelNrs(){

   let a = JSON.parse(this.Payload());

   console.log(a.commerceInfo);

   /* let b = {
     "commerceInfo": a.commerceInfo,
     "skus":a.filters,
     "AHRIRefs": '',
     "requiredRebates": a.requiredRebates
  }

  let body = JSON.stringify(a);

  console.log(body);
   let url= '/home/detail/' + body;
   window.open(url)   */
 }


}


