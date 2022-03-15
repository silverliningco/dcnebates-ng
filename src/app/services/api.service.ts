import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
      private _http: HttpClient
    ) { }

  api_url:string = 'https://rebate-calculator-node-2022.herokuapp.com'

  ProductLines(params: any): Observable<any> {

    let url = this.api_url + '/product-lines?params=' + params; 

    return this._http.get(url);
  }

  Filters(params: any): Observable<any> {

    let url = this.api_url + '/filters?params=' + params; 

    return this._http.get(url);
  }

  Search(params: any): Observable<any> {

    let url = this.api_url + '/search-equipment?params=' + params; 

    return this._http.get(url);
  }

  Detail(skus: any, ahri_refs: any, params: any): Observable<any> {

    let url = this.api_url + '/view-detail?skus='+ skus + '&ahri_refs=' + ahri_refs +'&params=' + params; 

    return this._http.get(url);
  }
}
