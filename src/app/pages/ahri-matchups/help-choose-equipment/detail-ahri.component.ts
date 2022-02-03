import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// sevice
import {AHRICombinationService} from '../../../services/AHRICombinations.service';


@Component({
  selector: 'app-detail-ahri',
  templateUrl: './detail-ahri.component.html',
  styleUrls: ['./detail-ahri.component.css']
})
export class DetailAhriComponent implements OnInit {
  
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
      this.loadDetail(skus, ahri_refs);
    });
  }

  ngOnInit(): void {
  }

  loadDetail(skus: any, ahri_refs: any){
    this._ahriCombinationService.getResultDetail(skus, ahri_refs)
            .subscribe( (resp:any) => {
              //this.url = resp.body.eligibleRebates[0].url;
              this.detail= resp.body;
            });            
  }

  goToLink(){
    window.open(this.url, "_blank");    
  }

}
