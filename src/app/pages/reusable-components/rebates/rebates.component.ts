import { Component, Inject, OnInit } from '@angular/core';
import { Rebate, RebateTier, Criteria  } from '../../../models/rebate';
import { ApiService } from '../../../services/api.service';
import { bridgeService } from '../../../services/bridge.service';

export interface parms {

  elegibilityQuestions: any;
  state: any;
  utilityProviders: any;

}

@Component({
  selector: 'app-rebates',
  templateUrl: './rebates.component.html',
  styleUrls: ['./rebates.component.css']
})

export class RebatesComponent implements OnInit {

  myRebate: Array<Rebate> = [];
//  parameter!: parms;

  availableRebates!: Array<Rebate>;

  constructor(
    private _api: ApiService,
    public _bridge: bridgeService, 
    
  ) { }

  ngOnInit(): void {

    /* receiving form data */
    this._bridge.sentAvailableRebateParams.subscribe((payload: any) => {
      // Call available rebates.
      this.getAvailableRebates(payload.state, payload.elegibilityQuestions, payload.utilityProviders);
    });
   }
 

  getAvailableRebates(state: any, elegibilityQuestions: any, utilityProviders: any){ 

    this._api.AvailableRebates(JSON.stringify(state), JSON.stringify(elegibilityQuestions),  JSON.stringify(utilityProviders)).subscribe({
      next: (resp: any) => {
        this.myRebate = resp;
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    });
  }


}
