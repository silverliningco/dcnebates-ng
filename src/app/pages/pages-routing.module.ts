import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { PagesComponent } from './pages.component';

import { AHRIRatingsComponent } from './ahri-ratings/ahri-ratings.component';
import { CoolingOnlyComponent } from './ahri-ratings/cooling-only/cooling-only.component';
import { HeatingCoolingComponent } from './ahri-ratings/heating-cooling/heating-cooling.component';
import { KnowModelNrComponent } from './ahri-ratings/know-model-nr/know-model-nr.component';

import { WholeHouseHPRebateComponent } from './whole-house-hp-rebate/whole-house-hp-rebate.component';

import { PartialSupplementalHPRebateComponent } from './partial-supplemental-hp-rebate/partial-supplemental-hp-rebate.component';

import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        data: { breadcrumb: 'Home' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: HomeComponent
          },
          {
            path: 'detail/:skus/:ahri_refs/:params',
            component: DetailComponent,
            data: { breadcrumb: 'View detail' },
          },

          // AHRIRatings *************************************
          {
            path: 'AHRIRatings',
            data: { breadcrumb: 'AHRI Ratings' },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: AHRIRatingsComponent
              },

              // HeatingCooling
              {
                path: 'HeatingCooling',
                component: HeatingCoolingComponent,
                data: { breadcrumb: 'Heating Cooling' }
              },

              // CoolingOnly
              {
                path: 'CoolingOnly',
                component: CoolingOnlyComponent,
                data: { breadcrumb: 'Cooling Only' },
              },

              // KnowModel
              {
                path: 'KnowModel',
                component: KnowModelNrComponent,
                data: { breadcrumb: 'Know Model' },
              }

            ]
          },

          // WholeHouseHP **************************************
          {
            path: 'WholeHouseHP',
            component: WholeHouseHPRebateComponent,
            data: { breadcrumb: 'Mass save Whole house' }
          },

          // PartialSupplementalHP **********************************
          {
            path: 'PartialSupplementalHP',
            component: PartialSupplementalHPRebateComponent,
            data: { breadcrumb: 'Partial Supplemental HP' }
          }
        ]
      }
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
]









@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
