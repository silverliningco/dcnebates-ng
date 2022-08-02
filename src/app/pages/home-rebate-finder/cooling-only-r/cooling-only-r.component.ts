import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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

  elegibilityQuestionsGroup !: FormGroup;
  commerceInfoGroup !: FormGroup;
  nominalSizeGroup !: FormGroup;
  furnaceGroup !: FormGroup; stateGroup !: FormGroup;
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
    return this.elegibilityQuestionsGroup.get('questions') as FormArray;
  }

  ngOnInit(): void {

    /* form groups */
    this.elegibilityQuestionsGroup = this._formBuilder.group({
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
    
  /* ElegibilityQuestions */
  /* NOTE: for the moment this version doesn't consider this step */
  /* AddQuestion(question:any){
    const QuestionFormGroup  = this._formBuilder.group({
      elegibilityQuestionId: question.elegibilityQuestionId,
      answer: ['',  Validators.required],
      question:question.question,
      alternatives: [question.alternatives]
    });
    this.questions.push(QuestionFormGroup);
  } */

  /* LoadElegibilityQuestions(){
    this._api.ElegibilityQuestions(this.stateGroup.controls['state'].value, 
      JSON.stringify([
        this.utilityGroup.controls['electricUtility'].value
      ])
    ).subscribe({
      next: (resp) => {

        this.questions.clear()

        resp.forEach((question: any) => {
          this.AddQuestion(question)
        });
        
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  } */

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
      /* elegibilityQuestions: this.elegibilityQuestionsGroup.value, */
      state: this.stateGroup.controls['state'].value,
      utilityProviders: { 
        "electricUtility": this.utilityGroup.controls['electricUtility'].value
      },
      levelOneSystemTypeId: 2,
      sizingConstraint: "Nominal cooling tons"
    }  
    /* sent the infor to product-lines-components */
    this._bridge.sentRebateParams.emit({
      data: this.payload
    });
  
  }

  tabChange(e:any){
    // Confirm that it's the last step (ahri combinations).
    if(this.stepper?.steps.length -1 == e.selectedIndex){
      this.submitForm()
    }
  }
}
