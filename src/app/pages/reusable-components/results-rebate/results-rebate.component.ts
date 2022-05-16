import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { payloadForm } from '../../../models/payloadFrom';
import { Rebate } from '../../../models/rebate';
import { bridgeService } from '../../../services/bridge.service';
import { FiltersComponent } from '../../reusable-components/filters/filters.component';
import { RebatesComponent } from '../../reusable-components/rebates/rebates.component';


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
  results!: any;
  filters: Array<any> = [];

  myRebate: Array<Rebate> = [];
  

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm;

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
        this.myPayloadForm.requiredRebates = payload.data.requiredRebates;
        this.myPayloadForm.searchType = payload.data.searchType;
        this.myPayloadForm.state = payload.data.state;
        this.myPayloadForm.elegibilityQuestions = payload.data.elegibilityQuestions;
        this.myPayloadForm.utilityProviders = payload.data.utilityProviders;

        this.CallProductLines(this.myPayloadForm);
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


  CallProductLines(payload: any) {
    this._api.ProductLines(JSON.stringify(payload)).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.productLines = resp

          // Call Filters with selected product line
          this.productLinesGroup.controls['productLine'].setValue(resp[0].id);
          /* this.CallFilters(); */
          this.getAvailableRebates();

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
    /* this.CallFilters() */
  }

  getAvailableRebates(){
    let state= JSON.stringify(this.myPayloadForm.state);
    let utilityProviders= JSON.stringify(this.myPayloadForm.utilityProviders);
    let elegibilityQuestions= JSON.stringify(this.myPayloadForm.elegibilityQuestions.questions);

    this._api.AvailableRebates(state, utilityProviders, elegibilityQuestions).subscribe({
      next: (resp: any) => {
        this.myRebate = resp;
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    });
  }

  selectRebate(){

  }


  /* modal */
  openFilters(): void{
    const dialogRef = this.dialog.open(FiltersComponent, {
      data: 'Filters'
    });
    dialogRef.afterClosed().subscribe(resp => {
      console.log(resp);
    })
  }


  /* modal */
  openRebate(): void{
    const dialogRef = this.dialog.open(RebatesComponent, {
      data: 'Rebate'
    });
    dialogRef.afterClosed().subscribe(resp => {
      console.log(resp);
    })
  }


  getMachineCombinations (){

    let payload = {
      commerceInfo: this.myPayloadForm.commerceInfo,
      searchType: this.myPayloadForm.searchType,
      nominalSize: this.myPayloadForm.nominalSize,
      fuelSource: this.myPayloadForm.fuelSource,
      systemTypeId: this.productLinesGroup.controls['productLine'].value,  /* product lines */
      /* filters: myfilters, */
      requiredRebates: this.myPayloadForm.requiredRebates   /* rebates id */
    }

  }
}


