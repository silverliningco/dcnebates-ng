import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


//pages
import {PagesRoutesModule} from './pages/pages-routes.module';
import {PagesComponent} from './pages/pages.component';

const routes: Routes = [
  { path: '', component: PagesComponent}
];

//function for AOT compiling
export function loadChildModule() {
  return PagesRoutesModule;
}

@NgModule({
  imports: [RouterModule.forRoot(routes),
    PagesRoutesModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
