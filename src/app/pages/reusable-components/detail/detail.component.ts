import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

import { ActivatedRoute } from '@angular/router';

export interface Links {
  url: string;
  title: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  detail!:any;
  myURL: Array<Links> = [];

  constructor(
    public activatedRoute: ActivatedRoute, 
    private _api: ApiService
    ) { 

    activatedRoute.queryParams.subscribe( params => {
      let skus = params['skus'];
      let ahri_refs = params['ahri_refs'];
      let detailParams = params['params'];
      
      this._api.Detail(skus, ahri_refs, detailParams).subscribe({
        next: (resp) => {
          this.detail = resp;
          console.log(this.detail);
          this.getURL(this.detail.availableRebates);
        },
        error: (e) => alert(e.error),
        complete: () => console.info('complete')
      })
    });
  }

  ngOnInit(): void {
  }

  getURL(availableRebates: any){

    availableRebates.forEach((element: any) => {  
    });

  }


}



/* links: [
{"title":"",
"url":""},...]

*/


