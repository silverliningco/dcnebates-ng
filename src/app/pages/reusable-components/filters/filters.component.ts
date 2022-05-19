import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { bridgeService } from '../../../services/bridge.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  commerceInfoGroup !: FormGroup;
  filtersGroup !: FormGroup;
  filters: Array<any> = [];
  parmsFilter!: any;

   /* display title when exist filter */
   showModelNrs: boolean = false;
   showIndoorUnit: boolean = false;
   showOptions: boolean = false;

   myPayload!: string;

  constructor(
    public dialogRef: MatDialogRef<FiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _bridge: bridgeService,
  ) { }

  ngOnInit(): void {

    /* let prepare = JSON.stringify(this.message);
    this.parmsFilter = JSON.parse(prepare); */

    this.parmsFilter = JSON.stringify(this.message);

    this.commerceInfoGroup = this._formBuilder.group({
      storeId: 1,
      showAllResults: [false],
    });
    

    this.filtersGroup = this._formBuilder.group({
      indoorUnitSKU: [''],
      outdoorUnitSKU: [''],
      furnaceSKU: [''],
      indoorUnitConfiguration: [null],
    });

    this.CallFilters();
  }

  close(){
    this.dialogRef.close();
  }

  Payload(){
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
    
    let payload = {
      commerceInfo: this.parmsFilter.commerceInfo,
      searchType: this.parmsFilter.searchType,
      nominalSize: this.parmsFilter.nominalSize,
      fuelSource: this.parmsFilter.fuelSource,
      systemTypeId: this.parmsFilter.productLine,
      filters: myfilters,
      requiredRebates: this.parmsFilter.requiredRebates
    }

    return  JSON.stringify(payload);
  }

  async CallFilters () {
    /* this.filtersGroup.disable(); */

    this.myPayload = this.Payload();

    console.log(this.myPayload);

      await this._api.Filters(this.parmsFilter).subscribe(
       (resp: any) => {
        if (resp.length > 0) {
          this.filters = resp;
          
          console.log('con filtros');
          this.filtersGroup.reset();
          // Set selected values
          resp.forEach((filter: any) => {
            if (filter.filterName === 'outdoorUnitSKU' || filter.filterName === 'indoorUnitSKU' || filter.filterName === 'furnaceSKU' || filter.filterName == 'coastal') {
              this.filtersGroup.controls[filter.filterName].setValue(filter.selectedValues[0]);
            } else {
              this.filtersGroup.controls[filter.filterName].setValue(filter.selectedValues);
            }
          });

          /* this.filtersGroup.enable(); */

        }

        this.showTitleFilter(this.filters);
      },
    )
  }

  removeFilter(myFilter: any, option:any): void {
    if(option){
      this.filtersGroup.controls[myFilter].setValue(this.filtersGroup.controls[myFilter].value.filter((e: string) => e !== option))
    } else {
      this.filtersGroup.controls[myFilter].reset();
    }  
    this.CallFilters()
  }

  showTitleFilter(filters: any) {

    this.showModelNrs = false;
    this.showIndoorUnit = false;
    this.showOptions = false;

    filters.forEach((ele: any) => {
      if (ele.options.length >= 1 && ele.filterName === 'outdoorUnitSKU' || ele.filterName === 'indoorUnitSKU' || ele.filterName === 'furnaceSKU') {
        this.showModelNrs = true
      }

      if (ele.filterName === 'indoorUnitConfiguration') {
        this.showIndoorUnit = true
      }

    });
  }

  sentFilters(filters: any) {  
  
    /* sent the infor to product-lines-components */
    this._bridge.sentFilters.emit({
      /* data: this.Payload() */
      data: 'filters'
    });
  }

}
