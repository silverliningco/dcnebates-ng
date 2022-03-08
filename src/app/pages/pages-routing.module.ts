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


const routes: Routes =[
  {
    path: '',
    component: PagesComponent,
    children: [

      // rutas dinamicas

      {
        path: 'detail/:skus/:ahri_refs/:params', 
        component: DetailComponent
      },

      // HOME *********************************
      {
        path: '', 
        redirectTo: '/home', 
        pathMatch: 'full' 
      },

      {
        path: 'home', 
        component: HomeComponent, 
        data: {breadcrumbs: 'Home'},
        children: [
          // AHRIRatings *************************************
          {
            path: 'AHRIRatings', 
            component: AHRIRatingsComponent,
            data: {breadcrumbs: 'AHRI Ratings'},
            children: [

              // HeatingCooling
              {
                path: 'HeatingCooling', 
                component: HeatingCoolingComponent, 
                data: {breadcrumbs: 'Heating Cooling'}
              },


              // CoolingOnly
              {
                path: 'CoolingOnly', 
                component: CoolingOnlyComponent, 
                data: {breadcrumbs: 'Cooling Only'},
              },

              // KnowModel
              {
                path: 'KnowModel', 
                component: KnowModelNrComponent, 
                data: {breadcrumbs: 'Know Model'},
              }

            ]
          },

          // WholeHouseHP **************************************
          {
            path: 'WholeHouseHP', 
            component: WholeHouseHPRebateComponent, 
            data: {breadcrumbs: 'Whole HouseHP'}
          },

          // PartialSupplementalHP **********************************
          {
            path: 'PartialSupplementalHP', 
            component: PartialSupplementalHPRebateComponent, 
            data: {breadcrumbs: 'Partial Supplemental HP'}
          }

        ]
      }
    ]
  }
]








@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
