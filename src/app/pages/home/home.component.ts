import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myurl!:any;

  @ViewChild("ahrihome") ahrihome!: ElementRef;

  hiddenHome: boolean = false;

  constructor(
    @Inject(DOCUMENT) document: any,
    private renderer2: Renderer2
  ) { 
    this.myurl = document.location.href;
    
  }

  ngOnInit(): void {
    console.log(this.myurl);
    this.hiddenHome = false;
  }

  ngAfterViewInit() {
    
    const myhome = this.ahrihome.nativeElement;
    setTimeout(() => {
      if (this.myurl === 'http://localhost:4200/home/AHRIRatings'){
      myhome.style.display = 'none';
    }

    }, 200);

    
  }

  onActivate(eventOutlet : any) {    

    if (eventOutlet = 'WholeHouseHPRebateComponent' || 'PartialSupplementalHPRebateComponent' || 'AHRIMatchupsComponent'){
      this.hiddenHome = true;
    } else {
      this.hiddenHome = false;
    }
  }


}
