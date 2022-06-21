import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { bridgeService } from '../../../services/bridge.service';
import { ApiService } from 'src/app/services/api.service';

import { utilityInfo } from '../../../models/utility';
import { Rebate, RebateTier } from '../../../models/rebate';

@Component({
  selector: 'app-heating-cooling-r',
  templateUrl: './heating-cooling-r.component.html',
  styleUrls: ['./heating-cooling-r.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class HeatingCoolingRComponent implements OnInit {

  
  commerceInfoGroup !: FormGroup;
  nominalSizeGroup !: FormGroup;
  furnaceGroup !: FormGroup; stateGroup !: FormGroup;
  utilityGroup !: FormGroup;
  availableRebatesGroup  !: FormGroup;

  payloadRebates: Array<any> = [];
  payload: any;

  stepperOrientation: Observable<StepperOrientation>;

  sendElectric: Array<any> = [];
  sendGasOil: Array<any> = [];
  myUtilityIds!: any;
  myState!: string;
  myFuel!: string;

  availableRebates!: Array<Rebate>;
  IsValidAvailabeRebates: boolean = true;

  /* utilities */
  electricity:  Array<utilityInfo> = [];
  fossilFuel: Array<utilityInfo> = [];

  /* display columns when they have data in table of results */
  showFurnace: boolean = true;
  showHSPF: boolean = true;

  /* display title when exist filter */
  showModelNrs: boolean = false;
  showIndoorUnit: boolean = false;
  showOptions: boolean = false;

  /* data exchange */
  data!: any;

  constructor(
    private _formBuilder: FormBuilder,
    public breakpointObserver: BreakpointObserver,
    public _bridge: bridgeService,
    private _api: ApiService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }


  ngOnInit(): void {

    /* form grups */
    this.commerceInfoGroup = this._formBuilder.group({
      storeId: 1,
      showAllResults: [false, Validators.required],
    });

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
      heatingBTUH: ['', [this.ValidateHeatingBTUH, this.ValidateNumber]],
      coolingTons: ['',  Validators.required],
    });

    this.furnaceGroup = this._formBuilder.group({
      fuelSource: ['', Validators.required],
    });

  }

  /* validators */
  /* note: it will always show the error: "Cooling tons is required"
     when "e" is entered as input, because its type = object and its value = null */
     ValidateNumber(control: AbstractControl) : ValidationErrors | null  {

      let coolingToms = control.value;
      let typeCT = typeof coolingToms;
  
      if (typeCT === 'number' ){
        return null;
      } 
      else {
        if (typeCT === 'object' &&  coolingToms === null){
          return  { null_not_permit : true };
        } if (typeCT === 'string' &&  coolingToms === ''){
          return  { need_1_or_3_characters : true };
        } 
        else{
          return  { is_not_number : true };
        }
        
      }
     
    }
  
    ValidateHeatingBTUH(control: AbstractControl) : ValidationErrors | null  {
  
      let heatingBTUH = control.value;
      let lengthHeatingBTUH!: string;    
  
  
      if (heatingBTUH != null){
        lengthHeatingBTUH = heatingBTUH.toString();
      }else {
        return  { null_not_permit: true };
      }
      
  
      // first verify if the number is integer
       if (heatingBTUH % 1 === 0){
        if (lengthHeatingBTUH.length === 4 || lengthHeatingBTUH.length === 5 || lengthHeatingBTUH.length === 6) {
  
          if (heatingBTUH >= 8000 && heatingBTUH <= 135000 ){
  
            return null;
          } else {
            return  { Hbtuh_invalid_value: true };
          }
  
        } else {
          return  {  need_between_4_6_characters: true };
        }
  
      } else {
        return  { it_not_integer: true }; 
      }
  
    }

    // utilities
  changeState() {

    this.sendGasOil = [];
    this.sendElectric = [];

    this._api.Utilities(this.stateGroup.controls['state'].value).subscribe({
      next: (resp: any) => {
        let listUtilities: Array<utilityInfo> = resp;
        this.selectUtility(listUtilities);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  selectUtility(array: Array<utilityInfo>) {

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

  PrepareAvailableRebates(){
    let electric = Number(this.utilityGroup.controls['electricUtility'].value) ;
    let gasOil = Number(this.utilityGroup.controls['gasOilUtility'].value);

    this.myUtilityIds = {
      "electricUtilityId": electric,
      "fossilFuelUtilityId": gasOil
    }

    let body = {
      "country": "US",
      "state": this.stateGroup.controls['state'].value,
      "utilityProviders": this.myUtilityIds,
      "fuelSource": this.furnaceGroup.controls['fuelSource'].value,
      "rebateTypes":[ "electric", "fossil fuel", "OEM", "distributor"],
      "OEM": "Carrier",
      "storeIds": []
    }

    this.GetAvailableRebates(body);
  }

  GetAvailableRebates(body: any) {
    
    this._api.AvailableRebates(body).subscribe({
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

      /* matches the level RebateTier in the defined model */
      let myTier: Array<RebateTier> = [];

      var myMax = Math.max.apply(Math, reb.rebateTiers.map(function(rt:any) {return rt.accessibilityRank;}))

      reb.rebateTiers?.forEach( (element: any) => {

          let myDefault = (myMax == element.accessibilityRank) ? true :false;  
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

  submitForm() {  

    this.payload = {
      commerceInfo: this.commerceInfoGroup.value,
      searchType: "Heating and Cooling",
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      state: this.stateGroup.value,
      requiredRebates: this.payloadRebates
    }  
    /* sent the infor to product-lines-components */
    this._bridge.sentParams.emit({
      data: this.payload
    });
  
  }



}
