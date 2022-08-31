import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { payloadForm } from '../../../models/payloadFrom';
import { Rebate, RebateTier } from '../../../models/rebate';
import { BestDetail, jsonStructureSearch, EqualUnitsOptions} from '../../../models/detailBestOption';
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

  filters: Array<any> = [];

  /* search */
  noResultsSearch!: boolean;
  results!: any; // guarda todos los resultados del endpoint search
  oneCard: Array<BestDetail> = []; // el contenido de cada tarjeta
  equalUnitsOptions: Array<EqualUnitsOptions> = []; // el contenido de cada tarjeta
  

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
  index: number = 0;


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
                      // remove rebates tab
                      this.tabs.splice(0, 1);
                    }else {
                      this.showCardRebate = true;
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

      }

      this.showTitleFilter(this.filters);

      // Call search.
      this.CallSearch();
    },
    error: (e) => alert(e.error),
    complete: () => console.info('complete')
  })
}

CallSearch() {
  this.showSpinner = true;
   this._api.Search(this.Payload()).subscribe({
    next: (resp) => {
      if (resp.length > 0) {
        this.noResultsSearch = false;
        this.results = resp;
        this.totalRebateMax();
      } else {
        this.noResultsSearch = true;
      }

      this.showSpinner = false;
    }
  })
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

totalRebateMax(){

  this.oneCard=[];
    
  // recorriendo toda la respuesta del search
  this.results.forEach((element:any) => {
    // debuelve los resultados ordenamos del maxino al minimo
    let max =  element.sort( function(a: any, b:any) {
      if (a.totalAvailableRebates < b.totalAvailableRebates || a.totalAvailableRebates === null) return +1;
      if (a.totalAvailableRebates > b.totalAvailableRebates || b.totalAvailableRebates === null) return -1;
      return 0;
  }) ;
    this.oneCard.push(max[0]);; // colocando el maximo de cada grupo a cada card
  });  
  
  this.getUnitOptionstoSelect2(this.oneCard);

  this.searchUnits();

  return this.sortDescendingOneCard();
}

searchUnits(){

  // variables to save the unit id to current card
  let myOutdoorUnit: string = '';
  let myIndoorUnit: string = '';
  let myfurnace: string = '';

  // variables that save unit searches in results
  let myEqualUnitsOutdoors: any = [];
  let myEqualUnitsIndoors: any = [];
  let myEqualUnitsfurnace:any = [];


  /* looping through results */
  this.oneCard.forEach((element:any) => {
  
    myOutdoorUnit = '';
    myIndoorUnit = '';
    myfurnace = '';
    myEqualUnitsOutdoors = [];
    myEqualUnitsIndoors = [];
    myEqualUnitsfurnace = [];
    
  
    // save the value of units
    element.components.forEach((ele1:any) => {
      switch (ele1.type) {
        case 'outdoorUnit':
          myOutdoorUnit = ele1.id;
          break;
        case 'indoorUnit':
          myIndoorUnit = ele1.id;
          break;
        case 'furnace':
          myfurnace = ele1.id;
          break;
      }
    });
  
    // se buscar entro de this.results todos los registros con el mismo aoutddor unit
    myEqualUnitsOutdoors = this.globalSearch('myOutdoorUnit', this.results, ['id'] );
  
    // busca las combinaciones para el resto de tipo de unidades
    if (myfurnace != '' && myIndoorUnit === ''){
      myEqualUnitsfurnace = this.globalSearch('myfurnace', myEqualUnitsOutdoors[0], ['id'] );
      element.equalUnits = myEqualUnitsfurnace;
      element.lengthEqualUnits = myEqualUnitsfurnace.length;
    } else if (myfurnace === '' && myIndoorUnit != ''){
      myEqualUnitsIndoors = this.globalSearch('myIndoorUnit', myEqualUnitsOutdoors[0], ['id'] );
      element.equalUnits = myEqualUnitsIndoors;
      element.lengthEqualUnits = myEqualUnitsIndoors.length;
    } else if (myfurnace != '' && myIndoorUnit != '') {
      myEqualUnitsfurnace = this.globalSearch('myfurnace', myEqualUnitsOutdoors[0], ['id'] );

      myEqualUnitsIndoors = this.globalSearch('myIndoorUnit', myEqualUnitsfurnace[0], ['id'] );

      element.equalUnits = myEqualUnitsIndoors;
      element.lengthEqualUnits = myEqualUnitsIndoors.length;
    } else {
      let message = 'error';
    }


  
  });

  return this.oneCard;
}


filterByID(myUnitID: string, i:number) {

  // falta hacer el que las opciones se carguen en la nuevo elemento del card, o talves se debe de 
  // cargar en una una sola en cada una de las conbinaciones ????
  
  this.oneCard[i].lengthEqualUnits = 0;
  this.oneCard[i].equalUnits = [];

  // variables to save the unit id to current card
  let myOutdoorUnit: any = '';
  let myIndoorUnit: any = '';
  let myfurnace: any = '';

  // variables that save unit searches in results
    let myEqualUnitsOutdoors: any = [];
    let myEqualUnitsIndoors: any = [];
    let myEqualUnitsfurnace:any = [];

  //Search bestOption with user selections
  myOutdoorUnit = this.oneCard[i].components!.filter((item: any)=> item.type == "outdoorUnit")[0].id;

  // buscando la unidad si importatr su type
  let a: any = {};
  this.results[0].forEach((ele1:any)=> {
    ele1.components.forEach((ele2:any) => {
      if (ele2.id === myUnitID){
        a= ele2;
      }
    });
  });

  if (a.type === 'indoorUnit'){
    myIndoorUnit = a.id;
  } else {
    myfurnace = a.id;
  }
  
  // se buscar entro de this.results todos los registros con el mismo aoutddor unit
  myEqualUnitsOutdoors = this.globalSearch('myOutdoorUnit', this.results, ['id'] );

  // busca las combinaciones para el resto de tipo de unidades
  if (myfurnace === '' && myIndoorUnit != ''){
    console.log('a');
    myEqualUnitsOutdoors.forEach((element :any)=> {
      let myFind = element.components?.filter((item: any)=> item.type == "indoorUnit")[0].id;
      if(myFind == myIndoorUnit){
        myEqualUnitsIndoors.push(element);
        this.oneCard[i] = element;
        this.oneCard[i].equalUnits = myEqualUnitsIndoors;
        this.oneCard[i].lengthEqualUnits = myEqualUnitsIndoors.length;
      }
    });
  } else if (myfurnace != '' && myIndoorUnit === ''){
    console.log('b');
    myEqualUnitsOutdoors.forEach((element :any)=> {
      let myFind = element.components?.filter((item: any)=> item.type == "furnace")[0].id;
      console.log(element.components?.filter((item: any)=> item.type == "furnace")[0].id);
      if(myFind === myfurnace){
        myEqualUnitsfurnace.push(element);
        this.oneCard[i] = element;
        this.oneCard[i].equalUnits = myEqualUnitsfurnace;
        this.oneCard[i].lengthEqualUnits = myEqualUnitsfurnace.length;
      }
    });
  } else if (myfurnace != '' && myIndoorUnit != '') {
    console.log('c');
    myEqualUnitsOutdoors.forEach((element :any)=> {
      let myFind = element.components?.filter((item: any)=> item.type == "furnace")[0].id;
      if(myFind === myfurnace){
        myEqualUnitsfurnace.push(element);
      }

      myEqualUnitsfurnace.forEach((element:any) => {
        let myFind = element.components?.filter((item: any)=> item.type == "indoorUnit")[0].id;
        if(myFind === myIndoorUnit){
          myEqualUnitsIndoors.push(element);
          this.oneCard[i] = element;
          this.oneCard[i].equalUnits = myEqualUnitsIndoors;
          this.oneCard[i].lengthEqualUnits = myEqualUnitsIndoors.length;;
        }
      });
    });
  } else {
    console.log('d');
    let message = 'error';
  }

  // obteniendo las opciones
  let options = this.getUnitOptionstoSelect3(myOutdoorUnit);

  this.oneCard[i].optionsIndoorsToSelect = options[0];
  this.oneCard[i].optionsfurnaceToSelect = options[1];

  // console.log(this.oneCard[i]);
  // console.log(this.oneCard[i].equalUnits);

}

globalSearch (event: any, objectData:any,  combinations: Array<any>) {
    
  let input = event;

  let results: Array<any> = [];

  objectData.forEach((conb:any) => {
    
    let b = conb.filter((data:any) => {
    let combinationQueries = "";

    combinations.forEach((arg:any) => {
      combinationQueries +=
      data.hasOwnProperty(arg) && data[arg].toLowerCase().trim() + "";
    });

    let a =  Object.keys(data).some((key:any) => {
      return(
        (data[key] != undefined && 
          data[key] != null && 
          JSON.stringify(data[key]).toLowerCase().trim().includes(input)) ||
          combinationQueries.trim().includes(input)  
      );
    });
    return a;
   });

  if(b.length != 0){
    results.push(b);
  }
   
  });

  console.log(results)
  return results;
}



getUnitOptionstoSelect2(oneCard:any){

  let myOptionsIndoor: Array<jsonStructureSearch> = [];
  let myOptionsfurnace: Array<jsonStructureSearch> = [];

  // reecortiendo oneCard
  for (let i = 0; i < oneCard.length; i++) {
    
    // limpienado las variables, cada ves que salte de aoutdoor
    myOptionsIndoor = [];
    myOptionsfurnace = [];

    // recortiendo results para obtener los components
    this.results[i].forEach((everyCombinationOutdoor:any) => {
      everyCombinationOutdoor.components.forEach((eachComponent:any) => {
        switch (eachComponent.type) {
          case 'indoorUnit':
            myOptionsIndoor.push(eachComponent);
            break;
          case 'furnace':
            myOptionsfurnace.push(eachComponent);
            break;
        } 
      });
    });

    oneCard[i].optionsIndoorsToSelect = this.deleteDuplicateUnitSelect(myOptionsIndoor);
    oneCard[i].optionsfurnaceToSelect = this.deleteDuplicateUnitSelect(myOptionsfurnace);
  }

  return oneCard;
}

getUnitOptionstoSelect3(outdoor:any){

  // variables that save unit searches in results
  let myEqualUnitsOutdoors: any = [];

  let myOptionsIndoor: Array<jsonStructureSearch> = [];
  let myOptionsfurnace: Array<jsonStructureSearch> = [];

    
    // limpienado las variables, cada ves que salte de aoutdoor
    myOptionsIndoor = [];
    myOptionsfurnace = [];

    this.results.forEach((subel:BestDetail[]) => {
      subel.forEach(element => {
        let myFind = element.components?.filter((item: any)=> item.type == "outdoorUnit")[0].id;
        if(myFind == outdoor){
          myEqualUnitsOutdoors = subel
        }
      });
    });

    myEqualUnitsOutdoors.forEach((units:any) => {
      units.components.forEach((eachComponent:any) => {
        switch (eachComponent.type) {
          case 'indoorUnit':
            myOptionsIndoor.push(eachComponent);
            break;
          case 'furnace':
            myOptionsfurnace.push(eachComponent);
            break;
        } 
      });
    });

    

    myOptionsIndoor = this.deleteDuplicateUnitSelect(myOptionsIndoor);
    myOptionsfurnace = this.deleteDuplicateUnitSelect(myOptionsfurnace);

    return [myOptionsIndoor, myOptionsfurnace];

}

deleteDuplicateUnitSelect(options: Array<jsonStructureSearch>){

  let newOptions: Array<jsonStructureSearch> = [];
  let uniqueObject:any = {};

  for (let i in options){

    // extract the id
    let optID:any = options[i]['id'];

    // use the id as the index
    uniqueObject[optID] = options[i];
  }

  // loop for push the unique into array
  for (let i in uniqueObject){
    newOptions.push(uniqueObject[i]);
  }

  return newOptions;
}


sortDescendingOneCard(){

  // console.log(this.oneCard);

  let newOrder = this.oneCard.sort( function(a: any, b:any) {
    // return Number.parseInt(b.totalAvailableRebates) - Number.parseInt(a.totalAvailableRebates)
    
      if (a.totalAvailableRebates < b.totalAvailableRebates || a.totalAvailableRebates === null) return +1;
      if (a.totalAvailableRebates > b.totalAvailableRebates || b.totalAvailableRebates === null) return -1;
      return 0;
     
  }) ;

  this.oneCard = newOrder;
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

  lengthEqualUnits2(configurationOptions:BestDetail, i: any, equalUnits:any){
  
    console.log(equalUnits);


    this.oneCard[i].grupOptions = this.equalUnitsOptions;

    // console.log(this.equalUnitsOptions);

  }

  isArray(obj: any) {
    if (Array.isArray(obj)) {
      return true

    } else {
      return false
    }
  }


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


  openDialog(myCombination:BestDetail, i:number) {

    //Get systems with selected outdoor unit
    let myOutdoorUnit = this.oneCard[i].components!.filter((item: any)=> item.type == "outdoorUnit")[0].SKU;
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


  public demo1TabIndex = 1;
  public demo1BtnClick() {
    const tabCount = 2;
    this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
  }

}

/* 
  * arreglar los estilos del togle
  * se debe de mostrar los resultados del togle ordenamos de mayor a menor
  * en el caso en que aparece furnace, siempre hay indoor? por que no se evalua si hay o no, se da por hecho que 
    siempre hay
*/


