import { Component, Inject, OnInit } from '@angular/core';
import { Rebate, RebateTier } from '../../../models/rebate';
import { ApiService } from '../../../services/api.service';
import { bridgeService } from '../../../services/bridge.service';

export interface parms {

  elegibilityQuestions: any;
  state: any;
  utilityProviders: any;

}

@Component({
  selector: 'app-rebates',
  templateUrl: './rebates.component.html',
  styleUrls: ['./rebates.component.css']
})

export class RebatesComponent implements OnInit {

  payloadRebates: Array<any> = [];
  availableRebates!: Array<Rebate>;
  IsValidAvailabeRebates: boolean = true;
  NoExistAvailableRebates: boolean = false;

  constructor(
    private _api: ApiService,
    public _bridge: bridgeService, 
    
  ) { }

  ngOnInit(): void {

    /* receiving form data */
    this._bridge.sentAvailableRebateParams.subscribe((payload: any) => {
      // Call available rebates.
      this.PrepareAvailableRebates(payload.state, payload.elegibilityQuestions, payload.utilityProviders, payload.fuelSource);
    });
   }

   PrepareAvailableRebates(state: any, elegibilityQuestions: any, utilityProviders: any, fuelSource: any){

    let body = {
      "country": "US",
      "state": state,
      "utilityProviders": utilityProviders,
      "fuelSource": fuelSource,
      "rebateTypes":[ "electric", "fossil fuel", "OEM", "distributor"],
      "OEM": "Carrier",
      "storeIds": []
    }

    this.GetAvailableRebates(body);
  }   

  GetAvailableRebates(body: any){ 

    this._api.AvailableRebates(body).subscribe({
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

    console.log(this.availableRebates);

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


}
