import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Rebate, RebateTier } from '../../models/rebate';
import { ModelNr, PostBodyNr} from  '../../models/modelNr';
import { utilityInfo } from '../../models/utility';

@Component({
  selector: 'app-i-know-model-nr',
  templateUrl: './i-know-model-nr.component.html',
  styleUrls: ['./i-know-model-nr.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})
export class IKnowModelNrComponent implements OnInit {

  @ViewChild('stepper')
  stepper!: MatStepper;

  utilityOtherValue: number = 0;

  stepperOrientation: Observable<StepperOrientation>;

  /* FORM GRUP */
  stateGroup !: FormGroup;
  utilityGroup !: FormGroup;
  furnaceGroup !: FormGroup; 
  filtersGroup !: FormGroup;

  /* utilities */
  sendElectric: Array<any> = [];
  sendGasOil: Array<any> = [];
  electricity:  Array<utilityInfo> = [];
  fossilFuel: Array<utilityInfo> = [];

  /*  AVAILABLE REBATES */
  availableRebates!: Array<Rebate>;
  NoExistAvailableRebates: boolean = false;

  /* MODEL NRS */
  modelNrs: ModelNr = new ModelNr; 
  myOutdoorUnit: any= [];
  bodyModelNr: PostBodyNr = new PostBodyNr;
  payload!: any;

  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    public router: Router,
    public breakpointObserver: BreakpointObserver,
  ) { 
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {

    this.stateGroup = this._formBuilder.group({
      state: ['', Validators.required]
    });

    this.utilityGroup = this._formBuilder.group({
      electricUtility: ['', Validators.required],
      fossilFuelUtilityId: ['', Validators.required]
    });

    this.furnaceGroup = this._formBuilder.group({
      fuelSource: ['', Validators.required],
    });

    this.filtersGroup = this._formBuilder.group({
      outdootUnit: [null],
      indoorUnit: [null],
      furnaceUnit: [null],
    });
  }

  // utilities
  ChangeState() {

    this.sendGasOil = [];
    this.sendElectric = [];

    this._api.Utilities(this.stateGroup.controls['state'].value).subscribe({
      next: (resp: any) => {
        let listUtilities: Array<utilityInfo> = resp;
        this.SelectUtility(listUtilities);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  SelectUtility(array: Array<utilityInfo>) {

    this.electricity = [];
    this.fossilFuel = [];

    array.forEach(ele => {
      if (ele.electricity === true && ele.fossilFuel === false){
        this.electricity.push(ele);
      } if (ele.electricity === false && ele.fossilFuel === true){
        this.fossilFuel.push(ele);
      } if (ele.electricity === true && ele.fossilFuel === true) {
        this.electricity.push(ele);
        this.fossilFuel.push(ele);
      }
    });
  }

  /* ****************************************************************************************************************************************************** */
  /*                                                        AVAILABLE REBATES                                                                               */
  /* ****************************************************************************************************************************************************** */

  PrepareDataAvailableRebates(){

    let body= {
      "country": "US",
      "state": this.stateGroup.controls['state'].value,
      "utilityProviders": {"electricUtility": this.utilityGroup.controls['electricUtility'].value, "fossilFuelUtilityId": this.utilityGroup.controls['fossilFuelUtilityId'].value},
      "fuelSource": this.furnaceGroup.controls['fuelSource'].value,
      "rebateTypes":["electric", "OEM", "distributor"],
      "OEM": "Carrier",
      "storeIds": []
    }

    return JSON.stringify(body);
  }

    GetAvailableRebates() {
     
      this._api.AvailableRebates(this.PrepareDataAvailableRebates()).subscribe({
        next: (resp: any) => {
          this.processingAvailableRebates(resp);

          /* get models nrs */
          this.ModelNrs();
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

      /* get models nrs */
      this.ModelNrs();
  
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
      });

      /* get models nrs */
      this.ModelNrs();
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
  /*                                                        MODEL NRS                                                                                       */
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

    this.payload = {
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      commerceInfo: {    
        "storeId": 1,
        "showAllResults": false  
      },
      filters: myfilters,
      requiredRebates: this.getSelectedRebates(),
      outdoorUnit:  this.filtersGroup.controls['outdootUnit'].value,
      indoorUnit: this.filtersGroup.controls['indoorUnit'].value,
      furnaceUnit: this.filtersGroup.controls['furnaceUnit'].value
    }

    return JSON.stringify(this.payload);
  }



  /* need call two time to model-nrs endpoint, the first for get the list of outdoor-units, the second for get the
  combinations according foreach outdoor-unit. */
  ModelNrs(){

    /* this.filtersGroup.disable(); */

      this._api.ModelNrs(this.Payload()).subscribe({
        next: (resp) => {
          this.modelNrs = resp;
        },
        error: (e) => alert(e.error),
        complete: () => console.info('complete')
      })
  }

  sentmodelNrs(){
    let body: any = this.Payload();
    let url= '/home/bestDetail/' + body;
    window.open(url)  
  }

  /* ****************************************************************************************************************************************************** */
  /*                                                        MODEL NRS END                                                                                   */
  /* ****************************************************************************************************************************************************** */


}

 