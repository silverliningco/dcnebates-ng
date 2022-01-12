import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { PagesComponent } from './pages.component';
import { AHRIMatchupsComponent } from './ahri-matchups/ahri-matchups.component';
import { HelpChooseEquipmentComponent } from './ahri-matchups/help-choose-equipment/help-choose-equipment.component';
import { KnowModelNrComponent } from './ahri-matchups/know-model-nr/know-model-nr.component';
import { WholeHouseHPRebateComponent } from './whole-house-hp-rebate/whole-house-hp-rebate.component';
import { PartialSupplementalHPRebateComponent } from './partial-supplemental-hp-rebate/partial-supplemental-hp-rebate.component';
import { HomeComponent } from './home/home.component';


const routes: Routes =[
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full' },
      {path: 'home', component: HomeComponent, data: {breadcrumbs: ['home']}},

      {path: 'AHRIMatchups', component: AHRIMatchupsComponent, data: {breadcrumbs: ['AHRI Matchups']} },
      {path: 'AHRIMatchups/HelpChoose', component: HelpChooseEquipmentComponent, data: {breadcrumbs: ['AHRI Matchups', 'Help Choose']} },
      {path: 'AHRIMatchups/KnowModel', component: KnowModelNrComponent, data: {breadcrumbs: ['AHRI Matchups', 'Know Model']} },

      {path: 'WholeHouseHP', component: WholeHouseHPRebateComponent, data: {breadcrumbs: ['Whole House HP']} },

      {path: 'PartialSupplementalHP', component: PartialSupplementalHPRebateComponent, data: {breadcrumbs: ['Partial Supplemental HP']} }
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
