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
    
  addQuestion(question:any){
    const QuestionFormGroup  = this._formBuilder.group({
      elegibilityQuestionId: question.elegibilityQuestionId,
      answer: ['',  Validators.required],
      question:question.question,
      alternatives: [question.alternatives]
    });
    this.questions.push(QuestionFormGroup);
  }

  loadElegibilityQuestions(){
    this._api.ElegibilityQuestions(this.stateGroup.controls['state'].value, 
      JSON.stringify([
        this.utilityGroup.controls['electricUtility'].value
      ])
    ).subscribe({
      next: (resp) => {

        this.questions.clear()

        resp.forEach((question: any) => {
          this.addQuestion(question)
        });
        
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    })
  }

  // utilities
  changeState() {

    this.sendGasOil = [];
    this.sendElectric = [];
    this.utilityGroup.controls["electricUtility"].reset();

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
  the values that each object has in the "utilitiesProvided" field */
  transform(array: Array<utilityInfo>): any[] {

    return array.filter((d: any) => d.utilitiesProvided.find((a: any) => {

      if (a.includes('Electricity')) {
        this.sendElectric.push(d);
      } if (a.includes('Natural Gas')) {
        this.sendGasOil.push(d);
      }

    }));

  }

  submitForm() {  

    this.payload = {
      commerceInfo: this.commerceInfoGroup.value,
      searchType: "Cooling Only",
      nominalSize: this.nominalSizeGroup.value,
      fuelSource: this.furnaceGroup.controls['fuelSource'].value,
      state: this.stateGroup.value,
      elegibilityQuestions: this.elegibilityQuestionsGroup.value
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
