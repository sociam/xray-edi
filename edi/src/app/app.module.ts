import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize'
import { FormsModule } from '@angular/forms';
// HttpClientModule for issueing http requests.
import { HttpClientModule } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

// My Own Services
import { AppInfoTypesService } from './service/app-info-types.service';
import { XrayAPIService } from './service/xray-api.service';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AutocompleteComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterializeModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AngularFontAwesomeModule
  ],
  providers: [AppInfoTypesService, XrayAPIService],
  bootstrap: [AppComponent, NavbarComponent, FooterComponent, AutocompleteComponent ]
})

export class AppModule { }
