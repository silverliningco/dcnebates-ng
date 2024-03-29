import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { bridgeService } from '../../../services/bridge.service';
import { ApiService } from 'src/app/services/api.service';

import { utilityInfo } from '../../../models/utility';

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
  @ViewChild('stepper')
  stepper!: MatStepper;

  utilityOtherValue: number = 0;

  eligibilityQuestionsGroup !: FormGroup;
  commerceInfoGroup !: FormGroup;
  nominalSizeGroup !: FormGroup;
  furnaceGroup !: FormGroup; 
  stateGroup !: FormGroup;
  utilityGroup !: FormGroup;

  payload: any;

  stepperOrientation: Observable<StepperOrientation>;

  sendElectric: Array<any> = [];
  sendGasOil: Array<any> = [];
  myUtilityIds!: Array<any>;
  myState!: string;

  /* display columns when they have data in table of results */
  showFurnace: boolean = true;
  showHSPF: boolean = true;

  /* utilities */
  electricity:  Array<utilityInfo> = [];
  fossilFuel: Array<utilityInfo> = [];

  /* display title when exist filter */
  showModelNrs: boolean = false;
  showIndoorUnit: boolean = false;
  showOptions: boolean = false;

  myEligibilityQuestions:Array<any> = [];
  noResultsEQ: boolean = false;

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
  
  get questions(){
      return this.eligibilityQuestionsGroup.get('questions') as FormArray;
  }

  ngOnInit(): void {
    
    /* form groups */
    this.eligibilityQuestionsGroup = this._formBuilder.group({
      questions: this._formBuilder.array([])
    });

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

    this.nominalSizeGroup = this._formBuilder.group({
      coolingTons: ['',  Validators.required],
    });

    this.furnaceGroup = this._formBuilder.group({
      fuelSource: ['', Validators.required],
    });

  }

  /* validators */
  /* note: it will always show the error: "Cooling tons is required"
     when "e" is entered as input, because its type = object and its value = null 
  */
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

  /* ElegibilityQuestions */
  AddQuestion(question:any){
    const QuestionFormGroup  = this._formBuilder.group({
      questionId: question.questionId,
      answer: ['',  Validators.required],
      questionText: question.questionText,
      options: [question.options]
    });
    this.questions.push(QuestionFormGroup);
  }

  PrepareDataEligibilityQuestions(){
    let body = {
      country: "US",
      state: this.stateGroup.controls['state'].value,
      utilityProviders: { 
        electricUtilityId: this.utilityGroup.controls['electricUtility'].value },
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      rebateTypes:["electric", "OEM", "distributor"],
      OEM: "Carrier",
      storeIds: []
    }
    return body;
  }


  LoadEligibilityQuestions(myOldEligibilityQuestions:any){

    this._api.ElegibilityQuestions(this.PrepareDataEligibilityQuestions()).subscribe({
      next: (resp) => {
        if (JSON.stringify(resp) !== JSON.stringify(myOldEligibilityQuestions)){
          this.myEligibilityQuestions = resp;


          this.questions.clear()
          if(resp.length > 0) {
            resp.forEach((question: any) => {
              this.AddQuestion(question)
              this.noResultsEQ = false;
            });
          } else {
            this.noResultsEQ = true;
          }
        }
        
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  AnswersEligibilityQuestions(){
    // Create interface to dynamically asign properties
    interface IAnswer {
      [key: string]: string
    }
    var myAnswers: IAnswer = {};

    let myQuestions = this.eligibilityQuestionsGroup.value.questions;
    myQuestions.forEach((question: any) => {
      myAnswers![question.questionId] = question.answer;
    });

    
    return myAnswers;

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


  submitForm() {

    this.payload = {
      commerceInfo: this.commerceInfoGroup.value,
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      state: this.stateGroup.controls['state'].value,
      eligibilityCriteria: this.AnswersEligibilityQuestions(),
      utilityProviders: { 
        electricUtilityId: this.utilityGroup.controls['electricUtility'].value 
      },
      levelOneSystemTypeId: 2,
      // levelTwoSystemTypeId: 2,
      sizingConstraint: "Nominal cooling tons",
      rebateTypes:["electric", "OEM", "distributor"],
      home: 'rebate'
    }  
    /* sent the info to results-rebate */
    this._bridge.sentRebateParams.emit({
      data: this.payload
    });
  }

  tabChange(e:any){

    // Call eligibility questions, always it will be the second to last.
    if(this.stepper?.steps.length -2 == e.selectedIndex){
      this.LoadEligibilityQuestions(this.myEligibilityQuestions)
    }
    // Confirm that it's the last step (ahri combinations).
    if(this.stepper?.steps.length -1 == e.selectedIndex){
      this.submitForm()
    }
  }
}
