import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class AHRIMatchupsService {

    
  constructor(
    public http: HttpClient
  ) { }

    
  
  save (a: any){

    let url = 'pay';

    return this.http.post(url, a)
            .pipe(
                map((resp: any) => {

                    console.log(resp);
                    return ;//resp.a;
                })
            )
  }

}


