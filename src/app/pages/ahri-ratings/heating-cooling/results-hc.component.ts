import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

// modal color para slider
import {ThemePalette} from '@angular/material/core';

// model
import {AHRICombinations} from '../../../models/AHRICombinations.model';
import { detailParams } from '../../../models/detail.model';

// sevice
import {AHRICombinationService} from '../../../services/AHRICombinations.service';
import { paramsDetailService } from '../../../services/params-detail.service';

@Component({
  selector: 'app-results-hc',
  templateUrl: './results-hc.component.html',
  styleUrls: ['./results-hc.component.css']
})
export class ResultsHCComponent implements OnInit {

  DetailParams: detailParams = new detailParams();
  loadDetailParams!: any;

  ahriCombinations: AHRICombinations[] = [];
  p: number =1;
 
  rows!: number;
  isMobile = this.deviceService.isMobile();
  isDesktopDevice = this.deviceService.isDesktop();


  @Input('data') 
    set data( data:any){
      this.ahriCombinations = data;
    }

    constructor(
      public _ahriCombinationService: AHRICombinationService,
      private deviceService: DeviceDetectorService,
      public _paramsDetailService: paramsDetailService
    ) { }
  
    ngOnInit(): void {
      this.Device();

      this._paramsDetailService.sentParams
          .subscribe((forDetail: any) => {
            //console.log(forDetail);
            //console.log(forDetail.data.country);

            // load data of forDetail to model paramsDetailService
            this.DetailParams.rebateIds = forDetail.data.rebateIds;
            this.DetailParams.storeId = forDetail.data.storeId;
            this.DetailParams.country = forDetail.data.country;
            this.DetailParams.electricUtilityId = forDetail.data.electricUtilityId;
            this.DetailParams.gasOilUtilityId = forDetail.data.gasOilUtilityId;
            this.DetailParams.state = forDetail.data.state;
            this.DetailParams.eligibilityDetail = forDetail.data.eligibilityDetail;

            this.loadDetailParams =this.DetailParams;

            //console.log(this.DetailParams);

          });

    }
  
    
    Device(){
      if(this.isMobile === true){
        this.rows=3;
      }else{
        this.rows=10
      }
    }


  // MODAL For slider color and range
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }
  // MODAL end



}
