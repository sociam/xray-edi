import { Component, OnInit, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import { XrayAPIService } from '../service/xray-api.service'; 
import { FullApp } from '../service/app-info-types.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css',
              './autocomplete.component.scss']
})

export class AutocompleteComponent implements OnInit {

  public query = '';
  public titles = [ ];

  public filteredList = [];

  @Output() selectionChange : EventEmitter<FullApp>;
  @Input() selectedApp: FullApp;

  appData:  FullApp[];
  search() {
      if (this.query.trim() !== ""){
        this.api.fetchApps({title: this.query, fullInfo: true, onlyAnalyzed: true})
        .subscribe((apps)=> {return apps.filter((el) => {
            el.storeinfo.title.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            this.filteredList = apps;
          })
        })
      }else{
        this.filteredList = []; 
      }
  }
  
  select(item: FullApp){
    //alert( item.app + ' ' + item.storeinfo.title);
    this.selectedApp = item;
    this.selectionChange.emit(item);
    //this.filteredList = [];
  }
 
  constructor( private api: XrayAPIService) {
    this.selectionChange = new EventEmitter<FullApp>();
  }

  ngOnInit() {
  }

}
