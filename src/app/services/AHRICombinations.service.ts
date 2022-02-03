import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; 

import {URL_SERVICIOS}  from '../config/config';
import {AHRICombinations}  from '../models/AHRICombinations.model';

@Injectable({
    providedIn: 'root'
  })
  export class AHRICombinationService {

    constructor(
    public http: HttpClient
  ) { } 

    
  save (params: any){

    let url = URL_SERVICIOS + '/search-equipment?params=' + params;

    return this.http.get(url)
    .pipe(
        map((resp: any) => {
          return resp;
        })
    )
  }

  getResultDetail(skus: any, ahri_refs: any){

    let url = URL_SERVICIOS + '/view-detail?skus='+ skus + '&ahri_refs=' + ahri_refs;

    return this.http.get(url)
    .pipe(
        map((resp: any) => {
            return resp;
        })
    )
  }
  
}


