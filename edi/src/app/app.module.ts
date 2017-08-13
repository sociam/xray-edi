import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize'
import { FormsModule } from '@angular/forms';
// HttpClientModule for issueing http requests.
import { HttpClientModule } from '@angular/common/http';

import { D3Service } from 'd3-ng2-service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SearchComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterializeModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  providers: [D3Service],
  bootstrap: [AppComponent, NavbarComponent, FooterComponent, SearchComponent ]
})

export class AppModule { }
