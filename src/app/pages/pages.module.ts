import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// pagination
import {NgxPaginationModule} from 'ngx-pagination';

// Components
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { HomeAhiMatchupsComponent } from './home-ahi-matchups/home-ahi-matchups.component';
import { CoolingOnlyComponent } from './home-ahi-matchups/cooling-only/cooling-only.component';
import { FurnaceOnlyInstallComponent } from './home-ahi-matchups/furnace-only-install/furnace-only-install.component';
import { KnowModelNbrComponent } from './home-ahi-matchups/know-model-nbr/know-model-nbr.component';
import { ExisNonEcmComponent } from './home-ahi-matchups/exis-non-ecm/exis-non-ecm.component';
import { HeatingCoolingComponent } from './home-ahi-matchups/heating-cooling/heating-cooling.component';


// Angular Material 
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list'; 
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';

import { BreadcrumbModule } from 'xng-breadcrumb';
import { HomeRebateFinderComponent } from './home-rebate-finder/home-rebate-finder.component';
import { HeatingCoolingRComponent } from './home-rebate-finder/heating-cooling-r/heating-cooling-r.component';
import { CoolingOnlyRComponent } from './home-rebate-finder/cooling-only-r/cooling-only-r.component';


@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    DetailComponent,
    HomeAhiMatchupsComponent,
    CoolingOnlyComponent,
    FurnaceOnlyInstallComponent,
    KnowModelNbrComponent,
    ExisNonEcmComponent,
    HeatingCoolingComponent,
    HomeRebateFinderComponent,
    HeatingCoolingRComponent,
    CoolingOnlyRComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
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
