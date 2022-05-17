import { Injectable, Output,  EventEmitter } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })


export class bridgeService {

    @Output() sentAhriParams: EventEmitter<any> = new EventEmitter();
    @Output() sentRebateParams: EventEmitter<any> = new EventEmitter();
    @Output() getRebateParams: EventEmitter<any> = new EventEmitter();

    constructor(
    ) { } 
  
};

