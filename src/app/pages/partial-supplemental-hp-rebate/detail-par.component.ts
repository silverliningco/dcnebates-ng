import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// sevice
import {AHRICombinationService} from '../../services/AHRICombinations.service';


@Component({
  selector: 'app-detail-par',
  templateUrl: './detail-par.component.html',
  styleUrls: ['./detail-par.component.css']
})
export class DetailParComponent implements OnInit {

  detail!:any;
  url !:any;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { 
    activatedRoute.params.subscribe( params => {
      let skus = params['skus'];
      let ahri_refs = params['ahri_refs'];
      let detailParams = params['params']; 

       this.loadDetail(skus, ahri_refs, detailParams);
    });
  }

  ngOnInit(): void {
  }

  loadDetail(skus: any, ahri_refs: any, detailParams: any){
    this._ahriCombinationService.newGetResultDetail(skus, ahri_refs, detailParams)
            .subscribe( (resp:any) => {
              //this.url = resp.body.eligibleRebates[0].url;
              console.log(resp.body);
              this.detail= resp.body;
            });            
  }

  goToLink(){
    window.open(this.url, "_blank");    
  }

}
