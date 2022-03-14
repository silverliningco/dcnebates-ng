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
import { AhriMatchupsComponent } from './ahri-matchups/ahri-matchups.component';
import { RebateFinderComponent } from './rebate-finder/rebate-finder.component';
import { DetailComponent } from './detail/detail.component';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

import { BreadcrumbModule } from 'xng-breadcrumb';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    AhriMatchupsComponent,
    RebateFinderComponent,
    DetailComponent
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
    
  ]
})
export class PagesModule { }
