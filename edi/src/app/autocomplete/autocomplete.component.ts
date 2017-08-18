import { Component, OnInit, ElementRef } from '@angular/core';
import { XrayAPIService } from '../service/xray-api.service'; 
import { FullApp } from '../service/app-info-types.service';
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css',
              './autocomplete.component.scss']})
export class AutocompleteComponent implements OnInit {

  public query = '';
  public titles = [ ];

  public filteredList = [];
  public elementRef;
  
  appData:  FullApp[];

  search() {
      if (this.query.trim() !== ""){
        this.api.fetchApps({title: this.query, fullInfo: true, onlyAnalyzed: true})
        .then((apps)=> {return apps.filter((el) => {
            return el.storeinfo.title.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
          })
        })
        .then((apps) => this.filteredList = apps)
        .catch((err) => console.log(err));
      }else{
        this.filteredList = []; 
      }
  }
  
  select(item: FullApp){
    alert( item.app + ' ' + item.storeinfo.title);
    //this.filteredList = [];
  }
 
  constructor(myElement: ElementRef, private api: XrayAPIService) {
    this.elementRef = myElement;
  }

  ngOnInit() {
  }

}
