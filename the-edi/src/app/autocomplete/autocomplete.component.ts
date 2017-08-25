import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { XrayAPIService } from '../service/xray-api.service'; 
import { FullApp } from '../service/app-info-types.service';
import { SelectionTrackingService } from '../service/selection-tracking.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css',
              './autocomplete.component.scss']
})

export class AutocompleteComponent implements OnInit {
  //private appTracker: SelectionTrackingService = new SelectionTrackingService();
  public query = '';
  public titles = [ ];

  public filteredList = [];

  @Output() selectionChange : EventEmitter<FullApp>;
  @Input() selectedApp: FullApp;

  appData:  FullApp[];
  search() {
      if (this.query.trim() !== ""){
        this.api.fetchApps({title: this.query, fullInfo: true, onlyAnalyzed: true})
        .subscribe((apps)=> {
          this.filteredList = apps.filter((el) => el.storeinfo.title.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
        })
      }else{
        this.filteredList = []; 
      }
  }
  
  select(item: FullApp){
    //alert( item.app + ' ' + item.storeinfo.title);
    this.selectedApp = item;
    this.selectionChange.emit(item);
    
    this.appTracker.setCurrentSelection(item);
    this.appTracker.addApp(item);
    console.log(this.appTracker.getSelections().size);

    //this.appTracker.addApp(item);
    //console.log('Selection Count: ' + this.appTracker.currentAppSelection.id);
    //this.filteredList = [];
  }
 
  constructor( private api: XrayAPIService, private appTracker: SelectionTrackingService) {
    this.selectionChange = new EventEmitter<FullApp>();
  }

  ngOnInit() {
  }

}
