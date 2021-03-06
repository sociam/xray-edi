import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { Observable, Subject} from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import { FullApp, GenreStats, CompanyStats, CompanyTypeStats, CompanyGenreCoverage } from './app-info-types.service';


@Injectable()
export class XrayAPIService {

  constructor(private httpClient: HttpClient) {}
  
  public static readonly API_PREFIX : string = 'https://negi.io/api';
  //public static readonly API_PREFIX : string = 'http://localhost:8118/api';

  /**
   * Returns a HTTP Headers object with the necessary headers required to
   * interact with the xray API.
   */
  getHeaders(noCache: boolean): HttpHeaders {
    let headers =  new HttpHeaders().set('Accept', 'application/json')
    if(noCache) {
      headers.append('Pragma','no-cache');
    }
    return headers;
  }

  /**
   * Parses JSON Object into a URL param options object and then Turns that to a
   * string. 
   * @param options JSON of param options that can be used to query the xray API.
   */
  private parseFetchAppParams(options: {
      title?: string,
      startsWith?: string,
      developer?: string, 
      appID?: string, 
      fullInfo?: boolean, 
      onlyAnalyzed?: boolean, 
      limit?: number,
      noCache?: boolean
    }) :string {
      // Initialising URL Parameters from passed in options.
    let urlParams = new URLSearchParams();
      
    if(options.title) {
      urlParams.append('title', options.title);
    }
    if(options.developer) {
      urlParams.append('developer', options.developer);
    }
    if(options.startsWith) {
      urlParams.append('startsWith', options.startsWith);
    }
    if(options.appID) {
      urlParams.append('appId', options.appID);
    }
    if(options.fullInfo) {
      urlParams.append('isFull',  options.fullInfo ? 'true': 'false');
    }
    if(options.onlyAnalyzed) {
      urlParams.append('onlyAnalyzed', options.onlyAnalyzed ? 'true': 'false');
    }
    if(options.limit) {
      urlParams.append('limit', options.limit.toString());
    }
    if(options.noCache) {
      urlParams.append('nocache', options.noCache ? 'true': 'false');
    }
    return urlParams.toString();
  }

  /**
   * Issues a get request to the xray API using the param options provied as a
   * json parameter. the JSON is passed to 'parseFetchAppParams' that acts as a 
   * helper function to stringify the optins into a URL acceptable string.
   * @param options JSON of param options that can be used to query the xray API.
   */
  fetchApps(options: {
      title?: string,
      startsWith?: string,
      developer?: string, 
      appID?: string, 
      fullInfo?: boolean,
      onlyAnalyzed?: boolean, 
      limit?: number
    }) :Observable<FullApp[]> {
    
    const headers = this.getHeaders(false); 
    let body = this.parseFetchAppParams(options);

    return this.httpClient.get<FullApp[]>( XrayAPIService.API_PREFIX + '/apps?' + body, { headers: headers }).map((data: FullApp[]) => {
      return data.map((app: FullApp) =>{
         app.hosts = app.hosts?app.hosts:[];
         app.perms = app.perms?app.perms:[];
         return app;
       }); 
    });
  }

  fetchApp(app) {
    const headers = this.getHeaders(false); 
    return this.httpClient.get<FullApp[]>( XrayAPIService.API_PREFIX + '/apps?isFull=true&appId=' + app, { headers: headers })
    .toPromise().then((apps) => {return apps[0]});

  }

  fetchAlts(app) {
    const headers = this.getHeaders(false); 
    return this.httpClient.get<string[]>( XrayAPIService.API_PREFIX + '/alt/' + app, { headers: headers }).map((data: string[]) => {
      return data.map((app: string) =>{
         return this.fetchApp(app).then(alt => {
          alt.hosts = alt.hosts?alt.hosts:[];
          alt.perms = alt.perms?alt.perms:[];
          return alt;
        });
      }); 
    });
  }

  fetchGenreAvgs() {
    const headers = this.getHeaders(true);
    return this.httpClient.get<GenreStats[]>(XrayAPIService.API_PREFIX + '/stats/genre_host_averages', {headers: headers});
  }

  fetchCompanyFreq() {
    const headers = this.getHeaders(true);
    return this.httpClient.get<CompanyStats[]>(XrayAPIService.API_PREFIX + '/stats/app_company_freq', {headers: headers});
  }

  fetchCompanyTypeFreq() {
    const headers = this.getHeaders(true);
    return this.httpClient.get<CompanyTypeStats[]>(XrayAPIService.API_PREFIX + '/stats/app_type_freq', {headers: headers});
  }

  fetchCompanyGenreCoverage() {
    const headers = this.getHeaders(true);
    return this.httpClient.get<CompanyGenreCoverage[]>(XrayAPIService.API_PREFIX + '/stats/company_genre_coverage', {headers: headers});
  }

}
