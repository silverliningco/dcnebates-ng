import { Component, OnInit, VERSION, ViewChild,ViewChildren, ElementRef, Renderer2, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

 
  /* name = "Angular " + VERSION.major;
  @ViewChild("ahrihome") ahrihome!: ElementRef; */

  //@ViewChildren('ahrihome', {read: ElementRef}) ahrihome:QueryfindList<ElementRef>

  //@ViewChild('ahrihome', {'read': ViewContainerRef}) ahrihome;


  constructor(private renderer: Renderer2, private host: ElementRef) { }

  ngOnInit(): void {
    //this.change();
  }

  /* change(): void {
    const myhome = this.ahrihome.nativeElement;

    console.log(myhome);
  } */

 /*  ngAfterViewInit() {
    
    console.log("afterinit");
    //const myhome = this.ahrihome.nativeElement;
    setTimeout(() => {
      console.log('time');
      console.log(this.ahrihome.nativeElement);
    }, 1000);
  } */
 




  /* gAfterViewChecked() {
    console.log(this.ahrihome.length)
  }

  removeChild(){
    this.renderer.removeChild(this.host.nativeElement, this.ahrihome.first.nativeElement);
  } */

  /* disable(){
    console.log(this.ahrihome);
    //this.myButton.nativeElement.setAttribute("disabled", "true"); //BAD PRACTICE
    this.renderer.setAttribute(this.ahrihome.nativeElement, "disabled", "true");
  } */

  /* showHome(){
    console.log(this.ahrihome);
    //this.ahrihome.nativeElement.style.visibility="hidden";
    //this.ahrihome.nativeElement.innerHTML = "I am changed by ElementRef & ViewChild";
  } */


  onActivate(eventb : any) {
       

    if (eventb.srcElement.href === 'http://localhost:4200/home'){
      location.reload();
    } 

    if (eventb.srcElement.href ===  'http://localhost:4200/home/AHRIRatings'){
        
        location.reload();

        //document.getElementById('ahri-home')!.style.display = 'none';
        //document.getElementById('ahri-home')!.style.visibility="hidden";

        
    }
    
  }

}
