import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


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
// components
import { PagesComponent } from './pages.component';
import { AHRIMatchupsComponent } from './ahri-matchups/ahri-matchups.component';
import { WholeHouseHPRebateComponent } from './whole-house-hp-rebate/whole-house-hp-rebate.component';
import { PartialSupplementalHPRebateComponent } from './partial-supplemental-hp-rebate/partial-supplemental-hp-rebate.component';
import { HomeComponent } from './home/home.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

import { DetailAhriComponent } from './ahri-matchups/help-choose-equipment/detail-ahri.component';
import { DetailParComponent } from './partial-supplemental-hp-rebate/detail-par.component';
import { DetailWhoComponent } from './whole-house-hp-rebate/detail-who.component';


import { ResultsHelpComponent } from './ahri-matchups/help-choose-equipment/results-help.component';


// module
import {PagesRoutingModule} from './pages-routing.module';
import { HelpChooseEquipmentComponent } from './ahri-matchups/help-choose-equipment/help-choose-equipment.component';
import { KnowModelNrComponent } from './ahri-matchups/know-model-nr/know-model-nr.component';
import { SharedModModule } from '../shared/shared-mod.module';
import { ResultsParComponent } from './partial-supplemental-hp-rebate/results-par.component';
import { ResultsWhoComponent } from './whole-house-hp-rebate/results-who.component';


@NgModule({
  declarations: [
    PagesComponent,
    AHRIMatchupsComponent,
    WholeHouseHPRebateComponent,
    PartialSupplementalHPRebateComponent,
    HomeComponent,
    HelpChooseEquipmentComponent,
    KnowModelNrComponent,
    DetailAhriComponent,
    DetailParComponent,
    DetailWhoComponent,
    ResultsHelpComponent,
    ResultsParComponent,
    ResultsWhoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    SharedModModule,
    HttpClientModule,
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
    MatDividerModule
  ],
  exports:[
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
    MatDividerModule
  ]
})
export class PagesModModule { }
