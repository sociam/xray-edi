import { Component, OnInit, Injectable } from '@angular/core'; // Allows for creation of components
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Response interface
 * 
 * Expected format for the response from the xray archiver api.
 */
interface PlaystoreInfo {
  title:         string;
	summary:       string;
	description:   string;
	storeURL:      string;
	price:         string;
	free:          Boolean;
	rating:        string; 
	numReviews:    number;
	genre:         string;  
	familyGenre:   string; 
	installs:      Range;
	developer:     number;
	updated:       string;
	androidVer:    string;  
	contentRating: string; 
	screenshots:   string[];
	video:         string;
	recentChanges: string[];
	crawlDate:     string;
	permissions:   string[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit{
constructor(private httpClient: HttpClient) {}
  
  searchTerm: string

  appData: any

  searchApps() {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    this.httpClient.get('http://localhost:8118/api/search/apps/' + this.searchTerm ,{ headers}).
    subscribe(
      (data) => {
        console.log(data)
        this.appData = data
    },
    (err) => {
      console.log(err)
    });
  }
  ngOnInit(): void {
    this.appData = []
    this.searchTerm = ''

  }
  
}
