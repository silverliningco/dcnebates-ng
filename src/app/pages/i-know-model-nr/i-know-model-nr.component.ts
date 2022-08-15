import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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
  eligibilityQuestionsGroup !: FormGroup;
  stateGroup !: FormGroup;
  utilityGroup !: FormGroup;
  furnaceGroup !: FormGroup; 

  /* utilities */
  sendElectric: Array<any> = [];
  sendGasOil: Array<any> = [];
  electricity:  Array<utilityInfo> = [];
  fossilFuel: Array<utilityInfo> = [];

  myEligibilityQuestions:Array<any> = [];
  noResultsEQ: boolean = true;

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

  get questions(){
      return this.eligibilityQuestionsGroup.get('questions') as FormArray;
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

    this.eligibilityQuestionsGroup = this._formBuilder.group({
      questions: this._formBuilder.array([])
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

 
  Payload() {
    let payload = {
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      commerceInfo: {    
        "storeId": 1,
        "showAllResults": false  
      },
      eligibilityCriteria: this.AnswersEligibilityQuestions()
    };

    return JSON.stringify(payload);
  }

  sentmodelNrs(){
    let body: any = this.Payload();
    let url= '/home/detail-i-know-my-model-nr/' + body;
    window.open(url)  
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
        electricUtilityId: this.utilityGroup.controls['electricUtility'].value, 
        fossilFuelUtilityId: this.utilityGroup.controls['fossilFuelUtilityId'].value },
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      rebateTypes:["electric", "OEM", "distributor", "fossil fuel"],
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


  tabChange(e:any){

    // Call eligibility questions, always it will be the last. for I know my model nr.
    if(this.stepper?.steps.length -1 == e.selectedIndex){
      this.LoadEligibilityQuestions(this.myEligibilityQuestions)
    }
   
  }
}

 
