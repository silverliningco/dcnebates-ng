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
          
            //console.log(resp);
            return resp;
        })
    )
  }

  
  // sin connecion a node
  senddetail (detail: any) {
      
    this.data_table = detail;

    //console.log(this.data_table[0].skus); 

    //this.getdetail(2, this.data_table);


  }


  getdetail (cod: any) {

    //console.log(cod);
    //console.log(this.data_table[0].skus[0]);
    //console.log(this.data_table); 
    
    // find 
    //console.log(this.data_table.find((x:any) =>  x.outdoorUnit === '25HBC530AP030*'));
    return this.data_table.find((x:any) =>  x.outdoorUnit === '25HBC530AP030*');
    
  }

  // conectado con node
  /* getdetail (detail: any) {
    console.log(`det detail service: ${detail}`)
    
     let url = URL_SERVICIOS + '/detail/' + detail;
    
    return this.http.get(url, detail)
    .pipe(
        map((resp: any) => {
          
          //console.log(JSON.stringify(resp));
            return resp;
        })
    ) 

  }
 */


}


