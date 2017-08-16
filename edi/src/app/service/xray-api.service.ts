import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { FullApp } from './app-info-types.service';


@Injectable()
export class XrayAPIService {

  constructor(private httpClient: HttpClient) {}
  
  getHeaders() {
    return new HttpHeaders().set('Accept', 'application/json');
  }

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
    .then((data) => { console.log(data); return data; })
    .catch((err) => { return err; })

  }

}
