// Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
import { ObservatoryComponent } from './observatory/observatory.component';
import { ForceDirectedGraphComponent } from './force-directed-graph/force-directed-graph.component';
import { AppInspectComponent } from './app-inspect/app-inspect.component';

// Services
import { AppInfoTypesService } from './service/app-info-types.service';
import { XrayAPIService } from './service/xray-api.service';
import { SelectionTrackingService } from './service/selection-tracking.service';
import { CompanyInfoService } from './service/company-info.service';
import { HostCompanyDonutComponent } from './host-company-donut/host-company-donut.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about',component: AboutComponent },
  { path: 'refine',component: AppDisplayComponent },
  { path: 'observatory',component: ObservatoryComponent },
  { path: 'apps/:app', component:AppInspectComponent },
  { path: 'apps', component: AppInspectComponent},
  { path: '404', component: PageNotFoundComponent },
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
    HomeComponent,
    ObservatoryComponent,
    ForceDirectedGraphComponent,
    AppInspectComponent,
    HostCompanyDonutComponent
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
  providers: [
    AppInfoTypesService,
    XrayAPIService,
    SelectionTrackingService,
    CompanyInfoService
  ],
  bootstrap: [
    AppComponent,
    NavbarComponent,
  ]
})
export class AppModule { }
