import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

// modal color para slider
import {ThemePalette} from '@angular/material/core';

// model
import {AHRICombinations} from '../../../models/AHRICombinations.model';

// sevice
import {AHRICombinationService} from '../../../services/AHRICombinations.service';


@Component({
  selector: 'app-results-cool-on',
  templateUrl: './results-cool-on.component.html',
  styleUrls: ['./results-cool-on.component.css']
})
export class ResultsCoolOnComponent implements OnInit {

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
