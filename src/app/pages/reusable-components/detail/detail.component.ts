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
        let a = {
          "commerceInfo": {
            "storeId": 1,
            "showAllResults": false
          },
          "skus":[ "24ACB724A003", "CAPMP3617ALA","59MN7B080C17--14"], 
          "requiredRebates": [
                {
              "rebateId": 1,
              "rebateTierId": 2,
              "isRequired": false
            },
            {
              "rebateId": 2,
              "rebateTierId": 3,
              "isRequired": false
            },
            {
              "rebateId": 6,
              "rebateTierId": 8,
              "isRequired": false
            }
          ]
        }
  
        this._api.Search(a).subscribe({
          next: (resp) => {
            this.processResult(resp);
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

  onNavigate(url : any){
    window.open(url, '_blank');
  }
}
