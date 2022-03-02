import { Injectable, Output,  EventEmitter } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })
  export class paramsDetailService {

    @Output() sentParams: EventEmitter<any> = new EventEmitter();

    constructor(
    ) { } 
  
}


