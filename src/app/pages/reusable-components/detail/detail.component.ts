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

    activatedRoute.params.subscribe( params => {

     let body = JSON.parse(params['body']) ;

      this._api.Detail(body).subscribe({
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
    window.open(url, '_blank');
  }


}
