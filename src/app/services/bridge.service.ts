import { Injectable, Output,  EventEmitter } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })


export class bridgeService {

    @Output() sentAhriParams: EventEmitter<any> = new EventEmitter();
    @Output() sentRebateParams: EventEmitter<any> = new EventEmitter();
    
    @Output() sentAvailableRebateParams: EventEmitter<any> = new EventEmitter();
    @Output() sentFilters: EventEmitter<any> = new EventEmitter();

    constructor(
    ) { } 
  
};

