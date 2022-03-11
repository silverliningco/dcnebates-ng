import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//app
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//pages modules
import { PagesRoutesModule } from './pages/pages-routes.module';
import { PagesModule } from './pages/pages.module';

//pages component
import { PagesComponent } from './pages/pages.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//shared
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesRoutesModule,
    PagesModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
