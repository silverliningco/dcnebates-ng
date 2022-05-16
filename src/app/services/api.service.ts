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

  ProductLines(params: any): Observable<any> {

    let url = URL_SERVICIOS + '/product-lines?params=' + params; 

    return this._http.get(url);
  }

  Filters(params: any): Observable<any> {

    let url = URL_SERVICIOS + '/filters?params=' + params; 

    return this._http.get(url);
  }

  AvailableRebates(state: any, utilityProviders:any,  elegibilityQuestions:any): Observable<any> {

    let url = URL_SERVICIOS + '/available-rebates?state=' + state + '&utilityProviders=' + utilityProviders+ "&elegibilityQuestions=" + elegibilityQuestions;

    return this._http.get(url);
  }

  ElegibilityQuestions(state: any, utilityProviders:any ): Observable<any> {

    let url = URL_SERVICIOS + '/elegibility-questions?state=' + state + '&utilityProviders=' + utilityProviders; 

    return this._http.get(url);
  }

  Search(params: any): Observable<any> {

    let url = URL_SERVICIOS + '/search-equipment?params=' + params; 

    return this._http.get(url);
  }

  Detail(skus: any, ahri_refs: any, params: any): Observable<any> {

    let url = URL_SERVICIOS + '/view-detail?skus='+ skus + '&ahri_refs=' + ahri_refs +'&params=' + params; 

    return this._http.get(url);
  }

  Utilities(state: any){

    let url = URL_SERVICIOS + '/load-utilities?country=US&state='+ state;

    return this._http.get(url);
    
  }
}
