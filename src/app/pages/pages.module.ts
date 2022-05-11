import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

// pagination
import {NgxPaginationModule} from 'ngx-pagination';

/* breadcrumb */
import { BreadcrumbModule } from 'xng-breadcrumb';

/* components */
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { HomeAhiMatchupsComponent } from './home-ahi-matchups/home-ahi-matchups.component';
import { HomeRebateFinderComponent } from './home-rebate-finder/home-rebate-finder.component';
import { DetailComponent } from './reusable-components/detail/detail.component';
import { CoolingOnlyRComponent } from './home-rebate-finder/cooling-only-r/cooling-only-r.component';
import { HeatingCoolingRComponent } from './home-rebate-finder/heating-cooling-r/heating-cooling-r.component';
import { CoolingOnlyAhriComponent } from './home-ahi-matchups/cooling-only-ahri/cooling-only-ahri.component';
import { ExisNonEcmAhriComponent } from './home-ahi-matchups/exis-non-ecm-ahri/exis-non-ecm-ahri.component';
import { FurnaceOnlyInstallAhriComponent } from './home-ahi-matchups/furnace-only-install-ahri/furnace-only-install-ahri.component';
import { HeatingCoolingAhriComponent } from './home-ahi-matchups/heating-cooling-ahri/heating-cooling-ahri.component';
import { KnowModelNbrAhriComponent } from './home-ahi-matchups/know-model-nbr-ahri/know-model-nbr-ahri.component';
import { ResultsComponent } from './reusable-components/results/results.component'; 

/* angular material */
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule } from '@angular/material/input';
import {FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import { ResultsRebateComponent } from './reusable-components/results-rebate/results-rebate.component';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    HomeAhiMatchupsComponent,
    HomeRebateFinderComponent,
    DetailComponent,
    CoolingOnlyRComponent,
    HeatingCoolingRComponent,
    CoolingOnlyAhriComponent,
    ExisNonEcmAhriComponent,
    FurnaceOnlyInstallAhriComponent,
    HeatingCoolingAhriComponent,
    KnowModelNbrAhriComponent,
    ResultsComponent,
    ResultsRebateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    NgxPaginationModule,
    BreadcrumbModule,

    MatCardModule,
    MatIconModule,
    MatStepperModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule
  ]
})
export class PagesModule { }
