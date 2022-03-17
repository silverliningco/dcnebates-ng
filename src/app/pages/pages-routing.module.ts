import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { AhriMatchupsComponent } from './ahri-matchups/ahri-matchups.component';
import {RebateFinderComponent} from './rebate-finder/rebate-finder.component';

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
          component: AhriMatchupsComponent,
          data: { breadcrumb: 'AHRI Matchups' }
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
