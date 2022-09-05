import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { payloadForm,  } from '../../../models/payloadFrom';
import { Rebate, RebateTier } from '../../../models/rebate';
import { BestDetail, Card, ComponentDetail} from '../../../models/detailBestOption';
import { bridgeService } from '../../../services/bridge.service';
import { MatDialog } from '@angular/material/dialog';
import { TableViewComponent } from '../table-view/table-view.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  /* FORM GRUP */
  commerceInfoGroup !: FormGroup;
  productLinesGroup !: FormGroup;
  filtersGroup !: FormGroup;

  /* PRODUC LINE */
  productLines!: any;
  noResultsPL!: boolean;

  /* filgters */
  filters: Array<any> = [];  
  notFilters!: boolean;

  /* search */
  noResultsSearch!: boolean;
  results!: any; // guarda todos los resultados del endpoint search
  myCards: Array<Card> = [];
  sizeSelect!: number;

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm; 
  myPayloadRebate!: any;

  /* display title when exist filter */
  showIndoorUnitConfig: boolean = false;
  showCoilType: boolean = false;
  showcoilCasing: boolean = false;
  showCardRebate: boolean = false;
  showIndoor: boolean = false;

  /*  AVAILABLE REBATES */
  availableRebates!: Array<Rebate>;
  NoExistAvailableRebates: boolean = false;

  showSpinner:boolean = false;

  resetTab: number = 0;
  tabs = ['REBATES','FILTERS'];

  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _bridge: bridgeService,
    private dialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    this.showSpinner = true;
    // receiving form data
       this._bridge.sentRebateParams
        .subscribe((payload: any) => {
        
          this.myPayloadForm = payload.data;
          this.CallProductLines();
          
          // call GetAvailableRebates if home = 'rebate'
          if (this.myPayloadForm.home === 'ahri'){
            this.showCardRebate = false;
            this.sizeSelect = 100;
            // remove rebates tab
            this.tabs.splice(0, 1);
          }else {
            this.showCardRebate = true;
            this.sizeSelect = 70;
            this.resetTab = 0;
            this.GetAvailableRebates();
          }
                    
         });
   
         // form control
    this.commerceInfoGroup = this._formBuilder.group({
      storeId: 1,
      showAllResults: [false],
    });

    this.productLinesGroup = this._formBuilder.group({
      productLine: [''],
    });

    this.filtersGroup = this._formBuilder.group({
      indoorUnitConfiguration: null,
      coilType: null,
      coilCasing: null
    });
  }



/* ****************************************************************************************************************************************************** */
/*                                                          PRODUCT LINE                                                                                  */
/* ****************************************************************************************************************************************************** */
  PrepareProductLines(){

    let {commerceInfo, nominalSize, fuelSource, levelOneSystemTypeId, sizingConstraint} = this.myPayloadForm;

      let body = {
        commerceInfo: commerceInfo,
        nominalSize: nominalSize,
        fuelSource: fuelSource,
        levelOneSystemTypeId: levelOneSystemTypeId,
        sizingConstraint: sizingConstraint
      }

    //update commerce info with "updated show all results" input.
    body.commerceInfo!.showAllResults = this.commerceInfoGroup.controls['showAllResults'].value;

      return body;

  }
  
  CallProductLines() {

    this._api.ProductLines(this.PrepareProductLines()).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.results = [];
          this.productLines = resp

          this.productLinesGroup.controls['productLine'].setValue(resp[0].id);
          // hidden indoor unit for Mini-Split (multi zone)
          let productLine = this.productLinesGroup.controls['productLine'].value;
          if(productLine === 'Mini-Split (multi zone)'){
            this.showIndoor = false;
          } else {
            this.showIndoor = true;
          }
          this.CallFilters();
          this.noResultsPL = false;
        } else {
          this.noResultsPL = true;
          this.showSpinner = false;
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
    this.resetTab = 0;
    this.showSpinner = true;
    this.CallFilters();

  }

/* ****************************************************************************************************************************************************** */
/*                                                          PRODUCT LINE END                                                                              */
/* ****************************************************************************************************************************************************** */


