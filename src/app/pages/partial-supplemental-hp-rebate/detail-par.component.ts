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
      let cod = params['cod'];
      
      this.loadDetail(cod)
    });
  }

  ngOnInit(): void {
  }

  loadDetail(cod: any){
    this._ahriCombinationService.getResultDetail(cod)
            .subscribe( (resp:any) => {
              this.url = resp.body.eligibleRebates[0].url;
              this.detail= resp.body;
            });            
  }

  goToLink(){
    window.open(this.url, "_blank");    
  }

}
