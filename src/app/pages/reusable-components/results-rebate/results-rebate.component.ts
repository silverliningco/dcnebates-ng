import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
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
  filters: Array<any> = [];

  /* model nrs */
  modelNr_1: ModelNr = new ModelNr;
  combinationModelNrs: Array<ModelNr> = []
  myOutdoorUnit: any= [];
  bodyModelNr: Array<PostBodyNr> = [];

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm;
  myDetail: Detail = new Detail;

  /* rebates */
  payloadRebates: Array<any> = [];
  bodyRebate!: any; 
  availableRebates!: Array<Rebate>;
  IsValidAvailabeRebates: boolean = true;
  NoExistAvailableRebates: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _bridge: bridgeService, 
    public dialog: MatDialog
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
        this.myPayloadForm.elegibilityQuestions = payload.data.elegibilityQuestions;
        this.myPayloadForm.utilityProviders = payload.data.utilityProviders;

        this.CallProductLines(this.myPayloadForm);
        this.GetAvailableRebates();
        this.GetViewDetailBestOption()
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


  PrepareProductLines(){
    let body = {
      "searchType": this.myPayloadForm.searchType,
      "fuelSource": this.myPayloadForm.fuelSource,
      "commerceInfo": this.myPayloadForm.commerceInfo,
      "nominalSize": this.myPayloadForm.nominalSize
    }

    this.CallProductLines(body);
  }

  CallProductLines(body: any) {
    this._api.ProductLines(JSON.stringify(body)).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.productLines = resp
          this.bodyModelNr = []; /* cleaning  up parameter array for later do the post request ModelNrs */ 
          this.combinationModelNrs = []; /* cleaning  up parameter array for later do the post request ModelNrs */ 
          this.productLinesGroup.controls['productLine'].setValue(resp[0].id);
          this.ModelNrs();
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
  }

  PrepareModelNrs(){

    if (this.myOutdoorUnit.length === 0){
      this.bodyModelNr.push(
        {
          "searchType": this.myPayloadForm.searchType,
          "fuelSource":  this.myPayloadForm.fuelSource,
          "commerceInfo": this.myPayloadForm.commerceInfo,
          "nominalSize": this.myPayloadForm.nominalSize,
          "systemTypeId": 2, /* no se de donde biene eso */
          "filters":[], /* falta programar toda esa parte */
          "requiredRebates": this.myPayloadForm.requiredRebates,
          "outdoorUnit": null,
          "indoorUnit": null,
          "furnaceUnit": null
        }
      );
    } else {
      this.bodyModelNr = [];
      this.myOutdoorUnit.forEach((ele: string) => {
        this.bodyModelNr.push(
          {
            "searchType": this.myPayloadForm.searchType,
            "fuelSource":  this.myPayloadForm.fuelSource,
            "commerceInfo": this.myPayloadForm.commerceInfo,
            "nominalSize": this.myPayloadForm.nominalSize,
            "systemTypeId": 2, /* no se de donde biene eso */
            "filters":[], /* falta programar toda esa parte */
            "requiredRebates": this.myPayloadForm.requiredRebates,
            "outdoorUnit": ele,
            "indoorUnit": null,
            "furnaceUnit": null
          }
        );
      });
    }

    return this.bodyModelNr;
  }

  /* need call two time to model-nrs endpoint, the first for get the list of outdoor-units, the second for get the
   combinations according foreach outdoor-unit. */
  ModelNrs(){

    this.myOutdoorUnit = [];
    this.PrepareModelNrs();

      this._api.ModelNrs(this.bodyModelNr[0]).subscribe({
        next: (resp) => {
          this.modelNr_1 = resp;
          this.myOutdoorUnit = this.modelNr_1.outdoorUnits;

          this.PrepareModelNrs();

          this.bodyModelNr.forEach((ele: any) => {
            // second call to model-nrs endpoint 
            this._api.ModelNrs(ele).subscribe({
              next: (resp) => {
                this.combinationModelNrs.push(resp);
              },
              error: (e) => alert(e.error),
              complete: () => console.info('complete')
            });
          });
        },
        error: (e) => alert(e.error),
        complete: () => console.info('complete')
      })
  }

  PrepareAvailableRebates(){

    this.bodyRebate = {
      "country": "US",
      "state": this.myPayloadForm.state,
      "utilityProviders": this.myPayloadForm.utilityProviders,
      "fuelSource": this.myPayloadForm.fuelSource,
      "rebateTypes":[ "electric", "fossil fuel", "OEM", "distributor"],
      "OEM": "Carrier",
      "storeIds": []
    }

  }   

  GetAvailableRebates(){ 

    this.PrepareAvailableRebates();

    this._api.AvailableRebates(this.bodyRebate).subscribe({
      next: (resp: any) => {
        this.processingAvailableRebates(resp);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    });
  }

  processingAvailableRebates(myResp: any){
    this.availableRebates = [];
    
    /* confirm if exists data */
    if (myResp.length === 0){
      this.NoExistAvailableRebates = true;
    } else {
      this.NoExistAvailableRebates = false;
    }

    /* processing data */
    if (myResp.length > 0){
      for (let indx = 0; indx < myResp.length; indx++) {
        const reb = myResp[indx];
  
        /* matches the level RebateTier in the defined model */
        let myTier: Array<RebateTier> = [];
  
        var myMax = Math.max.apply(Math, reb.rebateTiers.map(function(rt:any) {return rt.accessibilityRank;}))
  
        let myFirstOccurrence = false;

        reb.rebateTiers?.forEach( (element: any) => {
          let myDefault = false;
          if(!myFirstOccurrence && myMax == element.accessibilityRank) {
            myFirstOccurrence = true;
            myDefault = (myMax == element.accessibilityRank) ? true :false;  
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

    // validate if at least one rebate is selected
    this.validateSelection();
  }

  // If there are multiple rebate tiers in a given rebate,
  // checking one rebate tier should always uncheck the remaining tier(s).
  uncheckRemainingTiers(rebTier: RebateTier, reb: Rebate){

    const resultTier = reb.rebateTiers?.filter(rt => rt.completed == true);

    if(resultTier!.length > 0) {
      reb.completed = true;
    } else {
      reb.completed = false;
    }

    reb.rebateTiers?.forEach(element => {

      if( element.title != rebTier.title){
        // Uncheck rebate tier.
        element.completed = false;
      }
    });
  }

  rebate_change(reb: Rebate) {
    // add rebate tier  selections TODO
    //...
    reb.rebateTiers?.forEach(tier => {
      if(!reb.completed) {
        tier.completed = reb.completed!;
      } else {
        tier.completed = tier.defaultTier;
      }
     })


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

      if (e.completed === true){       

          e.rebateTiers?.filter(e2 => {

            if (e2.completed == true){
              getformat =  {"rebateId": e.rebateId, "rebateTierId": e2.rebateTierId, "isRequired": false};
              collectFormat.push(getformat);
            }
            
          });
        
      }

    });
    this.payloadRebates = collectFormat;
    
  }

  PrepareDetailBestOption(){
    let body = {
      "commerceInfo": this.myPayloadForm.commerceInfo,
      "outdoorUnit": "25HBC524AP03",
      "requiredRebates": [   
          {
              "rebateId": 1,
              "rebateTierId": 2,
              "isRequired": false
          },
          {
              "rebateId": 2,
              "rebateTierId": 3,
              "isRequired": false
          },
          {
              "rebateId": 6,
              "rebateTierId": 8,
              "isRequired": false
          }
      ]
   }

   return JSON.stringify(body);
  }

  GetViewDetailBestOption(){
    this._api.DetailsBestOption(this.PrepareDetailBestOption()).subscribe({
      next: (resp) => {
        this.myDetail = resp;
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    });
  }

}


export class TooltipOverviewExample {}
