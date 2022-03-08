import { Component, OnInit, VERSION, ViewChild,ViewChildren, ElementRef, Renderer2, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(private renderer: Renderer2, private host: ElementRef) { }

  ngOnInit(): void {
  }

  onActivate(eventb : any) {
       

    if (eventb.srcElement.href === 'http://localhost:4200/home'){
      location.reload();
    } 

    if (eventb.srcElement.href ===  'http://localhost:4200/home/AHRIRatings'){
        
        location.reload();
        
    }
    
  }

}
