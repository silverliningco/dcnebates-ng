import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// modules
import { AppRoutingModule } from './app-routing.module';
import { PagesModModule } from './pages/pages-mod.module';
import { PagesRoutingModule } from './pages/pages-routing.module';

// componet
import { AppComponent } from './app.component';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModModule,
    PagesRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
