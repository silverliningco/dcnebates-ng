import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Rebate } from '../../../models/rebate';
import { ApiService } from '../../../services/api.service';
import { bridgeService } from '../../../services/bridge.service';

@Component({
  selector: 'app-rebates',
  templateUrl: './rebates.component.html',
  styleUrls: ['./rebates.component.css']
})
export class RebatesComponent implements OnInit {

  myRebate: Array<Rebate> = [];

  constructor(
    private _api: ApiService,
    public _bridge: bridgeService,
    public dialogRef: MatDialogRef<RebatesComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) { }

  ngOnInit(): void {

    /* receiving form data */
    this._bridge.getRebateParams
      .subscribe((payload: any) => {
        let state = payload.data.state;
        let elegibilityQuestions = payload.data.elegibilityQuestions.questions;
        let utilityProviders = payload.data.utilityProviders;

        this.getAvailableRebates(state, elegibilityQuestions, utilityProviders);

      });

  }

  close(){
    this.dialogRef.close();
  }

  getAvailableRebates(state: any, elegibilityQuestions: any, utilityProviders: any){ 

    let myState = JSON.stringify(state);
    let myElegibilityQuestions = JSON.stringify(elegibilityQuestions);
    let myUtilityProviders = JSON.stringify(utilityProviders);

    this._api.AvailableRebates(myState, myElegibilityQuestions, myUtilityProviders).subscribe({
      next: (resp: any) => {
        this.myRebate = resp;
        console.log(this.myRebate);
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete')
    });
  }

  selectRebate(){

  }

}
