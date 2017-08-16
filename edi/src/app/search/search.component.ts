import { Component, OnInit, Injectable } from '@angular/core'; // Allows for creation of components


import { FullApp } from '../service/app-info-types.service';
import { XrayAPIService } from '../service/xray-api.service';
/**
 * Response interface
 * 
 * Expected format for the response from the xray archiver api.
 */

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit{
constructor(private api: XrayAPIService) {}
  
  searchTerm: string;
  appData:  FullApp[];

  search() {
    this.api.fetchApps({title: this.searchTerm, fullInfo: true})
    .then((apps)=> this.appData = apps)
    .catch((err) => console.log(err));
  }

  ngOnInit(): void {
    this.appData = [];
    this.searchTerm = '';
  }
  
}
