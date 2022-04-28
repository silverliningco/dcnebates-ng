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
import { Rebate, RebateTier, Criteria } from '../../../models/rebate';

@Component({
  selector: 'app-cooling-only-r',
  templateUrl: './cooling-only-r.component.html',
  styleUrls: ['./cooling-only-r.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})

export class CoolingOnlyRComponent implements OnInit {

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
  myUtilityIds!: Array<any>;
  myState!: string;

  availableRebates!: Array<Rebate>;
  IsValidAvailabeRebates: boolean = true;

  /* display columns when they have data in table of results */
  showFurnace: boolean = true;
  showHSPF: boolean = true;

  /* display title when exist filter */
  showModelNrs: boolean = false;
  showIndoorUnit: boolean = false;
  showOptions: boolean = false;

  /* intercambio de datos */
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
      electricUtility: ['', Validators.required]
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
      this.utilityGroup.controls['electricUtility'].value
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
      searchType: "Cooling Only",
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
