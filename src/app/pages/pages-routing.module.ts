import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

import { HomeComponent } from './home/home.component';
import { DetailComponent } from './reusable-components/detail/detail.component';

import { HomeAhiMatchupsComponent } from './home-ahi-matchups/home-ahi-matchups.component';
import { CoolingOnlyAhriComponent } from './home-ahi-matchups/cooling-only-ahri/cooling-only-ahri.component';
import { FurnaceOnlyInstallAhriComponent } from './home-ahi-matchups/furnace-only-install-ahri/furnace-only-install-ahri.component';
import { KnowModelNbrAhriComponent } from './home-ahi-matchups/know-model-nbr-ahri/know-model-nbr-ahri.component';
import { ExisNonEcmAhriComponent } from './home-ahi-matchups/exis-non-ecm-ahri/exis-non-ecm-ahri.component';
import { HeatingCoolingAhriComponent } from './home-ahi-matchups/heating-cooling-ahri/heating-cooling-ahri.component';
import { HomeRebateFinderComponent } from './home-rebate-finder/home-rebate-finder.component';
import { CoolingOnlyRComponent } from './home-rebate-finder/cooling-only-r/cooling-only-r.component';
import { HeatingCoolingRComponent } from './home-rebate-finder/heating-cooling-r/heating-cooling-r.component';
import { INowModelNrComponent } from './home-rebate-finder/i-now-model-nr/i-now-model-nr.component'; 
import { ResultsRebateComponent } from './reusable-components/results-rebate/results-rebate.component'; 



const routes: Routes = [{
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
          path: 'ahri-matchups',
          data: { breadcrumb: 'AHRI Matchups' },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: HomeAhiMatchupsComponent,
            },
            {
              path: 'cooling-only',
              component: CoolingOnlyAhriComponent,
              data: { breadcrumb: 'Cooling only' }
            },
            {
              path: 'furnace-only-install',
              component: FurnaceOnlyInstallAhriComponent,
              data: { breadcrumb: 'Furnace only installations' }
            },
            {
              path: 'know-model-nbr',
              component: KnowModelNbrAhriComponent,
              data: { breadcrumb: 'I know my model' }
            },
            {
              path: 'exis-non-ECM-furnace',
              component: ExisNonEcmAhriComponent,
              data: { breadcrumb: 'Existing or non-ECM furnace instalation' }
            },
            {
              path: 'heating-cooling',
              component: HeatingCoolingAhriComponent,
              data: { breadcrumb: 'Heating and cooling' }
            },
          ]
        },
        {
          path: 'rebate-finder',
          data: { breadcrumb: 'Rebate Finder' },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: HomeRebateFinderComponent,
            },
            {
              path: 'cooling-only-r',
              component: CoolingOnlyRComponent,
              data: { breadcrumb: 'Cooling only' }
            },
            {
              path: 'heating-cooling-r',
              component: HeatingCoolingRComponent,
              data: { breadcrumb: 'Heating and cooling' }
            },
            {
              path: 'i-now-model-nr',
              component: INowModelNrComponent,
              data: { breadcrumb: 'I now my model nr' }
            },
          ]
        },
        {
          path: 'detail',
          component: DetailComponent,
          data: { breadcrumb: 'Detail' }
        },

        {
          path: 'result-rebate',
          component: ResultsRebateComponent,
          data: { breadcrumb: 'result-rebate' }
        },

      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
