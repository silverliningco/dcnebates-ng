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

  AvailableRebates(state: any, utilityProviders:any ): Observable<any> {

    let url = URL_SERVICIOS + '/available-rebates?state=' + state + '&utilityProviders=' + utilityProviders; 

    return this._http.get(url);
  }

  Search(params: any): Observable<any> {

    let url = URL_SERVICIOS + '/search-equipment?params=' + params; 

    return this._http.get(url);
  }

  Detail(skus: any, ahri_refs: any, params: any): Observable<any> {

    /* let url = URL_SERVICIOS + '/view-detail?skus='+ skus + '&ahri_refs=' + ahri_refs +'&params=' + params;  */
    let url = 'http://45.79.197.74/view-detail?skus=["25VNA424A003","FE4ANB003L00"]&ahri_refs=["206788330"]&params={"commerceInfo":{"storeId":1,"showAllResults":false},"requiredRebates":[{"rebateId": 1,"rebateTierId": 2,"isRequired": false},{"rebateId": 2,"rebateTierId": 3,"isRequired": false},{"rebateId": 6,"rebateTierId": 8,"isRequired":false}]}'; 

    return this._http.get(url);
  }

  Utilities(state: any){

    let url = URL_SERVICIOS + '/load-utilities?country=US&state='+ state;

    return this._http.get(url);
    
  }
}
