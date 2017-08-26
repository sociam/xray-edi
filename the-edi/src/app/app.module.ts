import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
// HttpClientModule for issueing http requests.
import { HttpClientModule } from '@angular/common/http';
// Routing Modules for routing on button presses.
import { RouterModule, Routes } from '@angular/router';

// Components
import { AppComponent } from './app.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppDisplayComponent } from './app-display/app-display.component';
import { HostCountBarChartComponent } from './host-count-bar-chart/host-count-bar-chart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

// Services
import { AppInfoTypesService } from './service/app-info-types.service';
import { XrayAPIService } from './service/xray-api.service';
import { SelectionTrackingService } from './service/selection-tracking.service';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about',component: AboutComponent },
  { path: 'refine',component: AppDisplayComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AutocompleteComponent,
    NavbarComponent,
    SidenavComponent,
    AppDisplayComponent,
    HostCountBarChartComponent,
    PageNotFoundComponent,
    AboutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [AppInfoTypesService, XrayAPIService, SelectionTrackingService],
  bootstrap: [AppComponent,AutocompleteComponent, SidenavComponent, NavbarComponent, AppDisplayComponent]
})
export class AppModule { }
