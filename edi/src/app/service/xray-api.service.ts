import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { FullApp } from './app-info-types.service';


@Injectable()
export class XrayAPIService {

  constructor(private httpClient: HttpClient) {}
  
  /**
   * Returns a HTTP Headers object with the necessary headers required to
   * interact with the xray API.
   */
  getHeaders() {
    return new HttpHeaders().set('Accept', 'application/json');
  }

  /**
   * Parses JSON Object into a URL param options object and then Turns that to a
   * string. 
   * @param options JSON of param options that can be used to query the xray API.
   */
  private parseFetchAppParams(options: {
      title?: string,
      startsWith?: string, 
      appID?: string, 
      fullInfo?: boolean, 
      onlyAnalyzed?: boolean, 
      limit?: number
    }) :string {
      // Initialising URL Parameters from passed in options.
    let urlParams = new URLSearchParams();

    if(options.title) {
      urlParams.append('title', options.title);
    }
    if(options.startsWith) {
      urlParams.append('startsWith', options.startsWith);
    }
    if(options.appID) {
      urlParams.append('appID', options.appID);
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
      appID?: string, 
      fullInfo?: boolean, 
      onlyAnalyzed?: boolean, 
      limit?: number
    }) :Promise<FullApp[]> {
    
    const headers = this.getHeaders(); 
    let body = this.parseFetchAppParams(options);    
    let appData: FullApp[];

    return this.httpClient.get<FullApp[]>( 'http://localhost:8118/api/apps?' + body, { headers: headers })
    .toPromise()
    .then((data) => {
       return data.map((app) => {
         app.hosts = app.hosts?app.hosts:[];
         app.perms = app.perms?app.perms:[];
         return app;
       }); 
      })
    .catch((err) => { console.log(err); return err; })

  }

}
