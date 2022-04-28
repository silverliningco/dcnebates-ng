import { Injectable, Output,  EventEmitter } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })
  export class bridgeService {

    @Output() sentParams: EventEmitter<any> = new EventEmitter();

    constructor(
    ) { } 
  
}
