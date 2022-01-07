import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { PagesComponent } from './pages.component';
import { AHRIMatchupsComponent } from './ahri-matchups/ahri-matchups.component';
import { WholeHouseHPRebateComponent } from './whole-house-hp-rebate/whole-house-hp-rebate.component';
import { PartialSupplementalHPRebateComponent } from './partial-supplemental-hp-rebate/partial-supplemental-hp-rebate.component';
import { HomeComponent } from './home/home.component';


const routes: Routes =[
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full' },
      {path: 'home', component: HomeComponent},
      {path: 'AHRIMatchups', component: AHRIMatchupsComponent },
      {path: 'WholeHouseHP', component: WholeHouseHPRebateComponent },
      {path: 'PartialSupplementalHP', component: PartialSupplementalHPRebateComponent }
    ]
  }
]

/* RUTAS
  http://localhost:4200/home
  http://localhost:4200/AHRIMatchups
  http://localhost:4200/WholeHouseHP
  http://localhost:4200/PartialSupplementalHP
 */


@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
