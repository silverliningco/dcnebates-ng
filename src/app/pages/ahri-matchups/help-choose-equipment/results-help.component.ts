import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

// model
import {AHRICombinations} from '../../../models/AHRICombinations.model';

// sevice
import {AHRICombinationService} from '../../../services/AHRICombinations.service';

@Component({
  selector: 'app-results-help',
  templateUrl: './results-help.component.html',
  styleUrls: ['./results-help.component.css']
})
export class ResultsHelpComponent implements OnInit {

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
      private deviceService: DeviceDetectorService
    ) { }
  
    ngOnInit(): void {
      this.Device();
    }
  
    
    Device(){
      if(this.isMobile === true){
        this.rows=3;
      }else{
        this.rows=10
      }
    }



}
