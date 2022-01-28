import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// sevice
import {AHRICombinationService} from '../../services/AHRICombinations.service';


@Component({
  selector: 'app-detail-who',
  templateUrl: './detail-who.component.html',
  styleUrls: ['./detail-who.component.css']
})
export class DetailWhoComponent implements OnInit {

  detail!:any;

  constructor(
    public _ahriCombinationService: AHRICombinationService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {
      let cod = params['cod'];
      
      this.loadDetail(cod);
    });
   }

  ngOnInit(): void {
  }

  loadDetail(cod: any){
    this._ahriCombinationService.getResultDetail(cod)
            .subscribe( (resp:any) => {
              this.detail= resp.body;
            });
    
            
  }

}
