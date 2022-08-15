import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

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
import { ResultsComponent } from './reusable-components/results/results.component';
import { IKnowModelNrComponent } from './i-know-model-nr/i-know-model-nr.component';
import { SpinnerComponent } from './reusable-components/spinner/spinner.component';
import { TableViewComponent } from './reusable-components/table-view/table-view.component';

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
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DetailIKnowMyModelComponent } from './reusable-components/detail-i-know-my-model/detail-i-know-my-model.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


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
    ResultsComponent,
    DetailIKnowMyModelComponent,
    IKnowModelNrComponent,
    SpinnerComponent,
    TableViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
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
    MatExpansionModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  entryComponents:[
  ]
})
export class PagesModule { }
