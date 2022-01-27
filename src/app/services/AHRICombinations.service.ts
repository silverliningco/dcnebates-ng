import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; 

import {URL_SERVICIOS}  from '../config/config';

@Injectable({
    providedIn: 'root'
  })
  export class AHRICombinationService {

    
  constructor(
    public http: HttpClient
  ) { } 

    
  
  save (params: any){

    let url = URL_SERVICIOS;
    
    return this.http.get(url, {params: {params}})
    .pipe(
        map((resp: any) => {
          
            //console.log(resp);
            return resp;
        })
    )
  }

}


