import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// sevice
import {AHRICombinationService} from '../../../services/AHRICombinations.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  detail!:any;

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
              console.log(resp);
              this.detail= resp;
            });            
  }

  goToLink(myUrl: string){
    window.open(myUrl, "_blank");    
  }

}