/* ****************************************************************************************************************************************************** */
/*                                                        AVAILABLE REBATES                                                                               */
/* ****************************************************************************************************************************************************** */
  PrepareDataAvailableRebates(){

    let {state, utilityProviders, fuelSource, eligibilityCriteria, rebateTypes} = this.myPayloadForm;

    let body= {
      country: "US",
      state: state,
      utilityProviders: utilityProviders,
      fuelSource: fuelSource,
      rebateTypes: rebateTypes,
      OEM: "Carrier",
      storeIds: [],
      eligibilityCriteria: eligibilityCriteria
    }

    return body;
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

    // confirm if exists data
    if (myResp.length === 0) {
      this.NoExistAvailableRebates = true;
    } else {
      this.NoExistAvailableRebates = false;
    }

    // processing data
    if (myResp.length > 0) {
      for (let indx = 0; indx < myResp.length; indx++) {
        const reb = myResp[indx];

        // matches the level RebateTier in the defined model
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


  // Elegibility detail codes
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


/* ****************************************************************************************************************************************************** */
/*                                                        FILTERS                                                                                         */
/* ****************************************************************************************************************************************************** */

PrepareFilters(){
  let myFilters: any = null;
  let indoorUnitConfiguration: any = null;
  let coilType: any = null;
  let coilCasing: any = null;

  Object.entries(this.filtersGroup.value).forEach(
    ([key, value]) => {
      if (value != null) {
        switch  (key){
          case 'indoorUnitConfiguration':
            let val1 = JSON.stringify(value);
            indoorUnitConfiguration = `"${key}": ${val1}`;
            break;
          case 'coilType':
            let val2 = JSON.stringify(value);
            coilType = `"${key}": ${val2}`;
            break;
          case 'coilCasing':
            let val3 = JSON.stringify(value);
            coilCasing = `"${key}": ${val3}`;
            break;
        }
      } else {
        switch  (key){
          case 'indoorUnitConfiguration':
            indoorUnitConfiguration = null;
            break;
          case 'coilType':
            coilType = null;
            break;
          case 'coilCasing':
            coilCasing = null;
            break;
        }
      }
    }
  );

  
  if (indoorUnitConfiguration === null && coilType === null &&  coilCasing === null){
    myFilters = null;
    return myFilters;
  } else if (indoorUnitConfiguration != null && coilType === null &&  coilCasing === null){
    myFilters= `{ ${indoorUnitConfiguration} }`;
  } else if (indoorUnitConfiguration === null && coilType != null &&  coilCasing === null){
    myFilters= `{ ${coilType} }`;
  } else if (indoorUnitConfiguration === null && coilType === null &&  coilCasing != null){
    myFilters= `{ ${coilCasing} }`;
  } else if (indoorUnitConfiguration != null && coilType != null &&  coilCasing === null){
    myFilters= `{ ${indoorUnitConfiguration}, ${coilType} }`;
  } else if (indoorUnitConfiguration === null && coilType != null &&  coilCasing != null){
    myFilters= `{ ${coilType}, ${coilCasing} }`;
  } else if (indoorUnitConfiguration != null && coilType === null &&  coilCasing != null){
    myFilters= `{ ${indoorUnitConfiguration}, ${coilCasing} }`;
  } else if (indoorUnitConfiguration != null && coilType != null &&  coilCasing != null){
    myFilters= `{ ${indoorUnitConfiguration}, ${coilType}, ${coilCasing} }`;
  }

  return decodeURIComponent(myFilters);
}


// Function that gets input values from UI and returns payload.
Payload() {

  let {commerceInfo, nominalSize, fuelSource, levelOneSystemTypeId, sizingConstraint} = this.myPayloadForm;

  let rebate:any;
    if (this.myPayloadForm.home === 'ahri'){
      rebate = null;
    }else {
      rebate = this.getSelectedRebates();
    }

  let body = {
    commerceInfo: commerceInfo,
    nominalSize: nominalSize,
    fuelSource: fuelSource,
    levelOneSystemTypeId: levelOneSystemTypeId,
    levelTwoSystemTypeId: this.productLinesGroup.controls['productLine'].value,
    sizingConstraint: sizingConstraint,
    filters: JSON.parse(this.PrepareFilters()),
    requiredRebates: rebate
  };

  return JSON.stringify(body);
}

// Function that call filters from API and update UI. 
// also calls Search function to load results.
CallFilters() { 

  this.filtersGroup.disable();

  this._api.Filters(this.Payload()).subscribe({
    next: (resp) => {
      if (resp.length > 0) {
        this.notFilters = false;
        this.filters = resp;
        this.filtersGroup.reset();
        // Set selected values
        resp.forEach((filter: any) => {
          if (filter.filterName === 'coastal') {
            this.filtersGroup.controls[filter.filterName].setValue(filter.selectedValues[0]);
          } else {
            this.filtersGroup.controls[filter.filterName].setValue(filter.selectedValues);
          }
        });
        this.filtersGroup.enable();
      } else {
        this.notFilters = true;
      }

      this.showTitleFilter(this.filters);

      // Call search.
      this.CallSearch();
    },
    error: (e) => alert(e.error),
    complete: () => console.info('complete')
  })
}


 // function to remove selections filters from my filters.
 removeFilter(myFilter: any, option: any): void {
  if (option) {
    this.filtersGroup.controls[myFilter].setValue(this.filtersGroup.controls[myFilter].value.filter((e: string) => e !== option))
  } else {
    this.filtersGroup.controls[myFilter].reset();
  }
  this.CallSearch()
}


showTitleFilter(filters: any) {

  this.showIndoorUnitConfig = false;
  this.showCoilType = false;
  this.showcoilCasing = false;

  filters.forEach((ele: any) => {
    if (ele.filterName === 'indoorUnitConfiguration') {
      this.showIndoorUnitConfig = true
    }
  });

  filters.forEach((ele: any) => {
    if (ele.filterName === 'coilType') {
      this.showCoilType = true
    }
  });

  filters.forEach((ele: any) => {
    if (ele.filterName === 'coilCasing') {
      this.showcoilCasing = true
    }
  });

}


// for applied filters
isArray(obj: any) {
  if (Array.isArray(obj)) {
    return true

  } else {
    return false
  }
}

/* ****************************************************************************************************************************************************** */
/*                                                        FILTERS END                                                                                     */
/* ****************************************************************************************************************************************************** */


/* ****************************************************************************************************************************************************** */
/*                                                        SEARCH                                                                                          */
/* ****************************************************************************************************************************************************** */

CallSearch() {
  
  this.showSpinner = true;
   this._api.Search(this.Payload()).subscribe({
    next: (resp) => {
      
      if (resp.length > 0) {
        this.showSpinner = false;
        this.noResultsSearch = false;
        this.results = resp;
        this.myCards = [];
        
        // recorriendo toda la respuesta del search
        resp.forEach((element:any) => {
          let myCard: Card;
          // debuelve los resultados ordenamos del maxino al minimo
          let max =  element.sort( function(a: any, b:any) {
            if (a.totalAvailableRebates < b.totalAvailableRebates || a.totalAvailableRebates === null) return +1;
            if (a.totalAvailableRebates > b.totalAvailableRebates || b.totalAvailableRebates === null) return -1;
            return 0;
          });

          myCard ={
            active: max[0], // colocando el maximo de cada grupo a cada card
            options: max,
            indoorOptions: this.getComponentOptions(max, 'indoorUnit'),
            furnaceOptions: this.getComponentOptions(max, 'furnace'),
            configurationOptions:  this.getConfigurationOptions(max[0].components, max),
          }

          this.myCards.push(myCard);
        });  

        // Ordenar cards de manera descendente por totalAvailableRebates
        this.myCards.sort( function(a: Card, b:Card) {
          if (a.active.totalAvailableRebates! < b.active.totalAvailableRebates! || a.active.totalAvailableRebates === null) return +1;
          if (a.active.totalAvailableRebates! > b.active.totalAvailableRebates! || b.active.totalAvailableRebates === null) return -1;
          return 0;
        }) ;
  
      } else {
        this.showSpinner = false;
        this.noResultsSearch = true;
      }
    }
  })
}

getComponentOptions(combinations: Array<BestDetail>, type: string) {
  let myComponentsDetail:ComponentDetail[] = []
  combinations.forEach((det:BestDetail) => {
    
      let myFind = det.components?.filter((item: any)=> item.type == type);
      // If filter finds components with specific type
      if(myFind![0]){
        myComponentsDetail.push(myFind![0])
      }
    
  });

  const myUniqueComponents = [...new Map(myComponentsDetail.map((m) => [m.id, m])).values()];

  return myUniqueComponents;
}
getConfigurationOptions(myComponents:ComponentDetail[],myOptions: BestDetail[]) {

  let myConfigurationOptions:any[] = []

  myOptions.forEach((option:BestDetail) => {
    
    let countOks = 0;
    myComponents!.forEach(element => {
      option.components!.forEach(anotherEl => {
        if(element.id == anotherEl.id ) {
          countOks++
          if(option.components!.length == countOks){
            if(option.configurationOptions){
              myConfigurationOptions.push(option.configurationOptions[0])

            }
          }
        }
      });
    });
  })

  let myUniqueComponents = [...new Map(myConfigurationOptions.map((m) => [m.id, m])).values()];

  return myUniqueComponents;

}



filterByConfigurationOptions(myUnitID: string, myCard: Card){
  let myActive:BestDetail = {}

  myCard.options.forEach((option:BestDetail) => {
    
    let countOks = 0;
    myCard?.active.components!.forEach(element => {
      option.components!.forEach(anotherEl => {
        if(element.id == anotherEl.id ) {
          countOks++
          if(option.components!.length == countOks){
            if(option.configurationOptions![0].id == myUnitID){
              myActive = option
            }
          }
        }
      });
    });
  })
  // En caso no se haya encontrado la combinacion retornamos un mensaje.
  if(Object.keys(myActive).length === 0){
    alert("It's not a valid combination.")
  }else{
    myCard.active = myActive
  }
}

filterByID(myUnitID: string, myUnitType: string, myCard: Card) {

  let myActive:BestDetail = {}
  let myComponents = myCard?.active.components?.filter((item: any)=> item.type != myUnitType);
  //asignar input seleccionado a components para hacer la busqueda
  myComponents?.push({id:myUnitID, type: myUnitType})

  myCard.options.forEach((option:BestDetail) => {
    let countOks = 0;
    myComponents!.forEach(element => {
      option.components!.forEach(anotherEl => {
        if(element.id == anotherEl.id ) {
          countOks++
          if(option.components!.length == countOks){
            
            console.log(countOks, option)
            myActive = option
          }
        }
      });
    });
  })
  // En caso no se haya encontrado la combinacion retornamos un mensaje.
  if(Object.keys(myActive).length === 0){
    alert("It's not a valid combination.")
  }else{
    myCard.active = myActive
    myCard.configurationOptions = this.getConfigurationOptions(myActive.components!, myCard.options)
  }
}


/* ****************************************************************************************************************************************************** */
/*                                                        SEARCH  END                                                                                     */
/* ****************************************************************************************************************************************************** */

 


  


  prepareDataToSend(myCombination:BestDetail){
    let myAHRIs: String[] = []
    myCombination.components!.forEach(element => {
      myAHRIs.push(element.SKU!)
    });
    
    let rebate:any;
    if (this.myPayloadForm.home === 'ahri'){
      rebate = null;
    }else {
      rebate = this.getSelectedRebates();
    }

    let {commerceInfo} = this.myPayloadForm;

    let body = {
      "commerceInfo": commerceInfo,
      "skus": myAHRIs, 
	    "requiredRebates": rebate
    }

    let myBody = JSON.stringify(body)
    return myBody
  }


  sentmodelNrs(myCombination:BestDetail) {

    let myBody = this.prepareDataToSend(myCombination);

   let url= '/home/detail/' + myBody;
   window.open(url) 
 }


  openDialog( i:number) {

    //Get systems with selected outdoor unit
    let myOutdoorUnit = this.myCards[i].active.components!.filter((item: any)=> item.type == "outdoorUnit")[0].SKU;
    let mySystems: BestDetail[] = []
    this.results.forEach((subel:BestDetail[]) => {
      subel.forEach(element => {
        let myFind = element.components?.filter((item: any)=> item.type == "outdoorUnit")[0].SKU;
        if(myFind == myOutdoorUnit){
          mySystems = subel
        }
      });
    });
  
    this.dialogRef.open(TableViewComponent, {
      data: {
        commerceInfo:  this.myPayloadForm.commerceInfo,
        requiredRebates: this.getSelectedRebates(),
        systems:mySystems,
        home : this.myPayloadForm.home
      }
    });
  }


}


