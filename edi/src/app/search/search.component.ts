import { Component, OnInit, Injectable } from '@angular/core'; // Allows for creation of components
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
/**
 * Response interface
 * 
 * Expected format for the response from the xray archiver api.
 */

interface AppStub {
  title: string;
  appID: string;
}

interface Installs {
  min: number;
  max: number;
}

interface StoreInfo {
  title: string;
  summary: string;
  description: string;
  storeURL: string;
  price: string;
  free: boolean;
  rating: string;
  numReviews: number;
  genre: string;
  familyGenre:string;
  installs: Installs;
  developer: number;
  updated: string;
  androidVer: string;
  contentRating: string;
  screenshots: string[];
  video: string;
  recentChanges: string[];
  crawlDate: string;
  permissions: string[];

}

interface Developer {
  emails: string[];
  name: string;
  storeSite: string;
  site: string;
}

interface FullApp {
  id: string;
  app: string;
  store: string;
  region: string;
  ver: string;
  screenFlags: number;
  storeinfo: StoreInfo;
  icon: string;
  developer: Developer;
  hosts: string[];
  perms: string[];
  packages: string[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit{
constructor(private httpClient: HttpClient) {}
  
  searchTerm: string

  appStubs: AppStub[]
  appData:  FullApp[]

  getHeaders() {
    return new HttpHeaders().set('Accept', 'application/json');
  }

  postSearchQuery() {
    this.appData = [];
    const headers = this.getHeaders();

    let urlParams = new URLSearchParams();

    urlParams.append('title', this.searchTerm);
    let body = urlParams.toString();      

    this.httpClient
    .post<FullApp[]>('http://sociamnat.cs.ox.ac.uk:8003/api/apps?isFull=True&startsWith='+this.searchTerm,
      body, 
      { headers: headers }
    )
    .subscribe(
      (data) => { this.appData = data; console.log(data)},
      (err) => { console.log(err) }
    );
  
  }

  postAppQuery(appID:string) {
    var appData: FullApp[];
    
    const headers = this.getHeaders();

    let urlParams = new URLSearchParams();

    urlParams.append('title', this.searchTerm);
    let body = urlParams.toString();      

    this.httpClient
    .post<FullApp[]>('http://sociamnat.cs.ox.ac.uk:8003/api/apps?isfull=true&appId='+appID,
      body,
      {headers: headers}
    )
    .subscribe(
      (data) => { appData = data; },
      (err) => { console.log(err) }
    );
    return appData;
  }


  ngOnInit(): void {
    this.appData = []
    this.searchTerm = ''
  }
  
}
