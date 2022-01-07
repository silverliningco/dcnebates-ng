import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// pages 
import {PagesRoutingModule} from './pages/pages-routing.module';
import {PagesComponent} from './pages/pages.component';

const routes: Routes = [
  { path: '', component: PagesComponent}
];

//function for AOT compiling
export function loadChildModule() {
  return PagesRoutingModule;
}

@NgModule({
  imports: [RouterModule.forRoot(routes),
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
