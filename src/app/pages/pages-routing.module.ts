import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { PagesComponent } from './pages.component';

import { AHRIMatchupsComponent } from './ahri-ratings/ahri-matchups.component';
import { CoolingOnlyComponent } from './ahri-ratings/cooling-only/cooling-only.component';
import { DetailCoolOnComponent } from './ahri-ratings/cooling-only/detail-cool-on.component';
import { HeatingCoolingComponent } from './ahri-ratings/heating-cooling/heating-cooling.component';
import { DetailHCComponent } from './ahri-ratings/heating-cooling/detail-hc.component';
import { KnowModelNrComponent } from './ahri-ratings/know-model-nr/know-model-nr.component';

import { WholeHouseHPRebateComponent } from './whole-house-hp-rebate/whole-house-hp-rebate.component';
import { DetailWhoComponent } from './whole-house-hp-rebate/detail-who.component';

import { PartialSupplementalHPRebateComponent } from './partial-supplemental-hp-rebate/partial-supplemental-hp-rebate.component';
import { DetailParComponent } from './partial-supplemental-hp-rebate/detail-par.component';

import { HomeComponent } from './home/home.component';



const routes: Routes =[
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full' },
      {path: 'home', component: HomeComponent, data: {breadcrumbs: ['home']}},

      {path: 'AHRIMatchups', component: AHRIMatchupsComponent, data: {breadcrumbs: ['home','AHRI Ratings']} },
      {path: 'AHRIMatchups/HeatingCooling', component: HeatingCoolingComponent, data: {breadcrumbs: ['home','AHRI Ratings', 'Heating Cooling']} },
      {path: 'AHRIMatchups/HeatingCooling/:skus/:ahri_refs/:params', component: DetailHCComponent},
      {path: 'AHRIMatchups/CoolingOnly', component: CoolingOnlyComponent, data: {breadcrumbs: ['home','AHRI Ratings', 'Cooling Only']} },
      {path: 'AHRIMatchups/CoolingOnly/:skus/:ahri_refs/:params', component: DetailCoolOnComponent },
      {path: 'AHRIMatchups/KnowModel', component: KnowModelNrComponent, data: {breadcrumbs: ['home','AHRI Matchups', 'Know Model']} },

      {path: 'WholeHouseHP', component: WholeHouseHPRebateComponent, data: {breadcrumbs: ['home','Whole House HP']} },
      {path: 'WholeHouseHP/:skus/:ahri_refs/:params', component: DetailWhoComponent},

      {path: 'PartialSupplementalHP', component: PartialSupplementalHPRebateComponent, data: {breadcrumbs: ['home','Partial Supplemental HP']} },
      {path: 'PartialSupplementalHP/:skus/:ahri_refs/:params', component: DetailParComponent }
    ]
  }
]



@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
