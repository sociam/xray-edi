import { Component, OnInit, ElementRef } from '@angular/core';
import { XrayAPIService } from '../service/xray-api.service'; 
import { FullApp } from '../service/app-info-types.service';
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {

  public query = '';
  public titles = [ ];

  public filteredList = [];
  public elementRef;
  
  appData:  FullApp[];

  search() {
    
  }
  filter() {
    
    if (this.query !== ""){
      this.api.fetchApps({title: this.query, fullInfo: true})
      .then((apps)=> this.appData = apps)
      .then(()=>{
        this.filteredList = this.appData.filter(function(el){
          return el.storeinfo.title.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
      })
      .catch((err) => console.log(err));
    }else{
      this.filteredList = [];
    }
  }
  
  select(item: FullApp){
    alert( item.app + ' ' + item.storeinfo.title);
    this.filteredList = [];
  }
 
  constructor(myElement: ElementRef, private api: XrayAPIService) {
    this.elementRef = myElement;
  }

  ngOnInit() {
  }

}
