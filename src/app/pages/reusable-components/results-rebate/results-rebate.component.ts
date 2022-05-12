import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { bridgeService } from '../../../services/bridge.service';
import { FiltersComponent } from '../../reusable-components/filters/filters.component';

@Component({
  selector: 'app-results-rebate',
  templateUrl: './results-rebate.component.html',
  styleUrls: ['./results-rebate.component.css']
})
export class ResultsRebateComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _bridge: bridgeService, 
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }


  openFilters(): void{
    const dialogRef = this.dialog.open(FiltersComponent, {
      data: 'Filters'
    });
    dialogRef.afterClosed().subscribe(resp => {
      console.log(resp);
    })
  }

}


