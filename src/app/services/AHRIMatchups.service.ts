import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; 

import {URL_SERVICIOS}  from '../config/config';

@Injectable({
    providedIn: 'root'
  })
  export class AHRIMatchupsService {

    
  constructor(
    public http: HttpClient
  ) { }

    
  
  save (a: any){

    let url = URL_SERVICIOS;
    
    return this.http.get(url, {params: {a}})
    .pipe(
        map((resp: any) => {
          
            console.log(resp);
            return resp;
        })
    )
  }

}


