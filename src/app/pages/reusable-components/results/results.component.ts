import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { payloadForm,  } from '../../../models/payloadFrom';
import { Rebate, RebateTier } from '../../../models/rebate';
import { BestDetail, Card, ComponentDetail, OptionsbyType} from '../../../models/detailBestOption';
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
  myCards: Array<Card> = [];
  resultsSearch!: any;

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm; 
  myPayloadRebate!: any;

  /* display title when exist filter */
  showCardRebate: boolean = false;
  showIndoor: boolean = false;

  /*  AVAILABLE REBATES */
  availableRebates!: Array<Rebate>;
  NoExistAvailableRebates: boolean = false;

  showSpinner:boolean = false;

  resetTab: number = 0;
  tabs: Array<string> = [];

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
          this.tabs = ['REBATES','FILTERS'];
        
          this.myPayloadForm = payload.data;
          this.CallProductLines();
          
          // call GetAvailableRebates if home = 'rebate'
          if (this.myPayloadForm.home === 'ahri'){
            this.showCardRebate = false;
            // remove rebates tab
            this.tabs.splice(0, 1);
          }else {
            this.showCardRebate = true;
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
      coilCasing: null,
      electricalPhase: null,
      coastal: null,
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

        let myAvailableRebateTiers = reb.rebateTiers?.filter((rt:any) => rt.isAvailable == true);

        var myMax = Math.max.apply(Math, myAvailableRebateTiers.map(function (rt: any) { return rt.accessibilityRank; }))

        let myFirstOccurrence = false;

        reb.rebateTiers?.forEach((element: any) => {
          let myDefault = false;
          if (!myFirstOccurrence && myMax == element.accessibilityRank) {
            if(element.isAvailable === true){
              myFirstOccurrence = true;
              myDefault = (myMax == element.accessibilityRank) ? true : false;
            } 
          }

          myTier.push({
            title: element.title,
            rebateTierId: element.rebateTierId,
            completed: myDefault,
            defaultTier: myDefault,
            notes: element.notes,
            isAvailable: element.isAvailable
          });
        });


        this.availableRebates.push({
          title: reb.title,
          rebateId: reb.rebateId,
          rebateTiers: myTier,
          notes: reb.notes,
          rebateType: reb.rebateNotes,
          completed: myFirstOccurrence,
          disabled: myFirstOccurrence
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

  let myfilters: any = {};

  Object.entries(this.filtersGroup.value).forEach(
    ([key, value]) => {
      if (value && value != "") {
        myfilters[key] = (Array.isArray(value)) ? value : [value];
      }
    }
  );
    return myfilters;
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
    filters: this.PrepareFilters(),
    availableRebates: rebate
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
          
            this.filtersGroup.controls[filter.filterName].setValue(filter.selectedValues);
         
        });
        this.filtersGroup.enable();
      } else {
        this.notFilters = true;
      }

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

      this.resultsSearch = JSON.stringify(resp) ;
      
      if (resp.length > 0) {
        this.showSpinner = false;
        this.noResultsSearch = false;
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
            bestOption: max[0],
            showResetCard: false,
            options: max,
            allOptions: this.getComponentOptionsbyType(max, max[0]),
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

getComponentOptionsbyType(combinations: BestDetail[], bestOption: BestDetail){

  // se excluye outdoorunit por que se sabe de antemano que los cards biene agrupados por este
  let Posibletype: string[] = [];
  let options: OptionsbyType[] = [];
  let myOption: OptionsbyType = {};

  const {components} = bestOption;

  // al saber que ya los cards estan agrupados por outdoorUnit, se excluye este
  for (const component of components!) {
    if (component.type != "outdoorUnit"){
      Posibletype.push(component.type!)
    }
  }

  // elimnando elementos duplicados
  let myType = new Set(Posibletype)

  // agregando las opciones encontradas
  for (const type of myType) {
    let gruopO = this.getComponentOptions(combinations, type)
    
    myOption = {
      nameOption: type,
      options: gruopO
    } 
    options.push(myOption)
  }

  return options;

}

getComponentOptions(combinations: Array<BestDetail>, type: string){
  let myComponentsDetail:ComponentDetail[] = []
  combinations.forEach((det:BestDetail) => {
    
      let myFind = det.components?.filter((item: any)=> item.type == type);
      // If filter finds components with specific type
      if(myFind![0]){
        myFind![0].desable = false;
        myComponentsDetail.push(myFind![0]);
        // console.log(myFind![0]);
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

  // avilitar el bototn reset card
  myCard.showResetCard = true;

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
            myActive = option
          }
        }
      });
    });
  })

  this.desableElements(myUnitID, myCard, myUnitType);

  // En caso no se haya encontrado la combinacion retornamos un mensaje.
  if(Object.keys(myActive).length === 0){
    console.log("It's not a valid combination.")
    let {options: rawOptions} = myCard;
    let newCombination = this.SearchInResponses(rawOptions, ['id'], myUnitID);
    myCard.active = newCombination[0];
    myCard.configurationOptions = this.getConfigurationOptions(myCard.active.components!, myCard.options);
  }else{
    myCard.active = myActive;
    myCard.configurationOptions = this.getConfigurationOptions(myActive.components!, myCard.options);
  }
}

