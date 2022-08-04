import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { BestDetail, Rebate, Accesories} from '../../../models/detailBestOption';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  
  detailR!: Array<BestDetail>;

  rebate: Array<Rebate> = [];
  existRebate: boolean = false;
  existLink: boolean = false;

  accesorie: Array<Accesories> = [];
  existAcc: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute, 
    private _api: ApiService
    ) { 

      activatedRoute.params.subscribe( params => {
    
        let body = params['body'] ;
  
        this._api.Search(body).subscribe({
          next: (resp) => {
            this.processResult(resp);
            /* this.processRebate(this.detail.availablerebates);
            this.processAccesories(this.detail.accesories); */
          },
          error: (e) => alert(e.error),
          complete: () => console.info('complete')
        });
      });
  }

  ngOnInit(): void {
  }

  processResult(detail: any){
    detail.forEach((ele: any) => {
      this.detailR = ele;
    });
  }

  init(unit: any){

    console.log(unit);

  }

  processRebate(availableRebates: any){

    availableRebates.forEach((elm1: any) => {
      this.rebate.push(elm1);
    });

    if (this.rebate.length > 0){
      this.existRebate = true;
    }

  }

  processAccesories(accesories: any){

    accesories.forEach((elm1: any) => {
      this.accesorie.push(elm1);
    });

    if (this.accesorie.length > 0){
      this.existAcc = true;
    }

  }

}
