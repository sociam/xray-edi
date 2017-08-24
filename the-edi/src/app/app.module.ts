import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
// HttpClientModule for issueing http requests.
import { HttpClientModule } from '@angular/common/http';


// Components
import { AppComponent } from './app.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppDisplayComponent } from './app-display/app-display.component';

// Services
import { AppInfoTypesService } from './service/app-info-types.service';
import { XrayAPIService } from './service/xray-api.service';
import { SelectionTrackingService } from './service/selection-tracking.service';

@NgModule({
  declarations: [
    AppComponent,
    AutocompleteComponent,
    NavbarComponent,
    SidenavComponent,
    AppDisplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AppInfoTypesService, XrayAPIService, SelectionTrackingService],
  bootstrap: [AppComponent,AutocompleteComponent, SidenavComponent, NavbarComponent, AppDisplayComponent]
})
export class AppModule { }