desableElements(myUnitID:any,  card:any, myUnitType:any){

  let {options: rawOptions, allOptions} = card;
  let groupOptiosActive = this.SearchInResponses(rawOptions, ['id'], myUnitID);

  let optionsActive: any[] = [];

  // opteniendo todos los types que existen
  let Type: string[] = [];
  for (const option of allOptions) {
    let {nameOption: type} = option;
    Type.push(type);  
  }
  // elimiando los types duplicados
  let myType = new Set(Type)


  // asignando a optionsActive lo que corresponde
  for (const itemType of myType) { // indoor y furnace
    let comb: string[] = [];
    for (const combinacionAc of groupOptiosActive) {
      
      for (const component of combinacionAc.components) {
        let {type} = component;
        if (itemType == type){
          comb.push(component.id);
        }
      }
    }

    // hacer el esquema anotado en goodnotes aqui
    let a = {
      nameOption: itemType,
      options: new Set(comb) 
    }
    optionsActive.push(a);
  }

  console.log(optionsActive);


  // actibando y desactivando las opciones del dropdown
  // todos se pasan a desable = true, para luego ser pasados a false solo los que son iguales
  for (const myOption of allOptions) {
    for (const itemsOption of myOption.options) {

      // pasando todas las opciones a desable = true
      itemsOption.desable = true;

      // pasando a true los que se encuentran dentro de optionsActive
      for (const intemAct of optionsActive) {

        for (const ite of intemAct.options) {
          if (itemsOption.id == ite){
            console.log(itemsOption.id, ite)
            itemsOption.desable = false;
          }
        }
      }
    }
  }

  console.log(allOptions)


}

desableElements1(myUnitID:any,  card:any, myUnitType:any){

  let myUnit = {
    type: myUnitType, 
    value: myUnitID
  }

  let {options: rawOptions} = card;
  let groupOptiosActive = this.SearchInResponses(rawOptions, ['id'], myUnit);

  let optionIn: Array<string> = [];
  let optionFu: Array<string> = [];

  for (let unit of groupOptiosActive){
    let comp = unit.components;
    for ( let component of comp){
      if (myUnit.type === "furnace"){
        // se va obtener todos los indoors
        if(component.type === "indoorUnit"){
          optionIn.push(component.id);
        }
      } else {
        // se va obtener todos los furnace
        if(component.type === "furnace"){
          optionFu.push(component.id);
        }
      }
    }
  }

  // elimiando loa repetidos
  let myoptionIn = new Set(optionIn); 
  let myOptionFu = new Set(optionFu);

  // todos se pasan a desable = true, para luego ser pasados a false solo los que son iguales
  if(myUnit.type == "indoorUnit"){
    for (const unit of card.furnaceOptions) {
      unit.desable = true
    }

    for (const myfurnace of myOptionFu) {
      card.furnaceOptions.find((unit:any) => {
        if (unit.id == myfurnace){
          // console.log(unit.id)
          unit.desable = false;
        }
      })
    }
  } else {
    for (const unit of card.indoorOptions) {
      unit.desable = true
    }

    for (const myindoor of myoptionIn) {
      card.indoorOptions.find((unit:any) => {
        if (unit.id == myindoor){
          // console.log(unit.id)
          unit.desable = false;
        }
      })
    }
  }

}

SearchInResponses (objectData:Array<any>,  combinations: Array<any>, unit: any) {
    
  let input = unit;
  let result: Array<any> = [];

  
    let b = objectData.filter((data:any) => {
      let combinationQueries = "";
  
      combinations.forEach((arg:any) => {
        combinationQueries +=
        data.hasOwnProperty(arg) && data[arg].trim() + "";
      });
  
      return Object.keys(data).some((key:any) => {
        return(
          (data[key] != undefined && 
            data[key] != null && 
            JSON.stringify(data[key]).trim().includes(input)) ||
          combinationQueries.trim().includes(input)  
        );
      });
    });
  
    if(b.length != 0){
      result = b
    }
  
  return result;
}

Reset(myCard:  Card, myType: string){

}

ResetCard(myCard:  Card){

  myCard.showResetCard= false
  myCard.active = myCard.bestOption;

  // reset allOptions
  let {allOptions} = myCard;

  for (const myOption of allOptions) {
    let {options} = myOption;
    for (const element of options!) {
      element.desable = false
    }
  }

  console.log(allOptions)
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
	    "availableRebates": rebate
    }

    let myBody = JSON.stringify(body)
    return myBody
  }


  sentmodelNrs(myCombination:BestDetail) {

    let myBody = this.prepareDataToSend(myCombination);

   let url= '/home/detail/' + myBody;
   window.open(url) 
 }


  openDialog(myOptions: BestDetail[]) {

    this.dialogRef.open(TableViewComponent, {
      data: {
        commerceInfo:  this.myPayloadForm.commerceInfo,
        availableRebates: this.getSelectedRebates(),
        systems:myOptions,
        home : this.myPayloadForm.home
      }
    });
  }


}