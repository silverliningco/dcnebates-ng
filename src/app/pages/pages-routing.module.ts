import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import {RebateFinderComponent} from './rebate-finder/rebate-finder.component';

import { HomeAhiMatchupsComponent } from './home-ahi-matchups/home-ahi-matchups.component';
import { CoolingOnlyComponent } from './home-ahi-matchups/cooling-only/cooling-only.component';
import { FurnaceOnlyInstallComponent } from './home-ahi-matchups/furnace-only-install/furnace-only-install.component';
import { KnowModelNbrComponent } from './home-ahi-matchups//know-model-nbr/know-model-nbr.component';
import { ExisNonEcmComponent } from './home-ahi-matchups//exis-non-ecm/exis-non-ecm.component';
import { HeatingCoolingComponent } from './home-ahi-matchups/heating-cooling/heating-cooling.component';


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
              component: CoolingOnlyComponent,
              data: { breadcrumb: 'Cooling only' }
            },
            {
              path: 'furnace-only-install',
              component: FurnaceOnlyInstallComponent,
              data: { breadcrumb: 'Furnace only installations' }
            },
            {
              path: 'know-model-nbr',
              component: KnowModelNbrComponent,
              data: { breadcrumb: 'I know my model' }
            },
            {
              path: 'exis-non-ECM-furnace',
              component: ExisNonEcmComponent,
              data: { breadcrumb: 'Existing or non-ECM furnace instalation' }
            },
            {
              path: 'heating-cooling',
              component: HeatingCoolingComponent,
              data: { breadcrumb: 'Heating and cooling' }
            },
          ]
        },
        {
          path: 'rebate-finder',
          component: RebateFinderComponent,
          data: { breadcrumb: 'Rebate Finder' }
        },
        {
          path: 'detail',
          component: DetailComponent,
          data: { breadcrumb: 'Detail' }
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
