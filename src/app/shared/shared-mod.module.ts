import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import {BreadcrumbsComponent}  from './breadcrumbs/breadcrumbs.component';
import {HeaderComponent}  from './header/header.component';
import {FooterComponent}  from './footer/footer.component';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    BreadcrumbsComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModModule { }
