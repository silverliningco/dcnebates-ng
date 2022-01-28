import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; 

import {URL_SERVICIOS}  from '../config/config';
import {AHRICombinations}  from '../models/AHRICombinations.model';

@Injectable({
    providedIn: 'root'
  })
  export class AHRICombinationService {

  data_table!: any;
  constructor(
    public http: HttpClient
  ) { } 

    
  
  save (params: any){

    let url = URL_SERVICIOS;
    
    return this.http.get(url, {params: {params}})
    .pipe(
        map((resp: any) => {
          return resp;
        })
    )
  }

  // 2 endpoints ************************************************
  getResultDetail(ahri_refs: any){
    let url = URL_SERVICIOS + '/detail/' + ahri_refs;
    
    return this.http.get(url)
    .pipe(
        map((resp: any) => {
            return resp;
        })
    )
  }

 
}


