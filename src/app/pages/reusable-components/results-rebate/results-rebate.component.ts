import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { payloadForm } from '../../../models/payloadFrom';
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
  combinations!: any;
  filters: Array<any> = [];

  /*  receives information from the other components*/
  myPayloadForm: payloadForm = new payloadForm;
  myPayloadRebate!: any;

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

        /* send necessary data for available rebates */
        this._bridge.sentAvailableRebateParams.emit({
          state: payload.data.state,
          elegibilityQuestions: payload.data.elegibilityQuestions,
          utilityProviders: payload.data.utilityProviders,
          fuelSource: payload.data.fuelSource
        });

        this.CallProductLines(this.myPayloadForm);
        /* this.CallSearch(this.myPayloadForm); */
      });

      this._bridge.sentFilters
              .subscribe((payload: any) => {

        console.log(payload);

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
          // Call Filters with selected product line
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

  /* falta pasar el parametro payload, no estoy segura si es aqui por que tengo ver ver el video o mejor leer el word */
  PrepareModelNrs(){
    let body = {
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

    /* this.ModelNrs(body); */
    return JSON.stringify(body);
  }

  ModelNrs(){
    this._api.ModelNrs(this.PrepareModelNrs()).subscribe({
      next: (resp) => {
        console.log(resp);
        this.combinations= resp;
      }
    })
  }

  // Function that reset filters and load filters with selected product line
  SelectProductLine() {
    this.filtersGroup.reset();
    this.commerceInfoGroup.controls['showAllResults'].setValue(false);
    this.filters = [];
    /* this.CallFilters() */
  }
 
  /* modal */
  openFilters(): void{
    let payload= {
      commerceInfo: this.myPayloadForm.commerceInfo,
      searchType: this.myPayloadForm.searchType,
      nominalSize: this.myPayloadForm.nominalSize,
      fuelSource: this.myPayloadForm.fuelSource,
      systemTypeId: this.productLinesGroup.controls['productLine'].value,
      filters: [],
      requiredRebates: []
    }

    const dialogRef = this.dialog.open(FiltersComponent, {
      data: payload
    });

    dialogRef.afterClosed().subscribe(resp => {
      console.log(resp);
    })
  }


  /* modal */
  openRebate(): void{

    this.myPayloadRebate = {
      state: this.myPayloadForm.state,
      utilityProviders: this.myPayloadForm.utilityProviders,
      elegibilityQuestions: this.myPayloadForm.elegibilityQuestions,
    } 

    const dialogRef = this.dialog.open(RebatesComponent, {
      data: this.myPayloadRebate
    });

    dialogRef.afterClosed().subscribe(resp => {
      console.log(resp);
    })
  }

}


