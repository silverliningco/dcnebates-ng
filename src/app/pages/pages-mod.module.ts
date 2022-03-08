import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// bradcrumb
import {BreadcrumbModule} from 'xng-breadcrumb';

// pagination
import {NgxPaginationModule} from 'ngx-pagination';

// angular material
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';

// components
import { PagesComponent } from './pages.component';
import { AHRIRatingsComponent } from './ahri-ratings/ahri-ratings.component';
import { WholeHouseHPRebateComponent } from './whole-house-hp-rebate/whole-house-hp-rebate.component';
import { PartialSupplementalHPRebateComponent } from './partial-supplemental-hp-rebate/partial-supplemental-hp-rebate.component';
import { HomeComponent } from './home/home.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { HeatingCoolingComponent } from './ahri-ratings/heating-cooling/heating-cooling.component';
import { KnowModelNrComponent } from './ahri-ratings/know-model-nr/know-model-nr.component';


import { ResultsHCComponent } from './ahri-ratings/heating-cooling/results-hc.component';
import { ResultsParComponent } from './partial-supplemental-hp-rebate/results-par.component';
import { ResultsWhoComponent } from './whole-house-hp-rebate/results-who.component';

// module
import {PagesRoutingModule} from './pages-routing.module';
import { SharedModModule } from '../shared/shared-mod.module';
import { CoolingOnlyComponent } from './ahri-ratings/cooling-only/cooling-only.component';
import { ResultsCoolOnComponent } from './ahri-ratings/cooling-only/results-cool-on.component';
import { DetailComponent } from './detail/detail.component';



@NgModule({
  declarations: [
    PagesComponent,
    AHRIRatingsComponent,
    WholeHouseHPRebateComponent,
    PartialSupplementalHPRebateComponent,
    HomeComponent,
    HeatingCoolingComponent,
    KnowModelNrComponent,
    ResultsHCComponent,
    ResultsParComponent,
    ResultsWhoComponent,
    CoolingOnlyComponent,
    ResultsCoolOnComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    SharedModModule,
    HttpClientModule,
    NgxPaginationModule,
    BreadcrumbModule,
    // angular Material
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatSortModule,
    MatStepperModule,
    MatFormFieldModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSliderModule
  ],
  exports:[
    BreadcrumbModule,
    // angular Material
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatSortModule,
    MatFormFieldModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSliderModule
  ]
})
export class PagesModModule { }
