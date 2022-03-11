import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import {PagesComponent} from './pages.component';
import {HomeComponent} from './home/home.component';
import {AhriMatchupComponent} from './ahri-matchup/ahri-matchup.component';

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
            path: 'AhriMatchup',
            component: AhriMatchupComponent,
            data: { breadcrumb: 'Ahri Matchup' },
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
export class PagesRoutesModule { }
