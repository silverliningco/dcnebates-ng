import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// url endpoint
import {URL_SERVICIOS}  from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
      private _http: HttpClient
    ) { }

    ProductLines(body: any): Observable<any> {

      let url = URL_SERVICIOS + '/product-lines'; 
  
      return this._http.post(url, body);
    }

    Filters(body: any): Observable<any> {

      let url = URL_SERVICIOS + '/filters'; 
  
      return this._http.post(url, body);
    }

    AvailableRebates(body: any): Observable<any> {

      let url = URL_SERVICIOS + '/available-rebates'; 
  
      return this._http.post(url, body);
    }

  ElegibilityQuestions(body: any): Observable<any> {

    let url = URL_SERVICIOS + '/eligibility-criteria' 

    return this._http.post(url, body);
  }

  Search(body: any): Observable<any> {

    let url = URL_SERVICIOS + '/search-equipment'; 

    return this._http.post(url, body);
  }

  Utilities(state: any){

    let url = URL_SERVICIOS + '/utility-providers?country=US&state='+ state;

    return this._http.get(url);
    
  }

  ModelNrs(body: any){
    let url = URL_SERVICIOS + '/model-nrs'; 

    return this._http.post(url, body);
  }

}