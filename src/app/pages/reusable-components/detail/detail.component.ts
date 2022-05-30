import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Detail, Links, Rebate } from '../../../models/detail';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  detail!: Detail;
  rebate: Array<Rebate> = [];
  link: Array<Links> = [];
  existRebate: boolean = false;
  existLink: boolean = false;

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
          this.processRebate(this.detail.availableRebates);
        },
        error: (e) => alert(e.error),
        complete: () => console.info('complete')
      })
    });
  }

  ngOnInit(): void {
  }

  processRebate(availableRebates: any){

    availableRebates.forEach((elm1: any) => {
      this.rebate.push(elm1);
      this.link.push(elm1.links);
    });

    if (this.rebate.length > 0){
      this.existRebate = true;
    }

    if (this.link.length > 0){
      this.existLink = true;
    }

    console.log(this.rebate);

  }

  onNavigate(url : any){
    window.location.href = url;
  }


}



